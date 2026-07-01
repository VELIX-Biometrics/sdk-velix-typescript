import type { VelixClient } from '../client'
import type { Person, PaginatedResult } from '../types'

export class PersonsModule {
  constructor(private readonly client: VelixClient) {}

  async list(tenantId: string, page = 1, pageSize = 50): Promise<PaginatedResult<Person>> {
    return this.client.get('/v1/persons', { tenantId, page, pageSize })
  }

  async get(personId: string): Promise<Person> {
    return this.client.get(`/v1/persons/${personId}`)
  }

  async enroll(personId: string, frame: string): Promise<{ enrolled: boolean; quality: number }> {
    return this.client.post(`/v1/persons/${personId}/enroll`, { frame })
  }

  async delete(personId: string): Promise<void> {
    return this.client.delete(`/v1/persons/${personId}`)
  }
}
