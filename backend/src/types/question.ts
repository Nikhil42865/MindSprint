import type { CategoryId, DifficultyId } from "./challenge.js";

export const OPTION_IDS = ["A", "B", "C", "D"] as const;
export type OptionId = (typeof OPTION_IDS)[number];

export type QuestionOption = {
  id: OptionId;
  text: string;
};

export type Question = {
  id: string;
  category: CategoryId;
  topic?: string;
  difficulty: DifficultyId;
  question: string;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
  correctAnswer: OptionId;
  explanation: string;
  source?: "generated";
  verified: true;
};