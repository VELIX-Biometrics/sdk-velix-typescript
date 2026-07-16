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
  email: string
  phone: string
  document: string
  documentType: DocumentType
  /** ISO 8601 (ex: '1990-05-20'). Opcional, mas necessário para calcular age/isMinor na resposta. */
  birthDate?: string
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
  /** Calculada a partir de birthDate — null se birthDate não foi informado. */
  age: number | null
  /** true se age < 18 — null se birthDate não foi informado. */
  isMinor: boolean | null
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

/** Resposta de GET /v1/public/checkin/{tenantSlug}/liveness/challenge (endpoint público, sem API Key). */
export interface LivenessChallenge {
  /** Nonce anti-replay — usar em LivenessBlock.token dentro de identify(). */
  token: string
  /** Sequência de ações que o chamador deve capturar, nesta ordem. */
  steps: LivenessAction[]
  /** Timestamp Unix (segundos) de expiração do nonce. */
  expiresAt: number
}

export interface CheckinIdentifyRequest {
  /** Frame base64 principal. */
  imageBase64: string
  images?: string[]
  topK?: number
  liveness?: LivenessBlock
  location?: CheckinLocation
}

export interface CheckinLiveness {
  ok: boolean
}

export interface CheckinIdentifyResponse {
  match: boolean
  subjectId: string | null
  subjectName: string | null
  /** Score de liveness NUNCA é exposto — apenas o booleano `ok`. */
  liveness: CheckinLiveness
  model: string
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

/**
 * Payload de POST /v1/internal/contexts/authorize — autorização
 * serviço-a-serviço (sem usuário humano), autenticada por apikey de
 * produto (x-api-key), usada pelo Velix Pay (Orbix Mart) e demais
 * integrações que autorizam ações automáticas contra um contexto do
 * Identity Context. Diferente de ContextModule.authorize(contextId, ...),
 * que é o Authorization Engine público autenticado por JWT de usuário.
 */
export interface InternalAuthorizeRequest {
  tenantId: string
  contextCode: string
  personId: string
  action: string
  resource?: string
  confidence?: number
  livenessRequired?: boolean
  livenessStatus?: 'PASSED' | 'FAILED' | 'NOT_PERFORMED'
  deviceId?: string
  metadata?: Record<string, unknown>
  /**
   * Score de similaridade biométrica (0-1) do identify. Quando presente,
   * a resposta muda pro formato de risk score do Velix Pay
   * (InternalAuthorizeRiskResult) em vez do formato genérico
   * (InternalAuthorizeResult).
   */
  similarityScore?: number
}

export interface InternalAuthorizeResult {
  authorized: boolean
  reason: string
  contextId: string | null
  identityId: string | null
  membershipId: string | null
  action: string
  resource: string | null
  decisionId?: string
}

export type InternalAuthorizeRiskResult =
  | { allowed: true }
  | { allowed: false; risk: number }

export type InternalAuthorizeResponse = InternalAuthorizeResult | InternalAuthorizeRiskResult
