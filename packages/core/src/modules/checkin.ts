import type { VelixClient } from '../client'
import type { CheckinIdentifyRequest, CheckinIdentifyResponse, LivenessChallenge } from '../types'

/** POST /v1/api/checkin/identify — scope checkin:write */
export class CheckinModule {
  constructor(private readonly client: VelixClient) {}

  /**
   * Busca o nonce anti-replay de liveness — chamar ANTES de identify() sempre
   * que o tenant exigir prova de vida (padrão). Endpoint público (sem API
   * Key), mas ainda passa pelo baseUrl configurado no client. `tenantSlug` é
   * o slug do seu tenant (não o mesmo valor da API Key).
   *
   * O `steps` retornado define a ordem exata das ações que precisam ser
   * capturadas de verdade (aproximar/afastar o rosto da câmera) — enviar o
   * mesmo frame estático para todos os passos é rejeitado pela verificação
   * geométrica do servidor (identify() retorna liveness.ok: false).
   */
  async getLivenessChallenge(tenantSlug: string): Promise<LivenessChallenge> {
    return this.client.get<LivenessChallenge>(
      `/v1/public/checkin/${tenantSlug}/liveness/challenge`,
    )
  }

  /**
   * Identificação facial via biometria. Score de similaridade e de liveness
   * NUNCA são expostos — a resposta traz apenas os booleanos `match`/`liveness.ok`.
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

    return this.client.post<CheckinIdentifyResponse>('/v1/api/checkin/identify', body)
  }
}
