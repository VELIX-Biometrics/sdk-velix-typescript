import { useState, useEffect } from 'react'
import { VelixClient } from '@velix/sdk-browser'
import type { Person } from '@velix/sdk-browser'

export function useGuest(client: VelixClient, personId: string | null) {
  const [guest, setGuest] = useState<Person | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!personId) return
    setLoading(true)
    client
      .get<Person>(`/v1/persons/${personId}`)
      .then(setGuest)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [client, personId])

  return { guest, loading, error }
}
