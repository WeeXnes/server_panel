import { defineEventHandler, getCookie, createError } from 'h3';
import si from 'systeminformation';
import {checkValidJwtToken} from "~/core/command_auth";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { token } = body;
        checkValidJwtToken(token)

        const cpuData = await si.cpu();
        const cpuTemp = await si.cpuTemperature();

        return {
            info: cpuData,   // `info` is the key, `cpuData` is the value
            temps: cpuTemp   // `temps` is the key, `cpuTemp` is the value
        };

    } catch (error) {
        console.error('Error fetching CPU info:', error);
    }
});
