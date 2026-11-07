import { z } from "zod";
import {
  CATEGORY_IDS,
  DIFFICULTY_IDS,
  DURATION_SECONDS,
} from "../types/challenge.js";

export const challengeConfigSchema = z
  .object({
    category: z.enum(CATEGORY_IDS),
    difficulty: z.enum(DIFFICULTY_IDS),
    durationSeconds: z.union([
      z.literal(DURATION_SECONDS[0]),
      z.literal(DURATION_SECONDS[1]),
      z.literal(DURATION_SECONDS[2]),
    ]),
  })
  .strict();

export type ChallengeConfigInput = z.infer<typeof challengeConfigSchema>;