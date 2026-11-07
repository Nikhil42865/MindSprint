type QuestionCardProps = {
  prompt: string;
};

export default function QuestionCard({ prompt }: QuestionCardProps) {
  return <h1 className="prompt">{prompt}</h1>;
}
