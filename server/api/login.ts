import bcrypt from 'bcryptjs';
import { sendError, createError } from 'h3';
import jwt from 'jsonwebtoken';
import {settings} from "~/panel.config";
import {jwt_globals} from "~/core/globals";
import Logger from "~/core/logger";

export default defineEventHandler(async (event) => {
    try {
        const { password } = await readBody(event);

        if (!password) {
            Logger.error("password is required");
            return sendError(event, createError({ statusCode: 400, message: 'password is required' }));
        }

        const isMatch = await bcrypt.compare(password, settings.password.hash);
        if (!isMatch) {
            Logger.error("Invalid credentials! password");
            return sendError(event, createError({ statusCode: 400, message: 'Invalid credentials!' }));
        }

        const token = jwt.sign({ userId: password }, jwt_globals.secret!, {
            expiresIn: '1h',
        });

        return {
            message: 'Login successful!',
            token
        };
    } catch (error) {
        console.error("Login error: ", error);
        return sendError(event, createError({ statusCode: 500, message: 'Internal server error' }));
    }
});
