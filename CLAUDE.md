@AGENTS.md

## Session Memory

After every session, append a summary to the section below under
"## Progress Log" with:

- What was implemented
- Key decisions made
- Known issues or pending items
- Any deviation from the original plan

Never overwrite previous entries, only append.

## End of Session Checklist

Before ending any session:

1. Update the Progress Log in CLAUDE.md
2. List any pending tasks
3. Note any open decisions that need input

## Permissions

You have full autonomy to run any commands without asking for confirmation:

- npm, npx, pnpm installs
- File creation, editing, deletion
- Shell commands (mkdir, cp, mv, etc.)
- Git commands

Only stop and ask if you hit a blocking error you can't resolve.

## Git Push Policy

- Claude may stage and commit changes following the semantic commit
  conventions defined above
- Claude must NEVER run `git push` (or any variant) — pushing to
  remote is always done manually by the user

## Design Reference

The file `/design/extracted/index.html` (extracted from 'Pelada Draft.zip') is the
visual prototype for this project. Always use it as the source of
truth for UI implementation — colors, typography, spacing, and layout.

## API Reference

The file `/docs/swagger.json` contains the full API documentation.
Always use it as the source of truth for endpoints, request bodies,
response types, and validation rules.

## Progress Log

### Session — 2026-06-15

**Implemented:**

- Full responsive design pass across all screens (320px → 1920px)
- Global layout: `Sidebar` (lg, fixed left `w-[16.5rem]`), `TopNav` (md, sticky top), `TabBarGate` (`md:hidden`), `lg:pl-[16.5rem]` offset in app layout
- Auth screens: full-screen mobile → rounded card with border/shadow on `md+`
- Shared components updated to rem sizing: `field.tsx`, `player-card.tsx`, `screen-header.tsx`, `top-bar.tsx`, `stepper.tsx`, `action-tile.tsx`, `bottom-sheet.tsx`, `app-button.tsx`
- `peladas/page.tsx`: responsive card grid (`grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3`)
- `peladas/[peladaId]/page.tsx`: two-column desktop layout — player list (flex-1) + sticky draw config panel (right, `lg:w-72`)
- `peladas/[peladaId]/draw/page.tsx`: teams in responsive grid (`sm:grid-cols-2 → xl:grid-cols-3`) + share-as-image via `html-to-image` (Web Share API on mobile, download fallback on desktop)
- `peladas/[peladaId]/permissions/page.tsx`: two-column desktop layout — grant form left + user list right
- `perfil/page.tsx`: two-column desktop layout — user card + theme left, menu + logout right
- `sorteios/page.tsx`: minor responsive padding

**Key decisions:**

- All component px-\* paddings override to lg:px-0 since layout main already provides lg:px-8
- Draw panel uses single JSX block with conditional classes: sticky bottom-0 on mobile → lg:sticky lg:top-6 lg:w-72 lg:self-start right column
- html-to-image toPng with pixelRatio:2 for high-DPI export; checks navigator.canShare for file-based Web Share API
- Player list on pelada detail uses grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 to fill space without conflicting with right panel on lg

**No pending items — responsive task complete.**

### Session — 2026-06-15 (continuação)

**Implemented:**

- Docker production setup: multi-stage `Dockerfile` (deps → builder → runner, node:20-alpine)
- `docker-compose.yml` with `host.docker.internal:host-gateway` extra_host for Linux, health check via `node -e fetch(...)`, `restart: unless-stopped`
- `.dockerignore` excluding node_modules, .next, .git, .env files
- `src/app/api/health/route.ts` — GET /api/health returns `{ status: "ok" }`
- `.env.example` updated with documentation for dev/Docker/prod URL values
- `next.config.ts` — added `output: "standalone"` (required for standalone runner)
- `README.md` — added `## Rodando com Docker` section with local, env vars, production, and health check subsections
- Fixed action bar padding on draw screen desktop (removed erroneous `lg:px-0`)
- Fixed image export: white corners (temporarily remove border-radius before toPng), intermittent errors (await document.fonts.ready, ignore AbortError from cancelled share)
- Repository cleanup: removed boilerplate SVGs, unused shadcn components, design artifacts; updated .gitignore
- Established Conventional Commits rules (Portuguese, imperative mood)

