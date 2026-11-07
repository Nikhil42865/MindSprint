import type { CategoryId, DifficultyId } from "../types/challenge.js";
import type { Question } from "../types/question.js";
import type { QuestionProvider } from "./questionProvider.interface.js";

const MOCK_BANK_VERSION = "mock-1.0.0";

const mockQuestions: Question[] = [
  createQuestion(
    "math_easy_001",
    "mental-maths",
    "easy",
    "What is 15% of 200?",
    ["20", "25", "30", "35"],
    "C",
    "200 x 15 / 100 = 30.",
  ),
  createQuestion(
    "math_medium_001",
    "mental-maths",
    "medium",
    "What is 48 x 25?",
    ["1000", "1100", "1200", "1250"],
    "C",
    "48 x 100 / 4 = 1200.",
  ),
  createQuestion(
    "math_hard_001",
    "mental-maths",
    "hard",
    "What is the remainder when 997 is divided by 13?",
    ["7", "8", "9", "10"],
    "B",
    "13 x 76 = 988, leaving a remainder of 9.",
  ),
  createQuestion(
    "series_easy_001",
    "number-series",
    "easy",
    "What number comes next: 2, 4, 6, 8?",
    ["9", "10", "11", "12"],
    "B",
    "The sequence increases by 2 each time.",
  ),
  createQuestion(
    "series_medium_001",
    "number-series",
    "medium",
    "What number comes next: 3, 6, 12, 24?",
    ["36", "48", "60", "72"],
    "B",
    "Each number is multiplied by 2.",
  ),
  createQuestion(
    "series_hard_001",
    "number-series",
    "hard",
    "What number comes next: 1, 4, 9, 16?",
    ["20", "24", "25", "36"],
    "C",
    "These are consecutive square numbers: 1 squared through 4 squared.",
  ),
  createQuestion(
    "logic_easy_001",
    "logical-reasoning",
    "easy",
    "If all birds have wings and a robin is a bird, what must be true?",
    ["A robin has wings", "A robin can swim", "All wings are birds", "Robins are mammals"],
    "A",
    "The conclusion follows directly from the two statements.",
  ),
  createQuestion(
    "logic_medium_001",
    "logical-reasoning",
    "medium",
    "Which word does not belong: circle, triangle, square, blue?",
    ["Circle", "Triangle", "Square", "Blue"],
    "D",
    "Blue is a color; the others are shapes.",
  ),
  createQuestion(
    "logic_hard_001",
    "logical-reasoning",
    "hard",
    "A is taller than B. C is taller than A. Who is shortest?",
    ["A", "B", "C", "Cannot determine"],
    "B",
    "The order is C, A, B from tallest to shortest.",
  ),
  createQuestion(
    "quant_easy_001",
    "quantitative-aptitude",
    "easy",
    "If 5 notebooks cost 25, what does one notebook cost?",
    ["4", "5", "6", "10"],
    "B",
    "25 divided by 5 is 5.",
  ),
  createQuestion(
    "quant_medium_001",
    "quantitative-aptitude",
    "medium",
    "A train travels 180 km in 3 hours. What is its average speed?",
    ["45 km/h", "60 km/h", "90 km/h", "120 km/h"],
    "B",
    "Average speed is distance divided by time: 180 / 3 = 60 km/h.",
  ),
  createQuestion(
    "quant_hard_001",
    "quantitative-aptitude",
    "hard",
    "If x + 1/x = 5, what is x squared + 1/x squared?",
    ["21", "23", "25", "27"],
    "B",
    "Squaring gives x squared + 2 + 1/x squared = 25, so the answer is 23.",
  ),
];

export class MockQuestionProvider implements QuestionProvider {
  public async getQuestions(
    category: CategoryId,
    difficulty: DifficultyId,
  ): Promise<unknown> {
    return mockQuestions.filter(
      (question) => question.category === category && question.difficulty === difficulty,
    );
  }

  public getVersion(): string {
    return MOCK_BANK_VERSION;
  }
}

function createQuestion(
  id: string,
  category: CategoryId,
  difficulty: DifficultyId,
  question: string,
  optionTexts: [string, string, string, string],
  correctAnswer: Question["correctAnswer"],
  explanation: string,
): Question {
  return {
    id,
    category,
    difficulty,
    question,
    options: optionTexts.map((text, index) => ({
      id: ["A", "B", "C", "D"][index] as Question["correctAnswer"],
      text,
    })) as Question["options"],
    correctAnswer,
    explanation,
    verified: true,
  };
}