export { VelixClient } from './client'
export { VelixError, VelixApiError, VelixNetworkError } from './errors'
export { OnboardingModule } from './modules/onboarding'
export { CheckinModule } from './modules/checkin'
export { LgpdModule } from './modules/lgpd'
export { MeModule } from './modules/me'
export { EventsModule } from './modules/events'
export { TimeModule } from './modules/time'
export type {
  VelixConfig,
  Envelope,
  ApiResponse,
  DocumentType,
  IdentityRole,
  OnboardingRequest,
  OnboardingFrameResult,
  OnboardingResponse,
  LivenessAction,
  LivenessSample,
  LivenessBlock,
  CheckinLocation,
  CheckinIdentifyRequest,
  CheckinIdentifyResponse,
  CheckinResult,
  DeletionRequest,
  DeletionRequestResponse,
  MeResponse,
  Person,
  CreateGuestRequest,
  GuestResponse,
  PaginatedResult,
} from './types'
