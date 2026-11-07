import type { ChallengeConfig } from "../types/challenge.js";
import { QuestionBankService } from "./questionBank.service.js";
import {
  selectQuestionBatch,
  type AnswerKeyEntry,
  type ChallengeQuestion,
} from "./questionSelection.service.js";

export type PreparedChallenge = {
  challengeId: string;
  config: ChallengeConfig;
  questions: ChallengeQuestion[];
  answerKey: Record<string, AnswerKeyEntry>;
  bankVersion: string;
};

export class ChallengeService {
  public constructor(
    private readonly questionBankService: QuestionBankService,
    private readonly maximumQuestions: number,
  ) {}

  public async prepareChallenge(config: ChallengeConfig): Promise<PreparedChallenge> {
    const questions = await this.questionBankService.getQuestions(config);
    const selected = selectQuestionBatch(questions, this.maximumQuestions);

    return {
      challengeId: `ch_${crypto.randomUUID()}`,
      config,
      questions: selected.questions,
      answerKey: selected.answerKey,
      bankVersion: this.questionBankService.getVersion(),
    };
  }
}