import { AxiosInstance } from 'axios';
export interface VelixClientConfig {
    apiUrl: string;
    apiKey: string;
    timeout?: number;
}
export declare class VelixClient {
    readonly http: AxiosInstance;
    constructor(config: VelixClientConfig);
}
