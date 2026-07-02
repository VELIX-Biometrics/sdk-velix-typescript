import type { VelixClient } from '../client'
import type { OnboardingRequest, OnboardingResponse, OnboardingFrameResult } from '../types'

/** POST /v1/api/onboarding — scope onboarding:write */
export class OnboardingModule {
  constructor(private readonly client: VelixClient) {}

  async enroll(request: OnboardingRequest): Promise<OnboardingResponse> {
    const body = {
      name: request.name,
      email: request.email,
      phone: request.phone,
      document: request.document,
      document_type: request.documentType,
      external_id: request.externalId,
      metadata: request.metadata,
      frames: request.frames,
      role: request.role,
      access_groups: request.accessGroups,
    }

    const res = await this.client.post<{
      person_id: string
      identity_id: string
      enrolled: boolean
      frames_processed: number
      frames_results: Array<{
        frame_index: number
        quality_passed: boolean
        quality_score: number
        liveness_passed: boolean
      }>
      embedding_id: string | null
      message: string
    }>('/v1/api/onboarding', body)

    const framesResults: OnboardingFrameResult[] = (res.frames_results ?? []).map((f) => ({
      frameIndex: f.frame_index,
      qualityPassed: f.quality_passed,
      qualityScore: f.quality_score,
      livenessPassed: f.liveness_passed,
    }))

    return {
      personId: res.person_id,
      identityId: res.identity_id,
      enrolled: res.enrolled,
      framesProcessed: res.frames_processed,
      framesResults,
      embeddingId: res.embedding_id,
      message: res.message,
    }
  }
}
