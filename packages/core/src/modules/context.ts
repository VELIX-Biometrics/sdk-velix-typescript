import type { VelixClient } from '../client'

/**
 * Identity Context (Velix.ID) — contexts, roles, permissions, memberships,
 * link-requests (consentimento cross-tenant), authorization e tokens.
 * Ver code/lib/lib-velix-contracts/openapi/public-api.yaml, tag "Identity Context".
 */
export class ContextModule {
  constructor(private readonly client: VelixClient) {}

  /** POST /v1/contexts — cria contexto. */
  async create(payload: Record<string, unknown>): Promise<unknown> {
    return this.client.post('/v1/contexts', payload)
  }

  /** GET /v1/contexts/{id} — busca contexto por id. */
  async get(id: string): Promise<unknown> {
    return this.client.get(`/v1/contexts/${id}`)
  }

  /** GET /v1/contexts — lista contextos do tenant. */
  async list(params?: Record<string, unknown>): Promise<unknown> {
    return this.client.get('/v1/contexts', params)
  }

  /** PATCH /v1/contexts/{id} — atualiza contexto. */
  async update(id: string, payload: Record<string, unknown>): Promise<unknown> {
    return this.client.patch(`/v1/contexts/${id}`, payload)
  }

  /** DELETE /v1/contexts/{id} — remove contexto (soft delete). */
  async remove(id: string): Promise<void> {
    return this.client.delete(`/v1/contexts/${id}`)
  }

  /** POST /v1/contexts/{contextId}/authorize — Authorization Engine. */
  async authorize(contextId: string, payload: Record<string, unknown>): Promise<unknown> {
    return this.client.post(`/v1/contexts/${contextId}/authorize`, payload)
  }

  /** GET /v1/contexts/{contextId}/authorization-decisions — auditoria de decisões. */
  async listAuthorizationDecisions(contextId: string, params?: Record<string, unknown>): Promise<unknown> {
    return this.client.get(`/v1/contexts/${contextId}/authorization-decisions`, params)
  }

  /**
   * POST /v1/contexts/{contextId}/link-requests — solicita vínculo cross-tenant.
   * Nunca cria membership diretamente: retorna 202 (PENDING) aguardando
   * consentimento da pessoa via magic link/notificação. A API pública não
   * expõe endpoints de approve/reject — o consentimento acontece fora do SDK.
   */
  async createLinkRequest(contextId: string, payload: Record<string, unknown>): Promise<unknown> {
    return this.client.post(`/v1/contexts/${contextId}/link-requests`, payload)
  }
}

export class ContextMembershipModule {
  constructor(private readonly client: VelixClient) {}

  /** POST /v1/contexts/{contextId}/memberships — vincula identidade a contexto. */
  async create(contextId: string, payload: Record<string, unknown>): Promise<unknown> {
    return this.client.post(`/v1/contexts/${contextId}/memberships`, payload)
  }

  /** GET /v1/contexts/{contextId}/memberships — lista memberships de um contexto. */
  async listByContext(contextId: string): Promise<unknown> {
    return this.client.get(`/v1/contexts/${contextId}/memberships`)
  }

  /** GET /v1/identities/{identityId}/memberships — lista memberships de uma identidade. */
  async listByIdentity(identityId: string): Promise<unknown> {
    return this.client.get(`/v1/identities/${identityId}/memberships`)
  }

  /**
   * PATCH /v1/memberships/{membershipId}/status — atualiza status.
   * `status: 'revoked'` é a saída de contexto (definitiva, sem carência).
   */
  async updateStatus(membershipId: string, payload: { status: string }): Promise<unknown> {
    return this.client.patch(`/v1/memberships/${membershipId}/status`, payload)
  }

  /** POST /v1/memberships/{membershipId}/roles — adiciona roles ao membership. */
  async addRoles(membershipId: string, payload: { roleIds: string[] }): Promise<unknown> {
    return this.client.post(`/v1/memberships/${membershipId}/roles`, payload)
  }

  /** POST /v1/memberships/{membershipId}/roles/remove — remove roles do membership. */
  async removeRoles(membershipId: string, payload: { roleIds: string[] }): Promise<unknown> {
    return this.client.post(`/v1/memberships/${membershipId}/roles/remove`, payload)
  }
}

export class ContextRoleModule {
  constructor(private readonly client: VelixClient) {}

  /** POST /v1/context-roles — cria role de contexto. */
  async create(payload: Record<string, unknown>): Promise<unknown> {
    return this.client.post('/v1/context-roles', payload)
  }

  /** GET /v1/context-roles?contextType=... — lista roles por context_type. */
  async list(contextType: string): Promise<unknown> {
    return this.client.get('/v1/context-roles', { contextType })
  }

  /** POST /v1/context-roles/{roleId}/permissions — vincula permissions a uma role. */
  async linkPermissions(roleId: string, payload: { permissionIds: string[] }): Promise<unknown> {
    return this.client.post(`/v1/context-roles/${roleId}/permissions`, payload)
  }
}

export class ContextPermissionModule {
  constructor(private readonly client: VelixClient) {}

  /** POST /v1/context-permissions — cria permission de contexto. */
  async create(payload: Record<string, unknown>): Promise<unknown> {
    return this.client.post('/v1/context-permissions', payload)
  }

  /** GET /v1/context-permissions?category=... — lista permissions de contexto. */
  async list(category?: string): Promise<unknown> {
    return this.client.get('/v1/context-permissions', category ? { category } : undefined)
  }
}

export class AuthorizationTokenModule {
  constructor(private readonly client: VelixClient) {}

  /** POST /v1/authorization-tokens/validate — valida (e opcionalmente consome) um token vat_*. */
  async validate(payload: { token: string; consume?: boolean }): Promise<unknown> {
    return this.client.post('/v1/authorization-tokens/validate', payload)
  }
}
