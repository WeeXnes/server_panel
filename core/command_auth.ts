import Logger from "~/core/logger";
import {createError} from "h3";
import {jwt_globals} from "~/core/globals";
import jwt from "jsonwebtoken";

export function checkValidJwtToken(token: string) {
    Logger.info("Checking token " + token);
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
    Logger.success("user has been authed, password: " + decoded.userId);
}