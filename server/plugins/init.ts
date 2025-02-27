import { defineNitroPlugin } from "#imports";
import { reactive } from "vue";
import * as crypto from 'crypto';
import {jwt_globals} from "~/core/globals";

export default defineNitroPlugin((nitroApp) => {
    console.log("Running init...");
    console.log("Generating jwt secret...")
    jwt_globals.secret = crypto.randomBytes(32).toString('base64');
    console.log("secret: " + jwt_globals.secret)
});