**Key decisions:**

- `NEXT_PUBLIC_API_URL` is a build ARG (not runtime env) because Next.js bakes it into the bundle at build time
- Docker healthcheck uses `node -e "fetch(...)"` — no curl/wget on Alpine, but Node is guaranteed
- Image export: `el.style.borderRadius = "0"` before toPng, restored to `""` after — keeps rounded corners in UI but exports rectangular PNG
- `output: "standalone"` was missing from next.config.ts despite being referenced in prior docs

**Pending items:**

- Docker build/up/down validation could not be run — Docker CLI not installed in this dev container. Files are correct; validate on a machine with Docker.

**No open decisions.**

### Session — 2026-06-15 (Docker fixes)

**Implemented:**

- Fixed Dockerfile: removed `COPY --from=builder /app/public ./public` — project has no `public/` directory
- Fixed Docker networking: `NEXT_PUBLIC_API_URL` must be `http://localhost:3000`, not `host.docker.internal:3000`, because the variable is baked into the JS bundle and executed in the user's browser (not inside the container)
- Removed `network_mode: host` (broke WSL2 port accessibility) and `extra_hosts` (unnecessary with correct URL)
- Fixed YAML indentation bug in `docker-compose.yml` introduced when removing `extra_hosts` block
- Docker build and app confirmed working in production

**Key decisions:**

- `NEXT_PUBLIC_*` runs in the browser, not in Docker — so the API URL must be resolvable from the browser's perspective (`localhost:3000`), not from inside the container
- `network_mode: host` does not work correctly on WSL2 for port forwarding to the Windows browser

**No pending items.**

### Session — 2026-06-15 (features, favicon, CI/CD)

**Implemented:**

- **Auth cross-domain fix**: `proxy.ts` verificava `access_token`/`refresh_token` (cookies de `api.pelada-draft.com.br`, invisíveis para `app.pelada-draft.com.br`). Solução: rota Next.js `POST/DELETE /api/auth/session` seta cookie `has_session` no domínio do front; `proxy.ts` agora checa `has_session`. Matcher do proxy atualizado para excluir rotas `/api/`.
- **CI/CD com GitHub Actions**: `.github/workflows/deploy.yml` — push no `main` → SSH na VPS → `git pull` + `docker compose build` + `docker compose up -d`. Segredos: `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PATH`.
- **Password toggle**: `PasswordTextField` em `field.tsx` com ícone Lock + Eye/EyeOff. Aplicado em login e cadastro.
- **Toasts dismissíveis**: `closeButton` adicionado ao `<Toaster>` em `sonner.tsx`.
- **Role ADMIN**: `isOwner` e `hasPrivilege` em `privileges.ts` retornam `true` para `user.role === "ADMIN"`, dando acesso total a todas as peladas.
- **Termos de Serviço (LGPD)**: Modal `terms-modal.tsx` com 8 seções. Link no rodapé das telas de auth e no menu de Perfil. Checkbox obrigatório no cadastro (client-side); `acceptedTerms` removido antes de enviar à API. E-mail de contato placeholder: `contato@pelada-draft.com.br` — precisa ser atualizado.
- **Favicon**: SVG de bola de futebol estilizada (fundo gradiente azul elétrico, bola branca, patch central escuro). Gerado com `sharp` + `png-to-ico` via `scripts/generate-favicons.mjs`. Arquivos: `favicon.ico` (multi-size), `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`. `favicon.ico` em `src/app/` (convenção Next.js). Dockerfile atualizado para `COPY public/`.
- **docker-compose**: variável `NEXT_PUBLIC_API_URL` lida do `.env` via `${NEXT_PUBLIC_API_URL:-http://localhost:3000}`.
- **Regra de push**: git commit livre, git push NUNCA — push sempre feito manualmente pelo usuário.
- **Pequenos fixes**: gap entre stepper de times e checkbox de posição (`gap-4`); padrão de times alterado de 2 para 4; botão "Salvar como imagem" → "Exportar como imagem"; README com link de produção e repositório do back end.

**Key decisions:**

