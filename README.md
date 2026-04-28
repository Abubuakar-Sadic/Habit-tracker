# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and localStorage persistence.

---

## Setup

```bash
npm install
```

---

## Running the App

```bash
# Development
npm run dev

# Production (required for E2E tests)
npm run build
npm run start
```

---

## Running the Tests

```bash
# All tests (unit + integration + e2e)
npm test

# Unit tests only (with coverage)
npm run test:unit

# Integration tests only
npm run test:integration

# End-to-end tests only (requires app running: npm run build && npm run start)
npm run test:e2e
```

---

## Local Persistence Structure

All data is stored in `localStorage` using three keys:

| Key | Shape | Purpose |
|-----|-------|---------|
| `habit-tracker-users` | `User[]` | Stores registered user accounts |
| `habit-tracker-session` | `Session \| null` | Stores the active login session |
| `habit-tracker-habits` | `Habit[]` | Stores all habits for all users |

**User shape:** `{ id, email, password, createdAt }`  
**Session shape:** `{ userId, email }`  
**Habit shape:** `{ id, userId, name, description, frequency, createdAt, completions[] }`

Habits are filtered per user at runtime — `userId` is matched against the active session.

---

## PWA Support

- **`public/manifest.json`** — declares app name, icons, colors, and `display: standalone`
- **`public/sw.js`** — a cache-first service worker that pre-caches the app shell on install and serves from cache when offline
- **`src/components/shared/ServiceWorkerRegistrar.tsx`** — client component that registers the SW via `navigator.serviceWorker.register`
- Icons at **`public/icons/icon-192.png`** and **`public/icons/icon-512.png`**

---

## Trade-offs and Limitations

- **Passwords stored in plaintext** — this is a front-end-only stage; no bcrypt or hashing is used.
- **No token expiry** — sessions persist until explicit logout.
- **Single frequency** — only `daily` frequency is implemented as specified.
- **No pagination** — habit list renders all habits at once.

---

## Mapping of Test Files to Behavior

### `tests/unit/slug.test.ts`
Verifies `getHabitSlug()` — lowercasing, trimming, space-to-hyphen conversion, removal of special characters.

### `tests/unit/validators.test.ts`
Verifies `validateHabitName()` — empty input rejection, 60-character limit, trimmed valid output.

### `tests/unit/streaks.test.ts`
Verifies `calculateCurrentStreak()` — empty completions, today-not-completed = 0, consecutive day counting, duplicate deduplication, gap detection.

### `tests/unit/habits.test.ts`
Verifies `toggleHabitCompletion()` — adding a date, removing a date, no mutation of original, no duplicates.

### `tests/integration/auth-flow.test.tsx`
Renders `LoginForm` and `SignupForm` components inside `AuthProvider`. Tests signup creating a session, duplicate email rejection, valid login storing session, invalid credentials showing error.

### `tests/integration/habit-form.test.tsx`
Renders the full `DashboardPage` with seeded localStorage. Tests empty-name validation, habit creation, editing (immutable fields preserved), deletion (requires confirmation), and completion toggle updating the streak display.

### `tests/e2e/app.spec.ts`
Full browser tests via Playwright against the running Next.js app. Tests all 10 required scenarios: splash screen, auth redirects, signup, login, habit isolation per user, create, complete, persist after reload, logout, and offline shell load.

---

## Required File Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx              ← splash + redirect
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── dashboard/page.tsx
├── src/
│   ├── types/
│   │   ├── auth.ts
│   │   ├── habit.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── slug.ts
│   │   ├── validators.ts
│   │   ├── streaks.ts
│   │   ├── habits.ts
│   │   └── storage.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── HabitContext.tsx
│   └── components/
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   └── SignupForm.tsx
│       ├── habits/
│       │   ├── DashboardPage.tsx
│       │   ├── HabitCard.tsx
│       │   └── HabitForm.tsx
│       └── shared/
│           ├── SplashScreen.tsx
│           └── ServiceWorkerRegistrar.tsx
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── slug.test.ts
│   │   ├── validators.test.ts
│   │   ├── streaks.test.ts
│   │   └── habits.test.ts
│   ├── integration/
│   │   ├── auth-flow.test.tsx
│   │   └── habit-form.test.tsx
│   └── e2e/
│       └── app.spec.ts
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
└── README.md
```
