import type { ValidatedQuestion } from "../validators/question.validator.js";
import { shuffle } from "../utils/shuffle.js";
import type { OptionId, QuestionOption } from "../types/question.js";

export type ChallengeQuestion = {
  id: string;
  question: string;
  options: QuestionOption[];
};

export type AnswerKeyEntry = {
  correctAnswer: OptionId;
  explanation: string;
};

export type SelectedQuestionBatch = {
  questions: ChallengeQuestion[];
  answerKey: Record<string, AnswerKeyEntry>;
};

export function selectQuestionBatch(
  questions: readonly ValidatedQuestion[],
  maximumQuestions: number,
): SelectedQuestionBatch {
  const uniqueQuestions = Array.from(
    new Map(questions.map((question) => [question.id, question])).values(),
  );
  const selectedQuestions = shuffle(uniqueQuestions).slice(0, maximumQuestions);
  const answerKey: Record<string, AnswerKeyEntry> = {};

  const publicQuestions = selectedQuestions.map((question) => {
    answerKey[question.id] = {
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };

    return {
      id: question.id,
      question: question.question,
      options: question.options,
    };
  });

  return {
    questions: publicQuestions,
    answerKey,
  };
}