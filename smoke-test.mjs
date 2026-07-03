#!/usr/bin/env node
// Smoke test de contrato — roda contra API_BASE_URL real usando o SDK
// TypeScript de verdade (build local, não instala do npm — ainda não
// publicado). Ver test-all-sdks.sh para o formato RESULT:.
import { execSync } from 'node:child_process'

const TAG = 'typescript'
const IMG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

function result(step, ok, detail) {
  console.log(`RESULT:${TAG}:${step}:${ok ? 'PASS' : 'FAIL'}:${detail}`)
}

try {
  execSync('npm install --prefer-offline --no-audit --no-fund', { cwd: 'packages/core', stdio: 'inherit' })
  execSync('npm run build', { cwd: 'packages/core', stdio: 'inherit' })
} catch (e) {
  console.log(`RESULT:${TAG}:build:FAIL:${e.message}`)
  process.exit(1)
}

const { VelixClient } = await import('./packages/core/dist/index.js')

const client = new VelixClient({
  apiUrl: process.env.API_BASE_URL,
  apiKey: process.env.VELIX_API_KEY,
})

function reachable(msg) {
  return !/route not found|no route|401|403/i.test(msg)
}
function reachableOrLiveness(msg) {
  return reachable(msg) || /liveness/i.test(msg)
}

let personId = null

try {
  const r = await client.onboarding.enroll({ name: 'Smoke Test TS', frames: [IMG, IMG, IMG] })
  personId = r.personId
  result('onboarding', !!personId, `person_id=${personId}`)
} catch (e) {
  result('onboarding', false, e.message)
}

try {
  const r = await client.checkin.identify({ imageBase64: IMG })
  result('checkin', typeof r.matched === 'boolean', `matched=${r.matched}`)
} catch (e) {
  result('checkin', reachableOrLiveness(e.message), e.message)
}

if (personId) {
  try {
    await client.lgpd.requestDeletion({ personId })
    result('lgpd', true, 'deletion-request ok')
  } catch (e) {
    result('lgpd', false, e.message)
  }

  try {
    const r = await client.me.get(personId)
    result('me', !!r, `got response`)
  } catch (e) {
    result('me', false, e.message)
  }
}

try {
  await client.events.createGuest('00000000-0000-0000-0000-000000000000', {
    name: 'Guest Smoke',
    email: 'guest@smoke.test',
  })
  result('events_create', true, 'endpoint reachable')
} catch (e) {
  result('events_create', reachable(e.message), e.message)
}

try {
  await client.events.getGuest('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000')
  result('events_get', true, 'endpoint reachable')
} catch (e) {
  result('events_get', reachable(e.message), e.message)
}
