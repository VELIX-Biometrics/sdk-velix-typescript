import type { VelixClient } from '../client'
import type { CheckinResult, PaginatedResult } from '../types'

export class CheckinModule {
  constructor(private readonly client: VelixClient) {}

  async facial(eventId: string, frame: string, options?: { lat?: number; lng?: number }): Promise<CheckinResult> {
    return this.client.post(`/v1/events/${eventId}/checkin`, { method: 'facial', frame, ...options })
  }

  async qrCode(eventId: string, token: string, options?: { lat?: number; lng?: number }): Promise<CheckinResult> {
    return this.client.post(`/v1/events/${eventId}/checkin`, { method: 'qr_code', qr_token: token, ...options })
  }

  async manual(eventId: string, personId: string, operatorId: string): Promise<CheckinResult> {
    return this.client.post(`/v1/events/${eventId}/checkin`, { method: 'manual', person_id: personId, operator_id: operatorId })
  }

  async getHistory(eventId: string, page = 1, pageSize = 50): Promise<PaginatedResult<CheckinResult>> {
    return this.client.get(`/v1/events/${eventId}/checkins`, { page, pageSize })
  }
}
