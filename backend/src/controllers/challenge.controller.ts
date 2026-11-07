import type { RequestHandler } from "express";
import { challengeConfigSchema } from "../validators/challenge.validator.js";
import { ApiError } from "../utils/apiError.js";
import type { ChallengeService } from "../services/challenge.service.js";

export function createChallengeController(
  challengeService: ChallengeService,
): RequestHandler {
  return async (request, response, next) => {
    const parsedConfig = challengeConfigSchema.safeParse(request.body);
    if (!parsedConfig.success) {
      next(new ApiError(400, "INVALID_REQUEST", "Invalid challenge configuration."));
      return;
    }

    try {
      const challenge = await challengeService.prepareChallenge(parsedConfig.data);
      response.status(201).json(challenge);
    } catch (error) {
      next(error);
    }
  };
}