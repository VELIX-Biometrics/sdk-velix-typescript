import type { VelixClient } from '../client';
import type { CheckinResult } from '../types';

export class CheckinModule {
  constructor(private client: VelixClient) {}

  async facial(eventId: string, frame: string, options?: { lat?: number; lng?: number }): Promise<CheckinResult> {
    const { data } = await this.client.http.post<CheckinResult>(`/v1/events/${eventId}/checkin`, {
      method: 'facial',
      frame,
      ...options,
    });
    return data;
  }

  async qrCode(eventId: string, token: string, options?: { lat?: number; lng?: number }): Promise<CheckinResult> {
    const { data } = await this.client.http.post<CheckinResult>(`/v1/events/${eventId}/checkin`, {
      method: 'qr_code',
      qr_token: token,
      ...options,
    });
    return data;
  }

  async manual(eventId: string, personId: string, operatorId: string): Promise<CheckinResult> {
    const { data } = await this.client.http.post<CheckinResult>(`/v1/events/${eventId}/checkin`, {
      method: 'manual',
      person_id: personId,
      operator_id: operatorId,
    });
    return data;
  }

  async getHistory(eventId: string, page = 1, pageSize = 50) {
    const { data } = await this.client.http.get(`/v1/events/${eventId}/checkins`, {
      params: { page, pageSize },
    });
    return data;
  }
}
