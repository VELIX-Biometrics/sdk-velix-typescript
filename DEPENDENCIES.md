# Dependências de Runtime — Velix SDK TypeScript

## @velixbiometrics/sdk-core
**Nenhuma dependência externa de runtime** — apenas APIs nativas (fetch, crypto.subtle, TextEncoder).
Compatível com Node 18+, browsers modernos, Edge runtimes (Cloudflare Workers, Deno).

## @velixbiometrics/sdk-node
- `@velixbiometrics/sdk-core` (workspace)

Usa built-ins do Node: `crypto` (HMAC para webhooks).

## @velixbiometrics/sdk-browser
- `@velixbiometrics/sdk-core` (workspace)

Zero Node built-ins. Usa `SubtleCrypto` para operações criptográficas se necessário.

## @velixbiometrics/sdk-react
- `@velixbiometrics/sdk-browser` (workspace)
- `react` ^18 || ^19 (peer dependency — não bundled)
