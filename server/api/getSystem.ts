import si from 'systeminformation';

export default defineEventHandler(async () => {
    try {
        const systemData = await si.osInfo();

        return systemData;

    } catch (error) {
        console.error('Error fetching CPU info:', error);
    }
});
