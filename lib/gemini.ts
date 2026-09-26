import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ReviewResult {
  riskyChanges: string[];
  missingTests: string[];
  commitMessages: string[];
}

const PROMPT_TEMPLATE = (diff: string) => `
You are a senior software engineer reviewing a pull request diff.
Analyse the diff below and respond with EXACTLY three sections using these exact headings:

### RISKY CHANGES
- List each risky or breaking change as a bullet point
- If none found, write: - None identified

### MISSING TESTS
- List each area that lacks test coverage as a bullet point
- If none found, write: - None identified

### COMMIT MESSAGES
- List each unclear or missing commit message issue as a bullet point
- If none found, write: - None identified

Do NOT add any other text, intro, or conclusion outside these three sections.

PR DIFF:
\`\`\`
${diff}
\`\`\`
`.trim();

function parseSection(text: string, heading: string): string[] {
  const regex = new RegExp(
    `### ${heading}\\n([\\s\\S]*?)(?=\\n###|$)`,
    "i"
  );
  const match = text.match(regex);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter((line) => line.length > 0 && line.toLowerCase() !== "none identified");
}

export async function reviewDiff(diff: string): Promise<ReviewResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(PROMPT_TEMPLATE(diff));
  const text = result.response.text();

  return {
    riskyChanges: parseSection(text, "RISKY CHANGES"),
    missingTests: parseSection(text, "MISSING TESTS"),
    commitMessages: parseSection(text, "COMMIT MESSAGES"),
  };
}
