export interface CheckinResult {
    success: boolean;
    personId: string;
    eventId: string;
    method: 'facial' | 'qr_code' | 'manual';
    timestamp: string;
    geofenceStatus?: 'ok' | 'alerta' | 'bloqueado';
}
export interface Person {
    id: string;
    name: string;
    document: string;
    tenantId: string;
    enrolledAt: string | null;
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
