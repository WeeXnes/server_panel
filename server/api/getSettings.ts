import si from 'systeminformation';
import {settings} from "~/panel.config";
import {checkValidJwtToken} from "~/core/command_auth";
import { defineEventHandler, getCookie, createError } from 'h3';
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { token } = body;
        checkValidJwtToken(token)
        return settings
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
});
