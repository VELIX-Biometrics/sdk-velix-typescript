import type { VelixClient } from '../client'
import type { MeResponse } from '../types'

/** GET /v1/api/me/:personId — scope me:read */
export class MeModule {
  constructor(private readonly client: VelixClient) {}

  async get(personId: string): Promise<MeResponse> {
    const res = await this.client.get<{
      id: string
      name: string
      email: string | null
      phone: string | null
      photo_url: string | null
      created_at: string
    }>(`/v1/api/me/${personId}`)

    return {
      id: res.id,
      name: res.name,
      email: res.email,
      phone: res.phone,
      photoUrl: res.photo_url,
      createdAt: res.created_at,
    }
  }
}
