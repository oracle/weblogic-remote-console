declare global {
    interface Window {
        WRC_CONFIG?: {
            backendBaseUrl?: string;
        };
    }
}
export declare function getBackendBase(): Promise<string>;
export declare function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<string>;
