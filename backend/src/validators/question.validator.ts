import { z } from "zod";
import { CATEGORY_IDS, DIFFICULTY_IDS } from "../types/challenge.js";
import { OPTION_IDS } from "../types/question.js";

export const questionOptionSchema = z
  .object({
    id: z.enum(OPTION_IDS),
    text: z.string().trim().min(1),
  })
  .strict();

export const questionSchema = z
  .object({
    id: z.string().trim().min(1),
    category: z.enum(CATEGORY_IDS),
    topic: z.string().trim().min(1).optional(),
    difficulty: z.enum(DIFFICULTY_IDS),
    question: z.string().trim().min(1),
    options: z.array(questionOptionSchema).length(4),
    correctAnswer: z.enum(OPTION_IDS),
    explanation: z.string().trim().min(1),
    source: z.literal("generated").optional(),
    verified: z.literal(true),
  })
  .strict()
  .superRefine((question, context) => {
    const optionIds = question.options.map((option) => option.id);
    const optionTexts = question.options.map((option) => option.text);

    if (new Set(optionIds).size !== optionIds.length) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Option IDs must be unique.",
      });
    }

    if (new Set(optionTexts).size !== optionTexts.length) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Option text must be unique.",
      });
    }

    if (!optionIds.includes(question.correctAnswer)) {
      context.addIssue({
        code: "custom",
        path: ["correctAnswer"],
        message: "Correct answer must reference an option.",
      });
    }
  });

export const questionBankSchema = z.array(questionSchema);

export type ValidatedQuestion = z.infer<typeof questionSchema>;