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
import { VelixClient, CheckinModule, PersonsModule } from '@velix/sdk'

const client = new VelixClient({
  apiUrl: process.env.VELIX_API_URL!,
  apiKey: process.env.VELIX_API_KEY!,
})

const result = await new CheckinModule(client).facial('tenant-slug', frameBase64)
console.log(result.passed) // true | false
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VELIX_API_URL` | Yes | API base URL (`https://api.velixbiometrics.com`) |
| `VELIX_API_KEY` | Yes | Tenant API key (`vx_live_...` or `vx_sandbox_...`) |
| `VELIX_TIMEOUT` | No | Request timeout in ms (default: `10000`) |

## Modules

| Module | Methods |
|--------|---------|
| `CheckinModule` | `facial()`, `qr()`, `pin()`, `getHistory()` |
| `PersonsModule` | `list()`, `get()`, `create()`, `update()`, `delete()`, `enroll()` |
| `EventsModule` | `list()`, `get()`, `create()`, `configure()` |
| `TenantsModule` | `me()`, `updateSettings()` |

## Checkin Module

```typescript
import { CheckinModule } from '@velix/sdk'
const checkin = new CheckinModule(client)

// Facial identification (base64 JPEG frame)
const result = await checkin.facial('tenant-slug', frameBase64)
// { passed: true, personId: 'uuid', personName: 'João Silva' }

// QR code checkin
const result = await checkin.qr('tenant-slug', qrToken)

// PIN checkin
const result = await checkin.pin('tenant-slug', pin)

// Paginated history
const history = await checkin.getHistory('tenant-slug', { page: 1, limit: 20 })
// { items: [...], total: 142, page: 1, pages: 8 }
```

## Persons Module

```typescript
import { PersonsModule } from '@velix/sdk'
const persons = new PersonsModule(client)

// List with optional search
const list = await persons.list({ page: 1, limit: 20, search: 'João' })

// Get by ID
const person = await persons.get('uuid')

// Create
const created = await persons.create({
  name: 'João Silva',
  email: 'joao@company.com',
  externalId: 'EMP-001',
})

// Update
await persons.update('uuid', { name: 'João B. Silva' })

// Enroll biometrics (minimum 3 base64 frames)
await persons.enroll('uuid', [frame1, frame2, frame3])

// Delete
await persons.delete('uuid')
```

## Events Module

```typescript
import { EventsModule } from '@velix/sdk'
const events = new EventsModule(client)

const list    = await events.list({ page: 1, limit: 20 })
const event   = await events.get('uuid')
const created = await events.create({ name: 'Annual Conference 2026', date: '2026-09-01' })
await events.configure('uuid', { checkInOpen: true, requireLiveness: true })
```

## Tenants Module

```typescript
import { TenantsModule } from '@velix/sdk'
const tenants = new TenantsModule(client)

const tenant = await tenants.me()
await tenants.updateSettings({ requireLiveness: true, biometricQualityLevel: 'high' })
```

## Error Handling

```typescript
import { AuthError, BiometricError, RateLimitError, VelixError } from '@velix/sdk'

try {
  const result = await checkin.facial('slug', frame)
} catch (err) {
  if (err instanceof AuthError)      console.error('Invalid API key')
  if (err instanceof BiometricError) console.error('Face not recognized or liveness failed')
  if (err instanceof RateLimitError) console.error('Rate limit — retry after', err.retryAfter, 'ms')
  if (err instanceof VelixError)     console.error(`HTTP ${err.statusCode}: ${err.message}`)
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
