export const CATEGORY_IDS = [
  "mental-maths",
  "number-series",
  "logical-reasoning",
  "quantitative-aptitude",
] as const;

export const DIFFICULTY_IDS = ["easy", "medium", "hard"] as const;
export const DURATION_SECONDS = [60, 120, 300] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];
export type DifficultyId = (typeof DIFFICULTY_IDS)[number];
export type DurationSeconds = (typeof DURATION_SECONDS)[number];

export type ChallengeConfig = {
  category: CategoryId;
  difficulty: DifficultyId;
  durationSeconds: DurationSeconds;
};