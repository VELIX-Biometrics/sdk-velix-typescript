# velix-sdk-typescript

SDK TypeScript/JavaScript oficial do VELIX para integração com a plataforma de biometria e controle de acesso.

---

## Sobre o VELIX

VELIX Biometrics é uma plataforma de identidade digital e biometria que utiliza reconhecimento facial para autenticação, controle de acesso, controle de ponto, credenciamento, check-in e gestão de presença. Desenvolvida para empresas, eventos, indústrias, instituições de ensino e condomínios, a solução oferece identificação rápida, segura e escalável, operando em ambientes cloud, edge ou híbridos. Com arquitetura orientada a APIs, integrações simplificadas e recursos de analytics, o VELIX reduz fraudes, elimina processos manuais, melhora a experiência dos usuários e fornece inteligência operacional em tempo real, mantendo conformidade com a LGPD e padrões corporativos de segurança.

---

## O que este serviço faz

O `@velix/sdk` é o SDK oficial TypeScript/JavaScript do VELIX. Ele encapsula a comunicação HTTP com o `api-velix-identity-core` (BFF único da plataforma) em módulos tipados e prontos para uso, eliminando a necessidade de construir manualmente chamadas REST em integrações externas.

**Responsabilidades:**

- Fornecer um cliente HTTP configurável (`VelixClient`) baseado em axios, com autenticação via API Key e timeout configurável.
- Expor o `CheckinModule` para check-in facial (frame base64 + geolocalização opcional), check-in por QR Code, check-in manual por operador e consulta de histórico de check-ins de um evento.
- Expor o `PersonsModule` para listagem paginada de persons de um tenant, consulta individual, enroll biométrico (envio de frame para cadastro facial) e exclusão de person.
- Exportar todos os tipos TypeScript necessários (`CheckinResult`, `Person`, `PaginatedResult`, `VelixClientConfig`) para uso com tipagem estática completa em projetos consumidores.
- Ser publicado no registro npm como `@velix/sdk` e consumido por integradores, parceiros e sistemas internos que precisam interagir com a API pública do VELIX de forma padronizada.

---

## Stack

| Tecnologia | Versão | Propósito |
|---|---|---|
| TypeScript | ^5.4.0 | Linguagem principal, strict mode habilitado |
| Node.js | ^20 (types) | Runtime de execução |
| axios | ^1.6.0 | Cliente HTTP para chamadas à API VELIX |
| Jest | ^29.0.0 | Framework de testes unitários |
| ts-jest | ^29.0.0 | Transformador TypeScript para Jest |
| tsc | (embutido no TS) | Compilador — gera `dist/` com declarações `.d.ts` |

---

## Arquitetura

O SDK é uma biblioteca cliente pura. Não possui servidor, banco de dados, mensageria nem estado persistente. Toda a lógica de negócio reside no `api-velix-identity-core`.

```
Integrador / sistema parceiro
        │
        │  npm install @velix/sdk
        ▼
   VelixClient
   (axios, Bearer token via API Key)
        │
        │  HTTPS
        ▼
api-velix-identity-core  ←── BFF único da plataforma VELIX
   (porta 8001 / 3001)
        │
  ┌─────┼──────────────────┐
  ▼     ▼                  ▼
edge  vision          intelligence
```

**Módulos e endpoints consumidos:**

| Módulo SDK | Método | Endpoint |
|---|---|---|
| `CheckinModule.facial()` | POST | `/v1/events/:eventId/checkin` |
| `CheckinModule.qrCode()` | POST | `/v1/events/:eventId/checkin` |
| `CheckinModule.manual()` | POST | `/v1/events/:eventId/checkin` |
| `CheckinModule.getHistory()` | GET | `/v1/events/:eventId/checkins` |
| `PersonsModule.list()` | GET | `/v1/persons` |
| `PersonsModule.get()` | GET | `/v1/persons/:personId` |
| `PersonsModule.enroll()` | POST | `/v1/persons/:personId/enroll` |
| `PersonsModule.delete()` | DELETE | `/v1/persons/:personId` |

**Quem usa este SDK:**

- Integradores externos e parceiros que precisam realizar check-ins ou gerenciar persons via API VELIX.
- Sistemas internos de automação que consomem a API pública.
- Projetos que utilizam o `@velix/sdk` como dependência npm direta.

---

## Pré-requisitos

- **Node.js 18+** instalado localmente (para build e testes).
- **`api-velix-identity-core` em execução** (porta 8001 em dev) — o SDK consome exclusivamente esta API.
- **API Key válida** de um tenant ativo no `api-velix-identity-core` para autenticar as requisições.
- Acesso à internet ou ao registry npm privado para instalar o pacote (quando publicado).

