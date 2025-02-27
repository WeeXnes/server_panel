import { reactive } from "vue";

export const settings = reactive({
    ignoreCache: true,
    //Leave empty to scan all interfaces
    //or change item to "disabled" to disable interface scanning
    interfaces_to_scan:[
        "enp4s0"
    ],
    enable_qemu_controls: true,
    qemu_vms: [
        {
            name: "Gameserver",
            os: "Ubuntu 24.04"
        },
        {
            name: "Ubuntu_VM1",
            os: "Ubuntu 24.04"
        },
    ],
    enable_services: true,
    systemctl_services:[
        "libvirt",
        "frp"
    ],
    password:{
        hash: "$2y$10$04HVBBemPypGbaMhTmUxX.DUMir1HA4hT6cst.dGabot1ZWR5IQ.6",
        salt_rounds: 10
    },
});