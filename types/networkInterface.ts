export interface networkInterface {
    name: string;
    ip4: string;
    ip6: string;
    ip4subnet: string;
    ip6subnet: string;
    state: "up" | "down" | "unknown";
}
