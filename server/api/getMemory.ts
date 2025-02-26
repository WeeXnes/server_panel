import si from 'systeminformation';

export default defineEventHandler(async () => {
    try {
        const memoryData = await si.mem();

        return memoryData;

    } catch (error) {
        console.error('Error fetching CPU info:', error);
    }
});
