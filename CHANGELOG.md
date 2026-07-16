# Changelog — `@velixbiometrics/sdk-core`

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/). Versão do pacote
publicado em `packages/core/package.json`; changelog cobre só o pacote `@velixbiometrics/sdk-core`
(único dos 4 do monorepo `sdk-velix-typescript` publicado no npm até agora).

## [0.1.7] — 2026-07-16

### Fixed
- `CheckinContext` (e `CheckinLiveness`) não estavam exportados em `index.ts`/`index.d.ts` —
  consumidores TypeScript não conseguiam importar o tipo do campo `contexts` novo (0.1.6) para
  tipagem explícita, mesmo o campo já existindo em `CheckinIdentifyResponse`.
- README: badge de versão desatualizado (mostrava `0.1.3`); exemplo de `checkin.identify()` usava
  um shape de resposta que nunca existiu (`matched`/`personId`/`qualityScore`/`message`) em vez do
  real (`match`/`subjectId`/`liveness`/`model`/`contexts`) — corrigido, com exemplo de uso do
  campo `contexts`.

## [0.1.6] — 2026-07-16

### Fixed
- Republicação da `0.1.5`: mesmo padrão de bug da `0.1.3`/`0.1.4` — build corrido em cima de um
  `git stash` de diagnóstico publicou `dist/` sem o campo `contexts` novo. Corrigido com rebuild
  limpo, confirmado via tarball baixado do registry antes do commit do fix.

## [0.1.5] — 2026-07-16

### Added
- `CheckinIdentifyResponse.contexts: CheckinContext[]` — lista os contextos ativos (Identity
  Context, ex: Velix Pay) da pessoa identificada em `checkin.identify()`, já retornada pelo
  backend desde a v1.2.254 do identity-core. Requisito do Orbix Mart, que precisa saber em quais
  programas a pessoa está sem chamada extra ao autenticar via checkin servidor-a-servidor.

> ⚠️ Publicação com bug de packaging — ver `0.1.6` acima. Não usar esta versão.

## [0.1.4] — 2026-07-16

### Fixed
- Republicação da `0.1.3`: o tarball anterior tinha `dist/` inconsistente — `internal-authorization`
  existia como módulo isolado em `dist/modules/`, mas não estava exportado em `index.d.ts` nem
  plugado em `client.d.ts` (causa: rebuild incompleto entre um diagnóstico com `git stash` e o
  `npm publish`). `0.1.4` corrige com build limpo, verificado direto do tarball baixado do
  registry npm.

## [0.1.3] — 2026-07-16

### Added
- `client.internalAuthorization.authorize()` → `POST /v1/internal/contexts/authorize` — Authorization
  Engine serviço-a-serviço (sem usuário humano), autenticado por apikey de produto (`x-api-key`).
  Usado por integrações como o Velix Pay (Orbix Mart) que autorizam ações automáticas por
  `contextCode`/`personId` em vez de `contextId`/JWT de usuário (esse último já coberto por
  `client.contexts.authorize()`). Suporta o fluxo de risk score (`similarityScore` →
  `{allowed, risk?}`) além do fluxo genérico (`{authorized, reason, ...}`).

> ⚠️ Publicação com bug de packaging — ver `0.1.4` acima. Não usar esta versão.

## [0.1.2] — 2026-07-09

### Added
- `checkin.getLivenessChallenge()` — buscava o desafio de liveness fora do client oficial até
  esta versão.

## [0.1.1] e anteriores

Sem changelog formal — histórico completo em `git log -- packages/core`. Principais marcos:
- Estrutura de monorepo pnpm workspaces com 4 pacotes (`core`, `node`, `browser`, `react`).
- Facade `VelixClient` padronizado (`client.onboarding`, `client.checkin`, etc).
- Contrato realinhado com a API pública real (task #593).
- Métodos do Identity Context (contexts, memberships, roles, permissions, authorization tokens).
- Publicação inicial no npm sob o scope `@velixbiometrics` (renomeado de `@velix`, já reivindicado
  por terceiros).
