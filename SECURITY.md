# Segurança — @velix/sdk

## Verificação de integridade dos pacotes

Cada release publica attestations de provenance via Sigstore. Para verificar:

```bash
# Verificar provenance npm (requer npm >=9.5)
npm audit signatures @velix/sdk-core

# Verificar com cosign
cosign verify-blob dist/velix-sdk-core-*.tgz \
  --bundle dist/velix-sdk-core-*.tgz.bundle \
  --certificate-identity-regexp="https://bitbucket.org/brajola/velix-sdk-typescript" \
  --certificate-oidc-issuer="https://api.bitbucket.org/2.0/workspaces/brajola/pipelines-config/identity/oidc"
```

## SHA-256 dos releases

Os hashes de cada release estão listados no [CHANGELOG.md](CHANGELOG.md).

## Reportar vulnerabilidade

Envie para **security@velixbiometrics.com** com o assunto `[SDK] Vulnerability Report`.
Não abrir issues públicas para vulnerabilidades de segurança.

## Versão mínima segura

Consulte o endpoint de versão policy da API:
```
GET https://api.velixbiometrics.com/v1/sdk/version-policy
```

SDKs abaixo da versão mínima recebem aviso `Warning` header; abaixo de `deprecated_below` recebem `403`.
