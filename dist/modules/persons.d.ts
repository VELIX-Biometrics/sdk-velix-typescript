import type { VelixClient } from '../client';
import type { Person, PaginatedResult } from '../types';
export declare class PersonsModule {
    private client;
    constructor(client: VelixClient);
    list(tenantId: string, page?: number, pageSize?: number): Promise<PaginatedResult<Person>>;
    get(personId: string): Promise<Person>;
    enroll(personId: string, frame: string): Promise<{
        enrolled: boolean;
        quality: number;
    }>;
    delete(personId: string): Promise<void>;
}
