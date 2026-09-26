# 🔍 PR Reviewer

> **Built for IBM Bob 2.0 Hackathon 🤖**

An AI-powered pull request reviewer. Paste any raw code diff directly into the page — no GitHub login, no OAuth, no setup. Get an instant structured report powered by **Gemini 2.5 Flash**.

---

## ✨ Features

- **Paste & Review** — drop any raw `git diff` output into the textarea and hit submit
- **Three-section AI report:**
  - ⚠️ Risky / Breaking Changes
  - 🧪 Missing Test Coverage
  - 📝 Unclear / Missing Commit Messages
- **Light / Dark theme toggle** — smooth gradient themes, no page reload
- **Zero friction** — no auth, no accounts, no GitHub API

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v3 |
| AI Model | Gemini 2.5 Flash (`@google/generative-ai`) |
| Runtime | Node.js (server-side API route) |

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/VeerCodex/claudeSphere-pr-reviewer.git
cd claudeSphere-pr-reviewer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your Gemini API key

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

### 4. Run the dev server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📁 Project Structure

```
claudeSphere-pr-reviewer/
├── app/
│   ├── page.tsx              ← Single-page UI (textarea + results)
│   ├── layout.tsx            ← Root layout with Tailwind
│   ├── globals.css           ← Tailwind directives
│   └── api/
│       └── review/
│           └── route.ts      ← POST /api/review → Gemini API
├── lib/
│   └── gemini.ts             ← Gemini client + prompt + parser
├── .env.local                ← Your API key (gitignored)
└── ...config files
```

---

## 🔒 Security

- `.env.local` is gitignored — your API key is never committed
- All credentials stay server-side — the Gemini API key is only used in the Next.js API route, never exposed to the browser
- See [SECURITY.MD](SECURITY.MD) for full guidelines

---

## 🤖 Built with IBM Bob 2.0

This entire project — architecture, scaffolding, API integration, UI, and theming — was built using **IBM Bob 2.0** as the AI coding assistant:

- **Plan mode** → designed the 3-task architecture
- **Agent mode** → generated every file, resolved dependency vulnerabilities, and hot-reloaded the running server

---

## 📄 License

MIT
