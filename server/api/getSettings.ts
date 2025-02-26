import si from 'systeminformation';
import {settings} from "~/panel.config";

export default defineEventHandler(async () => {
    try {
        return settings
    } catch (error) {
        console.error('Error fetching CPU info:', error);
    }
});
