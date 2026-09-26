"use client";

import { useState } from "react";

interface ReviewResult {
  riskyChanges: string[];
  missingTests: string[];
  commitMessages: string[];
}

const SECTIONS: {
  key: keyof ReviewResult;
  label: string;
  borderColor: string;
  dotDark: string;
  dotLight: string;
  cardDark: string;
  cardLight: string;
}[] = [
  {
    key: "riskyChanges",
    label: "⚠️ Risky / Breaking Changes",
    borderColor: "border-red-500",
    dotDark: "bg-red-400",
    dotLight: "bg-red-500",
    cardDark: "bg-slate-800/60",
    cardLight: "bg-white",
  },
  {
    key: "missingTests",
    label: "🧪 Missing Test Coverage",
    borderColor: "border-amber-500",
    dotDark: "bg-amber-400",
    dotLight: "bg-amber-500",
    cardDark: "bg-slate-800/60",
    cardLight: "bg-white",
  },
  {
    key: "commitMessages",
    label: "📝 Unclear / Missing Commit Messages",
    borderColor: "border-blue-500",
    dotDark: "bg-blue-400",
    dotLight: "bg-blue-500",
    cardDark: "bg-slate-800/60",
    cardLight: "bg-white",
  },
];

// Sun icon
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

// Moon icon
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Home() {
  const [dark, setDark] = useState(true);
  const [diff, setDiff] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!diff.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data as ReviewResult);
      }
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Theme tokens
  const t = {
    page:        dark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
                      : "bg-gradient-to-br from-gray-50 via-white to-slate-100",
    badge:       dark ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                      : "border-indigo-400/50 bg-indigo-50 text-indigo-600",
    title:       dark ? "text-white"          : "text-slate-900",
    tagline:     dark ? "text-slate-400"      : "text-slate-500",
    toggle:      dark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                      : "bg-white border-gray-200 text-slate-600 hover:bg-gray-100",
    label:       dark ? "text-slate-300"      : "text-slate-700",
    textarea:    dark ? "border-slate-700 bg-slate-800/80 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500"
                      : "border-gray-300 bg-white text-slate-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400",
    reportTitle: dark ? "text-slate-200"      : "text-slate-700",
    cardHead:    dark ? "text-slate-200"      : "text-slate-700",
    cardItem:    dark ? "text-slate-300"      : "text-slate-600",
    cardNone:    dark ? "text-slate-500"      : "text-slate-400",
    error:       dark ? "border-red-700/60 bg-red-950/60 text-red-300"
                      : "border-red-300 bg-red-50 text-red-600",
    empty:       dark ? "text-slate-600"      : "text-slate-400",
    divider:     dark ? "border-slate-700/50" : "border-gray-200",
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${t.page} px-4 py-12`}>
      <div className="mx-auto max-w-3xl">

        {/* Theme toggle */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${t.toggle}`}
          >
            {dark ? <><SunIcon /><span>Light</span></> : <><MoonIcon /><span>Dark</span></>}
          </button>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          {/* Hackathon badge */}
          <div
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-colors duration-300"
            style={{
              borderColor: dark ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.5)",
              background:  dark ? "rgba(99,102,241,0.1)" : "rgba(238,242,255,1)",
              color:       dark ? "#a5b4fc" : "#4f46e5",
            }}
          >
            Built for IBM Bob 2.0 Hackathon 🤖
          </div>

          <h1 className={`text-3xl font-bold tracking-tight transition-colors duration-300 ${t.title}`}>
            🔍 PR Reviewer
          </h1>
          <p className={`mt-2 text-sm transition-colors duration-300 ${t.tagline}`}>
            Paste a raw code diff or PR diff below and get an instant AI review.
          </p>
        </div>

        {/* Divider */}
        <hr className={`mb-8 border-t transition-colors duration-300 ${t.divider}`} />

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="diff"
            className={`block text-sm font-medium transition-colors duration-300 ${t.label}`}
          >
            Paste your diff here
          </label>
          <textarea
            id="diff"
            value={diff}
            onChange={(e) => setDiff(e.target.value)}
            rows={16}
            placeholder={`diff --git a/src/index.ts b/src/index.ts\n--- a/src/index.ts\n+++ b/src/index.ts\n@@ -1,5 +1,6 @@\n ...`}
            className={`w-full rounded-lg border px-4 py-3 font-mono text-sm outline-none focus:ring-1 resize-y transition-colors duration-300 ${t.textarea}`}
          />
          <button
            type="submit"
            disabled={loading || !diff.trim()}
            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analysing…
              </span>
            ) : (
              "Review Diff"
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className={`mt-6 rounded-lg border px-4 py-3 text-sm transition-colors duration-300 ${t.error}`}>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-10 space-y-6">
            <h2 className={`text-lg font-semibold transition-colors duration-300 ${t.reportTitle}`}>
              Review Report
            </h2>
            {SECTIONS.map(({ key, label, borderColor, dotDark, dotLight, cardDark, cardLight }) => (
              <div
                key={key}
                className={`rounded-xl border-l-4 ${borderColor} ${dark ? cardDark : cardLight} px-5 py-4 shadow-sm transition-colors duration-300`}
              >
                <h3 className={`mb-3 text-sm font-semibold transition-colors duration-300 ${t.cardHead}`}>
                  {label}
                </h3>
                {result[key].length === 0 ? (
                  <p className={`text-sm italic transition-colors duration-300 ${t.cardNone}`}>
                    None identified ✓
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {result[key].map((item, i) => (
                      <li key={i} className={`flex items-start gap-2 text-sm transition-colors duration-300 ${t.cardItem}`}>
                        <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${dark ? dotDark : dotLight}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <p className={`mt-10 text-center text-sm transition-colors duration-300 ${t.empty}`}>
            Your review report will appear here after submission.
          </p>
        )}
      </div>
    </main>
  );
}
