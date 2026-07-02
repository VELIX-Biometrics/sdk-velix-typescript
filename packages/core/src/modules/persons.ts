import type { VelixClient } from '../client'
import type { Person, PaginatedResult } from '../types'

export class PersonsModule {
  constructor(private readonly client: VelixClient) {}

  /** Rota JWT-guarded — o tenant é resolvido pelo token, não passado por query. */
  async list(page = 1, limit = 50): Promise<PaginatedResult<Person>> {
    return this.client.get('/v1/persons', { page, limit })
  }

  async get(personId: string): Promise<Person> {
    return this.client.get(`/v1/persons/${personId}`)
  }

  async enroll(personId: string, frames: string[]): Promise<{ enrolled: boolean; quality: number }> {
    return this.client.post(`/v1/persons/${personId}/enroll`, { frames })
  }

  async delete(personId: string): Promise<void> {
    return this.client.delete(`/v1/persons/${personId}`)
  }
}
