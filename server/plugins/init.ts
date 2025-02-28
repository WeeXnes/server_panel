import { defineNitroPlugin } from "#imports";
import { reactive } from "vue";
import * as crypto from 'crypto';
import {jwt_globals} from "~/core/globals";
import Logger from "~/core/logger";
import {settings} from "~/panel.config";

export default defineNitroPlugin((nitroApp) => {
    Logger.info("Running init...");
    if(settings.password_hash == ""){
        throw new Error("The password hash is missing. Please use \"npm run password_gen <password>\" to set the password and then \"npm run build\" rebuild the server files");
    }
    if(!isValidBcryptHash(settings.password_hash)){
        throw new Error("The password hash is invalid. Please use \"npm run password_gen <password>\" to set the password and then \"npm run build\" rebuild the server files");
    }
    Logger.info("Generating jwt secret...")
    jwt_globals.secret = crypto.randomBytes(32).toString('base64');
    Logger.success("secret: " + jwt_globals.secret)
});

function isValidBcryptHash(hash: string): boolean {
    const bcryptPattern = /^\$2[aby]\$.{56}$/;
    return bcryptPattern.test(hash);
}
