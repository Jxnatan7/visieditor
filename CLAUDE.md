# VisiEditor

React Native + Expo mobile code editor with GitHub integration and AI assistant.

## Commands

```bash
pnpm start          # Start Expo dev server
pnpm typecheck      # TypeScript check
pnpm check-arch     # Architecture dependency check
pnpm lint           # ESLint
pnpm test           # Jest unit tests
```

## Architecture — 4-layer, unidirectional

```
app/          ← Expo Router routes, screen composition
features/     ← Domain logic per feature (auth, dashboard, workspace, ai-assistant, git-operations, settings)
core/         ← Shared infra: API clients, design-system, storage, types, events
ui/           ← Pure UI primitives (Text, Button, Input, Pressable, Badge, Avatar, ...)
```

**Rules:**
- `features/*` import from `core/` and `ui/` only. Cross-feature: use the other feature's `index.ts` only.
- `core/*` imports from `ui/` only (never from `features/`).
- `ui/*` imports from `core/design-system` only (for theme tokens).
- Architecture validated by `scripts/check-architecture.mjs`.

## Key patterns

**Compound components** — FileRow, RepoCard, AISheet, ApiKeyCard all use Context + `Object.assign`.

**State split:**
- Server state → TanStack Query (`features/*/api/`)
- Global UI/session state → Zustand (`features/*/stores/`)
- Form state → React Hook Form + Zod
- Local UI → `useState`

**Storage:**
- `SecureStore` — GitHub token, AI API keys
- `MMKV` — User preferences (fast, sync)
- `FileSystem` — File content cache, unsaved drafts
- `SQLite` — Repo metadata, AI conversation history

## GitHub OAuth

Requires env vars in `.env`:
```
EXPO_PUBLIC_GITHUB_CLIENT_ID=<your GitHub OAuth App client ID>
EXPO_PUBLIC_TOKEN_ENDPOINT=<token exchange server URL>
```

## AI Providers

Configure API keys in Settings → AI API Keys. Keys stored in SecureStore, never leave device.
- Anthropic (Claude Sonnet/Haiku)
- Google (Gemini 1.5 Pro/Flash)
