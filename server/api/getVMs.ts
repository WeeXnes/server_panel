import {execSync} from 'child_process';
import {execa} from 'execa'
import {settings} from "~/panel.config";
import {vm_cache} from "~/core/globals";
import Logger from "~/core/logger";

export default defineEventHandler(async () => {

    if(vm_cache.vms.length > 0){
        Logger.info("VMs are cached, refreshing vm states...")
        for (const vm of vm_cache.vms) {
            const stateValue = await getStateValue(vm.name)
            vm.state = stateValue === "running" ? 'on' : 'off';
        }
    }else{
        Logger.info("VMs havent been Loaded yet, loading now...")
        for (const vm of settings.qemu_vms) {
            Logger.info("Loading " + vm.name)
            const vCpuCount = await getVcpuCount(vm.name);
            const maxMemory = await getMaxMemory(vm.name);
            const autostartValue = await getAutostartValue(vm.name);
            const autostart = autostartValue === "enable";
            const stateValue = await getStateValue(vm.name);
            const state: 'on' | 'off' = stateValue === "running" ? 'on' : 'off';
            vm_cache.vms.push({
                name: vm.name,
                os: vm.os,
                vCpuCount: vCpuCount || 0,
                maxMemory: maxMemory || 0,
                autostart: autostart,
                state: state
            });
        }
    }

    return vm_cache.vms;
});


async function getVcpuCount(vmName: string): Promise<number | null> {
    try {
        const { stdout } = await execa('virsh', ['dominfo', vmName], {
            env: { LANG: 'C' }
        });
        const vCpuCount = parseInt(stdout.split('\n').find(line => line.includes('CPU(s)'))?.split(':')[1]?.trim() || '');
        return isNaN(vCpuCount) ? null : vCpuCount;
    } catch (error) {
        console.error('Error getting vCPU count:', error);
        return null;
    }
}

async function getMaxMemory(vmName: string): Promise<number | null> {
    try {
        const { stdout } = await execa('virsh', ['dominfo', vmName], {
            env: { LANG: 'C' }
        });
        console.log(stdout)
        const maxMemoryLine = stdout.split('\n').find(line => line.includes('Max memory'));
        const maxMemory = maxMemoryLine ? parseInt(maxMemoryLine.split(':')[1].trim()) / 1024 : null;
        return isNaN(<number>maxMemory) ? null : maxMemory;
    } catch (error) {
        console.error('Error getting max memory:', error);
        return null;
    }
}


async function getAutostartValue(vmName: string): Promise<string | null> {
    try {
        const { stdout } = await execa('virsh', ['dominfo', vmName], {
            env: { LANG: 'C' } // Set LANG to C to ensure consistent output formatting
        });

        const autostartLine = stdout.split('\n').find(line => line.includes('Autostart'));
        return autostartLine ? autostartLine.split(':')[1].trim() : null;
    } catch (error) {
        console.error('Error getting autostart value:', error);
        return null;
    }
}


async function getStateValue(vmName: string): Promise<string | null> {
    try {
        const { stdout } = await execa('virsh', ['dominfo', vmName], {
            env: { LANG: 'C' }
        });
        const stateLine = stdout.split('\n').find(line => line.includes('State'));
        const stateValue = stateLine ? stateLine.split(':')[1]?.trim() : null;
        return stateValue;
    } catch (error) {
        console.error('Error getting state value:', error);
        return null;
    }
}
