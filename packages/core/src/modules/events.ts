import type { VelixClient } from '../client'
import type { CreateGuestRequest, GuestResponse } from '../types'

interface WireGuestResponse {
  id: string
  eventId: string
  name: string
  email: string
  status: string
  categoryId: string | null
}

function mapGuest(res: WireGuestResponse): GuestResponse {
  return {
    id: res.id,
    eventId: res.eventId,
    name: res.name,
    email: res.email,
    status: res.status,
    categoryId: res.categoryId,
  }
}

/** Módulo de convidados de eventos (Velix Events). */
export class EventsModule {
  constructor(private readonly client: VelixClient) {}

  /** POST /v1/api/events/:id/guests — scope events:write */
  async createGuest(eventId: string, request: CreateGuestRequest): Promise<GuestResponse> {
    const res = await this.client.post<WireGuestResponse>(`/v1/api/events/${eventId}/guests`, {
      name: request.name,
      email: request.email,
      cpf: request.cpf,
      phone: request.phone,
      birthDate: request.birthDate,
      categoryId: request.categoryId,
      companionOf: request.companionOf,
    })
    return mapGuest(res)
  }

  /** GET /v1/api/events/:id/guests/:guestId — scope events:read */
  async getGuest(eventId: string, guestId: string): Promise<GuestResponse> {
    const res = await this.client.get<WireGuestResponse>(
      `/v1/api/events/${eventId}/guests/${guestId}`,
    )
    return mapGuest(res)
  }
}
