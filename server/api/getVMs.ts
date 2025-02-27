import {execa} from 'execa'
import {settings} from "~/panel.config";
import {vm_cache} from "~/core/globals";
import Logger from "~/core/logger";
import {reactive} from "vue";
import type {VM} from "~/types/VM";

export default defineEventHandler(async () => {

    if(vm_cache.vms.length > 0){
        Logger.info("VMs are cached, refreshing vm states...")
        for (const vm of vm_cache.vms) {
            const stateValue = await getStateValue(vm.name, true)
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
        const inCache = vm_single_caches.vms.some((vm) => vm.name === vmName);
        let stdout: string;
        if (!inCache) {
            const result = await execa('virsh', ['dominfo', vmName], {
                env: { LANG: 'C' }
            });
            stdout = result.stdout;
            vm_single_caches.vms.push({
                name: vmName,
                information: stdout
            })
        } else {
            console.log("loading info from cache for " + vmName)
            stdout = vm_single_caches.vms.find(vm => vm.name === vmName)?.information || "";
        }
        const vCpuCount = parseInt(stdout.split('\n').find(line => line.includes('CPU(s)'))?.split(':')[1]?.trim() || '');
        return isNaN(vCpuCount) ? null : vCpuCount;
    } catch (error) {
        console.error('Error getting vCPU count:', error);
        return null;
    }
}

async function getMaxMemory(vmName: string): Promise<number | null> {
    try {
        const inCache = vm_single_caches.vms.some((vm) => vm.name === vmName);
        let stdout: string;
        if (!inCache) {
            const result = await execa('virsh', ['dominfo', vmName], {
                env: { LANG: 'C' }
            });
            stdout = result.stdout;
            vm_single_caches.vms.push({
                name: vmName,
                information: stdout
            })
        } else {
            console.log("loading info from cache for " + vmName)
            stdout = vm_single_caches.vms.find(vm => vm.name === vmName)?.information || "";
        }
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
        const inCache = vm_single_caches.vms.some((vm) => vm.name === vmName);
        let stdout: string;
        if (!inCache) {
            const result = await execa('virsh', ['dominfo', vmName], {
                env: { LANG: 'C' }
            });
            stdout = result.stdout;
            vm_single_caches.vms.push({
                name: vmName,
                information: stdout
            })
        } else {
            console.log("loading info from cache for " + vmName)
            stdout = vm_single_caches.vms.find(vm => vm.name === vmName)?.information || "";
        }

        const autostartLine = stdout.split('\n').find(line => line.includes('Autostart'));
        return autostartLine ? autostartLine.split(':')[1].trim() : null;
    } catch (error) {
        console.error('Error getting autostart value:', error);
        return null;
    }
}

async function getStateValue(vmName: string, forceRefresh: boolean = false): Promise<string | null> {
    try {
        let inCache = vm_single_caches.vms.some((vm) => vm.name === vmName);
        if(forceRefresh)
            inCache = false;
        let stdout: string;
        if (!inCache) {
            const result = await execa('virsh', ['dominfo', vmName], {
                env: { LANG: 'C' }
            });
            stdout = result.stdout;
            vm_single_caches.vms.push({
                name: vmName,
                information: stdout
            })
        } else {
            console.log("loading info from cache for " + vmName)
            stdout = vm_single_caches.vms.find(vm => vm.name === vmName)?.information || "";
        }
        const stateLine = stdout.split('\n').find(line => line.includes('State'));
        return stateLine ? stateLine.split(':')[1]?.trim() : null;
    } catch (error) {
        console.error('Error getting state value:', error);
        return null;
    }
}



export interface vm_single_cache {
    name: string;
    information: string;
}

export const vm_single_caches = reactive({
    vms: [] as vm_single_cache[],
})

