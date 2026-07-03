import { createHmac, timingSafeEqual } from 'crypto'
import { VelixError } from '@velixbiometrics/sdk-core'

export interface WebhookPayload {
  event: string
  tenantId: string
  timestamp: string
  data: unknown
}

/**
 * Valida assinatura HMAC-SHA256 de um webhook recebido.
 * Lança VelixError se inválido ou expirado.
 */
export function validateWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string,
  maxAgeMs = 5 * 60 * 1000,
): WebhookPayload {
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  const received = signature.replace(/^sha256=/, '')

  const expectedBuf = Buffer.from(expected, 'hex')
  const receivedBuf = Buffer.from(received, 'hex')

  if (expectedBuf.length !== receivedBuf.length || !timingSafeEqual(expectedBuf, receivedBuf)) {
    throw new VelixError('Webhook signature inválida')
  }

  const parsed: WebhookPayload = JSON.parse(payload.toString())
  const age = Date.now() - new Date(parsed.timestamp).getTime()
  if (age > maxAgeMs) {
    throw new VelixError(`Webhook expirado (${Math.round(age / 1000)}s atrás)`)
  }

  return parsed
}
