import { useState, useCallback } from 'react'
import { VelixClient, CheckinModule } from '@velix/sdk-browser'
import type { CheckinIdentifyRequest, CheckinIdentifyResponse } from '@velix/sdk-browser'

interface UseCheckinState {
  result: CheckinIdentifyResponse | null
  loading: boolean
  error: string | null
}

/** Hook para POST /v1/api/checkin/identify (scope checkin:write). */
export function useCheckin(client: VelixClient) {
  const [state, setState] = useState<UseCheckinState>({ result: null, loading: false, error: null })
  const checkin = new CheckinModule(client)

  const identify = useCallback(
    async (request: CheckinIdentifyRequest) => {
      setState({ result: null, loading: true, error: null })
      try {
        const result = await checkin.identify(request)
        setState({ result, loading: false, error: null })
        return result
      } catch (err) {
        const error = (err as Error).message
        setState({ result: null, loading: false, error })
        throw err
      }
    },
    [client],
  )

  return { ...state, identify }
}