Para rodar o stack localmente, consulte o `RUNBOOK_SUBIDA.md` na raiz do monorepo ou execute:

```bash
./velix.sh infra
./velix.sh api
```

---

## Variáveis de Ambiente

O SDK em si não lê variáveis de ambiente — sua configuração é feita diretamente no construtor do `VelixClient`. Os valores abaixo são os que devem ser obtidos do ambiente e passados ao instanciar o cliente:

| Variável (sugestão) | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `VELIX_API_URL` | Sim | — | URL base do `api-velix-identity-core` (ex: `https://api.velixbiometrics.com` em prod ou `http://localhost:8001` em dev) |
| `VELIX_API_KEY` | Sim | — | API Key do tenant, obtida no painel administrativo do VELIX |
| `VELIX_TIMEOUT` | Não | `10000` | Timeout em milissegundos para cada requisição HTTP |

Exemplo de uso com variáveis de ambiente no projeto consumidor:

```bash
VELIX_API_URL=http://localhost:8001
VELIX_API_KEY=sua_api_key_aqui
VELIX_TIMEOUT=10000
```

---

## Como executar localmente

### Instalação como dependência

```bash
npm install @velix/sdk
```

### Desenvolvimento local do SDK

1. **Clone o repositório e acesse o diretório do SDK:**

```bash
cd SDK/velix-sdk-typescript
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Compile o TypeScript:**

```bash
npm run build
```

O output compilado ficará em `dist/` com os arquivos `.js` e as declarações `.d.ts`.

4. **Use o SDK em um projeto local via `npm link`:**

```bash
# No diretório do SDK
npm link

# No projeto consumidor
npm link @velix/sdk
```

5. **Exemplo de uso básico:**

```typescript
import { VelixClient, CheckinModule, PersonsModule } from '@velix/sdk'

const client = new VelixClient({
  apiUrl: process.env.VELIX_API_URL ?? 'http://localhost:8001',
  apiKey: process.env.VELIX_API_KEY ?? '',
  timeout: 10000,
})

// Check-in facial
const checkin = new CheckinModule(client)
const result = await checkin.facial('event-id', frameBase64, {
  lat: -23.5505,
  lng: -46.6333,
})
console.log(result.success, result.personId)

// Check-in por QR Code
const qrResult = await checkin.qrCode('event-id', 'QR_TOKEN_ABC123')

// Check-in manual por operador
const manualResult = await checkin.manual('event-id', 'person-id', 'operator-id')

// Histórico de check-ins
const history = await checkin.getHistory('event-id', 1, 50)

// Listagem de persons
const persons = new PersonsModule(client)
const lista = await persons.list('tenant-id', 1, 50)

// Buscar person por ID
const person = await persons.get('person-id')

// Enroll biométrico
const enroll = await persons.enroll('person-id', frameBase64)
console.log(enroll.enrolled, enroll.quality)

// Excluir person
await persons.delete('person-id')
```

---

## Testes

Os testes utilizam Jest com mocks de axios — nenhuma instância do `api-velix-identity-core` é necessária para rodar os testes.

```bash
# Rodar todos os testes
npm test

# Rodar com cobertura
npm test -- --coverage

# Rodar em modo watch (desenvolvimento)
npm test -- --watch
```

Os testes estão em `src/__tests__/`. Atualmente cobrem o `CheckinModule` (facial, QR Code, manual e passagem de coordenadas GPS).

---

## Build

```bash
# Compilar TypeScript para dist/
npm run build
```

O script `prepublishOnly` garante que build e testes passem antes de qualquer publicação:

```bash
# Executado automaticamente antes de npm publish
npm run build && npm test
```

### Publicação no npm

```bash
# Incrementa versão patch e publica no npm (acesso público)
npm run release
```

O comando `release` executa `npm version patch` (incrementa a versão em `package.json`) seguido de `npm publish --access public`. Certifique-se de estar autenticado no registry npm antes de executar:

```bash
npm login
```

---

## Dependências Externas

| Serviço | Tipo | Descrição |
|---|---|---|
| `api-velix-identity-core` | HTTP (API pública) | BFF único da plataforma VELIX. Todos os módulos do SDK consomem exclusivamente esta API na rota `/v1/*`. Autenticação via `Authorization: Bearer <apiKey>`. |

---

## Qualidade de código

### Lint e pre-push

Este repositório usa **Husky** para garantir qualidade antes de qualquer push:

```bash
# Roda automaticamente no pre-push via Husky
npm run lint
```
