import type { VelixClient } from '../client'
import type { CheckinResult } from '../types'

export class CheckinModule {
  constructor(private readonly client: VelixClient) {}

  /** Identificação facial via biometria. `frames` deve conter múltiplas capturas (liveness). */
  async facial(tenantSlug: string, frames: string[], options?: { lat?: number; lng?: number }): Promise<CheckinResult> {
    return this.client.post(`/v1/checkin/${tenantSlug}/identify`, { frames, ...options })
  }
}
