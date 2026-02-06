# Web App

TanStack Start (React 19 + Vite SSR) web app — trivia games for all users, admin management for admins.

## Commands

```bash
turbo dev --filter=web    # Dev server
cd apps/web && pnpm test  # Run tests
cd apps/web && pnpm test -- path/to/file.test.ts  # Single test
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
│   ├── __root.tsx       # Root layout (providers, devtools, Toaster)
│   ├── login.tsx        # Login/signup page
│   ├── _dashboard.tsx   # Auth guard layout + Header + BottomNav
│   ├── _dashboard/      # Authenticated routes
│   │   ├── _app.tsx     # Pathless layout: renders AppSidebar + Outlet
│   │   ├── _app/        # Routes with AppSidebar (no URL segment added)
│   │   │   ├── index.tsx           # Home page (trivia games list, join/view)
│   │   │   └── games/$gameId.tsx   # Game playing page (questions, stats, leaderboard)
│   │   ├── admin.tsx    # Admin layout guard + AdminSidebar
│   │   └── admin/       # Admin-only routes
│   │       ├── index.tsx           # Admin overview
│   │       └── trivia/             # Trivia management
│   └── routeTree.gen.ts # Auto-generated (do not edit)
├── components/
│   ├── retroui/         # Shared UI component library (30+ components)
│   ├── trivia/          # Trivia-specific components
│   ├── AdminSidebar.tsx # Desktop-only (hidden md:flex)
│   ├── AppSidebar.tsx   # Desktop-only (hidden md:flex)
│   ├── BottomNav.tsx    # Mobile-only bottom nav (md:hidden)
│   ├── Header.tsx
│   ├── LiveBadge.tsx    # Green pulsing LIVE badge
│   └── Page.tsx         # Page wrapper (breadcrumb, topRight slot, fullWidth)
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

### Responsive Layout

The app uses a responsive layout with two navigation modes:
- **Desktop (md+)**: Sidebars (`AppSidebar`, `AdminSidebar`) visible, bottom nav hidden
- **Mobile (<md)**: Sidebars hidden, `BottomNav` fixed at bottom

The `_dashboard.tsx` layout renders `<BottomNav />` and applies `pb-14 md:pb-0` to prevent content hiding behind it. Content areas use `p-4 md:p-6` for responsive padding.

### Page Component

Use `<Page>` from `@/components/Page` for content pages. Props:
- `backLink?: { to: string; label: string }` — breadcrumb back navigation
- `topRight?: ReactNode` — slot for badges/actions in the top-right
- `fullWidth?: boolean` — when false (default), constrains to `max-w-3xl`

```typescript
<Page backLink={{ to: "/", label: "Back to Home" }} topRight={<LiveBadge />}>
  {/* page content */}
</Page>
```

### Layout Routes

Uses TanStack Router's pathless layout routes (underscore prefix) to share UI without adding URL segments. The nesting is:

```
__root.tsx              → providers, Toaster
  _dashboard.tsx        → auth guard, Header, BottomNav, flex container
    _app.tsx            → AppSidebar (pathless — no URL segment)
      _app/index.tsx    → / (home page)
      _app/games/$id   → /games/$id (game page)
    admin.tsx           → AdminSidebar, admin role guard
      admin/...         → /admin/... (admin pages)
```

Shared UI like sidebars belongs in layout routes, not in individual page components. To add a new user-facing page, put it under `_app/` and it automatically gets the AppSidebar.

### Route Protection

The `_dashboard.tsx` layout wraps all authenticated routes. The `_dashboard/admin.tsx` layout additionally requires admin role. All routes under `_dashboard/admin/` require an authenticated admin user.

### UI Components (retroui)

shadcn-style components configured in `components.json`. The UI alias points to `@/components/retroui`. Uses Radix primitives, CVA for variants, and `cn()` for class merging.

### Toasts

`<Toaster />` is rendered in `__root.tsx`. Use `toast` from `sonner` for notifications:
```typescript
import { toast } from "sonner"
toast.error("Something went wrong")
```

### LiveBadge

Use `<LiveBadge />` from `@/components/LiveBadge` for green pulsing LIVE indicators. Used on the home page game cards and the game page header.

### Data Fetching

```typescript
import { api } from "@with-stef/backend/convex/_generated/api"
import { useQuery } from "convex/react"

const games = useQuery(api.trivia.listGames)
```

## Generated Files (do not edit)

- `src/routes/routeTree.gen.ts` - Auto-generated route tree
