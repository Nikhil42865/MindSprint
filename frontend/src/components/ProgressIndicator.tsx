type ProgressIndicatorProps = {
  current: number;
  total: number;
};

export default function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  return (
    <p className="progress" aria-label={`Question ${current} of ${total}`}>
      {current} / {total}
    </p>
  );
}
