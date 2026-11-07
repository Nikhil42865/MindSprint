import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionGroup from "../components/OptionGroup.tsx";
import { prepareChallenge } from "../services/challengeApi.ts";
import { setActiveChallenge } from "../storage/activeChallenge.ts";
import {
  CATEGORIES,
  DIFFICULTIES,
  DURATIONS,
  type CategoryId,
  type ChallengeConfig,
  type DifficultyId,
  type DurationSeconds,
} from "../types/challenge.ts";

const DEFAULT_CONFIG: ChallengeConfig = {
  category: "mental-maths",
  difficulty: "medium",
  durationSeconds: 120,
};

function readConfig(
  category: CategoryId | null,
  difficulty: DifficultyId | null,
  durationSeconds: DurationSeconds | null,
): ChallengeConfig | null {
  if (category === null || difficulty === null || durationSeconds === null) {
    return null;
  }

  return { category, difficulty, durationSeconds };
}

export default function SetupPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryId | null>(DEFAULT_CONFIG.category);
  const [difficulty, setDifficulty] = useState<DifficultyId | null>(
    DEFAULT_CONFIG.difficulty,
  );
  const [durationSeconds, setDurationSeconds] = useState<DurationSeconds | null>(
    DEFAULT_CONFIG.durationSeconds,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  function clearFeedback() {
    setError(null);
  }

  async function handleStart() {
    const config = readConfig(category, difficulty, durationSeconds);
    if (!config) {
      setError("Choose a category, difficulty, and duration.");
      return;
    }

    setError(null);
    setIsPreparing(true);

    try {
      const challenge = await prepareChallenge(config);
      if (!setActiveChallenge(challenge)) {
        setError("This challenge could not be saved in this browser. Check storage permissions and try again.");
        return;
      }

      navigate("/challenge");
    } catch {
      setError("We could not prepare the challenge. Check your connection and try again.");
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <main className="screen">
      <div className="setup">
        <header className="masthead">
          <p className="eyebrow">Timed practice</p>
          <h1>MindSprint</h1>
          <p className="lede">
            Pick a category, difficulty, and time. Then answer as many questions as you can.
          </p>
        </header>

        <OptionGroup
          label="Category"
          options={CATEGORIES}
          value={category}
          onChange={(value) => {
            setCategory(value);
            clearFeedback();
          }}
        />
        <OptionGroup
          label="Difficulty"
          options={DIFFICULTIES}
          value={difficulty}
          onChange={(value) => {
            setDifficulty(value);
            clearFeedback();
          }}
        />
        <OptionGroup
          label="Duration"
          options={DURATIONS}
          value={durationSeconds}
          onChange={(value) => {
            setDurationSeconds(value);
            clearFeedback();
          }}
        />

        <div className="actions">
          <button
            type="button"
            className="start"
            onClick={handleStart}
            disabled={isPreparing}
            aria-busy={isPreparing}
          >
            {isPreparing ? "Preparing..." : "Start challenge"}
          </button>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
