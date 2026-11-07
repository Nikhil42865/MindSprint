import axios from "axios";
import {
  CATEGORIES,
  DIFFICULTIES,
  DURATIONS,
  type ChallengeConfig,
  type OptionId,
  type PreparedChallenge,
  type Question,
} from "../types/challenge.ts";

type BackendOptionId = "A" | "B" | "C" | "D";

type BackendQuestionOption = {
  id: BackendOptionId;
  text: string;
};

type BackendQuestion = {
  id: string;
  question: string;
  options: [
    BackendQuestionOption,
    BackendQuestionOption,
    BackendQuestionOption,
    BackendQuestionOption,
  ];
};

type BackendAnswerKeyEntry = {
  correctAnswer: BackendOptionId;
  explanation: string;
};

type BackendPreparedChallenge = {
  challengeId: string;
  config: ChallengeConfig;
  questions: BackendQuestion[];
  answerKey: Record<string, BackendAnswerKeyEntry>;
  bankVersion: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function prepareChallenge(config: ChallengeConfig): Promise<PreparedChallenge> {
  try {
    const response = await api.post<unknown>("/api/challenges", config);
    if (!isBackendPreparedChallenge(response.data)) {
      throw new Error("The challenge service returned an invalid challenge.");
    }

    return toPreparedChallenge(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = readApiErrorMessage(error.response?.data);
      throw new Error(message ?? "The challenge service is unavailable.");
    }

    throw error;
  }
}

function isBackendPreparedChallenge(value: unknown): value is BackendPreparedChallenge {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const challenge = value as Partial<BackendPreparedChallenge>;
  return (
    typeof challenge.challengeId === "string" &&
    isChallengeConfig(challenge.config) &&
    Array.isArray(challenge.questions) &&
    challenge.questions.length > 0 &&
    challenge.questions.every(isBackendQuestion) &&
    isBackendAnswerKey(challenge.answerKey) &&
    typeof challenge.bankVersion === "string"
  );
}

function isChallengeConfig(value: unknown): value is ChallengeConfig {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const config = value as Partial<ChallengeConfig>;
  return (
    CATEGORIES.some((category) => category.id === config.category) &&
    DIFFICULTIES.some((difficulty) => difficulty.id === config.difficulty) &&
    DURATIONS.some((duration) => duration.id === config.durationSeconds)
  );
}

function isBackendQuestion(value: unknown): value is BackendQuestion {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const question = value as Partial<BackendQuestion>;
  return (
    typeof question.id === "string" &&
    typeof question.question === "string" &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every(isBackendQuestionOption)
  );
}

function isBackendQuestionOption(value: unknown): value is BackendQuestionOption {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const option = value as Partial<BackendQuestionOption>;
  return isBackendOptionId(option.id) && typeof option.text === "string";
}

function isBackendAnswerKey(value: unknown): value is Record<string, BackendAnswerKeyEntry> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return Object.values(value).every((entry) => {
    if (typeof entry !== "object" || entry === null) {
      return false;
    }

    const answer = entry as Partial<BackendAnswerKeyEntry>;
    return isBackendOptionId(answer.correctAnswer) && typeof answer.explanation === "string";
  });
}

function isBackendOptionId(value: unknown): value is BackendOptionId {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

function toPreparedChallenge(challenge: BackendPreparedChallenge): PreparedChallenge {
  return {
    challengeId: challenge.challengeId,
    config: challenge.config,
    questions: challenge.questions.map((question) => ({
      id: question.id,
      prompt: question.question,
      options: toFrontendOptions(question.options),
    })),
    answerKey: Object.entries(challenge.answerKey).map(([questionId, entry]) => ({
      questionId,
      correctOptionId: toFrontendOptionId(entry.correctAnswer),
      explanation: entry.explanation,
    })),
    bankVersion: challenge.bankVersion,
  };
}

function toFrontendOptions(
  options: BackendQuestion["options"],
): Question["options"] {
  return [
    toFrontendOption(options[0]),
    toFrontendOption(options[1]),
    toFrontendOption(options[2]),
    toFrontendOption(options[3]),
  ];
}

function toFrontendOption(option: BackendQuestionOption) {
  return {
    id: toFrontendOptionId(option.id),
    text: option.text,
  };
}

function toFrontendOptionId(value: BackendOptionId): OptionId {
  return value.toLowerCase() as OptionId;
}

function readApiErrorMessage(value: unknown): string | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const errorResponse = value as { error?: { message?: unknown } };
  return typeof errorResponse.error?.message === "string"
    ? errorResponse.error.message
    : null;
}
