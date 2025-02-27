import { exec } from 'child_process';
import Logger from "~/core/logger";
import {checkValidJwtToken} from "~/core/command_auth";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { action, token, force, vm } = body;

    try {

        checkValidJwtToken(token)

        const command = action === 'start' ? `virsh start ${vm.name}` : (force ? `virsh destroy ${vm.name}` : `virsh shutdown ${vm.name}`);

        console.log(command);

        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error || stderr) {
                    Logger.error(`Error: ${stderr || error?.message}`);
                    reject(`Error: ${stderr || error?.message}`)
                }
                resolve(stdout);
            });
        });
        Logger.info(action + ": " + vm.name);
        return { status: 'success', message: `VM ${action} successful`, vm };
    } catch (error) {
        return { status: 'error', message: `Failed to ${action} VM`, error: error };
    }
});

