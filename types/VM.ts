export interface VM {
    name: string;
    os: string;
    vCpuCount: number;
    maxMemory: number;
    autostart: boolean;
    state: "on" | "off";
}
