import { useState, useEffect } from 'react'
import { VelixClient, EventsModule } from '@velix/sdk-browser'
import type { GuestResponse } from '@velix/sdk-browser'

/** Hook para GET /v1/api/events/:eventId/guests/:guestId (scope events:read). */
export function useGuest(client: VelixClient, eventId: string | null, guestId: string | null) {
  const [guest, setGuest] = useState<GuestResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId || !guestId) return
    const events = new EventsModule(client)
    setLoading(true)
    events
      .getGuest(eventId, guestId)
      .then(setGuest)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [client, eventId, guestId])

  return { guest, loading, error }
}
