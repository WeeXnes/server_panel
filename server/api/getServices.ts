import { execSync } from 'child_process';
import si from 'systeminformation';
import {VM} from "~/types/VM";
import {serviceInterface} from "~/types/serviceInterface";
import {settings} from "~/panel.config";

export default defineEventHandler(async () => {
    try {
        const services = await si.services(settings.systemctl_services.join(', '));


        const interfaces: serviceInterface[] = [];
        if (Array.isArray(services)) {
            console.log(`services is array`);
            services.forEach((interface_obj) => {
                interfaces.push({
                    name: interface_obj.name,
                    state: interface_obj.running
                })
            });
        } else {
            interfaces.push(services);
        }

        return interfaces;

    } catch (error) {
        console.error('Error fetching CPU info:', error);
    }
});
