export interface VelixConfig {
  apiUrl: string
  apiKey: string
  environment: 'production' | 'sandbox'
  timeout?: number
}

export interface Envelope<T> {
  data: T
}

export type ApiResponse<T> = Promise<T>

export interface CheckinResult {
  passed: boolean
  personId?: string
  tenantSlug: string
  timestamp: string
  geofenceStatus?: 'ok' | 'alerta' | 'bloqueado'
}

export interface Person {
  id: string
  name: string
  document: string
  tenantId: string
  enrolledAt: string | null
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
}
