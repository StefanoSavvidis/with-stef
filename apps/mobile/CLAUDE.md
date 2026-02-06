# Mobile App

Expo 54 + React Native 0.81 mobile app for playing trivia games.

## Commands

```bash
turbo dev --filter=mobile            # Start Expo dev server
cd apps/mobile && npx expo start     # Start directly
cd apps/mobile && npx expo run:ios   # Run on iOS simulator
cd apps/mobile && npx expo run:android  # Run on Android emulator
```

## Stack

- **Framework**: Expo 54 (New Architecture enabled)
- **Navigation**: React Navigation 7 (bottom tabs + native stacks)
- **Styling**: Tailwind CSS v4 via Uniwind (`uniwind`)
- **Animations**: React Native Reanimated 4
- **Fonts**: Space Grotesk (body), Archivo Black (headings) via `@expo-google-fonts`
- **Backend**: Convex queries via `useQuery()`
- **Auth**: Better Auth with `@better-auth/expo` + `expo-secure-store`
- **Toasts**: Burnt

## Path Aliases

- `@/*` maps to `./src/*`
- `@/tw` maps to `./src/tw/index.tsx` (Uniwind styled components)
- `@/components/*` maps to `./src/components/*`

## Directory Structure

```
src/
├── screens/
│   ├── LoginScreen.tsx       # Email/password login & signup
│   ├── HomeScreen.tsx        # Main trivia hub
│   ├── GameScreen.tsx        # Active game play
│   ├── AccountScreen.tsx     # User profile
│   └── AdminPlaygroundScreen.tsx  # Admin-only screen
├── navigation/
│   ├── RootTabs.tsx          # Bottom tab navigator
│   ├── TriviaStack.tsx       # Stack navigator for trivia flow
│   └── types.ts              # Navigation type definitions
├── components/
│   └── retroui/              # Custom UI components (33+ components)
├── lib/
│   ├── auth-client.ts        # Better Auth + Expo secure storage
│   ├── convex.ts             # ConvexReactClient instance
│   └── fonts.ts              # Font loading config
├── tw/
│   └── index.tsx             # Uniwind/Tailwind wrapper components
└── global.css                # Tailwind CSS definitions

assets/                       # App icons and splash screens
```

## Key Patterns

### Auth

Uses Better Auth with the Expo plugin for secure token persistence:
```typescript
import { expoClient } from "@better-auth/expo"
import * as SecureStore from "expo-secure-store"

// Tokens stored in SecureStore automatically
```

The `convexClient()` plugin connects auth to Convex.

### Navigation

Bottom tabs (`RootTabs.tsx`) with stack navigators per tab. Admin tab is conditionally shown based on `user.role === "admin"`.

Type-safe navigation params defined in `navigation/types.ts`.

### Styling with Uniwind

Use Uniwind wrapper components from `@/tw` for Tailwind-style class names on native:
```typescript
import { View, Text } from "@/tw"
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold">Hello</Text>
</View>
```

### Data Fetching

```typescript
import { api } from "@with-stef/backend/convex/_generated/api"
import { useQuery } from "convex/react"

const games = useQuery(api.trivia.listGames)
```

## Configuration

- **Bundle ID**: `com.withstef.mobile` (iOS & Android)
- **URL Scheme**: `withstef`
- **Orientation**: Portrait only
- **Babel**: Requires `react-native-reanimated/plugin` (must be last in plugins)
- **Metro**: Custom config for monorepo resolution (`metro.config.js`)
