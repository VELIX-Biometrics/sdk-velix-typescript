import { useState, useCallback } from 'react'
import { VelixClient, CheckinModule } from '@velix/sdk-browser'
import type { CheckinResult } from '@velix/sdk-browser'

interface UseCheckinState {
  result: CheckinResult | null
  loading: boolean
  error: string | null
}

export function useCheckin(client: VelixClient, eventId: string) {
  const [state, setState] = useState<UseCheckinState>({ result: null, loading: false, error: null })
  const checkin = new CheckinModule(client)

  const facial = useCallback(
    async (frame: string, options?: { lat?: number; lng?: number }) => {
      setState({ result: null, loading: true, error: null })
      try {
        const result = await checkin.facial(eventId, frame, options)
        setState({ result, loading: false, error: null })
        return result
      } catch (err) {
        const error = (err as Error).message
        setState({ result: null, loading: false, error })
        throw err
      }
    },
    [client, eventId],
  )

  return { ...state, facial }
}
