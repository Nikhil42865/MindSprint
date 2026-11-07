import type { CategoryId, DifficultyId } from "../types/challenge.js";

export class QuestionProviderError extends Error {
  public constructor(
    public readonly kind: "unavailable" | "invalid-data",
    message: string,
  ) {
    super(message);
    this.name = "QuestionProviderError";
  }
}

export interface QuestionProvider {
  getQuestions(category: CategoryId, difficulty: DifficultyId): Promise<unknown>;
  getVersion(): string;
}