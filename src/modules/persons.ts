import type { VelixClient } from '../client';
import type { Person, PaginatedResult } from '../types';

export class PersonsModule {
  constructor(private client: VelixClient) {}

  async list(tenantId: string, page = 1, pageSize = 50): Promise<PaginatedResult<Person>> {
    const { data } = await this.client.http.get<PaginatedResult<Person>>('/v1/persons', {
      params: { tenantId, page, pageSize },
    });
    return data;
  }

  async get(personId: string): Promise<Person> {
    const { data } = await this.client.http.get<Person>(`/v1/persons/${personId}`);
    return data;
  }

  async enroll(personId: string, frame: string): Promise<{ enrolled: boolean; quality: number }> {
    const { data } = await this.client.http.post(`/v1/persons/${personId}/enroll`, { frame });
    return data;
  }

  async delete(personId: string): Promise<void> {
    await this.client.http.delete(`/v1/persons/${personId}`);
  }
}
