import type { VelixClient } from '../client'
import type { CheckinIdentifyRequest, CheckinIdentifyResponse } from '../types'

/** POST /v1/api/checkin/identify — scope checkin:write */
export class CheckinModule {
  constructor(private readonly client: VelixClient) {}

  /**
   * Identificação facial via biometria. Score de liveness NUNCA é exposto —
   * a resposta traz apenas `matched` (boolean).
   */
  async identify(request: CheckinIdentifyRequest): Promise<CheckinIdentifyResponse> {
    const body = {
      imageBase64: request.imageBase64,
      images: request.images,
      topK: request.topK,
      liveness: request.liveness
        ? {
            token: request.liveness.token,
            samples: request.liveness.samples.map((s) => ({
              action: s.action,
              imageBase64: s.imageBase64,
            })),
          }
        : undefined,
      location: request.location,
    }

    const res = await this.client.post<{
      matched: boolean
      person_id: string | null
      quality_score: number
      message: string
    }>('/v1/api/checkin/identify', body)

    return {
      matched: res.matched,
      personId: res.person_id,
      qualityScore: res.quality_score,
      message: res.message,
    }
  }
}
