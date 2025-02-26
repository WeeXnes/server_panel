import { execSync } from 'child_process';
import si from 'systeminformation';
import {VM} from "~/types/VM";
import {networkInterface} from "~/types/networkInterface";

export default defineEventHandler(async () => {
    try {
        const cpuData = await si.cpu();
        const cpuTemp = await si.cpuTemperature();
        const osInfo = await si.osInfo();
        const network = await si.networkInterfaces();

        const interfaces: networkInterface[] = [];
        if (Array.isArray(network)) {
            network.forEach((interface_obj) => {
                interfaces.push({
                    name: interface_obj.ifaceName,
                    ip4: interface_obj.ip4,
                    ip6: interface_obj.ip6,
                    ip4subnet: interface_obj.ip4subnet,
                    ip6subnet: interface_obj.ip6subnet,
                    state: interface_obj.operstate as "up" | "down" | "unknown"
                })
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

        interfaces.forEach(obj => {
            console.log(obj.name + " is " + obj.state);
        })
        return interfaces;

    } catch (error) {
        console.error('Error fetching CPU info:', error);
    }
});
