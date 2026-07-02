import type { VelixClient } from '../client'
import type { DeletionRequest, DeletionRequestResponse } from '../types'

/** POST /v1/api/deletion-request — scope lgpd:write */
export class LgpdModule {
  constructor(private readonly client: VelixClient) {}

  async requestDeletion(request: DeletionRequest): Promise<DeletionRequestResponse> {
    const res = await this.client.post<{ protocol_number: string; message: string }>(
      '/v1/api/deletion-request',
      { person_id: request.personId },
    )

    return {
      protocolNumber: res.protocol_number,
      message: res.message,
    }
  }
}
