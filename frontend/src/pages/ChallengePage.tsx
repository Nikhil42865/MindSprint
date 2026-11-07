import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AnswerOptions from "../components/AnswerOptions.tsx";
import ProgressIndicator from "../components/ProgressIndicator.tsx";
import QuestionCard from "../components/QuestionCard.tsx";
import Timer from "../components/Timer.tsx";
import { getExpiryTimestamp } from "../engine/timer.ts";
import {
  clearActiveChallenge,
  getActiveChallenge,
  updateActiveChallenge,
} from "../storage/activeChallenge.ts";
import {
  CATEGORIES,
  DIFFICULTIES,
  labelFor,
  type ActiveChallengeSession,
  type OptionId,
} from "../types/challenge.ts";

export default function ChallengePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<ActiveChallengeSession | null>(() =>
    getActiveChallenge(),
  );
  const [index, setIndex] = useState(() => session?.currentQuestionIndex ?? 0);
  const [answers, setAnswers] = useState<Partial<Record<string, OptionId>>>(
    () => session?.answers ?? {},
  );

  useEffect(() => {
    if (!session) {
      return;
    }

    if (session.status === "completed") {
      navigate("/results", { replace: true });
      return;
    }

    if (
      session.status === "active" &&
      session.expiresAt !== null &&
      session.expiresAt <= Date.now()
    ) {
      const completedSession: ActiveChallengeSession = {
        ...session,
        status: "completed",
        completedAt: Date.now(),
      };

      if (updateActiveChallenge(completedSession)) {
        setSession(completedSession);
        navigate("/results", { replace: true });
      }
      return;
    }

    if (!session || session.status !== "ready") {
      return;
    }

    const startedAt = Date.now();
    const activeSession: ActiveChallengeSession = {
      ...session,
      status: "active",
      startedAt,
      expiresAt: getExpiryTimestamp(startedAt, session.config.durationSeconds),
    };

    if (updateActiveChallenge(activeSession)) {
      setSession(activeSession);
    }
  }, [navigate, session]);

  if (!session) {
    return <Navigate to="/setup" replace />;
  }

  const question = session.questions[index];
  if (!question) {
    return (
      <main className="screen">
        <div className="challenge">
          <p className="lede">No questions were prepared for this challenge.</p>
          <button type="button" className="start" onClick={() => leave(navigate)}>
            Back to setup
          </button>
        </div>
      </main>
    );
  }

  const atEnd = index >= session.questions.length - 1;
  const selectedId = answers[question.id] ?? null;

  function showQuestion(nextIndex: number) {
    setIndex(nextIndex);
    updateActiveChallenge({ currentQuestionIndex: nextIndex });
  }

  function selectAnswer(optionId: OptionId) {
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);
    updateActiveChallenge({ answers: nextAnswers });
  }

  function finishChallenge() {
    const currentSession = getActiveChallenge();
    if (!currentSession || currentSession.status === "completed") {
      return;
    }

    const completedSession: ActiveChallengeSession = {
      ...currentSession,
      status: "completed",
      answers: currentSession.answers,
      currentQuestionIndex: index,
      completedAt: Date.now(),
    };

    if (updateActiveChallenge(completedSession)) {
      setSession(completedSession);
      navigate("/results", { replace: true });
    }
  }

  function advance() {
    if (atEnd) {
      finishChallenge();
      return;
    }

    showQuestion(index + 1);
  }

  return (
    <main className="screen">
      <div className="challenge">
        <header className="challenge-top">
          <div className="challenge-bar">
            <button type="button" className="brand" onClick={() => leave(navigate)} aria-label="Return to setup">
              <span className="brand-mark">M</span>
              <span>MindSprint</span>
            </button>
            <Timer expiresAt={session.expiresAt} onExpire={finishChallenge} />
            <ProgressIndicator current={index + 1} total={session.questions.length} />
          </div>
          <p className="challenge-meta">
            {labelFor(CATEGORIES, session.config.category)}
            {" · "}
            {labelFor(DIFFICULTIES, session.config.difficulty)}
          </p>
        </header>

        <div className="question-heading" aria-live="polite">
          <p className="question-kicker">Question {index + 1}</p>
          <QuestionCard prompt={question.prompt} />
        </div>
        <AnswerOptions
          options={question.options}
          selectedId={selectedId}
          onSelect={selectAnswer}
        />

        <div className="challenge-actions">
          <button
            type="button"
            className="ghost"
            onClick={advance}
          >
            {atEnd ? "Finish" : "Skip"}
          </button>
          <button
            type="button"
            className="next"
            onClick={advance}
            disabled={!atEnd && selectedId === null}
          >
            {atEnd ? "Finish challenge" : "Next question"}
          </button>
        </div>
        <p className="challenge-hint">
          {atEnd
            ? "Finish when you are ready to see your results."
            : "Your choice is saved as soon as you select it."}
        </p>
      </div>
    </main>
  );
}

function leave(navigate: ReturnType<typeof useNavigate>) {
  clearActiveChallenge();
  navigate("/setup");
}
