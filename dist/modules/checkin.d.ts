import type { VelixClient } from '../client';
import type { CheckinResult } from '../types';
export declare class CheckinModule {
    private client;
    constructor(client: VelixClient);
    facial(eventId: string, frame: string, options?: {
        lat?: number;
        lng?: number;
    }): Promise<CheckinResult>;
    qrCode(eventId: string, token: string, options?: {
        lat?: number;
        lng?: number;
    }): Promise<CheckinResult>;
    manual(eventId: string, personId: string, operatorId: string): Promise<CheckinResult>;
    getHistory(eventId: string, page?: number, pageSize?: number): Promise<any>;
}
