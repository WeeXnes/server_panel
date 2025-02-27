
import { execSync } from 'child_process';
import {VM} from "~/types/VM";
import {settings} from "~/panel.config";

export default defineEventHandler(() => {
    let vmNames = ["Gameserver", "Ubuntu_VM1"]
    const virtualMachines: VM[] = [];
    settings.qemu_vms.forEach(vm => {
        const vCpuCount = parseInt(execSync(`LANG=C virsh dominfo ${vm.name} | grep 'CPU(s)' | awk '{print $2}'`).toString().trim());
        const maxMemory = parseInt(execSync(`LANG=C virsh dominfo ${vm.name} | grep 'Max memory' | awk '{print $3}'`).toString().trim()) / 1024;
        const autostartValue = execSync(`LANG=C virsh dominfo ${vm.name} | grep 'Autostart' | awk '{print $2}'`).toString().trim();
        const autostart = autostartValue === "enable";
        const stateValue = execSync(`LANG=C virsh dominfo ${vm.name} | grep 'State' | awk '{print $2, $3}'`).toString().trim();
        const state: 'on' | 'off' = stateValue === "running" ? 'on' : 'off';
        virtualMachines.push({
            name: vm.name,
            os: vm.os,
            vCpuCount: vCpuCount,
            maxMemory: maxMemory,
            autostart: autostart,
            state: state
        });
    });
    return virtualMachines;
});
