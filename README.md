# API Quest

API Quest assessment service, bootstrapped from the local TypeScript service
template. It follows a layered, module-foldered structure and is fully
standalone: the framework primitives (request/error middleware, HTTP types, env
and shutdown helpers, error classes) live in the project itself, with no shared
package to install.

## Stack

- **Runtime / language**: Node.js + TypeScript (strict), CommonJS
- **HTTP**: Express 5
- **Framework layer**: local — `src/middlewares`, `src/helpers`, `src/errors`,
  and the framework types in `src/types` (no external core package)
- **Validation**: `zod` request schemas via the local `requestValidator` middleware
- **Auth**: JWT bearer guard with environment-backed credentials
  (`jsonwebtoken`)
- **Logging**: Morgan
- **Tests**: Jest + ts-jest + supertest (95% coverage threshold)
- **Lint**: ESLint (typescript-eslint strict + stylistic), markdownlint, yamllint
- **Package manager**: Yarn 4

## Layout

```text
src/
  index.ts            boot: env checks, build app, listen, graceful shutdown
  app.ts              express wiring (cors, json, routes, error handler)
  constants/          fixed values and env var name lists
  errors/             AppError base + NotFound/StateConflict/Validation
  helpers/            framework helpers: check-env-vars, decide-server-port,
                      graceful-shutdown
  controllers/        thin HTTP handlers, one file per operation
    <module>/
  services/           business workflows and transforms
    <module>/
  schemas/            zod request schemas + JWT/pagination schemas
    <module>/
  middlewares/        framework middleware (error handler, body-parser error,
                      request-validator) plus app middleware (verify-token).
                      Express 5 forwards async handler rejections to the error
                      handler automatically.
  routes/             routers, one per module, mounted in routes/index.ts
  types/
    dtos/<module>/     API request/response payloads (suffix: Dto)
    entities/          domain models
    jwt/               token payload structures
    query-results/     raw database row shapes (suffix: Record)
    express/           Request augmentation (.d.ts)
test/                 mirrors src/ (controllers, integration, middlewares, ...)
```

## Authentication

Authentication is intentionally implemented as a guard, not as a user
management feature. The assessment requirement is to protect selected routes,
so `POST /auth/token` validates the configured `AUTH_USERNAME` and
`AUTH_PASSWORD`, issues a JWT, and protected routes verify that bearer token.

Because the API does not need registration, profile management, password
changes, roles, or user lookups, there is no `users` table or user repository.
Adding one would introduce storage and migration work that is outside the
current requirement.

## Getting started

```bash
# 1. Install dependencies (generates yarn.lock on first run)
corepack enable && yarn install

# 2. Configure environment
cp .env.example .env

# 3. Build / test / lint
yarn build
yarn test
yarn lint

# 4. Start
yarn start
```

## Deployment

Render settings:

- **Build command**: `corepack yarn install --immutable && corepack yarn build`
- **Start command**: `node --enable-source-maps ./dist/index.js`
- **Environment variables**: `PORT=10000`, `NODE_VERSION=24.14.1`
