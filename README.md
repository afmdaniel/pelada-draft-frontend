# Pelada Draft — Front end

Aplicação web para gerenciar peladas (grupos de futebol amador): cadastro de jogadores com estrelas e posição, sorteio equilibrado de times e gerenciamento de permissões.

## Stack

- **Next.js 16** (App Router) com TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (base-ui)
- **TanStack React Query** para estado assíncrono e cache
- **Axios** com interceptor de refresh token automático
- **React Hook Form** + **Zod** para formulários e validação

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure o ambiente (copie o exemplo):

   ```bash
   cp .env.example .env.local
   ```

   | Variável              | Descrição       | Padrão (dev)            |
   | --------------------- | --------------- | ----------------------- |
   | `NEXT_PUBLIC_API_URL` | URL base da API | `http://localhost:3000` |

   Em produção use `https://api.pelada-draft.com.br`.

3. Suba o servidor de desenvolvimento (porta **3001**, pois a API usa a 3000):

   ```bash
   npm run dev
   ```

## Autenticação

A API usa cookies HttpOnly (`access_token` / `refresh_token`). Todas as requisições são feitas com `withCredentials: true`. Um interceptor do Axios captura respostas 401, chama `POST /auth/refresh` e refaz a requisição original; se o refresh falhar, o usuário é redirecionado para `/login`.

A proteção de rotas é feita em `src/proxy.ts` (convenção do Next 16 que substitui o `middleware.ts`), verificando a presença dos cookies de sessão.

> **Nota:** a API não expõe um endpoint `/auth/me`. O identificador usado no login é salvo localmente para a checagem de "dono" na UI (`ownerUsername`). Essa checagem é só visual — quem decide de fato é o backend. Se o usuário entrar com o e-mail em vez do username, os botões de dono podem não aparecer; recomenda-se adicionar `/auth/me` no backend.

## Rotas

| Rota                              | Descrição                             | Protegida |
| --------------------------------- | ------------------------------------- | --------- |
| `/login`                          | Login (identifier + senha)            | Não       |
| `/register`                       | Cadastro                              | Não       |
| `/` → `/peladas`                  | Lista de peladas do usuário           | Sim       |
| `/peladas/[peladaId]`             | Detalhes + jogadores                  | Sim       |
| `/peladas/[peladaId]/draw`        | Sorteio de times                      | Sim       |
| `/peladas/[peladaId]/permissions` | Gerenciamento de permissões (só dono) | Sim       |

## Estrutura

```
src/
  app/                  # App Router (páginas)
    (auth)/             # login, register
    (app)/              # área logada (header compartilhado)
  components/
    ui/                 # shadcn/ui
    shared/             # Header, ConfirmDialog
    peladas/ players/   # componentes de domínio
  lib/
    api/                # Axios + funções por domínio
    hooks/              # React Query hooks por domínio
    validations/        # Schemas Zod
    utils/              # cn, privilégios, posições, usuário atual
  types/                # DTOs da API
  proxy.ts              # proteção de rotas (middleware do Next 16)
```
