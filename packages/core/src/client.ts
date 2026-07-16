import type { VelixConfig, Envelope } from './types'
import { VelixApiError, VelixNetworkError } from './errors'
import { OnboardingModule } from './modules/onboarding'
import { CheckinModule } from './modules/checkin'
import { LgpdModule } from './modules/lgpd'
import { MeModule } from './modules/me'
import { EventsModule } from './modules/events'
import { TimeModule } from './modules/time'
import {
  ContextModule,
  ContextMembershipModule,
  ContextRoleModule,
  ContextPermissionModule,
  AuthorizationTokenModule,
} from './modules/context'
import { InternalAuthorizationModule } from './modules/internal-authorization'

export class VelixClient {
  private readonly baseUrl: string
  private readonly headers: Record<string, string>
  private readonly timeout: number

  /** POST /v1/api/onboarding (Velix.ID). */
  readonly onboarding: OnboardingModule

  /** POST /v1/api/checkin/identify (Velix.ID). */
  readonly checkin: CheckinModule

  /** POST /v1/api/deletion-request (Velix.ID, LGPD). */
  readonly lgpd: LgpdModule

  /** GET /v1/api/me/{personId} (Velix.ID). */
  readonly me: MeModule

  /** POST/GET /v1/api/events/{id}/guests (Velix Events). */
  readonly events: EventsModule

  /** Não implementado — ver modules/time.ts. */
  readonly time: TimeModule

  /** /v1/contexts/* (Identity Context). */
  readonly contexts: ContextModule

  /** /v1/contexts/{id}/memberships, /v1/identities/{id}/memberships, /v1/memberships/* (Identity Context). */
  readonly memberships: ContextMembershipModule

  /** /v1/context-roles/* (Identity Context). */
  readonly contextRoles: ContextRoleModule

  /** /v1/context-permissions (Identity Context). */
  readonly contextPermissions: ContextPermissionModule

  /** /v1/authorization-tokens/validate (Identity Context). */
  readonly authorizationTokens: AuthorizationTokenModule

  /** POST /v1/internal/contexts/authorize (Velix Pay e outras integrações serviço-a-serviço). */
  readonly internalAuthorization: InternalAuthorizationModule

  constructor(private readonly config: VelixConfig) {
    this.baseUrl = config.apiUrl.replace(/\/$/, '')
    this.timeout = config.timeout ?? 30000
    this.headers = {
      'x-api-key': config.apiKey,
      'Content-Type': 'application/json',
    }

    // Facade — padronizado com os outros 15 SDKs (client.onboarding,
    // client.checkin, etc). Antes exigia instanciar cada módulo manualmente
    // (new OnboardingModule(client)), inconsistente com o resto do catálogo.
    this.onboarding = new OnboardingModule(this)
    this.checkin = new CheckinModule(this)
    this.lgpd = new LgpdModule(this)
    this.me = new MeModule(this)
    this.events = new EventsModule(this)
    this.time = new TimeModule()
    this.contexts = new ContextModule(this)
    this.memberships = new ContextMembershipModule(this)
    this.contextRoles = new ContextRoleModule(this)
    this.contextPermissions = new ContextPermissionModule(this)
    this.authorizationTokens = new AuthorizationTokenModule(this)
    this.internalAuthorization = new InternalAuthorizationModule(this)
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`)
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null) continue
        if (Array.isArray(v)) {
          // arrays viram múltiplos pares `key=v1&key=v2` (padrão qs/express)
          for (const item of v) url.searchParams.append(k, String(item))
        } else if (typeof v === 'object') {
          url.searchParams.set(k, JSON.stringify(v))
        } else {
          url.searchParams.set(k, String(v))
        }
      }
    }
    return this._fetch<T>(url.toString(), { method: 'GET' })
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this._fetch<T>(`${this.baseUrl}${path}`, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T = void>(path: string): Promise<T> {
    return this._fetch<T>(`${this.baseUrl}${path}`, { method: 'DELETE' })
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this._fetch<T>(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  private async _fetch<T>(url: string, init: RequestInit): Promise<T> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeout)

    try {
      const res = await fetch(url, {
        ...init,
        headers: { ...this.headers, ...(init.headers ?? {}) },
        signal: controller.signal,
      })
      clearTimeout(timer)

      if (!res.ok) {
        // Envelope real de erro: {"success":false,"error":{"code":"...",
        // "message":"..."}}. code/message ficam ANINHADOS sob "error" —
        // nunca no nível raiz. Mesmo bug encontrado e corrigido em 4 outros
        // SDKs desta plataforma (Ruby, Lua, Elixir, Go) — a mensagem real
        // da API nunca chegava a aparecer aqui, só "HTTP 400: Bad Request".
        let code: string | undefined
        let message = `HTTP ${res.status}: ${res.statusText}`
        try {
          const body = (await res.json()) as { error?: { code?: string; message?: string }; message?: string }
          code = body?.error?.code
          message = body?.error?.message ?? body?.message ?? message
        } catch {
          // body não é JSON — ok, mantém a mensagem genérica
        }
        throw new VelixApiError(message, res.status, code)
      }

      if (res.status === 204) return undefined as T

      const json = (await res.json()) as Envelope<T> | T
      return (json as Envelope<T>).data !== undefined ? (json as Envelope<T>).data : (json as T)
    } catch (err) {
      clearTimeout(timer)
      if (err instanceof VelixApiError) throw err
      throw new VelixNetworkError((err as Error).message, err)
    }
  }
}
