# Dependências de Runtime — Velix SDK TypeScript

## @velix/sdk-core
**Nenhuma dependência externa de runtime** — apenas APIs nativas (fetch, crypto.subtle, TextEncoder).
Compatível com Node 18+, browsers modernos, Edge runtimes (Cloudflare Workers, Deno).

## @velix/sdk-node
- `@velix/sdk-core` (workspace)

Usa built-ins do Node: `crypto` (HMAC para webhooks).

## @velix/sdk-browser
- `@velix/sdk-core` (workspace)

Zero Node built-ins. Usa `SubtleCrypto` para operações criptográficas se necessário.

## @velix/sdk-react
- `@velix/sdk-browser` (workspace)
- `react` ^18 || ^19 (peer dependency — não bundled)
