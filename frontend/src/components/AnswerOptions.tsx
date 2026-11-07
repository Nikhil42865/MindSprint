import type { OptionId, QuestionOption } from "../types/challenge.ts";

type AnswerOptionsProps = {
  options: readonly QuestionOption[];
  selectedId: OptionId | null;
  onSelect: (optionId: OptionId) => void;
};

export default function AnswerOptions({ options, selectedId, onSelect }: AnswerOptionsProps) {
  return (
    <div className="answer-list" role="radiogroup" aria-label="Answers">
      {options.map((option) => {
        const selected = option.id === selectedId;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className="answer"
            onClick={() => onSelect(option.id)}
          >
            <span className="answer-mark">{option.id}</span>
            <span>{option.text}</span>
          </button>
        );
      })}
    </div>
  );
}
