import { reactive } from "vue";
import type { VM } from "~/types/VM"


export const jwt_globals = reactive({
    secret: "",
});



export const vm_cache = reactive({
    vms: [] as VM[],
})
