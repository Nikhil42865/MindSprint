import "dotenv/config";

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

const maxQuestions = Number(process.env.MAX_QUESTIONS ?? 100);
if (!Number.isInteger(maxQuestions) || maxQuestions < 1 || maxQuestions > 100) {
  throw new Error("MAX_QUESTIONS must be an integer between 1 and 100.");
}

const questionBankTimeoutMs = Number(process.env.QUESTION_BANK_TIMEOUT_MS ?? 5000);
if (!Number.isInteger(questionBankTimeoutMs) || questionBankTimeoutMs < 100 || questionBankTimeoutMs > 30000) {
  throw new Error("QUESTION_BANK_TIMEOUT_MS must be an integer between 100 and 30000.");
}

const questionBankCacheTtlMs = Number(process.env.QUESTION_BANK_CACHE_TTL_MS ?? 300000);
if (!Number.isInteger(questionBankCacheTtlMs) || questionBankCacheTtlMs < 0) {
  throw new Error("QUESTION_BANK_CACHE_TTL_MS must be a non-negative integer.");
}

export const env = {
  port,
  frontendOrigins: (process.env.FRONTEND_ORIGIN ??
    "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  nodeEnv: process.env.NODE_ENV ?? "development",
  maxQuestions,
  questionBankBaseUrl:
    process.env.QUESTION_BANK_BASE_URL ??
    "https://raw.githubusercontent.com/Nikhil42865/mindsprint-question-bank/main",
  questionBankTimeoutMs,
  questionBankCacheTtlMs,
} as const;