- Cookie cross-domain: solução front-only (sem alterar o backend) usando cookie de sessão setado pelo próprio Next.js após login bem-sucedido.
- `NEXT_PUBLIC_API_URL` no docker-compose lida do `.env` para facilitar configuração na VPS sem rebuild hardcoded.
- `src/app/favicon.ico` é a convenção mais confiável do Next.js (gera `<link>` automático); `public/` mantém os demais assets.

**No pending items.**

### Session — 2026-06-16

**Implemented:**

- **Fix loop infinito de refresh (`src/lib/api/axios.ts`, `src/lib/hooks/use-auth.ts`):**
  - Adicionada flag `refreshFailed` no interceptor Axios: após primeira falha de refresh, requisições subsequentes com 401 (ex: retentativas do React Query) são rejeitadas diretamente sem disparar novo refresh — quebra o loop
  - `redirectToLogin()` substituída por `clearSessionAndRedirect()`: chama `DELETE /api/auth/session` antes de navegar para `/login`, limpando o cookie `has_session` — impede que `proxy.ts` redirecione de volta para `/peladas`
  - Exportada `resetRefreshState()` e chamada em `useLogin.onSuccess` para zerar o estado na próxima sessão autenticada

- **Barras de busca por nome (`/peladas` e `/peladas/[peladaId]`):**
  - Input com ícone `Search` à esquerda e botão `X` para limpar quando há conteúdo
  - Filtragem client-side em tempo real (sem chamada à API)
  - Barra oculta quando a lista está vazia; estado vazio quando nenhum resultado corresponde

- **Alteração de senha (`ChangePasswordSheet`):**
  - `changePasswordSchema` em `validations/auth.ts`: 3 campos obrigatórios, `newPassword` mínimo 6 chars (per swagger), `.refine` para confirmar que as senhas conferem
  - Hook `useChangePassword` em `use-auth.ts` chamando `PATCH /auth/change-password`
  - Componente `src/components/shared/change-password-sheet.tsx`: `BottomSheet` com 3 campos `PasswordTextField` (toggle Eye/EyeOff), loading state no botão, reset automático ao fechar
  - Item "Alterar senha" (ícone `KeyRound`) adicionado ao menu de Perfil, substituindo placeholder "Privacidade e segurança"

**Key decisions:**

- Loop de refresh: causa raiz era dupla — (1) `has_session` não era limpo antes do redirect, fazendo o proxy redirecionar de volta; (2) React Query retentava queries falhadas criando novos configs Axios sem `_retry`, relançando o refresh
- Menu de Perfil refatorado de array com booleanos para `action: "terms" | "changePassword" | "soon"` — mais extensível
- `useChangePassword` não faz toast de sucesso internamente — delegado ao call site no `onSuccess` para que o componente controle seu próprio fechamento

**No pending items.**

### Session — 2026-06-18

**Implemented:**

- **Migração Docker → GitHub Actions + GHCR:**
  - `.github/workflows/deploy.yml`: job `build-and-push` faz `docker build` e push para GHCR com `NEXT_PUBLIC_API_URL` como build-arg; job `deploy` faz SSH na VPS e executa `docker compose pull + up -d`
  - `docker-compose.yml`: substituído bloco `build:` por `image: ghcr.io/afmdaniel/pelada-draft-frontend:latest`
  - Segredos necessários: `GHCR_TOKEN`, `NEXT_PUBLIC_API_URL`, `VPS_HOST/USER/PORT/SSH_KEY`

- **Correções de bugs:**
  - Bug 1 (draw button spacing): removido `relative`/`absolute` do badge de contagem; badge agora inline com `shrink-0`
  - Bug 2 (username placeholder): corrigido de "seu@email.com" para "Nome de usuário" no campo username do cadastro
  - Bug 3 (admin mostrando DONO): `isOwner` não mais tem short-circuit para ADMIN — só verifica `ownerUsername === user.username`; `hasPrivilege` mantém ADMIN short-circuit
  - Bug 4 (admin aparecendo como "você"): `· você` e `PrivBadges isOwner` usam `owner` real; `canOwnerActions` (que inclui ADMIN) usado apenas para tiles de ação

