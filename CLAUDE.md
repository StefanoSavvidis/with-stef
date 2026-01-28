# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Development (specific app)
turbo dev --filter=admin
turbo dev --filter=mobile

# Build
pnpm build

# Code quality
pnpm lint           # Biome lint
pnpm format         # Biome format
pnpm check-types    # TypeScript type checking

# Testing (admin app only)
cd apps/admin && pnpm test

# Convex backend
cd packages/backend && npx convex dev
```

## Architecture

**Monorepo**: Turborepo + pnpm workspaces

```
apps/
├── admin/     # Vite + React 19, TanStack Router/Query, Tailwind
└── mobile/    # Expo 54, React Native

packages/
├── backend/   # Convex backend with Better Auth
└── config/    # Shared TypeScript & Biome configs
```

### Tech Stack

- **Admin**: Vite 7 + React 19 + TanStack Router + TanStack Query + Tailwind CSS
- **Mobile**: Expo 54 + React Native 0.81
- **Backend**: Convex (serverless) + Better Auth
- **Code Quality**: Biome 2 (linting + formatting), TypeScript 5.9 strict mode

### Authentication

Uses `@convex-dev/better-auth` Convex Component:
- Email/password authentication
- JWT-based sessions via `ctx.auth.getUserIdentity()`
- Roles: `"user"` (default) and `"admin"`
- Component manages `user`, `session`, `account` tables
- Auth client exported from `packages/backend/src/authClient.ts`

### Key Patterns

**Route Protection (Admin)**:
```typescript
// TanStack Router beforeLoad checks session and role
const session = await authClient.getSession();
if (!session || session.user.role !== "admin") throw redirect({ to: "/login" });
```

**Convex Function Protection**:
```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity || identity.role !== "admin") throw new Error("Unauthorized");
```

## Code Style

- **Formatting**: Tabs (width 2), double quotes, no semicolons
- **Imports**: Auto-organized by Biome
- Generated files excluded from linting: `routeTree.gen.ts`, `convex/_generated/`

## Convex Schema Guidelines

From `.cursorrules`:
- System fields `_id` and `_creationTime` are auto-generated (don't add indices for these)
- Use `v` validator builder for schema definitions
- Reference: https://docs.convex.dev/database/types

## Environment Variables

Required in `.env.local`:
- `VITE_CONVEX_URL` / `CONVEX_SITE_URL` - Convex deployment URL
- `CONVEX_DEPLOYMENT` - Convex deployment identifier
- `BETTER_AUTH_SECRET` - JWT signing secret
