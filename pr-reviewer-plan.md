# PR Reviewer — Project Plan

## Overview

Build a minimal Next.js fullstack app (App Router) inside `claudeSphere-pr-reviewer/`.  
A user pastes a raw code diff / PR diff into a textarea, clicks **Review**, and the app calls the **Gemini 1.5 Flash** API server-side and displays a three-section bulleted report:

1. **Risky / Breaking Changes**
2. **Missing Test Coverage**
3. **Unclear / Missing Commit Messages**

No GitHub OAuth, no URL fetching, no database, no auth — just paste → analyse → report.

---

## Architecture

```
claudeSphere-pr-reviewer/
├── app/
│   ├── page.tsx            ← single-page UI (textarea + submit + results)
│   ├── layout.tsx          ← root layout (Tailwind base)
│   └── api/
│       └── review/
│           └── route.ts    ← POST handler → calls Gemini API
├── lib/
│   └── gemini.ts           ← Gemini API client helper
├── .env.local              ← GEMINI_API_KEY (user adds manually)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Sub-Tasks

---

### Sub-Task 1 — Scaffold Next.js project with Tailwind

**Intent**  
Initialise a fresh Next.js 14 (App Router, TypeScript) project inside `claudeSphere-pr-reviewer/` and configure Tailwind CSS.

**Expected Outcomes**
- `package.json` present with `next`, `react`, `react-dom`, `tailwindcss`, `postcss`, `autoprefixer` dependencies
- `tailwind.config.ts` and `postcss.config.js` present and wired up
- `tsconfig.json` present with strict mode
- `next.config.ts` present (minimal)
- `app/layout.tsx` imports Tailwind global CSS
- `app/page.tsx` is a minimal placeholder

**Todo List**
- [ ] Create `package.json` with all required deps and scripts
- [ ] Create `tsconfig.json`
- [ ] Create `next.config.ts`
- [ ] Create `tailwind.config.ts`
- [ ] Create `postcss.config.js`
- [ ] Create `app/globals.css` with Tailwind directives
- [ ] Create `app/layout.tsx` (root layout importing globals.css)
- [ ] Create placeholder `app/page.tsx`

**Relevant Context**
- Next.js App Router convention: `app/` directory, `layout.tsx` as root shell
- Tailwind v3 setup: `@tailwind base/components/utilities` in globals.css

**Status** — `[x] done`

---

### Sub-Task 2 — Gemini API server route

**Intent**  
Create the backend POST endpoint at `/api/review` that receives the pasted diff text, builds a structured prompt, calls Gemini 1.5 Flash, parses the response, and returns JSON.

**Expected Outcomes**
- `lib/gemini.ts` encapsulates the Gemini REST call using the `@google/generative-ai` SDK
- `app/api/review/route.ts` accepts `{ diff: string }` in the request body
- Returns `{ riskyChanges: string[], missingTests: string[], commitMessages: string[] }`
- Returns `400` if diff is empty, `500` on Gemini errors
- `GEMINI_API_KEY` is read from `process.env` — never hardcoded

**Todo List**
- [ ] Add `@google/generative-ai` to `package.json`
- [ ] Create `lib/gemini.ts` — initialise client, export `reviewDiff(diff: string)` function
- [ ] Write the prompt that instructs Gemini to respond with exactly three labelled sections
- [ ] Parse Gemini plain-text response into the three arrays
- [ ] Create `app/api/review/route.ts` — validate input, call `reviewDiff`, return JSON
- [ ] Add `GEMINI_API_KEY=` placeholder to `.env.example`

**Relevant Context**
- SDK: `@google/generative-ai` — `GoogleGenerativeAI` class, `getGenerativeModel({ model: "gemini-1.5-flash" })`
- Prompt must force structured output (e.g., "### RISKY CHANGES", "### MISSING TESTS", "### COMMIT MESSAGES" sections) so parsing is reliable
- `SECURITY.MD` mandates environment variables for all credentials

**Status** — `[x] done`

---

### Sub-Task 3 — Frontend UI

**Intent**  
Build the single-page UI: a textarea for the diff, a submit button, loading state, and a results panel showing the three bulleted sections.

**Expected Outcomes**
- `app/page.tsx` renders a full-page layout with Tailwind
- Textarea accepts the pasted diff (no character limit enforced in UI)
- Submit button triggers a `fetch` POST to `/api/review`
- Loading spinner / disabled state shown while request is in flight
- Results section shows three cards: **Risky / Breaking Changes**, **Missing Test Coverage**, **Unclear / Missing Commit Messages** — each with a bulleted list
- Error message shown if the API call fails
- Empty state (before first submission) shows a prompt to paste a diff

**Todo List**
- [ ] Add `useState` for `diff`, `loading`, `result`, `error`
- [ ] Render labelled textarea with placeholder text
- [ ] Implement `handleSubmit` — POST to `/api/review`, set loading/result/error
- [ ] Render three result cards conditionally (only after a successful response)
- [ ] Style everything with Tailwind (dark-friendly neutral palette)

**Relevant Context**
- This is a Client Component (`"use client"`) since it uses `useState`
- `app/page.tsx` only — no extra components needed to keep it minimal
- Result type: `{ riskyChanges: string[], missingTests: string[], commitMessages: string[] }`

**Status** — `[x] done`

---

## Environment Setup Note

After implementation, the user must create `.env.local` (gitignored) with:

```
GEMINI_API_KEY=your_key_here
```

Then run:

```bash
cd claudeSphere-pr-reviewer
npm install
npm run dev
```
