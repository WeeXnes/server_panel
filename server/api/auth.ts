import { defineEventHandler, getCookie, createError } from 'h3';
import jwt from 'jsonwebtoken';
import {jwt_globals} from "~/core/globals";

export default defineEventHandler(async (event) => {
    try {
        const token = getCookie(event, 'token');
        console.log("Checking token " + token);
        if (!token) {
            throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
        }

        const secret = jwt_globals.secret;
        if (!secret) {
            throw createError({ statusCode: 500, statusMessage: 'JWT secret not set' });
        }

        const decoded = jwt.verify(token, secret) as { userId: string };
        if (!decoded?.userId) {
            throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
        }
        console.log("user has been authed, hash: " + decoded.userId);
        return { success: true };
    } catch (error: any) {
        return createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Invalid or expired token',
        });
    }
});