import si from 'systeminformation';

export default defineEventHandler(async () => {
    try {
        const cpuData = await si.cpu();
        const cpuTemp = await si.cpuTemperature();

        return {
            info: cpuData,   // `info` is the key, `cpuData` is the value
            temps: cpuTemp   // `temps` is the key, `cpuTemp` is the value
        };

    } catch (error) {
        console.error('Error fetching CPU info:', error);
    }
});
