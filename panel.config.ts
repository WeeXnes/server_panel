import { reactive } from "vue";

export const settings = reactive({
    ignoreCache: false,
    enable_services: false,
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
    systemctl_services:[
        "libvirt",
        "frp"
    ]
});