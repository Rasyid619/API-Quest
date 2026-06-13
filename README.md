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
- **Auth**: JWT bearer access tokens (`jsonwebtoken`)
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
    express/           Request augmentation (.d.ts)
test/                 mirrors src/ (controllers, integration, middlewares, ...)
```

## Getting started

```bash
# 1. Install dependencies (generates yarn.lock on first run)
corepack enable && yarn install

# 2. Configure environment
cp .env.example .env                 # fill ACCESS_TOKEN_PUBLIC_KEY

# 3. Build / test / lint
yarn build
yarn test
yarn lint

# 4. Start
yarn start
```

## Deployment

Render settings:

- **Build command**: `corepack enable && yarn install --immutable && yarn build`
- **Start command**: `yarn start`
- **Environment variables**: `ACCESS_TOKEN_PUBLIC_KEY`, `PORT=10000`
