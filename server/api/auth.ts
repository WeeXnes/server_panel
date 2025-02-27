import { defineEventHandler, getCookie, createError } from 'h3';
import jwt from 'jsonwebtoken';
import {jwt_globals} from "~/core/globals";
import Logger from "~/core/logger";
import {checkValidJwtToken} from "~/core/command_auth";

export default defineEventHandler(async (event) => {
    try {
        const token = getCookie(event, 'token') || "";
        checkValidJwtToken(token)
        return { success: true };
    } catch (error: any) {
        return createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Invalid or expired token',
        });
    }
});