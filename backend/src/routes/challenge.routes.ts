import { Router } from "express";
import { env } from "../config/env.js";
import { createChallengeController } from "../controllers/challenge.controller.js";
import { GithubQuestionProvider } from "../providers/githubQuestionProvider.js";
import { ChallengeService } from "../services/challenge.service.js";
import { QuestionBankService } from "../services/questionBank.service.js";

const questionProvider = new GithubQuestionProvider(
  env.questionBankBaseUrl,
  env.questionBankTimeoutMs,
  env.questionBankCacheTtlMs,
);
const questionBankService = new QuestionBankService(questionProvider);
const challengeService = new ChallengeService(questionBankService, env.maxQuestions);

export const challengeRouter = Router();

challengeRouter.post(
  "/challenges",
  createChallengeController(challengeService),
);