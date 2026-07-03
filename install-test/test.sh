#!/usr/bin/env bash
# Testa o pacote como um consumidor externo instalaria de verdade:
# `npm pack` gera o .tgz exatamente como ficaria no registry, instala
# num diretório separado (não o monorepo) e importa via require/import
# normal — não roda a partir do código-fonte local.
set -e
cd "$(dirname "$0")/../packages/core"
npm install --prefer-offline --no-audit --no-fund -q
npm run build

TARBALL=$(npm pack --silent)
mv "$TARBALL" /tmp/velix-sdk-core.tgz

rm -rf /tmp/velix-install-test-ts
mkdir -p /tmp/velix-install-test-ts
cd /tmp/velix-install-test-ts
npm init -y -q >/dev/null
npm install --no-audit --no-fund -q /tmp/velix-sdk-core.tgz

node -e "
const { VelixClient } = require('@velixbiometrics/sdk-core');
const client = new VelixClient({ apiUrl: 'http://localhost', apiKey: 'test' });
if (typeof client.onboarding?.enroll !== 'function') throw new Error('client.onboarding.enroll não existe no pacote instalado');
console.log('INSTALL_TEST:typescript:PASS: pacote instalado via npm pack, client.onboarding.enroll existe');
"
