import type { VelixConfig, Envelope } from './types'
import { VelixApiError, VelixNetworkError } from './errors'

export class VelixClient {
  private readonly baseUrl: string
  private readonly headers: Record<string, string>
  private readonly timeout: number

  constructor(private readonly config: VelixConfig) {
    this.baseUrl = config.apiUrl.replace(/\/$/, '')
    this.timeout = config.timeout ?? 30000
    this.headers = {
      'x-api-key': config.apiKey,
      'Content-Type': 'application/json',
    }

    if (
      config.environment === 'sandbox' &&
      config.apiUrl.includes('api.velixbiometrics.com') &&
      !config.apiUrl.includes('sandbox')
    ) {
      console.warn('[Velix SDK] URL de produção usada com environment=sandbox. Verifique a configuração.')
    }
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
        let code: string | undefined
        try {
          const body = (await res.json()) as Record<string, unknown>
          code = (body?.error ?? body?.message) as string | undefined
        } catch {
          // body não é JSON — ok
        }
        throw new VelixApiError(`HTTP ${res.status}: ${res.statusText}`, res.status, code)
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
