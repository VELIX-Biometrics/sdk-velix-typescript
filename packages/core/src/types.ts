export interface VelixConfig {
  apiUrl: string
  apiKey: string
  /** @deprecated Não há ambiente sandbox — todo cliente integra contra produção. Ignorado pelo client. */
  environment?: 'production'
  /** Timeout do cliente HTTP em ms. Default: 30000 (30s). Sempre sobrescrevível. */
  timeout?: number
}

export interface Envelope<T> {
  data: T
}

export type ApiResponse<T> = Promise<T>

// ── Onboarding (POST /v1/api/onboarding) ────────────────────────────────

export type DocumentType = 'CPF' | 'CNPJ' | 'RG' | 'PASSPORT' | 'OTHER'
export type IdentityRole = 'member' | 'admin' | 'tenant_admin'

/** Superfície idiomática camelCase exposta ao consumidor do SDK. */
export interface OnboardingRequest {
  name: string
  email?: string
  phone?: string
  document?: string
  documentType?: DocumentType
  externalId?: string
  metadata?: Record<string, unknown>
  /** Frames JPEG base64, sem prefixo data URI. Mínimo 1. */
  frames: string[]
  role?: IdentityRole
  accessGroups?: string[]
}

export interface OnboardingFrameResult {
  frameIndex: number
  qualityPassed: boolean
  qualityScore: number
  livenessPassed: boolean
}

export interface OnboardingResponse {
  personId: string
  identityId: string
  enrolled: boolean
  framesProcessed: number
  framesResults: OnboardingFrameResult[]
  embeddingId: string | null
  message: string
}

// ── Checkin (POST /v1/api/checkin/identify) ─────────────────────────────

export type LivenessAction = 'center' | 'move_closer' | 'move_away'

export interface LivenessSample {
  action: LivenessAction
  imageBase64: string
}

export interface LivenessBlock {
  /** Nonce obtido em GET /v1/public/checkin/{tenantSlug}/liveness/challenge. */
  token: string
  samples: LivenessSample[]
}

export interface CheckinLocation {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface CheckinIdentifyRequest {
  /** Frame base64 principal. */
  imageBase64: string
  images?: string[]
  topK?: number
  liveness?: LivenessBlock
  location?: CheckinLocation
}

export interface CheckinIdentifyResponse {
  matched: boolean
  personId: string | null
  /** Score de liveness NUNCA é exposto — apenas passed/matched booleans. */
  qualityScore: number
  message: string
}

/** @deprecated Use CheckinIdentifyResponse — mantido para compat de import. */
export type CheckinResult = CheckinIdentifyResponse

// ── LGPD (POST /v1/api/deletion-request) ────────────────────────────────

export interface DeletionRequest {
  personId: string
}

export interface DeletionRequestResponse {
  protocolNumber: string
  message: string
}

// ── Me (GET /v1/api/me/:personId) ───────────────────────────────────────

export interface MeResponse {
  id: string
  name: string
  email: string | null
  phone: string | null
  photoUrl: string | null
  createdAt: string
}

/** @deprecated Use MeResponse — mantido para compat de import. */
export type Person = MeResponse

// ── Events / Guests (POST|GET /v1/api/events/:id/guests) ───────────────

export interface CreateGuestRequest {
  name: string
  email: string
  cpf?: string
  phone?: string
  birthDate?: string
  categoryId?: string
  companionOf?: string
}

export interface GuestResponse {
  id: string
  eventId: string
  name: string
  email: string
  status: string
  categoryId: string | null
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
}
