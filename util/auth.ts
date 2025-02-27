// util/auth.ts
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import useRouter

export async function checkAuth(router: any) {
    try {
        const response = await axios.get('/api/auth', {
            withCredentials: true, // Ensure cookies are sent with the request
        });

        if (!response.data.success) {
            router.push('/login');
        }

        return response.data.success;
    } catch (error) {
        console.log("Not authenticated, redirecting to /login");
        router.push('/login');
        return false;
    }
}
