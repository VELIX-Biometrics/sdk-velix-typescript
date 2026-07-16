export { VelixClient } from './client'
export { VelixError, VelixApiError, VelixNetworkError } from './errors'
export { OnboardingModule } from './modules/onboarding'
export { CheckinModule } from './modules/checkin'
export { LgpdModule } from './modules/lgpd'
export { MeModule } from './modules/me'
export { EventsModule } from './modules/events'
export { TimeModule } from './modules/time'
export {
  ContextModule,
  ContextMembershipModule,
  ContextRoleModule,
  ContextPermissionModule,
  AuthorizationTokenModule,
} from './modules/context'
export { InternalAuthorizationModule } from './modules/internal-authorization'
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
  CheckinLiveness,
  CheckinContext,
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
  InternalAuthorizeRequest,
  InternalAuthorizeResult,
  InternalAuthorizeRiskResult,
  InternalAuthorizeResponse,
} from './types'
