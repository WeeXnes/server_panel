import {execSync} from 'child_process';
import {settings} from "~/panel.config";
import {vm_cache} from "~/core/globals";
import Logger from "~/core/logger";

export default defineEventHandler(() => {

    if(vm_cache.vms.length > 0){
        Logger.info("VMs are cached, refreshing vm states...")
        vm_cache.vms.forEach(vm=>{
            const stateValue = execSync(`LANG=C virsh dominfo ${vm.name} | grep 'State' | awk '{print $2, $3}'`).toString().trim();
            vm.state = stateValue === "running" ? 'on' : 'off';
        })
    }else{
        Logger.info("VMs havent been Loaded yet, loading now...")
        settings.qemu_vms.forEach(vm => {
            Logger.info("Loading " + vm.name)
            const vCpuCount = parseInt(execSync(`LANG=C virsh dominfo ${vm.name} | grep 'CPU(s)' | awk '{print $2}'`).toString().trim());
            const maxMemory = parseInt(execSync(`LANG=C virsh dominfo ${vm.name} | grep 'Max memory' | awk '{print $3}'`).toString().trim()) / 1024;
            const autostartValue = execSync(`LANG=C virsh dominfo ${vm.name} | grep 'Autostart' | awk '{print $2}'`).toString().trim();
            const autostart = autostartValue === "enable";
            const stateValue = execSync(`LANG=C virsh dominfo ${vm.name} | grep 'State' | awk '{print $2, $3}'`).toString().trim();
            const state: 'on' | 'off' = stateValue === "running" ? 'on' : 'off';
            vm_cache.vms.push({
                name: vm.name,
                os: vm.os,
                vCpuCount: vCpuCount,
                maxMemory: maxMemory,
                autostart: autostart,
                state: state
            });
        });
    }

    return vm_cache.vms;
});
