import { useState, useEffect } from 'react'
import { VelixClient } from '@velix/sdk-browser'

interface EventStatus {
  id: string
  status: 'scheduled' | 'live' | 'ended'
  checkinCount: number
  guestCount: number
}

export function useEventStatus(client: VelixClient, eventId: string, pollIntervalMs = 15000) {
  const [status, setStatus] = useState<EventStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetch = () =>
      client
        .get<EventStatus>(`/v1/events/${eventId}/status`)
        .then((s) => { if (!cancelled) setStatus(s) })
        .catch((err: Error) => { if (!cancelled) setError(err.message) })

    fetch()
    const id = setInterval(fetch, pollIntervalMs)
    return () => { cancelled = true; clearInterval(id) }
  }, [client, eventId, pollIntervalMs])

  return { status, error }
}
