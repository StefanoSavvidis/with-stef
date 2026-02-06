# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Development (all apps + backend concurrently)
pnpm dev

# Development (specific app)
turbo dev --filter=admin
turbo dev --filter=mobile

# Convex backend (run separately in packages/backend)
cd packages/backend && npx convex dev

# Build
pnpm build

# Code quality
pnpm lint           # Biome lint
pnpm format         # Biome format
pnpm check-types    # TypeScript type checking

# Testing (admin app)
cd apps/admin && pnpm test           # Run all tests
cd apps/admin && pnpm test -- path/to/file.test.ts  # Run single test file
```

## Architecture

**Monorepo**: Turborepo + pnpm workspaces

```
apps/
├── admin/     # TanStack Start (Vite + React 19), TanStack Router/Query, Tailwind
└── mobile/    # Expo 54, React Native 0.81

packages/
├── backend/   # Convex backend with Better Auth
└── config/    # Shared TypeScript & Biome configs
```

### Backend Package Exports

The `@with-stef/backend` package exports:
- `@with-stef/backend/convex/_generated/api` - Convex API functions
- `@with-stef/backend/convex/_generated/dataModel` - TypeScript types
- `@with-stef/backend/auth-client` - Auth client factory (`createWebAuthClient`)

### Authentication

Uses `@convex-dev/better-auth` Convex Component:
- Email/password authentication
- JWT-based sessions
- Roles: `"user"` (default) and `"admin"` defined in `user.additionalFields`
- Auth tables managed by the Better Auth component

**Route Protection (Admin)** - Uses Convex React helpers:
```typescript
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"

<AuthLoading><Loading /></AuthLoading>
<Unauthenticated><RedirectToLogin /></Unauthenticated>
<Authenticated><ProtectedContent /></Authenticated>
```

**Convex Function Protection** - Use custom wrappers from `functions.ts`:
```typescript
// No auth needed
import { publicQuery, publicMutation } from "./functions"

// Requires logged-in user (ctx.user available)
import { authedQuery, authedMutation } from "./functions"

// Requires admin role (ctx.user available, role checked)
import { adminQuery, adminMutation } from "./functions"
```

## Code Style

- **Formatting**: Tabs (width 2), double quotes, semicolons only as needed
- **Imports**: Auto-organized by Biome
- Generated files excluded from linting: `routeTree.gen.ts`, `convex/_generated/`

## Convex Conventions

- System fields `_id` and `_creationTime` are auto-generated (don't add indices for these)
- Use `v` validator builder for schema definitions
- Soft delete pattern: add `deletionTime: v.optional(v.number())` field, filter deleted records in queries
- User IDs from Better Auth are strings (not Convex IDs) due to component boundary
- Reference: https://docs.convex.dev/database/types

## Environment Variables

Required in `.env.local`:
- `VITE_CONVEX_URL` - Convex deployment URL (admin app)
- `SITE_URL` - Base URL for auth callbacks
- `CONVEX_DEPLOYMENT` - Convex deployment identifier
- `BETTER_AUTH_SECRET` - JWT signing secret
