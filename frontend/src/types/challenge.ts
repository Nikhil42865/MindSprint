export const CATEGORIES = [
  { id: "mental-maths", label: "Mental Maths" },
  { id: "number-series", label: "Number Series" },
  { id: "logical-reasoning", label: "Logical Reasoning" },
  { id: "quantitative-aptitude", label: "Quantitative Aptitude" },
] as const;

export const DIFFICULTIES = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
] as const;

export const DURATIONS = [
  { id: 60, label: "60 seconds" },
  { id: 120, label: "120 seconds" },
  { id: 300, label: "300 seconds" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type DifficultyId = (typeof DIFFICULTIES)[number]["id"];
export type DurationSeconds = (typeof DURATIONS)[number]["id"];

export type ChallengeConfig = {
  category: CategoryId;
  difficulty: DifficultyId;
  durationSeconds: DurationSeconds;
};

export type OptionId = "a" | "b" | "c" | "d";

export type QuestionOption = {
  id: OptionId;
  text: string;
};

export type QuestionOptions = readonly [
  QuestionOption,
  QuestionOption,
  QuestionOption,
  QuestionOption,
];

export type Question = {
  id: string;
  prompt: string;
  options: QuestionOptions;
};

export type AnswerKeyEntry = {
  questionId: string;
  correctOptionId: OptionId;
  explanation: string;
};

export type PreparedChallenge = {
  challengeId: string;
  config: ChallengeConfig;
  questions: Question[];
  answerKey: AnswerKeyEntry[];
  bankVersion: string;
};

export type ActiveChallengeSession = PreparedChallenge & {
  sessionId: string;
  status: "ready" | "active" | "completed";
  currentQuestionIndex: number;
  answers: Partial<Record<string, OptionId>>;
  startedAt: number | null;
  expiresAt: number | null;
  completedAt: number | null;
};

export type PersonalRecord = {
  sessionId: string;
  category: CategoryId;
  difficulty: DifficultyId;
  durationSeconds: DurationSeconds;
  correct: number;
  accuracy: number;
  completedAt: number;
};

export function labelFor<T extends string | number>(
  options: readonly { id: T; label: string }[],
  id: T,
): string {
  return options.find((option) => option.id === id)?.label ?? String(id);
}
