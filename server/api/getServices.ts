import { execSync } from 'child_process';
import si from 'systeminformation';
import {VM} from "~/types/VM";
import {serviceInterface} from "~/types/serviceInterface";
import {settings} from "~/panel.config";
import {checkValidJwtToken} from "~/core/command_auth";
import { defineEventHandler, getCookie, createError } from 'h3';
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { token } = body;
        checkValidJwtToken(token)

        const services = await si.services(settings.systemctl_services.join(', '));
        const interfaces: serviceInterface[] = [];
        if (Array.isArray(services)) {
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
