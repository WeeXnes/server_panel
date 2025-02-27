import { execSync } from 'child_process';
import si from 'systeminformation';
import {VM} from "~/types/VM";
import {networkInterface} from "~/types/networkInterface";
import {settings} from "~/panel.config";

export default defineEventHandler(async () => {
    try {
        const network = await si.networkInterfaces();
        const interfaces_to_scan = settings.interfaces_to_scan || [];

        const interfaces: networkInterface[] = [];
        if (Array.isArray(network)) {
            network.forEach((interface_obj) => {
                if(interfaces_to_scan.length > 0){
                    if(interfaces_to_scan.includes(interface_obj.ifaceName)){
                        interfaces.push({
                            name: interface_obj.ifaceName,
                            ip4: interface_obj.ip4,
                            ip6: interface_obj.ip6,
                            ip4subnet: interface_obj.ip4subnet,
                            ip6subnet: interface_obj.ip6subnet,
                            state: interface_obj.operstate as "up" | "down" | "unknown"
                        })
                    }
                }else{
                    interfaces.push({
                        name: interface_obj.ifaceName,
                        ip4: interface_obj.ip4,
                        ip6: interface_obj.ip6,
                        ip4subnet: interface_obj.ip4subnet,
                        ip6subnet: interface_obj.ip6subnet,
                        state: interface_obj.operstate as "up" | "down" | "unknown"
                    })
                }
            });
        } else {
            console.log(network.ifaceName + " is reachable at " + network.ip4);
            interfaces.push({
                name: network.ifaceName,
                ip4: network.ip4,
                ip6: network.ip6,
                ip4subnet: network.ip4subnet,
                ip6subnet: network.ip6subnet,
                state: network.operstate as "up" | "down" | "unknown"
            })
        }
        return interfaces;

    } catch (error) {
        console.error('Error fetching CPU info:', error);
    }
});
