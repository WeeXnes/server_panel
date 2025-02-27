import { defineNitroPlugin } from "#imports";
import { reactive } from "vue";
import * as crypto from 'crypto';
import {jwt_globals} from "~/core/globals";
import Logger from "~/core/logger";

export default defineNitroPlugin((nitroApp) => {
    Logger.info("Running init...");
    Logger.info("Generating jwt secret...")
    jwt_globals.secret = crypto.randomBytes(32).toString('base64');
    Logger.success("secret: " + jwt_globals.secret)
});


