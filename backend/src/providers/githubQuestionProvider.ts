import type { CategoryId, DifficultyId } from "../types/challenge.js";
import {
  QuestionProviderError,
  type QuestionProvider,
} from "./questionProvider.interface.js";

type CacheEntry = {
  expiresAt: number;
  data: unknown;
};

export class GithubQuestionProvider implements QuestionProvider {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly baseUrl: string;

  public constructor(
    baseUrl: string,
    private readonly timeoutMs: number,
    private readonly cacheTtlMs: number,
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  public async getQuestions(
    category: CategoryId,
    difficulty: DifficultyId,
  ): Promise<unknown> {
    const path = `questions/${category}/${difficulty}.json`;
    const cached = this.cache.get(path);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/${path}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new QuestionProviderError(
          "unavailable",
          `Question bank returned HTTP ${response.status}.`,
        );
      }

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        throw new QuestionProviderError(
          "invalid-data",
          "Question bank returned invalid JSON.",
        );
      }
      if (this.cacheTtlMs > 0) {
        this.cache.set(path, {
          data,
          expiresAt: Date.now() + this.cacheTtlMs,
        });
      }
      return data;
    } catch (error) {
      if (error instanceof QuestionProviderError) {
        throw error;
      }

      throw new QuestionProviderError(
        "unavailable",
        "Question bank could not be reached.",
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public getVersion(): string {
    return "github-main";
  }
}