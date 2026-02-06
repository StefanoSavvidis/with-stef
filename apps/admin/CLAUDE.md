# Admin App

TanStack Start (React 19 + Vite SSR) admin dashboard for managing trivia games.

## Commands

```bash
turbo dev --filter=admin    # Dev server
cd apps/admin && pnpm test  # Run tests
cd apps/admin && pnpm test -- path/to/file.test.ts  # Single test
```

## Stack

- **Framework**: TanStack Start (Vite + Nitro SSR)
- **Routing**: TanStack Router (file-based, `src/routes/`)
- **Data**: Convex queries via `useQuery()` + TanStack React Query
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **UI Components**: Custom `retroui` library in `src/components/retroui/` (built on Radix UI + CVA)
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

## Path Aliases

`@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

## Directory Structure

```
src/
├── routes/              # File-based routing (TanStack Router)
│   ├── __root.tsx       # Root layout (providers, auth, devtools)
│   ├── index.tsx        # Public landing (redirects admin to /trivia)
│   ├── login.tsx        # Login/signup page
│   ├── _admin.tsx       # Admin layout guard + sidebar
│   ├── _admin/trivia/   # Protected trivia management routes
│   └── routeTree.gen.ts # Auto-generated (do not edit)
├── components/
│   ├── retroui/         # Shared UI component library (30+ components)
│   ├── trivia/          # Trivia-specific components
│   ├── AdminSidebar.tsx
│   └── Header.tsx
├── integrations/
│   ├── convex/provider.tsx          # ConvexBetterAuthProvider
│   └── tanstack-query/             # React Query setup
├── lib/
│   ├── auth-client.ts   # Better Auth client (browser)
│   ├── auth-server.ts   # Server-side auth (SSR token)
│   └── utils.ts         # cn() class merging helper
└── styles.css           # Global Tailwind entry
```

## Key Patterns

### Auth

Client-side auth uses Convex React helpers:
```typescript
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
```

Server-side auth for SSR uses `getToken()` from `lib/auth-server.ts`.

Auth client is created via `createWebAuthClient` from `@with-stef/backend/auth-client`.

### Route Protection

The `_admin.tsx` layout wraps child routes with `Authenticated`/`Unauthenticated`/`AuthLoading` guards. All routes under `_admin/` require an authenticated admin user.

### UI Components (retroui)

shadcn-style components configured in `components.json`. The UI alias points to `@/components/retroui`. Uses Radix primitives, CVA for variants, and `cn()` for class merging.

### Data Fetching

```typescript
import { api } from "@with-stef/backend/convex/_generated/api"
import { useQuery } from "convex/react"

const games = useQuery(api.trivia.listGames)
```

## Generated Files (do not edit)

- `src/routes/routeTree.gen.ts` - Auto-generated route tree
