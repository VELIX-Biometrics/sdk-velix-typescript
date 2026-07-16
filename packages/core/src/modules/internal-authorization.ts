import type { VelixClient } from '../client'
import type { InternalAuthorizeRequest, InternalAuthorizeResponse } from '../types'

/**
 * Authorization Engine serviço-a-serviço (sem usuário humano) — usado por
 * integrações de produto (ex: Velix Pay/Orbix Mart) que autorizam ações
 * automáticas contra um contexto do Identity Context. Autenticado por
 * apikey de produto (x-api-key), diferente de ContextModule.authorize()
 * (Authorization Engine público, autenticado por JWT de usuário humano).
 * Ver code/core/api/api-velix-identity-core/src/modules/context/authorization/authorization-internal.controller.ts.
 */
export class InternalAuthorizationModule {
  constructor(private readonly client: VelixClient) {}

  /** POST /v1/internal/contexts/authorize */
  async authorize(payload: InternalAuthorizeRequest): Promise<InternalAuthorizeResponse> {
    return this.client.post('/v1/internal/contexts/authorize', payload)
  }
}