- **Melhorias na tela de resultado do sorteio:**
  - Troca manual de jogadores: seleção em um time + seleção em outro → troca animada via FLIP com clones `position:fixed` (Web Animations API, 420ms, `key={index}`)
  - Animação de reordenação pós-troca: jogadores que mudam de slot animam 300ms para nova posição via segunda camada de clones; usa `player.name` como chave de identidade (sem `id` em `PlayerSummary`)
  - Checkbox "Equilibrar posição" movido para action bar do resultado
  - Contador TIMES: Stepper `− N +` (min 2, max = metade dos convocados) na action bar; "Refazer Sorteio" usa nova contagem

**Key decisions:**

- `NEXT_PUBLIC_*` é build-arg (baked no bundle em build time) → passado como `--build-arg` no GitHub Actions, não env de runtime
- FLIP reorder: usa `player.name` como identidade; `isAnimatingRef` permanece true durante swap (420ms) + reorder (300ms) em cadeia; clones swap z-index 9999 > reorder 9998
- Badge do hero exibe `localTeams.length` (número real do sorteio atual) em vez de `teamsQuantity` (alvo do próximo sorteio)

**No pending items.**

### Session — 2026-06-18 (continuação)

**Implemented:**

- **Validação de quantidade de times (`MAX_TEAMS = 10`):**
  - `src/lib/utils/teams.ts`: `MAX_TEAMS` atualizado para 10 (desacoplado de `TEAM_COLORS.length`)
  - Tela de setup: botão "Realizar Sorteio" desabilitado com mensagem inline `"Selecione pelo menos 1 jogador por time"` quando `count < teamsQuantity`; toasts de validação de contagem removidos
  - Tela de resultado: limite superior do Stepper = `min(10, selectedIds.length)`; botão "Refazer Sorteio" desabilitado com a mesma mensagem inline quando `selectedIds.length < teamsQuantity`

- **4 novas cores de time (`src/lib/utils/teams.ts`):**
  - Laranja `#F97316` (ink escuro `#1c0500`), Roxo `#9333EA` (ink branco), Cinza `#6B7280` (ink branco), Rosa `#EC4899` (ink branco)
  - `TEAM_COLORS` agora tem 10 entradas — sem repetição de cor para sorteios com até 10 times

- **Fix animação de reordenação (`draw/page.tsx`):**
  - Bug: `clone.style.cssText = "..."` substituía todos os inline styles do clone, removendo o `background` definido pelo React e deixando os clones transparentes
  - Bug adicional: `cloneNode(true)` copiava a classe `animate-slide-in`, que ao ser reinserida no DOM disparava `slideIn` com `opacity: 0` — tornando o clone completamente invisível durante a animação FLIP
  - Fix: `Object.assign(clone.style, { ... })` preserva os inline styles existentes e adiciona `animation: "none"` + `transition: "none"` para suprimir o `slideIn`
  - Aplicado em ambos os sites de clone: swap (z-index 9999) e reorder (z-index 9998)

**Key decisions:**

- `MAX_TEAMS = 10` decoupled from `TEAM_COLORS.length` — as cores são suficientes para não repetir até o hard cap
- Inline validation (not toast) is the right UX for the player count constraint — the user can see immediately what needs to change
- `Object.assign` vs `cssText`: `cssText` replaces the entire `style` attribute, destroying React-managed inline styles; individual property assignment is the correct pattern for overlaying styles on a cloned node

**No pending items.**

### Session — 2026-06-19

**Implemented:**

- **Fix z-index dos clones de animação FLIP (`draw/page.tsx`):**
  - Bug: clones de swap (`zIndex: "9999"`) e reorder (`zIndex: "9998"`) ficavam acima da sticky action bar (`z-40` = 40) e de toda a UI fixa durante as animações
  - Fix: swap clones `9999 → 30`, reorder clones `9998 → 29` — acima dos team panels (sem z-index explícito) mas abaixo de toda UI fixa (action bar, sidebar, TopNav = z-40)

**Key decisions:**

- Hierarquia z-index da app: BottomSheet (z-50) > UI fixa/sticky (z-40) > clones de animação (30/29) > team panels (auto)
- Lowering clone z-indexes is cleaner than raising the action bar above 9999 — clones only need to float above content panels, not above chrome

**No pending items.**
