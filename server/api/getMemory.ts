import si from 'systeminformation';
import {checkValidJwtToken} from "~/core/command_auth";
import { defineEventHandler, getCookie, createError } from 'h3';
export default defineEventHandler(async (event) => {
    try {

        const body = await readBody(event);
        const { token } = body;
        checkValidJwtToken(token)
        const memoryData = await si.mem();

        return memoryData;

    } catch (error) {
        console.error('Error fetching CPU info:', error);
    }
});
