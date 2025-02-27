class Logger {
    private static getTimestamp(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static error(message: string): void {
        console.error(`[${this.getTimestamp()}] [ERROR] ${message}`);
    }

    static warning(message: string): void {
        console.warn(`[${this.getTimestamp()}] [WARNING] ${message}`);
    }

    static info(message: string): void {
        console.log(`[${this.getTimestamp()}] [INFO] ${message}`);
    }

    static success(message: string): void {
        console.log(`[${this.getTimestamp()}] [SUCCESS] ${message}`);
    }
}

export default Logger;
