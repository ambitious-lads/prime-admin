# Primely Web — Senior-Level Build Specification

> The complete engineering blueprint for the **Primely Web** application: a
> Next.js + Tailwind + shadcn/ui front-end that talks to the existing
> `primely-api` backend. This document is written for a senior front-end /
> full-stack engineer who will build the whole thing from scratch. It covers
> **both surfaces** of the product:
>
> 1. **Primely for Students** — a public, studentish marketing landing page plus
>    a logged-in, **read-only learning web app** that a subscriber can use from a
>    browser *without* the mobile app.
> 2. **Primely Admin Console** — a powerful internal dashboard for payment
>    verification, user & device management, content CRUD, and analytics.
>
> Read this top to bottom before writing a single line of code. Everything you
> need — routes, payloads, response shapes, page maps, component contracts,
> design tokens, security model, and the device / anti-credential-sharing
> system — is specified here.

---

## Table of Contents

1. [What we are building & why](#1-what-we-are-building--why)
2. [Ground rules for the codebase](#2-ground-rules-for-the-codebase)
3. [Tech stack & exact versions](#3-tech-stack--exact-versions)
4. [Repository & folder architecture](#4-repository--folder-architecture)
5. [Environment configuration](#5-environment-configuration)
6. [The backend contract (response envelope, errors, auth)](#6-the-backend-contract)
7. [Full API reference (every endpoint)](#7-full-api-reference)
8. [Authentication on the web](#8-authentication-on-the-web)
9. [The device lock & anti-credential-sharing model](#9-the-device-lock--anti-credential-sharing-model)
10. [The API client layer](#10-the-api-client-layer)
11. [Data fetching with TanStack Query](#11-data-fetching-with-tanstack-query)
12. [Design system & studentish visual language](#12-design-system--studentish-visual-language)
13. [The marketing landing page](#13-the-marketing-landing-page)
14. [Student web app — page by page](#14-student-web-app--page-by-page)
15. [Admin console — page by page](#15-admin-console--page-by-page)
16. [The admin payment verification dashboard (deep dive)](#16-the-admin-payment-verification-dashboard-deep-dive)
17. [Content CRUD (categories → topics → sets → questions, exams, courses)](#17-content-crud)
18. [Analytics dashboards (admin + student)](#18-analytics-dashboards)
19. [Forms, validation & file uploads](#19-forms-validation--file-uploads)
20. [Route protection & role-based access](#20-route-protection--role-based-access)
21. [Error handling, toasts, empty & loading states](#21-error-handling-toasts-empty--loading-states)
22. [Security checklist](#22-security-checklist)
23. [Performance & SEO](#23-performance--seo)
24. [Testing strategy](#24-testing-strategy)
25. [Deployment](#25-deployment)
26. [Admin credentials & first-run](#26-admin-credentials--first-run)
27. [What to expect / roadmap](#27-what-to-expect--roadmap)
28. [Screenshot & handoff notes](#28-screenshot--handoff-notes)

---

## 1. What we are building & why

Primely is an Ethiopian exam-prep platform (ESSLCE / university entrance focus).
The mobile app already exists. The backend (`primely-api`, Express + Drizzle +
PostgreSQL) already exists and is **the single source of truth** — the web app
adds **zero** business logic of its own that the backend does not already
enforce. The web app is a *client*.

We are adding **two** web surfaces on top of that backend:

### 1.1 Primely for Students (public web)

- A **cool, modern, studentish landing page** to convert visitors into
  registered users (think Duolingo-meets-Notion energy: friendly, colorful,
  confident, fast).
- A **logged-in web app** where a paying subscriber can study **from any
  browser** — read materials, take/review mock exams, practice, view analytics,
  manage their profile — **without needing the mobile app installed**.
- Critically: the web is positioned as a **reading / review companion**. The
  full create-heavy flows (e.g. uploading personal notes) can exist, but the web
  is primarily a **consume / review** surface. This keeps the value anchored to
  the subscription, not to a particular device.

### 1.2 Primely Admin Console (internal web)

- The team's daily driver. The **payment verification dashboard** is the
  centerpiece: subscriptions are activated manually after a human reviews a
  payment proof screenshot. Admins approve/reject here.
- Full **content management** (categories, topics, practice sets, questions,
  exams, courses & materials).
- **User & device management** — see who's subscribed, and **reset a user's
  bound device** when they legitimately switch phones.
- **Analytics** — revenue, signups, active users, content engagement.

### 1.3 The anti-sharing thesis

The backend now enforces a **single-device lock**: a *paid* account is bound to
exactly one physical device. If a subscriber tries to share their credentials so
a friend can log in on a second phone, **the second device is rejected**. The
web app participates in this model deliberately (see
[section 9](#9-the-device-lock--anti-credential-sharing-model)): the browser is
treated as its **own** device, so a subscriber can use *their own* mobile app
**and** the web, but cannot hand the account to other people across many phones.
Admins can reset the binding via the console for genuine device changes.

---

## 2. Ground rules for the codebase

These rules are non-negotiable and exist in this document so the whole team
builds consistently.

1. **Modular code, no comments.** Every file does one thing. Components, hooks,
   API functions, and schemas live in small focused files. **Do not write code
   comments.** Names carry the meaning. If a piece of code needs a comment to be
   understood, rename it or split it until it doesn't. (This rule applies to the
   web app source. This `web.md` document is the *only* place explanations live.)
2. **The backend is the source of truth.** Never replicate gating, pricing, or
   plan logic on the client beyond what's needed for UX. The server re-checks
   everything; the client only mirrors for a nice experience.
3. **Server Components by default, Client Components on purpose.** Use the
   Next.js App Router. Reach for `"use client"` only where you need state,
   effects, or browser APIs.
4. **Typed end to end.** TypeScript strict mode. Every API response has a type.
   Every form has a zod schema.
5. **Composition over configuration.** Build small primitives (from shadcn/ui)
   and compose feature components from them.
6. **Accessible & responsive.** Mobile-first. Keyboard navigable. Proper
   semantics. The student surface must look great on a phone browser too.
7. **No secrets in the client bundle.** Only `NEXT_PUBLIC_*` values reach the
   browser. The admin credentials are never hardcoded into the front-end.

---

## 3. Tech stack & exact versions

Use the **latest stable** of everything. As of this writing:

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | **Next.js 15** (App Router, React 19) | `npx create-next-app@latest` |
| Language | **TypeScript 5.x** strict | |
| Styling | **Tailwind CSS v4** | the version shadcn's latest init targets |
| Components | **shadcn/ui (latest)** | `npx shadcn@latest init` |
| Icons | **lucide-react** | ships with shadcn |
| Data fetching | **@tanstack/react-query v5** | client cache + mutations |
| Forms | **react-hook-form** + **zod** + `@hookform/resolvers` | |
| HTTP | native **fetch** wrapped in a typed client | no axios needed |
| Charts | **Recharts** (via shadcn charts) | analytics dashboards |
| Tables | **@tanstack/react-table v8** | admin data grids |
| Dates | **date-fns** | |
| State (light) | React context + Zustand (only if needed) | prefer Query cache |
| QR | **qrcode** (generate) + **html5-qrcode** or **@zxing/browser** (scan) | device transfer flow |
| Notifications | **sonner** (shadcn toast) | |
| Animations | **framer-motion** | landing page polish |

### 3.1 Bootstrap commands

```bash
npx create-next-app@latest primely-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd primely-web
npx shadcn@latest init
npx shadcn@latest add button card input label form dialog dropdown-menu \
  table tabs badge avatar sheet sonner skeleton select textarea \
  alert alert-dialog tooltip popover separator progress switch \
  checkbox radio-group scroll-area command pagination chart
npm i @tanstack/react-query @tanstack/react-table react-hook-form zod \
  @hookform/resolvers date-fns recharts framer-motion qrcode @zxing/browser
npm i -D @types/qrcode
```

---

## 4. Repository & folder architecture

Two surfaces, **one** Next.js app, separated by **route groups**. This keeps a
single deploy, one API client, one design system.

```
primely-web/
  src/
    app/
      (marketing)/
        layout.tsx
        page.tsx                      landing page
        pricing/page.tsx
        about/page.tsx
        contact/page.tsx
      (auth)/
        layout.tsx
        login/page.tsx
        register/page.tsx
        verify/page.tsx
      (student)/
        layout.tsx                    guarded: requires user session
        dashboard/page.tsx
        practice/page.tsx
        practice/[categoryId]/page.tsx
        practice/topic/[topicId]/page.tsx
        practice/set/[setId]/page.tsx
        exams/page.tsx
        exams/[id]/page.tsx
        exams/attempt/[attemptId]/page.tsx
        exams/report/[attemptId]/page.tsx
        courses/page.tsx
        courses/[courseId]/page.tsx
        courses/material/[materialId]/page.tsx
        notes/page.tsx
        analytics/page.tsx
        plans/page.tsx
        plans/checkout/page.tsx
        profile/page.tsx
        settings/page.tsx
        device/page.tsx               manage / transfer device
      (admin)/
        admin/
          layout.tsx                  guarded: requires admin role
          page.tsx                    admin overview
          payments/page.tsx           payment verification dashboard
          payments/[id]/page.tsx
          users/page.tsx
          users/[id]/page.tsx
          devices/page.tsx
          content/
            categories/page.tsx
            topics/page.tsx
            sets/page.tsx
            questions/page.tsx
          exams/page.tsx
          exams/[id]/page.tsx
          courses/page.tsx
          courses/[courseId]/page.tsx
          analytics/page.tsx
      api/
        device/route.ts               (optional) edge helper for device id
      layout.tsx                      root layout (providers)
      globals.css
      not-found.tsx
      error.tsx
    components/
      ui/                             shadcn primitives (generated)
      marketing/                      hero, features, testimonials, footer...
      student/                        student-only feature components
      admin/                          admin-only feature components
      shared/                         used by both surfaces
    lib/
      api/
        client.ts                     fetch wrapper
        endpoints.ts                  typed endpoint functions
        types.ts                      DTOs
      auth/
        session.ts                    token storage + helpers
        guards.ts                     server-side guards
      device/
        device-id.ts                  stable browser device id
      query/
        keys.ts                       query key factory
        provider.tsx                  QueryClientProvider
      utils/
        cn.ts
        format.ts                     money, dates, numbers
        plans.ts                      plan catalog mirror (UX only)
      validation/
        auth.ts
        plans.ts
        content.ts
    hooks/
      use-auth.ts
      use-plan.ts
      use-device.ts
      use-toast.ts
    config/
      site.ts
      nav.ts
    middleware.ts                     route protection
  .env.local
  components.json                     shadcn config
  tailwind.config.ts
  tsconfig.json
```

### 4.1 Why route groups

- `(marketing)`, `(auth)`, `(student)`, `(admin)` are **route groups** — they
  don't affect the URL but let each surface own its layout, fonts, and guard.
- The **admin** group lives under a real `/admin` URL segment for clarity and so
  it can be protected at the edge by `middleware.ts`.

---

## 5. Environment configuration

`.env.local` (never committed):

```
NEXT_PUBLIC_API_BASE_URL=https://api.primely.example/api
NEXT_PUBLIC_APP_NAME=Primely
NEXT_PUBLIC_SUPPORT_PHONE=0994627985
```

- The **only** public values needed are the API base URL and cosmetic config.
- The API base URL points at the deployed `primely-api` with the `/api` prefix.
- For local dev against a local backend: `http://localhost:3000/api`.
- **CORS:** the backend reads `CORS_ORIGIN` (comma-separated). Add the web app's
  origin(s) there (e.g. `https://app.primely.example,https://admin.primely.example`
  or `http://localhost:3001` for dev). Without this, browser requests are blocked
  in production.

`src/config/site.ts`:

```ts
export const site = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Primely",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "0994627985",
  description: "Ace your exams. Study smarter with Primely.",
};
```

---

## 6. The backend contract

### 6.1 Response envelope

**Every** endpoint returns this shape.

Success:

```json
{
  "success": true,
  "message": "Login successful",
  "data": { }
}
```

Error:

```json
{
  "success": false,
  "message": "This account is already active on another device...",
  "errors": [{ "code": "DEVICE_CONFLICT" }]
}
```

- HTTP status carries the real signal (`200`, `201`, `400`, `401`, `403`, `404`,
  `409`, `429`, `500`).
- `data` holds the payload on success.
- `errors` is an optional array of detail objects. For the device lock the
  backend sends a machine-readable `code` (`DEVICE_CONFLICT`, `DEVICE_REQUIRED`)
  the web uses to render the right screen.

### 6.2 Auth scheme

- **Access token**: JWT in `Authorization: Bearer <token>`. Long-lived
  (configured `365d` by default). Carries `sub`, `phone`, `fullName`, `role`,
  and now `deviceId`.
- **Refresh token**: opaque random string, stored hashed server-side, rotated on
  every `/auth/refresh`. 7-day TTL.
- **Roles**: `user` and `admin` (in the JWT `role` claim and re-checked on the
  server per request).

### 6.3 Device headers

For every request the web sends:

```
X-Device-Id: <stable-browser-device-id>
X-Device-Name: <human label, e.g. "Chrome on Windows">
```

These are also accepted in the body of `login` / `verify-otp` / `refresh`. See
[section 9](#9-the-device-lock--anti-credential-sharing-model).

### 6.4 Rate limits

- Global: **120 req / 60s** per IP.
- Auth endpoints: **10 req / 60s**.
- `POST /plans/subscribe`: **5 req / 60s**.
- On `429` the response includes a `Retry-After` header (seconds). The client
  surfaces a friendly "slow down" toast and disables the action until then.

---

## 7. Full API reference

Base URL: `NEXT_PUBLIC_API_BASE_URL` (ends in `/api`). All paths below are
relative to it. Auth column legend: **Public**, **User** (any logged-in),
**Admin** (role `admin`), **Pro** / **Pro+** (plan-gated).

### 7.1 Auth — `/auth`

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Public | `{ phone, password, fullName }` | `{ userId, phone, message }` (201) |
| POST | `/auth/login` | Public | `{ phone, password, deviceId?, deviceName? }` | `{ user, accessToken, refreshToken }` |
| POST | `/auth/verify-otp` | Public | `{ phone, otpCode, deviceId?, deviceName? }` | `{ user, accessToken, refreshToken }` |
| POST | `/auth/resend-otp` | Public | `{ phone }` | `{ message }` |
| POST | `/auth/refresh` | Public | `{ refreshToken, deviceId?, deviceName? }` | `{ user, accessToken, refreshToken }` |
| POST | `/auth/logout` | User | — | `null` |
| GET | `/auth/me` | User | — | decoded token `{ sub, phone, fullName, role, deviceId }` |
| GET | `/auth/users` | Admin | — | `User[]` (incl. `plan`, `boundDeviceId`, `boundDeviceName`, `deviceBoundAt`, `avatarUrl`) |
| POST | `/auth/users/:id/reset-device` | Admin | — | `{ id, message }` |
| POST | `/auth/users/backfill-avatars` | Admin | — | `{ updated }` |

**Validation notes**

- `register`: `phone` ≥ 10 chars, `password` ≥ 8 chars, `fullName` ≥ 2 chars.
- `verify-otp`: `otpCode` exactly 6 digits.
- `deviceId` / `deviceName`: optional strings (≤ 200 chars). Prefer sending them
  as `X-Device-Id` / `X-Device-Name` headers — the client does this automatically
  on every request.

**`user` object shape (login/verify/refresh):**

```ts
{
  id: string;
  phone: string;
  fullName: string;
  role: "user" | "admin";
  avatarUrl: string;
}
```

### 7.2 Plans & payments — `/plans`

| Method | Path | Auth | Body / Query | Returns |
| --- | --- | --- | --- | --- |
| GET | `/plans` | User | — | plans catalog array |
| GET | `/plans/me` | User | — | `{ plan, planLabel, planActivatedAt, planExpiresAt, latestPayment }` |
| POST | `/plans/subscribe` | User | multipart: `proof` file (optional, image ≤ 5MB) + `{ plan, transactionRef?, note? }` | `{ status, plan, ... }` |
| GET | `/plans/payments` | Admin | `?status=pending\|approved\|rejected` | `PlanPayment[]` |
| POST | `/plans/payments/:id/approve` | Admin | `{ confirmed: true, reviewNote }` (10–500 chars) | `{ payment, user }` |
| POST | `/plans/payments/:id/reject` | Admin | `{ reason }` (1–500 chars) | `{ payment }` |

**Plan catalog (mirror in `lib/utils/plans.ts` for UX only):**

```ts
export const PLANS = {
  free:     { key: "free",     label: "Free",     price: 0,   rank: 0,
              features: ["Access to core practice", "Limited mock exams"] },
  pro:      { key: "pro",      label: "Pro",      price: 300, rank: 1,
              features: ["Everything in Free", "Unlimited mock exams", "Detailed analytics"] },
  pro_plus: { key: "pro_plus", label: "Pro Plus", price: 500, rank: 2,
              features: ["Everything in Pro", "Premium notes & explanations", "Priority support"] },
} as const;
```

**Gating (server-enforced; mirror for UI lock badges):**

```
EXAM_UNLOCK_PLAN      = "pro"
ANALYTICS_UNLOCK_PLAN = "pro"
COURSE_UNLOCK_PLAN    = "pro_plus"
TUTOR_UNLOCK_PLAN     = "pro_plus"
```

**`subscribe` flow:** free → activates instantly. Paid → creates a `pending`
payment record (with optional uploaded proof image) for an admin to review.
A user can only have **one** pending request at a time (server rejects a second).

**`PlanPayment` shape:**

```ts
{
  id: string;
  userId: string;
  plan: "pro" | "pro_plus";
  amount: number;        // birr, server-derived
  status: "pending" | "approved" | "rejected";
  proofUrl: string | null;
  transactionRef: string | null;
  note: string | null;
  reviewedBy: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### 7.3 Courses — `/courses` (Pro+ for premium materials)

| Method | Path | Auth | Body | Returns |
| --- | --- | --- | --- | --- |
| GET | `/courses` | User | — | course list (locked flag per item) |
| GET | `/courses/:courseId` | User | — | course detail + materials |
| GET | `/courses/materials/:materialId` | User | — | material content (locked unless Pro+) |
| POST | `/courses/materials/:materialId/progress` | User | `{ watchedSeconds?, lastReadPage?, readPages?, scrollPercentage?, charDepth?, timeSpentSeconds? }` | updated progress |
| GET | `/courses/materials/:materialId/tutor` | User (Pro+) | — | tutor chat session |
| POST | `/courses/materials/:materialId/tutor` | User (Pro+) | `{ message }` (1–2000 chars) | AI tutor reply |
| DELETE | `/courses/materials/:materialId/tutor` | User (Pro+) | — | cleared session |

### 7.4 Mock exams — `/exams` (Pro for premium exams)

| Method | Path | Auth | Body / Query | Returns |
| --- | --- | --- | --- | --- |
| GET | `/exams` | User | `?tab=latest\|popular\|solved\|topic-wise\|saved&category=&difficulty=Easy\|Medium\|Hard` | exam list |
| GET | `/exams/:id` | User | — | exam detail |
| GET | `/exams/:id/leaderboard` | User | `?limit=50&offset=0` | leaderboard page |
| POST | `/exams/:id/save` | User | — | saved |
| DELETE | `/exams/:id/save` | User | — | unsaved |
| POST | `/exams/:id/start` | User | — | attempt (201) |
| GET | `/exams/attempts/:attemptId/questions` | User | — | questions for attempt |
| POST | `/exams/attempts/:attemptId/sync` | User | `{ timeLeftSeconds, timeSpentSeconds?, answers[] }` | synced state |
| POST | `/exams/attempts/:attemptId/submit` | User | — | scored attempt |
| GET | `/exams/attempts/:attemptId/report` | User | — | detailed report |
| GET | `/user/performance` | User | — | performance summary (note: top-level `/api/user/performance`) |

`answers[]` item: `{ questionId, selectedOption: string | null, isFlagged: boolean, timeSpentSeconds }`.

### 7.5 Practice — `/practice`

Read (User):

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/practice/categories` | categories |
| GET | `/practice/categories/:categoryId/topics` | topics |
| GET | `/practice/topics/:topicId/sets` | practice sets |
| GET | `/practice/sets/:setId/questions` | questions |
| GET | `/practice/topics/:topicId/stats` | per-topic stats |
| POST | `/practice/sets/:setId/submit-answer` | `{ questionId, selectedOption, timeSpentSeconds }` |
| POST | `/practice/sets/:setId/complete` | `{ timeSpentSeconds }` |

Write (Admin CRUD):

| Method | Path | Body |
| --- | --- | --- |
| POST | `/practice/categories` | `{ name, description?, iconName?, accentColor?, displayOrder? }` |
| POST | `/practice/topics` | multipart `image?` + `{ categoryId, name, description?, accentColor?, displayOrder? }` |
| POST | `/practice/sets` | `{ topicId, title, description?, difficulty?, estimatedTimeMinutes?, iconName?, iconColor?, iconBackground?, orderIndex? }` |
| POST | `/practice/questions` | `{ practiceSetId, questionText, options[], correctOption, explanation?, orderIndex? }` |
| PUT | `/practice/questions/:id` | partial of the above |
| DELETE | `/practice/questions/:id` | — |

`options[]` item: `{ label, text }` (min 2).

### 7.6 Analytics — `/analytics` (Pro)

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/analytics/dashboard` | — | dashboard data |
| GET | `/analytics/overview` | — | KPI overview |
| POST | `/analytics/score-calculator` | `{ esslceScore?, uatScore? }` | computed net score |

### 7.7 Streaks — `/streaks`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/streaks/me` | — | streak summary |
| GET | `/streaks/weekly` | — | weekly chart |
| POST | `/streaks/record-activity` | `{ questionsAnswered?, correctCount?, timeSpentSeconds? }` | updated streak |

### 7.8 Profile — `/profile`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/profile/me` | — | profile |
| PUT | `/profile/me` | multipart `avatar?` + profile fields | updated profile |
| GET | `/profile/settings` | — | settings |
| PUT | `/profile/settings` | settings object | updated settings |

### 7.9 Notes — `/notes`

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/notes/upload` | multipart `file` (≤ 50MB) + `{ title?, description? }` | note (201) |
| GET | `/notes` | — | notes list |
| GET | `/notes/:id` | — | note |
| DELETE | `/notes/:id` | — | deleted |

### 7.10 Health

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/health` (no `/api` prefix → `/health`) | `{ status: "UP", timestamp }` |

---

## 8. Authentication on the web

### 8.1 Token storage strategy

The backend issues a long-lived JWT access token and a rotating refresh token.
On the web we choose storage to balance security and the SPA experience:

- **Access token**: kept in memory (React context) for the session, mirrored to
  `localStorage` so a refresh of the page doesn't log the user out.
- **Refresh token**: kept in `localStorage` (paired with the access token). When
  the access token is rejected (`401`), the client calls `/auth/refresh` once,
  swaps in the new pair, and retries the original request.

> Note: A purely httpOnly-cookie model would be more XSS-resistant, but the
> backend issues tokens in the JSON body (not as cookies). To keep the contract
> unchanged we use `localStorage` + a single refresh-retry, and we harden
> against XSS aggressively (see [Security](#22-security-checklist)). If the team
> later wants cookies, add a thin Next.js Route Handler that proxies auth and
> sets httpOnly cookies — the rest of the app is unaffected because all token
> access goes through `lib/auth/session.ts`.

`src/lib/auth/session.ts`:

```ts
const ACCESS_KEY = "primely.access";
const REFRESH_KEY = "primely.refresh";
const USER_KEY = "primely.user";

export type SessionUser = {
  id: string;
  phone: string;
  fullName: string;
  role: "user" | "admin";
  avatarUrl?: string;
};

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export function saveSession(payload: {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}) {
  localStorage.setItem(ACCESS_KEY, payload.accessToken);
  localStorage.setItem(REFRESH_KEY, payload.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}
```

### 8.2 The auth context

`src/hooks/use-auth.ts` exposes the current user, plus `login`, `register`,
`verifyOtp`, `logout`, and a `role` helper. It hydrates from storage on mount,
and is the single place components read identity from.

```tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/endpoints";
import {
  clearSession,
  getStoredUser,
  saveSession,
  type SessionUser,
} from "@/lib/auth/session";

type AuthState = {
  user: SessionUser | null;
  ready: boolean;
  isAdmin: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setReady(true);
  }, []);

  async function login(phone: string, password: string) {
    const data = await authApi.login({ phone, password });
    saveSession(data);
    setUser(data.user);
    router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      clearSession();
      setUser(null);
      router.push("/login");
    }
  }

  const value = useMemo<AuthState>(
    () => ({ user, ready, isAdmin: user?.role === "admin", login, logout }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

### 8.3 The registration / OTP flow

1. `register/page.tsx` → `POST /auth/register` → on success route to `verify`
   with the phone in query/state.
2. `verify/page.tsx` → six-digit OTP input → `POST /auth/verify-otp` (sends
   device headers) → returns a full session → `saveSession` → route to
   `/dashboard`.
3. "Resend code" button → `POST /auth/resend-otp` with a 60s cooldown timer
   (the server also enforces it and returns the remaining seconds in the message
   on `400`).

### 8.4 Login flow

`login/page.tsx` → `POST /auth/login`. Three outcomes the UI must handle:

- **200**: session returned → store → redirect by role.
- **401 "Phone number is not verified"**: route to `verify`.
- **403 `DEVICE_CONFLICT`**: show the "account locked to another device" screen
  (see [section 9](#9-the-device-lock--anti-credential-sharing-model)).

---

## 9. The device lock & anti-credential-sharing model

This is the heart of the anti-sharing system. Read carefully — the web app must
cooperate with the backend's single-device lock.

### 9.1 What the backend enforces (already implemented)

- The `users` table now has `bound_device_id`, `bound_device_name`,
  `device_bound_at`.
- When a **paid** account (plan `pro` / `pro_plus`, role `user`) signs in, the
  presented `deviceId` is **bound** to the account if none is set, or **must
  match** the bound device otherwise. A mismatch → `403 { code: "DEVICE_CONFLICT" }`.
- A middleware (`deviceGuard`) runs on **every** authenticated business route. If
  a paid account calls any endpoint from a device whose `X-Device-Id` doesn't
  match the bound device, the request is rejected with `403 DEVICE_CONFLICT`.
- **Admins** and **free** users are never locked (admins run this console; free
  users may roam until they upgrade).
- Admins can clear a binding via `POST /auth/users/:id/reset-device`.
- The whole feature can be globally disabled with `DEVICE_LOCK_ENABLED=false`.

### 9.2 What "device" means on the web

A browser is treated as **one device**. We generate a **stable, random device
id** the first time the app loads and persist it. As long as the user stays in
that browser profile, it's the same device. This means:

- A subscriber can bind to **either** their phone (mobile app) **or** their
  browser — whichever they sign in on first becomes the bound device.
- They **cannot** simultaneously use the account on their phone app *and* the
  web *and* give it to friends — the moment a second device id appears, it's
  rejected. (Within reason: the bound device is a single id; switching requires
  an admin reset or the transfer flow below.)

> Product nuance: if you want a subscriber to use **both** their own phone app
> **and** their own browser, that is a "trusted multi-surface" feature that the
> *current backend deliberately does not allow* (one device id, hard lock). The
> web honors this. If the business later wants "1 phone + 1 web", extend the
> backend to store a small set of bound device ids; the web is ready for it
> because it always sends a stable id. Until then, the web presents a **device
> transfer** flow so a user can intentionally move their lock to the browser.

### 9.3 Generating a stable browser device id

`src/lib/device/device-id.ts`:

```ts
const KEY = "primely.device.id";
const NAME_KEY = "primely.device.name";

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "dev-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function detectName() {
  if (typeof navigator === "undefined") return "Web";
  const ua = navigator.userAgent;
  const browser =
    /edg/i.test(ua) ? "Edge" :
    /chrome/i.test(ua) ? "Chrome" :
    /firefox/i.test(ua) ? "Firefox" :
    /safari/i.test(ua) ? "Safari" : "Browser";
  const os =
    /windows/i.test(ua) ? "Windows" :
    /mac/i.test(ua) ? "macOS" :
    /android/i.test(ua) ? "Android" :
    /iphone|ipad/i.test(ua) ? "iOS" :
    /linux/i.test(ua) ? "Linux" : "Web";
  return `${browser} on ${os}`;
}

export function getDeviceId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function getDeviceName() {
  if (typeof window === "undefined") return null;
  let name = localStorage.getItem(NAME_KEY);
  if (!name) {
    name = detectName();
    localStorage.setItem(NAME_KEY, name);
  }
  return name;
}
```

> Harden the id (optional, recommended): blend the random id with a lightweight
> browser fingerprint (screen, platform, language) so clearing only the random
> key doesn't trivially mint a new device. Keep it deterministic and privacy-
> respecting — no third-party fingerprinting libraries.

### 9.4 The device-conflict screen

When **any** request returns `403` with `errors[0].code === "DEVICE_CONFLICT"`,
the client routes to `/device` (or shows a full-screen modal) explaining:

- "Your subscription is active on another device."
- Two actions:
  1. **Contact support** (`tel:0994627985`) to ask an admin to reset the device.
  2. **Transfer to this device** — see below.

`src/components/shared/device-conflict.tsx` renders this. The API client throws a
typed `DeviceConflictError`; a top-level error boundary / interceptor catches it.

### 9.5 The QR-based device transfer flow (anti-sharing, pro UX)

Goal: let a *legitimate owner* move their lock to a new device **without** making
sharing easy. The QR flow proves possession of the **currently bound device**.

Design (two variants — pick per product appetite):

**Variant A — admin-mediated (simplest, ships today):**

1. On the new device, user sees the conflict screen and taps "Transfer here".
2. The screen shows the new device id as a **QR code** + a short code.
3. The user opens the Primely **mobile app** (the bound device), goes to
   *Settings → Devices → Move my subscription*, and **scans the QR** (or types
   the code).
4. The mobile app calls a (future) backend endpoint
   `POST /auth/device/transfer { targetDeviceId }` authenticated as the bound
   device, which rebinds the account. (Until that endpoint exists, the same is
   achieved by an **admin** calling `reset-device`, then the user signing in on
   the new device, which binds it.)

**Variant B — self-service same-account scan (no admin):**

1. New device displays QR encoding `{ deviceId, deviceName, nonce }`.
2. The currently-bound device (phone app, already authenticated & matching the
   lock) scans it and confirms "Move my subscription to this browser?".
3. Bound device calls the transfer endpoint; backend rebinds; new device
   re-logs-in and now matches.

Because **only the device that currently holds the lock** can authorize a move,
a person who merely *knows the password* but isn't on the bound device cannot
steal the session — they'd hit `DEVICE_CONFLICT` and have no way to approve a
transfer. **This is the anti-credential-sharing guarantee.**

> Backend follow-up (not in this change set, documented for the roadmap): add
> `POST /auth/device/transfer` guarded by `requireAuth` + `deviceGuard` (so the
> caller must be on the bound device) that sets `boundDeviceId = targetDeviceId`.
> The web QR components below are built to drive it.

QR **generate** (new device) — `src/components/shared/device-qr.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function DeviceQr({ payload }: { payload: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) {
      QRCode.toCanvas(ref.current, payload, { width: 220, margin: 1 });
    }
  }, [payload]);
  return <canvas ref={ref} aria-label="Device transfer QR code" />;
}
```

QR **scan** (bound device / mobile web) — `src/components/shared/device-scanner.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

export function DeviceScanner({ onResult }: { onResult: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new BrowserQRCodeReader();
    let active = true;
    reader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
        if (active && result) onResult(result.getText());
      })
      .catch(() => setError("Camera unavailable"));
    return () => {
      active = false;
    };
  }, [onResult]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  return <video ref={videoRef} className="w-full rounded-lg" />;
}
```

### 9.6 Web-only subscribers (no mobile app at all)

A subscriber who never installs the mobile app simply binds to the **browser** on
first paid sign-in. Everything works on the web. If they later want their phone
app, they perform the transfer (or an admin resets). This satisfies the
requirement: *a person with a subscription can use the web fully without the
mobile app, but cannot share credentials to non-subscribers across devices.*

---

## 10. The API client layer

One typed fetch wrapper. It (a) injects the `Authorization` header, (b) injects
device headers on **every** request, (c) unwraps the response envelope, (d)
auto-refreshes on `401` once, and (e) throws typed errors including
`DeviceConflictError`.

`src/lib/api/client.ts`:

```ts
import { site } from "@/config/site";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from "@/lib/auth/session";
import { getDeviceId, getDeviceName } from "@/lib/device/device-id";

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export class DeviceConflictError extends ApiError {
  constructor(message: string) {
    super(403, message, "DEVICE_CONFLICT");
  }
}

type Options = {
  method?: string;
  body?: unknown;
  form?: FormData;
  auth?: boolean;
  query?: Record<string, string | number | undefined>;
};

function buildUrl(path: string, query?: Options["query"]) {
  const url = new URL(site.apiBaseUrl + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function deviceHeaders() {
  const id = getDeviceId();
  const name = getDeviceName();
  const headers: Record<string, string> = {};
  if (id) headers["X-Device-Id"] = id;
  if (name) headers["X-Device-Name"] = name;
  return headers;
}

async function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  const res = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...deviceHeaders() },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;
  const json = await res.json();
  saveSession(json.data);
  return true;
}

async function raw<T>(path: string, opts: Options, retry = true): Promise<T> {
  const headers: Record<string, string> = { ...deviceHeaders() };
  if (opts.auth !== false) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  let body: BodyInit | undefined;
  if (opts.form) {
    body = opts.form;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(buildUrl(path, opts.query), {
    method: opts.method ?? "GET",
    headers,
    body,
  });

  const json = await res.json().catch(() => ({}));

  if (res.ok) return json.data as T;

  const code = json?.errors?.[0]?.code as string | undefined;
  const message = json?.message ?? "Request failed";

  if (code === "DEVICE_CONFLICT") throw new DeviceConflictError(message);

  if (res.status === 401 && retry && opts.auth !== false) {
    const ok = await refreshTokens();
    if (ok) return raw<T>(path, opts, false);
    clearSession();
  }

  throw new ApiError(res.status, message, code);
}

export const api = {
  get: <T>(path: string, query?: Options["query"]) =>
    raw<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) =>
    raw<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) =>
    raw<T>(path, { method: "PUT", body }),
  del: <T>(path: string) => raw<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, form: FormData, method = "POST") =>
    raw<T>(path, { method, form }),
  public: {
    post: <T>(path: string, body?: unknown) =>
      raw<T>(path, { method: "POST", body, auth: false }),
  },
};
```

`src/lib/api/endpoints.ts` (a thin, typed surface per module — excerpt):

```ts
import { api } from "./client";
import type {
  AuthSession, PlanMe, PlanCatalogItem, PlanPayment, AdminUser,
  Exam, ExamReport, Category, Topic, PracticeSet, Question, Note,
  Course, CourseMaterial, AnalyticsDashboard,
} from "./types";

export const authApi = {
  register: (b: { phone: string; password: string; fullName: string }) =>
    api.public.post<{ userId: string; phone: string; message: string }>(
      "/auth/register", b),
  login: (b: { phone: string; password: string }) =>
    api.public.post<AuthSession>("/auth/login", b),
  verifyOtp: (b: { phone: string; otpCode: string }) =>
    api.public.post<AuthSession>("/auth/verify-otp", b),
  resendOtp: (b: { phone: string }) =>
    api.public.post<{ message: string }>("/auth/resend-otp", b),
  me: () => api.get<AuthSession["user"]>("/auth/me"),
  logout: () => api.post<null>("/auth/logout"),
  users: () => api.get<AdminUser[]>("/auth/users"),
  resetDevice: (id: string) =>
    api.post<{ id: string; message: string }>(`/auth/users/${id}/reset-device`),
};

export const plansApi = {
  catalog: () => api.get<PlanCatalogItem[]>("/plans"),
  me: () => api.get<PlanMe>("/plans/me"),
  subscribe: (form: FormData) => api.upload<{ status: string }>("/plans/subscribe", form),
  payments: (status?: string) =>
    api.get<PlanPayment[]>("/plans/payments", status ? { status } : undefined),
  approve: (id: string, reviewNote: string) =>
    api.post<{ payment: PlanPayment }>(`/plans/payments/${id}/approve`, {
      confirmed: true,
      reviewNote,
    }),
  reject: (id: string, reason: string) =>
    api.post<{ payment: PlanPayment }>(`/plans/payments/${id}/reject`, { reason }),
};

export const examsApi = {
  list: (q?: { tab?: string; category?: string; difficulty?: string }) =>
    api.get<Exam[]>("/exams", q),
  detail: (id: string) => api.get<Exam>(`/exams/${id}`),
  leaderboard: (id: string, q?: { limit?: number; offset?: number }) =>
    api.get<unknown>(`/exams/${id}/leaderboard`, q),
  save: (id: string) => api.post(`/exams/${id}/save`),
  unsave: (id: string) => api.del(`/exams/${id}/save`),
  start: (id: string) => api.post<{ attemptId: string }>(`/exams/${id}/start`),
  questions: (attemptId: string) => api.get<Question[]>(`/exams/attempts/${attemptId}/questions`),
  sync: (attemptId: string, b: unknown) => api.post(`/exams/attempts/${attemptId}/sync`, b),
  submit: (attemptId: string) => api.post(`/exams/attempts/${attemptId}/submit`),
  report: (attemptId: string) => api.get<ExamReport>(`/exams/attempts/${attemptId}/report`),
};

export const practiceApi = {
  categories: () => api.get<Category[]>("/practice/categories"),
  topics: (categoryId: string) => api.get<Topic[]>(`/practice/categories/${categoryId}/topics`),
  sets: (topicId: string) => api.get<PracticeSet[]>(`/practice/topics/${topicId}/sets`),
  questions: (setId: string) => api.get<Question[]>(`/practice/sets/${setId}/questions`),
  topicStats: (topicId: string) => api.get<unknown>(`/practice/topics/${topicId}/stats`),
  submitAnswer: (setId: string, b: unknown) => api.post(`/practice/sets/${setId}/submit-answer`, b),
  complete: (setId: string, b: unknown) => api.post(`/practice/sets/${setId}/complete`, b),
  createCategory: (b: unknown) => api.post<Category>("/practice/categories", b),
  createTopic: (form: FormData) => api.upload<Topic>("/practice/topics", form),
  createSet: (b: unknown) => api.post<PracticeSet>("/practice/sets", b),
  createQuestion: (b: unknown) => api.post<Question>("/practice/questions", b),
  updateQuestion: (id: string, b: unknown) => api.put<Question>(`/practice/questions/${id}`, b),
  deleteQuestion: (id: string) => api.del(`/practice/questions/${id}`),
};

export const coursesApi = {
  list: () => api.get<Course[]>("/courses"),
  detail: (id: string) => api.get<Course>(`/courses/${id}`),
  material: (id: string) => api.get<CourseMaterial>(`/courses/materials/${id}`),
  progress: (id: string, b: unknown) => api.post(`/courses/materials/${id}/progress`, b),
  tutorGet: (id: string) => api.get(`/courses/materials/${id}/tutor`),
  tutorSend: (id: string, message: string) => api.post(`/courses/materials/${id}/tutor`, { message }),
  tutorClear: (id: string) => api.del(`/courses/materials/${id}/tutor`),
};

export const analyticsApi = {
  dashboard: () => api.get<AnalyticsDashboard>("/analytics/dashboard"),
  overview: () => api.get<unknown>("/analytics/overview"),
  scoreCalculator: (b: { esslceScore?: number; uatScore?: number }) =>
    api.post<unknown>("/analytics/score-calculator", b),
};

export const streaksApi = {
  me: () => api.get<unknown>("/streaks/me"),
  weekly: () => api.get<unknown>("/streaks/weekly"),
  record: (b: unknown) => api.post("/streaks/record-activity", b),
};

export const profileApi = {
  me: () => api.get<unknown>("/profile/me"),
  update: (form: FormData) => api.upload("/profile/me", form, "PUT"),
  settings: () => api.get<unknown>("/profile/settings"),
  updateSettings: (b: unknown) => api.put("/profile/settings", b),
};

export const notesApi = {
  list: () => api.get<Note[]>("/notes"),
  detail: (id: string) => api.get<Note>(`/notes/${id}`),
  upload: (form: FormData) => api.upload<Note>("/notes/upload", form),
  remove: (id: string) => api.del(`/notes/${id}`),
};
```

---

## 11. Data fetching with TanStack Query

`src/lib/query/provider.tsx`:

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

`src/lib/query/keys.ts` — a query-key factory keeps cache invalidation sane:

```ts
export const qk = {
  me: ["me"] as const,
  plan: ["plan", "me"] as const,
  plansCatalog: ["plans", "catalog"] as const,
  payments: (status?: string) => ["payments", status ?? "all"] as const,
  users: ["users"] as const,
  exams: (q?: object) => ["exams", q ?? {}] as const,
  exam: (id: string) => ["exam", id] as const,
  report: (attemptId: string) => ["report", attemptId] as const,
  categories: ["practice", "categories"] as const,
  topics: (categoryId: string) => ["practice", "topics", categoryId] as const,
  sets: (topicId: string) => ["practice", "sets", topicId] as const,
  courses: ["courses"] as const,
  course: (id: string) => ["course", id] as const,
  material: (id: string) => ["material", id] as const,
  notes: ["notes"] as const,
  analyticsDashboard: ["analytics", "dashboard"] as const,
  streak: ["streak", "me"] as const,
};
```

Example feature hook `src/hooks/use-plan.ts`:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";

export function usePlan() {
  return useQuery({ queryKey: qk.plan, queryFn: plansApi.me });
}
```

Example mutation (admin approve payment) with optimistic invalidation:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toast } from "sonner";

export function useApprovePayment(reviewNote: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => plansApi.approve(id, reviewNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: qk.users });
      toast.success("Payment approved. Subscription activated.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
```

---

## 12. Design system & studentish visual language

The brand is **studentish**: energetic, friendly, confident, a little playful —
but never childish. Think clean cards, rounded corners, soft shadows, bold
headings, generous whitespace, and one punchy accent color.

### 12.1 Color tokens (CSS variables in `globals.css`)

Use shadcn's theming with these custom values. Light theme primary is a vivid
indigo/violet; the accent is a warm amber for highlights and streaks.

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 12%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 12%;
  --primary: 256 80% 58%;        /* studentish violet */
  --primary-foreground: 0 0% 100%;
  --secondary: 256 30% 96%;
  --secondary-foreground: 256 40% 30%;
  --accent: 38 95% 55%;          /* amber highlight */
  --accent-foreground: 240 10% 12%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 46%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;
  --success: 152 62% 40%;
  --warning: 38 92% 50%;
  --border: 240 6% 90%;
  --input: 240 6% 90%;
  --ring: 256 80% 58%;
  --radius: 0.9rem;
}

.dark {
  --background: 240 12% 8%;
  --foreground: 0 0% 98%;
  --card: 240 10% 11%;
  --card-foreground: 0 0% 98%;
  --primary: 256 85% 68%;
  --primary-foreground: 240 12% 8%;
  --secondary: 256 20% 18%;
  --secondary-foreground: 0 0% 98%;
  --accent: 38 95% 60%;
  --muted: 240 6% 16%;
  --muted-foreground: 240 5% 65%;
  --border: 240 6% 20%;
  --input: 240 6% 20%;
  --ring: 256 85% 68%;
}
```

### 12.2 Typography

- Display / headings: **Cal Sans** or **Clash Display** (fallback: Inter tight).
- Body / UI: **Inter** (`next/font/google`).
- Numbers in dashboards: tabular figures (`font-variant-numeric: tabular-nums`).

```tsx
import { Inter } from "next/font/google";
export const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

### 12.3 Spacing, radius, elevation

- Radius: `--radius` ≈ `0.9rem` (cards feel soft and modern).
- Shadows: subtle, layered (`shadow-sm` on rest, `shadow-md` on hover).
- Card padding: `p-5` mobile, `p-6` desktop.
- Page max width: `max-w-6xl` for app content, full-bleed sections on landing.

### 12.4 Reusable shared components (`components/shared/`)

Build these once and reuse across both surfaces:

- `PageHeader` — title + subtitle + action slot.
- `StatCard` — label, big number, delta chip, icon.
- `EmptyState` — illustration, message, CTA.
- `LoadingState` / skeleton wrappers per layout.
- `LockBadge` — "Pro" / "Pro+" lock pill for gated content.
- `PlanBadge` — colored plan chip.
- `ConfirmDialog` — wraps shadcn `AlertDialog`.
- `DataTable` — generic TanStack-table wrapper (admin grids).
- `MoneyText`, `DateText`, `RelativeTime` — formatting atoms.
- `Brand` — logo lockup.

`StatCard` example (no comments, modular):

```tsx
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon?: React.ReactNode;
};

export function StatCard({ label, value, delta, trend, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          {delta ? (
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-destructive",
                trend === "flat" && "text-muted-foreground",
              )}
            >
              {delta}
            </span>
          ) : null}
        </div>
        {icon ? <div className="text-primary">{icon}</div> : null}
      </CardContent>
    </Card>
  );
}
```

---

## 13. The marketing landing page

A high-converting, studentish single page at `/` with several sections. Use
`framer-motion` for tasteful entrance animations and server components for the
static content (fast first paint, good SEO).

### 13.1 Sections (top to bottom)

1. **Sticky nav** — logo, links (Features, Pricing, About), `Log in`, and a
   primary `Get started` button.
2. **Hero** — big bold headline, subhead, two CTAs (`Start free`, `See pricing`),
   and a product mockup/screenshot on the right (the screenshot you'll upload —
   see [section 28](#28-screenshot--handoff-notes)). Floating accent shapes and a
   soft gradient blob behind the mockup.
3. **Social proof strip** — "Trusted by X,000+ Ethiopian students", logos or
   simple stat chips (students, questions, mock exams).
4. **Feature grid** — 6 cards: Mock exams, Smart practice, Detailed analytics,
   Premium courses, AI tutor, Streaks. Each card = icon + title + one line.
5. **How it works** — 3 steps: Sign up → Subscribe → Study anywhere (phone *or*
   web).
6. **Pricing** — three plan cards (Free / Pro 300 / Pro Plus 500 birr) with the
   feature lists from the catalog; "Most popular" badge on Pro.
7. **Testimonials** — student quotes carousel.
8. **Device/anywhere section** — "Your subscription, your device" — explains the
   single-device security as a *feature* ("Your account is yours alone — locked
   to your device, so no one can share or steal it.").
9. **FAQ** — accordion (shadcn `Accordion`).
10. **Final CTA** — full-width gradient band with `Get started free`.
11. **Footer** — links, contact (`tel:0994627985`), socials, copyright.

### 13.2 Hero example

`src/components/marketing/hero.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            Built for Ethiopian students
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Ace your exams. <span className="text-primary">Study smarter.</span>
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Thousands of practice questions, real mock exams, and progress
            analytics — on your phone or the web. One subscription, all yours.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/register">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <Image
            src="/landing/app-mockup.png"
            alt="Primely app preview"
            width={560}
            height={680}
            priority
            className="mx-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
```

### 13.3 Pricing card

```tsx
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type PricingCardProps = {
  label: string;
  price: number;
  features: string[];
  popular?: boolean;
};

export function PricingCard({ label, price, features, popular }: PricingCardProps) {
  return (
    <Card className={cn(popular && "border-primary shadow-md ring-1 ring-primary/30")}>
      <CardHeader className="space-y-2">
        {popular ? (
          <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most popular
          </span>
        ) : null}
        <h3 className="text-xl font-semibold">{label}</h3>
        <p className="text-3xl font-bold">
          {price === 0 ? "Free" : `${price} birr`}
          {price > 0 ? <span className="text-base font-normal text-muted-foreground"> /mo</span> : null}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="w-full" variant={popular ? "default" : "outline"}>
          <a href="/register">Choose {label}</a>
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## 14. Student web app — page by page

The student surface lives under the `(student)` route group with a shared
guarded layout (sidebar + topbar). It is primarily a **read / review** surface:
the subscriber consumes content from the browser without the mobile app, but the
account stays anchored to one device by the lock.

### 14.1 Shared student layout

`src/app/(student)/layout.tsx` — guards the session and renders the shell.

```tsx
import { redirect } from "next/navigation";
import { StudentShell } from "@/components/student/shell";
import { requireUser } from "@/lib/auth/guards";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await requireUser();
  if (!ok) redirect("/login");
  return <StudentShell>{children}</StudentShell>;
}
```

The shell (`components/student/shell.tsx`) is a client component: collapsible
sidebar (Dashboard, Practice, Mock Exams, Courses, Notes, Analytics, Plan),
topbar with streak chip, plan badge, avatar dropdown (Profile, Settings, Device,
Logout), and a global `DeviceConflictWatcher` that listens for the
`DeviceConflictError` and redirects to `/device`.

### 14.2 `/dashboard` — the read-only home

**Purpose:** the student's "today" view. Read-only summary that motivates study.

**Data / endpoints:**

- `GET /streaks/me` and `GET /streaks/weekly` — streak ring + weekly bars.
- `GET /analytics/overview` — KPI chips (accuracy, questions solved, rank).
- `GET /plans/me` — plan badge + upgrade nudge if `free`.
- `GET /exams?tab=latest` — "Jump back in" / recommended exams.
- `GET /practice/categories` — quick links to practice.

**Layout:** greeting header → row of `StatCard`s → streak card + weekly chart →
"Continue studying" carousel → "Recommended mock exams" grid → upgrade CTA card
(only if not paid).

```tsx
import { PageHeader } from "@/components/shared/page-header";
import { StreakCard } from "@/components/student/streak-card";
import { OverviewStats } from "@/components/student/overview-stats";
import { ContinueStudying } from "@/components/student/continue-studying";
import { UpgradeNudge } from "@/components/student/upgrade-nudge";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Welcome back" subtitle="Here's your progress today." />
      <OverviewStats />
      <div className="grid gap-6 lg:grid-cols-3">
        <StreakCard className="lg:col-span-1" />
        <ContinueStudying className="lg:col-span-2" />
      </div>
      <UpgradeNudge />
    </div>
  );
}
```

### 14.3 `/practice` — browse categories

**Purpose:** entry to the practice hierarchy: **categories → topics → sets →
questions**.

- `GET /practice/categories` → grid of category cards (icon, accent color,
  topic count).
- Click → `/practice/[categoryId]`.

### 14.4 `/practice/[categoryId]` — topics in a category

- `GET /practice/categories/:categoryId/topics` → topic cards (image, name,
  stats from `GET /practice/topics/:topicId/stats` lazily per card or on detail).
- Click → `/practice/topic/[topicId]`.

### 14.5 `/practice/topic/[topicId]` — sets in a topic

- `GET /practice/topics/:topicId/sets` → set cards (title, difficulty pill,
  est. time, completion %).
- `GET /practice/topics/:topicId/stats` → header stats (accuracy, time).
- Click a set → `/practice/set/[setId]`.

### 14.6 `/practice/set/[setId]` — the practice runner

**Purpose:** answer questions one by one with instant feedback. This is
interactive but still "study" (allowed on web).

**Data / flow:**

1. `GET /practice/sets/:setId/questions` → list of questions
   (`{ id, questionText, options[], ... }`; the correct option/explanation is
   returned by the submit response, not pre-leaked — render explanation after
   answering).
2. For each answer: `POST /practice/sets/:setId/submit-answer`
   `{ questionId, selectedOption, timeSpentSeconds }` → returns correctness +
   explanation → show feedback.
3. On finish: `POST /practice/sets/:setId/complete { timeSpentSeconds }` → show
   summary (score, time, accuracy) and `POST /streaks/record-activity`.

**Components:** `QuestionCard`, `OptionButton` (states: idle / selected /
correct / wrong), `ProgressBar`, `ExplanationPanel`, `SetSummary`.

```tsx
"use client";

import { useState } from "react";
import { practiceApi } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils/cn";

type Option = { label: string; text: string };

export function OptionButton({
  option,
  state,
  onSelect,
}: {
  option: Option;
  state: "idle" | "selected" | "correct" | "wrong";
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition",
        state === "idle" && "hover:border-primary/60 hover:bg-secondary",
        state === "selected" && "border-primary bg-secondary",
        state === "correct" && "border-emerald-500 bg-emerald-50",
        state === "wrong" && "border-destructive bg-red-50",
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border text-sm font-medium">
        {option.label}
      </span>
      <span>{option.text}</span>
    </button>
  );
}
```

### 14.7 `/exams` — mock exam library

- `GET /exams?tab=...&category=...&difficulty=...` with tabs:
  `latest | popular | solved | topic-wise | saved`.
- Exam cards: title, question count, duration, difficulty pill, premium
  `LockBadge` if `pro`-gated and the user isn't Pro.
- Save / unsave: `POST` / `DELETE /exams/:id/save` (optimistic).
- Click → `/exams/[id]`.

### 14.8 `/exams/[id]` — exam detail & leaderboard

- `GET /exams/:id` → overview (instructions, count, time, your best).
- `GET /exams/:id/leaderboard?limit=&offset=` → ranked table (paginated).
- Primary action: **Start exam** → `POST /exams/:id/start` → returns
  `attemptId` → route to `/exams/attempt/[attemptId]`.
- If premium and user not Pro: show paywall → link to `/plans`.

### 14.9 `/exams/attempt/[attemptId]` — the exam runner

**Purpose:** a timed, full mock exam. The most stateful student page.

**Flow:**

1. `GET /exams/attempts/:attemptId/questions` → all questions.
2. Maintain local answer state `{ questionId, selectedOption, isFlagged,
   timeSpentSeconds }[]` and a countdown timer.
3. **Autosave** every ~15s and on navigation:
   `POST /exams/attempts/:attemptId/sync { timeLeftSeconds, timeSpentSeconds,
   answers[] }`. This makes the attempt resilient to refreshes/disconnects.
4. **Submit:** `POST /exams/attempts/:attemptId/submit` → route to
   `/exams/report/[attemptId]`.

**Components:** `ExamTimer`, `QuestionPalette` (grid of numbers with
answered/flagged states), `QuestionView`, `FlagButton`, `SubmitDialog`
(confirm + "X unanswered").

```tsx
"use client";

import { useEffect, useRef } from "react";
import { examsApi } from "@/lib/api/endpoints";

export function useAttemptAutosave(attemptId: string, getState: () => unknown) {
  const timer = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    timer.current = setInterval(() => {
      examsApi.sync(attemptId, getState()).catch(() => {});
    }, 15_000);
    return () => clearInterval(timer.current);
  }, [attemptId, getState]);
}
```

### 14.10 `/exams/report/[attemptId]` — results & review

- `GET /exams/attempts/:attemptId/report` → score, accuracy, time, per-topic
  breakdown, and per-question review (your answer vs correct + explanation).
- Charts: score gauge, topic accuracy bars.
- Actions: "Retake", "Back to exams", "View leaderboard".

### 14.11 `/courses` — premium courses (Pro+)

- `GET /courses` → course cards. Non-Pro+ users see `LockBadge` and a paywall
  on open.
- Click → `/courses/[courseId]`.

### 14.12 `/courses/[courseId]` — course detail

- `GET /courses/:courseId` → course meta + ordered materials list (video / pdf /
  reading). Progress per material shown as a ring.

### 14.13 `/courses/material/[materialId]` — the reader/player + AI tutor

**Purpose:** the core "reading only" experience for subscribers.

- `GET /courses/materials/:materialId` → content (locked unless Pro+).
- **Progress tracking** (read-only consumption telemetry):
  `POST /courses/materials/:materialId/progress` with
  `{ scrollPercentage, charDepth, readPages, lastReadPage, watchedSeconds,
  timeSpentSeconds }` — debounced as the user scrolls/reads/watches.
- **AI tutor** side panel (Pro+):
  - `GET /courses/materials/:materialId/tutor` → existing chat.
  - `POST .../tutor { message }` → AI reply.
  - `DELETE .../tutor` → clear conversation.

**Components:** `MaterialReader` (PDF/markdown/video), `ReadingProgressBar`,
`TutorPanel` (chat UI), `TutorMessage`.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { coursesApi } from "@/lib/api/endpoints";

export function useReadingProgress(materialId: string, containerRef: React.RefObject<HTMLElement>) {
  const last = useRef(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
        if (pct - last.current >= 10) {
          last.current = pct;
          coursesApi.progress(materialId, { scrollPercentage: pct }).catch(() => {});
        }
      });
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [materialId, containerRef]);
}
```

### 14.14 `/notes` — personal notes

- `GET /notes` → grid/list of uploaded files.
- `POST /notes/upload` (multipart `file` ≤ 50MB + `title`, `description`) — a
  dropzone with progress.
- `GET /notes/:id` open / preview; `DELETE /notes/:id` remove (confirm dialog).

### 14.15 `/analytics` — personal analytics (Pro)

- `GET /analytics/dashboard` and `GET /analytics/overview` → charts: accuracy
  over time, time studied, topic mastery heatmap, rank.
- `POST /analytics/score-calculator { esslceScore?, uatScore? }` → a small
  "score calculator" widget that returns a computed net score.
- Non-Pro: blurred preview + upgrade CTA.

### 14.16 `/plans` — view & subscribe

- `GET /plans` → catalog cards; `GET /plans/me` → current plan + latest payment
  status banner (e.g. "Your Pro payment is under review").
- Choosing a paid plan → `/plans/checkout`.

### 14.17 `/plans/checkout` — submit payment proof

**Purpose:** start a manual subscription. This is how money is made.

**Flow:**

1. Show the selected plan, price, and **payment instructions** (bank / mobile
   money account to send to — configure in `config/site.ts`).
2. User uploads a **proof screenshot** and optionally a `transactionRef` + note.
3. `POST /plans/subscribe` (multipart: `proof` file + `{ plan, transactionRef?,
   note? }`) → creates a **pending** request.
4. Show "Submitted! An admin will verify within X hours." and poll
   `GET /plans/me` for status flips to `approved` / `rejected`.
5. If already pending, the server blocks a second submission — surface that
   state with the existing pending banner.

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscribeSchema, type SubscribeInput } from "@/lib/validation/plans";
import { plansApi } from "@/lib/api/endpoints";
import { toast } from "sonner";

export function CheckoutForm({ plan }: { plan: "pro" | "pro_plus" }) {
  const form = useForm<SubscribeInput>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { plan, transactionRef: "", note: "" },
  });

  async function onSubmit(values: SubscribeInput, file?: File) {
    const fd = new FormData();
    fd.append("plan", values.plan);
    if (values.transactionRef) fd.append("transactionRef", values.transactionRef);
    if (values.note) fd.append("note", values.note);
    if (file) fd.append("proof", file);
    try {
      await plansApi.subscribe(fd);
      toast.success("Payment submitted for review.");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return null;
}
```

### 14.18 `/profile` & `/settings`

- `/profile`: `GET /profile/me`; `PUT /profile/me` (multipart `avatar` +
  fields: school, town, region, stream, etc.).
- `/settings`: `GET /profile/settings`; `PUT /profile/settings` (notifications,
  dark mode, etc.). Also exposes "Change device" link and logout.

### 14.19 `/device` — manage / transfer device

**Purpose:** the user-facing side of the device lock.

- Shows the current bound device (from `GET /auth/users` is admin-only, so for
  the user we show *this* browser's `deviceId`/`deviceName` and whether requests
  are succeeding).
- If a `DEVICE_CONFLICT` is active: render `DeviceConflict` with the **QR
  transfer** flow ([section 9.5](#95-the-qr-based-device-transfer-flow-anti-sharing-pro-ux))
  and a "Contact support" button (`tel:` the support phone).
- Explains the policy plainly: "Your subscription works on one device at a time
  to keep your account secure."

---

## 15. Admin console — page by page

The admin surface lives under `/admin` (`(admin)` route group) with its own
guarded layout. The console is dense, fast, and table-driven. Everything an
admin needs to run the business lives here.

### 15.1 Admin layout & guard

`src/app/(admin)/admin/layout.tsx`:

```tsx
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await requireAdmin();
  if (!ok) redirect("/login");
  return <AdminShell>{children}</AdminShell>;
}
```

`AdminShell` sidebar items: **Overview, Payments, Users, Devices, Content
(Categories / Topics / Sets / Questions), Exams, Courses, Analytics**. Topbar:
search, admin avatar, logout. A persistent **"Pending payments: N"** badge in
the sidebar (polled) so admins never miss revenue.

### 15.2 `/admin` — overview

KPI row + recent activity:

- `GET /plans/payments?status=pending` → pending count (the money queue).
- `GET /auth/users` → total users, subscribers (derive from `plan`).
- `GET /analytics/overview` (or aggregate) → signups, active.
- Quick links to the payment queue and content creation.

### 15.3 `/admin/payments` — payment verification dashboard

See the dedicated deep dive in [section 16](#16-the-admin-payment-verification-dashboard-deep-dive).

### 15.4 `/admin/users` — user management

- `GET /auth/users` → `DataTable` with columns: avatar + name, phone, plan
  (`PlanBadge`), verified, **bound device** (name + bound-at), created.
- Row actions: **View** (`/admin/users/[id]`), **Reset device**
  (`POST /auth/users/:id/reset-device`, confirm dialog).
- Filters: by plan, by verified, by "has bound device", search by phone/name.

### 15.5 `/admin/users/[id]` — user detail

- Identity, plan history (their `latestPayment`), device binding card with a
  **Reset device** button, and (future) activity. Driven by the same
  `GET /auth/users` data filtered client-side, or a future per-user endpoint.

### 15.6 `/admin/devices` — device oversight

A focused view of the anti-sharing system:

- From `GET /auth/users`, list every user that has a `boundDeviceId`, showing
  device name, bound-at, and plan.
- Bulk/quick **Reset device** action for support cases ("I got a new phone").
- This is where support resolves `DEVICE_CONFLICT` tickets.

### 15.7 Content sections

`/admin/content/categories`, `/topics`, `/sets`, `/questions`, plus
`/admin/exams` and `/admin/courses` — full CRUD detailed in
[section 17](#17-content-crud).

### 15.8 `/admin/analytics`

Business analytics dashboard — revenue (sum of approved `plan_payments.amount`),
conversion (subscribers / users), signups over time, content engagement. See
[section 18](#18-analytics-dashboards).

---

## 16. The admin payment verification dashboard (deep dive)

This is the most important admin screen: subscriptions are activated **manually**
after a human verifies a payment proof. Build it to be fast and unambiguous.

### 16.1 Data

- `GET /plans/payments?status=pending` (default view) — the work queue.
- Tabs/filter for `pending | approved | rejected | all`.
- Each `PlanPayment` includes `userId`, `plan`, `amount`, `proofUrl`,
  `transactionRef`, `note`, `status`, timestamps. Join the user for display via
  `GET /auth/users` (cache it) keyed by `userId`.

### 16.2 Layout

A **split view**:

- **Left:** the queue — a `DataTable` of pending payments sorted oldest-first
  (so nobody waits too long). Columns: user (avatar + name + phone), plan badge,
  amount (`MoneyText`), submitted (`RelativeTime`), transactionRef.
- **Right:** the **review panel** for the selected row:
  - Large **proof image** preview (zoomable; opens in a lightbox).
  - User details + their current plan.
  - `transactionRef` and `note` shown prominently.
  - Two big buttons: **Approve** (green, requires an audit note) and **Reject**
    (red, opens a reason dialog).

### 16.3 Approve

`POST /plans/payments/:id/approve { confirmed: true, reviewNote }` → backend
records the manual verification note, sets payment `approved`, and updates the
user's `plan` (transactional). On success:

- Toast "Approved — {plan} activated for {name}".
- Invalidate `["payments"]` and `users` queries.
- The user becomes Pro/Pro+ immediately; their next request reflects it (the
  backend reads plan fresh from the DB per request).

### 16.4 Reject

`POST /plans/payments/:id/reject { reason }` (1–500 chars). A dialog forces the
admin to write a reason (shown to the user). On success: toast, invalidate,
move to next pending item.

### 16.5 Implementation

```tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PaymentQueue } from "@/components/admin/payment-queue";
import { PaymentReview } from "@/components/admin/payment-review";

export default function PaymentsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: payments = [], isLoading } = useQuery({
    queryKey: qk.payments("pending"),
    queryFn: () => plansApi.payments("pending"),
    refetchInterval: 20_000,
  });

  const selected = payments.find((p) => p.id === selectedId) ?? payments[0] ?? null;

  return (
    <div className="grid h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[1fr_1.2fr]">
      <PaymentQueue
        payments={payments}
        loading={isLoading}
        selectedId={selected?.id ?? null}
        onSelect={setSelectedId}
      />
      {selected ? <PaymentReview payment={selected} /> : null}
    </div>
  );
}
```

`PaymentReview` (approve / reject) — modular, no comments:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { PlanPayment } from "@/lib/api/types";

export function PaymentReview({ payment }: { payment: PlanPayment }) {
  const qc = useQueryClient();
  const [reason, setReason] = useState("");

  const approve = useMutation({
    mutationFn: () =>
      plansApi.approve(payment.id, "Confirmed status, amount, receiver, and reference."),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("Approved. Subscription activated.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reject = useMutation({
    mutationFn: () => plansApi.reject(payment.id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Rejected.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex flex-col gap-4 overflow-auto rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">{payment.plan.toUpperCase()}</p>
          <p className="text-sm text-muted-foreground">{payment.amount} birr</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
          {payment.status}
        </span>
      </div>

      {payment.proofUrl ? (
        <a href={payment.proofUrl} target="_blank" rel="noreferrer">
          <Image
            src={payment.proofUrl}
            alt="Payment proof"
            width={640}
            height={800}
            className="rounded-lg border"
          />
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">No proof image attached.</p>
      )}

      {payment.transactionRef ? (
        <p className="text-sm">Ref: <span className="font-medium">{payment.transactionRef}</span></p>
      ) : null}
      {payment.note ? <p className="text-sm text-muted-foreground">{payment.note}</p> : null}

      <div className="mt-auto flex gap-3">
        <Button className="flex-1" onClick={() => approve.mutate()} disabled={approve.isPending}>
          Approve
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="flex-1">Reject</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject payment</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Reason shown to the student"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
            />
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => reject.mutate()}
                disabled={!reason.trim() || reject.isPending}
              >
                Confirm reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
```

---

## 17. Content CRUD

All content creation is **admin-only** (`requireAuth + requireAdmin`). The web
console exposes friendly forms over the practice/exam/course endpoints.

### 17.1 The hierarchy

```
Category  →  Topic  →  Practice Set  →  Question
Exam      →  (questions belong to the exam/attempt model)
Course    →  Material
```

### 17.2 Categories — `/admin/content/categories`

- List: `GET /practice/categories` → `DataTable` (name, displayOrder, accent).
- Create: `POST /practice/categories`
  `{ name, description?, iconName?, accentColor?, displayOrder? }`.
- (Update/delete category endpoints are not exposed by the backend yet — show
  create + list; document the gap. See roadmap.)

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { practiceApi } from "@/lib/api/endpoints";
import { categorySchema, type CategoryInput } from "@/lib/validation/content";
import { toast } from "sonner";

export function CreateCategoryForm() {
  const qc = useQueryClient();
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", iconName: "", accentColor: "", displayOrder: 0 },
  });
  const create = useMutation({
    mutationFn: (v: CategoryInput) => practiceApi.createCategory(v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["practice", "categories"] });
      toast.success("Category created");
      form.reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return null;
}
```

### 17.3 Topics — `/admin/content/topics`

- List by category: `GET /practice/categories/:categoryId/topics`.
- Create with optional image: `POST /practice/topics` **multipart** `image?` +
  `{ categoryId, name, description?, accentColor?, displayOrder? }`. Use a
  `FormData` builder; show an image dropzone.

### 17.4 Practice Sets — `/admin/content/sets`

- List by topic: `GET /practice/topics/:topicId/sets`.
- Create: `POST /practice/sets`
  `{ topicId, title, description?, difficulty?(easy|medium|hard),
  estimatedTimeMinutes?, iconName?, iconColor?, iconBackground?, orderIndex? }`.

### 17.5 Questions — `/admin/content/questions`

The richest editor. A question has `questionText`, an array of `options`
(`{ label, text }`, min 2), a `correctOption`, optional `explanation`, and
`orderIndex`.

- List by set: `GET /practice/sets/:setId/questions`.
- Create: `POST /practice/questions`
  `{ practiceSetId, questionText, options[], correctOption, explanation?, orderIndex? }`.
- Update: `PUT /practice/questions/:id` (partial).
- Delete: `DELETE /practice/questions/:id` (confirm dialog).

**Question editor UX:** dynamic option rows (add/remove), radio to mark the
correct option, live preview of how the student will see it.

```tsx
"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema, type QuestionInput } from "@/lib/validation/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QuestionEditor({ practiceSetId }: { practiceSetId: string }) {
  const form = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      practiceSetId,
      questionText: "",
      options: [
        { label: "A", text: "" },
        { label: "B", text: "" },
      ],
      correctOption: "A",
      explanation: "",
      orderIndex: 0,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  return (
    <form className="space-y-4">
      {fields.map((field, i) => (
        <div key={field.id} className="flex gap-2">
          <Input className="w-16" {...form.register(`options.${i}.label`)} />
          <Input className="flex-1" {...form.register(`options.${i}.text`)} />
          <Button type="button" variant="ghost" onClick={() => remove(i)}>
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ label: String.fromCharCode(65 + fields.length), text: "" })}
      >
        Add option
      </Button>
    </form>
  );
}
```

### 17.6 Exams — `/admin/exams`

- List: `GET /exams?tab=latest` (admin sees all).
- Detail: `GET /exams/:id` (+ leaderboard).
- (Exam/question authoring endpoints beyond practice are limited in the current
  backend; expose what exists, document the gap for the roadmap.)

### 17.7 Courses — `/admin/courses`

- List: `GET /courses`; detail: `GET /courses/:courseId`; material:
  `GET /courses/materials/:materialId`.
- (Course/material authoring endpoints are read-focused in the current backend;
  expose viewing + document authoring as a roadmap item.)

> **Honesty note for the team:** the backend currently exposes **create** for
> categories/topics/sets/questions and **read** broadly, but not full
> update/delete on every entity, nor admin authoring for exams/courses content.
> Build the screens against what exists, and clearly mark "coming soon" where an
> endpoint is missing rather than faking it. The [roadmap](#27-what-to-expect--roadmap)
> lists the backend endpoints to add.

---

## 18. Analytics dashboards

### 18.1 Student analytics (`/analytics`, Pro)

- `GET /analytics/dashboard` → time series + breakdowns.
- `GET /analytics/overview` → KPI chips.
- `POST /analytics/score-calculator` → net-score widget.
- Charts via Recharts/shadcn charts: line (accuracy over time), bar (time per
  topic), radial (mastery), area (questions/day).

### 18.2 Admin analytics (`/admin/analytics`)

Derive business metrics from existing endpoints (no dedicated admin analytics
endpoint exists, so compute client-side from):

- **Revenue:** sum `amount` of `GET /plans/payments?status=approved`.
- **MRR-ish:** approved payments in the current month.
- **Conversion:** subscribers (`users.plan != free`) / total users from
  `GET /auth/users`.
- **Signups over time:** bucket `users.createdAt`.
- **Pending revenue:** sum `amount` of pending payments.
- **Device-locked accounts:** count users with `boundDeviceId`.

Render as `StatCard` row + charts + a "recent approvals" table.

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { plansApi, authApi } from "@/lib/api/endpoints";

export function useAdminMetrics() {
  const approved = useQuery({
    queryKey: ["payments", "approved"],
    queryFn: () => plansApi.payments("approved"),
  });
  const users = useQuery({ queryKey: ["users"], queryFn: authApi.users });

  const revenue = (approved.data ?? []).reduce((sum, p) => sum + p.amount, 0);
  const total = users.data?.length ?? 0;
  const subscribers = (users.data ?? []).filter((u) => u.plan !== "free").length;
  const locked = (users.data ?? []).filter((u) => u.boundDeviceId).length;

  return {
    revenue,
    total,
    subscribers,
    locked,
    conversion: total ? Math.round((subscribers / total) * 100) : 0,
    loading: approved.isLoading || users.isLoading,
  };
}
```

---

## 19. Forms, validation & file uploads

### 19.1 Zod schemas mirror the backend

`src/lib/validation/auth.ts`:

```ts
import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(8, "At least 8 characters"),
  fullName: z.string().min(2),
});

export const otpSchema = z.object({
  phone: z.string().min(10),
  otpCode: z.string().length(6, "6 digits"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
```

`src/lib/validation/plans.ts`:

```ts
import { z } from "zod";

export const subscribeSchema = z.object({
  plan: z.enum(["free", "pro", "pro_plus"]),
  transactionRef: z.string().max(120).optional(),
  note: z.string().max(500).optional(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
```

`src/lib/validation/content.ts`:

```ts
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  iconName: z.string().optional(),
  accentColor: z.string().optional(),
  displayOrder: z.coerce.number().int().optional(),
});

export const topicSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  accentColor: z.string().optional(),
  displayOrder: z.coerce.number().int().optional(),
});

export const setSchema = z.object({
  topicId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  estimatedTimeMinutes: z.coerce.number().int().optional(),
  orderIndex: z.coerce.number().int().optional(),
});

export const questionSchema = z.object({
  practiceSetId: z.string().uuid(),
  questionText: z.string().min(1),
  options: z.array(z.object({ label: z.string().min(1), text: z.string().min(1) })).min(2),
  correctOption: z.string().min(1),
  explanation: z.string().optional(),
  orderIndex: z.coerce.number().int().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type TopicInput = z.infer<typeof topicSchema>;
export type SetInput = z.infer<typeof setSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
```

### 19.2 File uploads

Endpoints that take files use `multipart/form-data` (the client `api.upload`
helper sends `FormData` **without** a `Content-Type` header so the browser sets
the boundary):

| Endpoint | Field | Limit |
| --- | --- | --- |
| `POST /plans/subscribe` | `proof` | image ≤ 5MB |
| `POST /practice/topics` | `image` | image ≤ 5MB |
| `PUT /profile/me` | `avatar` | image ≤ 5MB |
| `POST /notes/upload` | `file` | any ≤ 50MB |

A reusable `Dropzone` component validates type/size client-side before upload and
shows a preview + progress.

---

## 20. Route protection & role-based access

### 20.1 Edge middleware

`src/middleware.ts` provides a first line of defense (the real enforcement is the
backend; this just improves UX by redirecting before render). Because tokens live
in `localStorage` (not cookies), middleware can't read them directly — so we keep
middleware light (e.g. block `/admin/*` for anyone without a presence cookie we
optionally set) and do the authoritative client guard in layouts.

> Recommended: set a tiny non-sensitive cookie `primely.role` (value `user` or
> `admin`, **not** a token) on login so middleware can redirect fast. The cookie
> is advisory only; the backend still authorizes every request.

```ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("primely.role")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
```

### 20.2 Client guards

`src/lib/auth/guards.ts` (client helpers used by layouts via a small wrapper, or
implement as client components that read `useAuth`):

```ts
import { getStoredUser } from "@/lib/auth/session";

export function currentRole() {
  return getStoredUser()?.role ?? null;
}

export function isAuthed() {
  return getStoredUser() !== null;
}
```

For server components that can't read `localStorage`, render a thin client
`Guard` boundary that checks `useAuth().ready` and redirects when no user, or
gate the whole group with a client layout. Keep it simple: a `RequireUser` and
`RequireAdmin` client component wrapping `{children}`.

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (ready && user?.role !== "admin") router.replace("/login");
  }, [ready, user, router]);
  if (!ready || user?.role !== "admin") return null;
  return <>{children}</>;
}
```

### 20.3 Plan gating in the UI

Mirror the server gating constants to show `LockBadge`s and paywalls early, but
**always** handle the server's `403` as the real gate (e.g. a non-Pro user
poking a premium exam gets a paywall both before and after the request).

---

## 21. Error handling, toasts, empty & loading states

### 21.1 Global error mapping

The API client throws `ApiError` (with `status`, `code`) and the special
`DeviceConflictError`. Map them centrally:

- `DEVICE_CONFLICT` → redirect to `/device` + show the conflict screen.
- `DEVICE_REQUIRED` → silently ensure the device id is sent (it always is) and
  retry; if it persists, show the conflict screen.
- `401` after a failed refresh → `clearSession()` + redirect to `/login`.
- `403` (non-device) → "You don't have access to this" + upsell if plan-gated.
- `404` → friendly empty state.
- `409` → "Already exists".
- `429` → "You're going a bit fast — try again in a few seconds." (respect
  `Retry-After`).
- `500` → "Something went wrong on our side."

A small `useApiErrorToast` hook (or a Query `onError` default) renders the right
`sonner` toast.

### 21.2 Loading & empty states

- Every list/grid has a skeleton (shadcn `Skeleton`) matching its final layout.
- Every empty list has an `EmptyState` (icon + message + CTA).
- Buttons that trigger mutations show a spinner and disable while pending.
- Suspense boundaries around route segments where streaming helps.

### 21.3 `app/error.tsx` and `app/not-found.tsx`

Branded, studentish error pages with a "Back to dashboard" / "Go home" CTA.

---

## 22. Security checklist

Because tokens live in `localStorage`, **XSS is the primary threat** — eliminate
it ruthlessly.

- **No `dangerouslySetInnerHTML`** with untrusted content. If you must render
  rich content (e.g. question explanations, course markdown), sanitize with a
  vetted sanitizer and a strict allow-list.
- **Escape everything by default** (React does this; don't bypass it).
- **CSP**: set a strict Content-Security-Policy via `next.config` headers
  (`default-src 'self'`, allow only your API origin and image CDN/Cloudinary).
- **Only `NEXT_PUBLIC_*`** values ship to the client. No server secrets, ever.
- **Never log tokens.** Scrub them from any error reporting.
- **HTTPS only** in production; set `Strict-Transport-Security`.
- **RBAC is server-side.** The web's admin guard is UX; the backend re-checks
  `requireAdmin` on every admin endpoint.
- **Device lock is server-side.** The web cooperates but cannot be the
  enforcement point — the backend `deviceGuard` is the gate.
- **Validate uploads** (type + size) client-side, but know the server is the
  real limit (5MB images / 50MB files).
- **Rate-limit-aware UI**: disable rapid re-submits; respect `Retry-After`.
- **Logout clears everything**: tokens, user, and the advisory `primely.role`
  cookie. (Do **not** clear the device id on logout — it must stay stable so the
  same browser remains the same device.)
- **CORS**: the backend must list the web origin(s) in `CORS_ORIGIN`.

### 22.1 `next.config` security headers (sketch)

```ts
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; img-src 'self' https://res.cloudinary.com data:; " +
      "connect-src 'self' https://api.primely.example; " +
      "style-src 'self' 'unsafe-inline'; script-src 'self';",
  },
];

export default {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```

---

## 23. Performance & SEO

- **Landing page**: Server Components, `next/image`, `next/font`, minimal JS.
  Target Lighthouse 95+. Add Open Graph + Twitter meta, `sitemap.ts`,
  `robots.ts`, and JSON-LD for the org/product.
- **App**: route-level code splitting (App Router does this), prefetch on hover,
  TanStack Query caching with sensible `staleTime`, skeletons to avoid layout
  shift.
- **Images**: serve Cloudinary URLs through `next/image` with `remotePatterns`
  for `res.cloudinary.com`.
- **Bundle hygiene**: tree-shake icons (import individually from lucide), avoid
  heavy date libs (date-fns only), lazy-load the QR scanner (`@zxing/browser`)
  only on the `/device` route.

`next.config` image config:

```ts
export default {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};
```

---

## 24. Testing strategy

- **Unit**: `vitest` for `lib/` (api client envelope unwrap, device id, plan
  helpers, formatters).
- **Component**: React Testing Library for forms (validation, error display),
  the payment review actions, the question editor field array.
- **E2E**: Playwright for the critical paths:
  1. Register → verify OTP → land on dashboard.
  2. Login → device-conflict screen renders on `DEVICE_CONFLICT`.
  3. Subscribe (upload proof) → pending banner.
  4. Admin login → approve a pending payment → user becomes Pro.
  5. Admin reset device → user can bind a new device.
- **MSW** (Mock Service Worker) to stub the API envelope in component/E2E tests.

---

## 25. Deployment

- **Host**: Vercel (ideal for Next.js) or any Node host. Set `NEXT_PUBLIC_*`
  env vars in the host dashboard.
- **Two domains** (recommended): `app.primely.example` (student) and
  `admin.primely.example` (admin) — same app, the admin domain can be additionally
  protected at the edge/CDN. Or a single domain with `/admin`.
- **Backend CORS**: add both web origins to the API's `CORS_ORIGIN`.
- **Build**: `next build` → `next start` (or Vercel auto). No server secrets in
  the client.
- **Backend migration**: deploy the API with the new device-lock migration
  applied (`npm run start:prod` runs migrations first). Confirm
  `DEVICE_LOCK_ENABLED` is set as desired.

---

## 26. Admin credentials & first-run

The admin account for the console:

- **Phone:** `0994627985`
- **Password:** `NNnatitam1`

> These are the operator credentials for the Primely Admin Console. The web app
> **never hardcodes** them — the admin logs in through the normal
> `POST /auth/login` flow, and the JWT `role` claim (`admin`) unlocks the
> `/admin` surface.

**Making this account an admin** (one-time, on the backend / DB):

1. Register the account through the app (or it already exists), and verify the
   phone via OTP so `is_phone_verified = true`.
2. Promote it to admin in the database:

   ```sql
   UPDATE users SET role = 'admin' WHERE phone = '+251994627985';
   ```

   (The backend normalizes `0994627985` → `+251994627985`.)
3. Admins are **exempt** from the device lock, so the operator can sign into the
   console from any machine.

---

## 27. What to expect / roadmap

### 27.1 What ships in this round

- **Backend**: the single-device lock (schema + binding on login/verify/refresh,
  `deviceGuard` middleware on all business routes, admin `reset-device`,
  `DEVICE_LOCK_ENABLED` flag). **Already implemented in this change set.**
- **This document** (`web.md`): the complete web build spec.
- **No website code yet** — the web app is to be built from this spec next.

### 27.2 Backend endpoints to add (for full web parity)

These would make the web console complete; build screens against what exists
today and mark these "coming soon":

1. `POST /auth/device/transfer { targetDeviceId }` — guarded by `requireAuth +
   deviceGuard` so only the bound device can move the lock (powers the QR
   self-service transfer in [section 9.5](#95-the-qr-based-device-transfer-flow-anti-sharing-pro-ux)).
2. `GET /auth/users/:id` — per-user detail (currently only the list endpoint).
3. **Update/delete** for categories, topics, sets (only create + read exist).
4. **Admin authoring** for exams and courses/materials.
5. `GET /admin/analytics` — server-computed business metrics (currently derived
   client-side from payments + users).
6. Optional: a small **"1 phone + 1 web"** trusted-multi-device variant of the
   lock (store a bounded set of device ids) if the business wants the same
   subscriber to use both their phone app and the browser simultaneously.

### 27.3 Phasing the web build

1. **Phase 1 — Foundation**: bootstrap, design system, API client, auth (login /
   register / OTP), device id + conflict handling, route guards.
2. **Phase 2 — Student core**: dashboard, practice browse + runner, exams library
   + runner + report.
3. **Phase 3 — Monetization**: plans, checkout (proof upload), plan status.
4. **Phase 4 — Admin**: payment verification dashboard, users, devices.
5. **Phase 5 — Content**: category/topic/set/question CRUD.
6. **Phase 6 — Depth**: courses + reader + AI tutor, notes, analytics
   (student + admin), streaks.
7. **Phase 7 — Landing**: marketing page, SEO, polish, animations.
8. **Phase 8 — Hardening**: tests, CSP, performance, accessibility audit.

---

## 28. Screenshot & handoff notes

- **A screenshot will be uploaded** by the product owner to anchor the visual
  direction (the landing-page hero and/or the app look & feel). **Match it**: use
  it as the source of truth for spacing, color emphasis, and the hero mockup. If
  there's any conflict between the screenshot and the tokens in
  [section 12](#12-design-system--studentish-visual-language), the **screenshot
  wins** for visuals — keep the engineering structure from this doc.
- Put the hero/app mockup image at `public/landing/app-mockup.png` and reference
  it as shown in [section 13.2](#132-hero-example).
- **Stack reminder (use the latest):** Next.js (App Router), Tailwind CSS, and
  shadcn/ui — newest stable versions. Initialize with `create-next-app@latest`
  and `shadcn@latest`.
- **Code style reminder:** modular, single-responsibility files, **no code
  comments** — all explanation lives in this document.

---

### Appendix A — Quick endpoint cheat sheet

```
AUTH
  POST   /auth/register
  POST   /auth/login                (+ deviceId/deviceName or X-Device-* headers)
  POST   /auth/verify-otp           (+ device)
  POST   /auth/resend-otp
  POST   /auth/refresh              (+ device)
  POST   /auth/logout
  GET    /auth/me
  GET    /auth/users                (admin)
  POST   /auth/users/:id/reset-device   (admin)

PLANS
  GET    /plans
  GET    /plans/me
  POST   /plans/subscribe           (multipart proof)
  GET    /plans/payments?status=    (admin)
  POST   /plans/payments/:id/approve (admin) { confirmed: true, reviewNote }
  POST   /plans/payments/:id/reject  (admin) { reason }

PRACTICE
  GET    /practice/categories
  GET    /practice/categories/:id/topics
  GET    /practice/topics/:id/sets
  GET    /practice/sets/:id/questions
  GET    /practice/topics/:id/stats
  POST   /practice/sets/:id/submit-answer
  POST   /practice/sets/:id/complete
  POST   /practice/categories       (admin)
  POST   /practice/topics           (admin, multipart image)
  POST   /practice/sets             (admin)
  POST   /practice/questions        (admin)
  PUT    /practice/questions/:id    (admin)
  DELETE /practice/questions/:id    (admin)

EXAMS
  GET    /exams?tab=&category=&difficulty=
  GET    /exams/:id
  GET    /exams/:id/leaderboard?limit=&offset=
  POST   /exams/:id/save
  DELETE /exams/:id/save
  POST   /exams/:id/start
  GET    /exams/attempts/:id/questions
  POST   /exams/attempts/:id/sync
  POST   /exams/attempts/:id/submit
  GET    /exams/attempts/:id/report
  GET    /user/performance

COURSES
  GET    /courses
  GET    /courses/:id
  GET    /courses/materials/:id
  POST   /courses/materials/:id/progress
  GET    /courses/materials/:id/tutor       (pro+)
  POST   /courses/materials/:id/tutor       (pro+)
  DELETE /courses/materials/:id/tutor       (pro+)

ANALYTICS / STREAKS / PROFILE / NOTES
  GET    /analytics/dashboard
  GET    /analytics/overview
  POST   /analytics/score-calculator
  GET    /streaks/me
  GET    /streaks/weekly
  POST   /streaks/record-activity
  GET    /profile/me
  PUT    /profile/me                (multipart avatar)
  GET    /profile/settings
  PUT    /profile/settings
  POST   /notes/upload              (multipart file)
  GET    /notes
  GET    /notes/:id
  DELETE /notes/:id
```

### Appendix B — Device lock state machine (web view)

```
                 first paid sign-in (deviceId sent)
   [no binding] ───────────────────────────────────▶ [bound to this device]
        │                                                     │
        │ paid sign-in on a different deviceId                │ same deviceId on every request
        ▼                                                     ▼
   [403 DEVICE_CONFLICT] ◀───────────────────────────  [requests succeed]
        │
        ├─▶ Contact support  → admin POST /auth/users/:id/reset-device → [no binding]
        └─▶ QR transfer (roadmap) → bound device approves → rebinds to new device
```

### Appendix C — TypeScript DTOs (`lib/api/types.ts`) starter

```ts
export type Role = "user" | "admin";
export type PlanKey = "free" | "pro" | "pro_plus";

export type AuthSession = {
  user: {
    id: string;
    phone: string;
    fullName: string;
    role: Role;
    avatarUrl: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type AdminUser = {
  id: string;
  phone: string;
  fullName: string;
  role: Role;
  plan: PlanKey;
  isPhoneVerified: boolean;
  boundDeviceId: string | null;
  boundDeviceName: string | null;
  deviceBoundAt: string | null;
  createdAt: string;
  avatarUrl: string | null;
};

export type PlanCatalogItem = {
  key: PlanKey;
  label: string;
  price: number;
  rank: number;
  features: string[];
};

export type PlanMe = {
  plan: PlanKey;
  planLabel: string;
  planActivatedAt: string | null;
  planExpiresAt: string | null;
  latestPayment: PlanPayment | null;
};

export type PlanPayment = {
  id: string;
  userId: string;
  plan: PlanKey;
  amount: number;
  status: "pending" | "approved" | "rejected";
  proofUrl: string | null;
  transactionRef: string | null;
  note: string | null;
  reviewedBy: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  iconName: string | null;
  accentColor: string | null;
  displayOrder: number;
};

export type Topic = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  accentColor: string | null;
  displayOrder: number;
};

export type PracticeSet = {
  id: string;
  topicId: string;
  title: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard" | null;
  estimatedTimeMinutes: number | null;
  orderIndex: number;
};

export type QuestionOption = { label: string; text: string };

export type Question = {
  id: string;
  questionText: string;
  options: QuestionOption[];
  correctOption?: string;
  explanation?: string | null;
  orderIndex: number;
};

export type Exam = {
  id: string;
  title: string;
  questionCount: number;
  durationMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  isPremium: boolean;
  isSaved?: boolean;
};

export type ExamReport = {
  score: number;
  accuracy: number;
  timeSpentSeconds: number;
  perTopic: { topic: string; accuracy: number }[];
  questions: {
    questionText: string;
    yourAnswer: string | null;
    correctOption: string;
    explanation: string | null;
  }[];
};

export type Course = {
  id: string;
  title: string;
  description: string | null;
  isLocked: boolean;
  materials?: CourseMaterial[];
};

export type CourseMaterial = {
  id: string;
  title: string;
  type: "video" | "pdf" | "reading";
  url?: string;
  content?: string;
  isLocked: boolean;
};

export type Note = {
  id: string;
  title: string | null;
  description: string | null;
  fileUrl: string;
  fileFormat: string | null;
  fileSize: number | null;
  createdAt: string;
};

export type AnalyticsDashboard = Record<string, unknown>;
```

---

*End of `web.md`. Build from the top. Honor the screenshot for visuals, honor the
backend for behavior, and keep the code modular and comment-free.*
