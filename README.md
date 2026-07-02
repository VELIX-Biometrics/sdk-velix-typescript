# @velix/sdk — TypeScript/JavaScript SDK ![version](https://img.shields.io/badge/version-0.1.0--alpha.1-orange)

> ⚠️ **Alpha / pre-release.** This SDK targets a public API surface that does not yet fully exist on the VELIX backend (see internal task #593). Endpoints and auth may not work against production. Do not use in production integrations yet.

Official TypeScript/JavaScript SDK for the VELIX Biometrics platform — facial access control B2B SaaS.

## Requirements

- Node.js 20+
- TypeScript 5+ (strict mode)

## Installation

```bash
npm install @velix/sdk
# or
yarn add @velix/sdk
```

## Quick Start

```typescript
import { VelixClient, CheckinModule } from '@velix/sdk'

const client = new VelixClient({
  apiUrl: process.env.VELIX_API_URL!,
  apiKey: process.env.VELIX_API_KEY!,
  environment: 'sandbox',
})

const result = await new CheckinModule(client).identify({ imageBase64: frameBase64 })
console.log(result.matched) // true | false
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VELIX_API_URL` | Yes | API base URL (`https://api.velixbiometrics.com`) |
| `VELIX_API_KEY` | Yes | Tenant API key (`vx_live_...` or `vx_sandbox_...`) |
| `VELIX_TIMEOUT` | No | Request timeout in ms (default: `30000`) |

## Modules

| Module | Methods | Endpoint |
|--------|---------|----------|
| `OnboardingModule` | `enroll()` | `POST /v1/api/onboarding` |
| `CheckinModule` | `identify()` | `POST /v1/api/checkin/identify` |
| `LgpdModule` | `requestDeletion()` | `POST /v1/api/deletion-request` |
| `MeModule` | `get()` | `GET /v1/api/me/:personId` |
| `EventsModule` | `createGuest()`, `getGuest()` | `POST`/`GET /v1/api/events/:id/guests` |
| `TimeModule` | `punch()`, `getEspelho()` | não implementado — ver nota abaixo |

## Checkin Module

```typescript
import { CheckinModule } from '@velix/sdk'
const checkin = new CheckinModule(client)

// Facial identification (base64 JPEG frame)
const result = await checkin.identify({ imageBase64: frameBase64 })
// { matched: true, personId: 'uuid', qualityScore: 0.91, message: '...' }

// With liveness challenge (token from GET /v1/public/checkin/{tenantSlug}/liveness/challenge)
const result2 = await checkin.identify({
  imageBase64: frameBase64,
  liveness: { token: challengeToken, samples: [{ action: 'center', imageBase64: frameBase64 }] },
})
```

## Onboarding Module

```typescript
import { OnboardingModule } from '@velix/sdk'
const onboarding = new OnboardingModule(client)

const result = await onboarding.enroll({
  name: 'João Silva',
  email: 'joao@company.com',
  documentType: 'CPF',
  document: '12345678900',
  frames: [frame1, frame2, frame3],
})
// { personId: 'uuid', identityId: 'uuid', enrolled: true, framesProcessed: 3, ... }
```

## Me Module

```typescript
import { MeModule } from '@velix/sdk'
const me = new MeModule(client)

const person = await me.get('person-uuid')
```

## LGPD Module

```typescript
import { LgpdModule } from '@velix/sdk'
const lgpd = new LgpdModule(client)

const { protocolNumber } = await lgpd.requestDeletion({ personId: 'uuid' })
```

## Events Module (Velix Events — convidados)

```typescript
import { EventsModule } from '@velix/sdk'
const events = new EventsModule(client)

const guest = await events.createGuest('event-uuid', {
  name: 'João Silva',
  email: 'joao@company.com',
  cpf: '12345678900',
})
const fetched = await events.getGuest('event-uuid', guest.id)
```

## Time Module

`api-velix-time` ainda não tem proxy público via `api-velix-identity-core` (gap de servidor, task #593). `TimeModule.punch()` e `TimeModule.getEspelho()` existem apenas para deixar isso explícito — **sempre lançam `VelixError`**, nunca simulam sucesso ou retornam dados falsos.

## Error Handling

```typescript
import { VelixError, VelixApiError, VelixNetworkError } from '@velix/sdk'

try {
  const result = await checkin.identify({ imageBase64: frame })
} catch (err) {
  if (err instanceof VelixApiError)     console.error(`HTTP ${err.status}: ${err.message}`)
  if (err instanceof VelixNetworkError) console.error('Network error:', err.cause)
  if (err instanceof VelixError)        console.error(err.message)
}
```

## Running Tests

```bash
npm test                   # all tests
npm test -- --coverage     # with coverage
npm test -- --watch        # watch mode
```

Tests use axios mocks — no running service required.

## Local Development

```bash
npm install
npm run build    # compile to dist/
npm run lint     # eslint

# Link locally in another project
npm link
# In the consumer project:
npm link @velix/sdk
```

## Get an API Key

Access the dashboard at **velixbiometrics.com** → Settings → API Keys → New Key.
