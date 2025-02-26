import { exec } from 'child_process';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { action, vm } = body;

    try {

        const command = action === 'start'
            ? `virsh start ${vm.name}`
            : `virsh shutdown ${vm.name}`;

        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error || stderr) {
                    reject(`Error: ${stderr || error?.message}`);
                }
                resolve(stdout);
            });
        });

        return { status: 'success', message: `VM ${action} successful`, vm };
    } catch (error) {
        return { status: 'error', message: `Failed to ${action} VM`, error: error };
    }
});

