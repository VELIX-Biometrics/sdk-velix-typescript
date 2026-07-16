# @velixbiometrics/sdk-core — TypeScript/JavaScript SDK ![version](https://img.shields.io/badge/version-0.1.0--alpha.1-orange)

> ⚠️ **Alpha / pre-release**, mas já publicado e confirmado funcionando de ponta a ponta contra a API real de staging (onboarding, LGPD, me, events). **npm:** https://www.npmjs.com/package/@velixbiometrics/sdk-core

Official TypeScript/JavaScript SDK for the VELIX Biometrics platform — facial access control B2B SaaS.

## Requirements

- Node.js 20+
- TypeScript 5+ (strict mode)

## Installation

```bash
npm install @velixbiometrics/sdk-core
# or
yarn add @velixbiometrics/sdk-core
```

## Quick Start

```typescript
import { VelixClient, CheckinModule } from '@velixbiometrics/sdk-core'

const client = new VelixClient({
  apiUrl: process.env.VELIX_API_URL!,
  apiKey: process.env.VELIX_API_KEY!,
})

const result = await new CheckinModule(client).identify({ imageBase64: frameBase64 })
console.log(result.match) // true | false
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VELIX_API_URL` | Yes | API base URL (`https://api.velixbiometrics.com`) |
| `VELIX_API_KEY` | Yes | Tenant API key (`vx_live_...`) |
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
| `client.contexts` | `create()`, `get()`, `list()`, `update()`, `remove()`, `authorize()`, `listAuthorizationDecisions()`, `createLinkRequest()` | `/v1/contexts/*` |
| `client.memberships` | `create()`, `listByContext()`, `listByIdentity()`, `updateStatus()`, `addRoles()`, `removeRoles()` | `/v1/contexts/:id/memberships`, `/v1/identities/:id/memberships`, `/v1/memberships/*` |
| `client.contextRoles` | `create()`, `list()`, `linkPermissions()` | `/v1/context-roles*` |
| `client.contextPermissions` | `create()`, `list()` | `/v1/context-permissions` |
| `client.authorizationTokens` | `validate()` | `POST /v1/authorization-tokens/validate` |
| `client.internalAuthorization` | `authorize()` | `POST /v1/internal/contexts/authorize` |

## Checkin Module

```typescript
import { CheckinModule } from '@velixbiometrics/sdk-core'
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
import { OnboardingModule } from '@velixbiometrics/sdk-core'
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
import { MeModule } from '@velixbiometrics/sdk-core'
const me = new MeModule(client)

const person = await me.get('person-uuid')
```

## LGPD Module

```typescript
import { LgpdModule } from '@velixbiometrics/sdk-core'
const lgpd = new LgpdModule(client)

const { protocolNumber } = await lgpd.requestDeletion({ personId: 'uuid' })
```

## Events Module (Velix Events — convidados)

```typescript
import { EventsModule } from '@velixbiometrics/sdk-core'
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

## Identity Context

Contexts, roles, permissions, memberships, link-requests (consentimento cross-tenant) e authorization engine. Ver `code/lib/lib-velix-contracts/openapi/public-api.yaml`, tag `Identity Context`.

```typescript
const context = await client.contexts.create({ name: 'Matriz SP', contextType: 'location' })

const decision = await client.contexts.authorize(context.id, {
  identityId: 'identity-uuid',
  permission: 'access:enter',
})
// { granted: true, token: 'vat_...', ... }

const membership = await client.memberships.create(context.id, {
  identityId: 'identity-uuid',
  roleIds: ['role-uuid'],
})

// saída de contexto (definitiva, sem carência)
await client.memberships.updateStatus(membership.id, { status: 'revoked' })

// vínculo cross-tenant — fica PENDING até a pessoa consentir via magic link
await client.contexts.createLinkRequest(context.id, { identityId: 'identity-uuid' })

await client.authorizationTokens.validate({ token: 'vat_...' })
```

## Internal Authorization (Velix Pay e integrações serviço-a-serviço)

Autorização automática (sem usuário humano logado) contra um contexto do Identity Context,
resolvida por `contextCode` + `personId` — diferente de `client.contexts.authorize()`, que exige
um `contextId` já conhecido e é autenticado por JWT de usuário. Este módulo usa a mesma apikey de
produto (`x-api-key`) já configurada no client.

```typescript
// Fluxo genérico
const decision = await client.internalAuthorization.authorize({
  tenantId: 'tenant-uuid',
  contextCode: 'payment',
  personId: 'person-uuid',
  action: 'purchase',
  confidence: 0.92,
})
// { authorized: true, reason: '...', contextId: '...', identityId: '...', ... }

// Fluxo de risk score (Velix Pay) — enviar similarityScore muda o formato da resposta
const risk = await client.internalAuthorization.authorize({
  tenantId: 'tenant-uuid',
  contextCode: 'payment',
  personId: 'person-uuid',
  action: 'purchase',
  similarityScore: 0.87,
})
// { allowed: true } | { allowed: false, risk: 0.4 }
```

## Error Handling

```typescript
import { VelixError, VelixApiError, VelixNetworkError } from '@velixbiometrics/sdk-core'

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
npm link @velixbiometrics/sdk-core
```

## Get an API Key

Access the dashboard at **velixbiometrics.com** → Settings → API Keys → New Key.
