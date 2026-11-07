import { type KeyboardEvent, useId } from "react";

export type Choice<T extends string | number> = {
  id: T;
  label: string;
};

type OptionGroupProps<T extends string | number> = {
  label: string;
  options: readonly Choice<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

export default function OptionGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) {
  const labelId = useId();

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !backward) {
      return;
    }

    event.preventDefault();
    const offset = forward ? 1 : -1;
    const nextIndex = (index + offset + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) {
      return;
    }

    onChange(next.id);
    const buttons =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[role="radio"]',
      );
    buttons?.[nextIndex]?.focus();
  }

  return (
    <div className="option-group">
      <div className="option-label" id={labelId}>
        {label}
      </div>
      <div className="choices" role="radiogroup" aria-labelledby={labelId}>
        {options.map((option, index) => {
          const selected = option.id === value;
          const tabStop = selected || (value === null && index === 0);
          return (
            <button
              key={String(option.id)}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={tabStop ? 0 : -1}
              className="choice"
              onClick={() => onChange(option.id)}
              onKeyDown={(event) => move(event, index)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
