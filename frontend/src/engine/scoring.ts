import type { ActiveChallengeSession, OptionId } from "../types/challenge.ts";

export type QuestionResult = {
  questionId: string;
  selectedOptionId: OptionId | null;
  correctOptionId: OptionId;
  explanation: string;
  isCorrect: boolean;
};

export type ChallengeScore = {
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracy: number;
  completion: number;
  results: QuestionResult[];
};

export function scoreChallenge(session: ActiveChallengeSession): ChallengeScore {
  const results = session.questions.map((question) => {
    const answerKey = session.answerKey.find((entry) => entry.questionId === question.id);
    const selectedOptionId = session.answers[question.id] ?? null;
    const correctOptionId = answerKey?.correctOptionId ?? "a";

    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId,
      explanation: answerKey?.explanation ?? "",
      isCorrect: selectedOptionId === correctOptionId,
    };
  });

  const correct = results.filter((result) => result.isCorrect).length;
  const unanswered = results.filter((result) => result.selectedOptionId === null).length;
  const incorrect = results.length - correct - unanswered;
  const total = results.length;

  return {
    correct,
    incorrect,
    unanswered,
    accuracy: total === 0 ? 0 : Math.round((correct / total) * 100),
    completion: total === 0 ? 0 : Math.round(((total - unanswered) / total) * 100),
    results,
  };
}