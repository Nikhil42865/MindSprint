import { questionBankSchema, type ValidatedQuestion } from "../validators/question.validator.js";
import type { ChallengeConfig } from "../types/challenge.js";
import {
  QuestionProviderError,
  type QuestionProvider,
} from "../providers/questionProvider.interface.js";
import { ApiError } from "../utils/apiError.js";

export class QuestionBankService {
  public constructor(private readonly provider: QuestionProvider) {}

  public async getQuestions(config: ChallengeConfig): Promise<ValidatedQuestion[]> {
    let rawQuestions: unknown;

    try {
      rawQuestions = await this.provider.getQuestions(config.category, config.difficulty);
    } catch (error) {
      if (error instanceof QuestionProviderError && error.kind === "invalid-data") {
        throw new ApiError(
          502,
          "INVALID_QUESTION_DATA",
          "Unable to prepare your challenge. Please try again.",
        );
      }

      throw new ApiError(
        502,
        "QUESTION_BANK_UNAVAILABLE",
        "Unable to prepare your challenge. Please try again.",
      );
    }

    const parsed = questionBankSchema.safeParse(rawQuestions);
    if (!parsed.success) {
      throw new ApiError(
        502,
        "INVALID_QUESTION_DATA",
        "Unable to prepare your challenge. Please try again.",
      );
    }

    const ids = parsed.data.map((question) => question.id);
    if (new Set(ids).size !== ids.length) {
      throw new ApiError(
        502,
        "INVALID_QUESTION_DATA",
        "Unable to prepare your challenge. Please try again.",
      );
    }

    const matchingQuestions = parsed.data.filter(
      (question) =>
        question.category === config.category && question.difficulty === config.difficulty,
    );

    if (matchingQuestions.length === 0) {
      throw new ApiError(
        404,
        "NO_QUESTIONS_AVAILABLE",
        "No suitable questions are available for this challenge.",
      );
    }

    return matchingQuestions;
  }

  public getVersion(): string {
    return this.provider.getVersion();
  }
}