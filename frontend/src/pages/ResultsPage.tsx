import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { scoreChallenge } from "../engine/scoring.ts";
import { clearActiveChallenge, getActiveChallenge } from "../storage/activeChallenge.ts";
import { savePersonalRecord } from "../storage/personalRecords.ts";
import {
  CATEGORIES,
  DIFFICULTIES,
  labelFor,
  type ActiveChallengeSession,
} from "../types/challenge.ts";

function formatTimeUsed(session: ActiveChallengeSession): string {
  if (session.startedAt === null || session.completedAt === null) {
    return "0:00";
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((session.completedAt - session.startedAt) / 1000),
  );
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const session = getActiveChallenge();

  useEffect(() => {
    if (!session || session.status !== "completed") {
      return;
    }

    const score = scoreChallenge(session);
    savePersonalRecord({
      sessionId: session.sessionId,
      category: session.config.category,
      difficulty: session.config.difficulty,
      durationSeconds: session.config.durationSeconds,
      correct: score.correct,
      accuracy: score.accuracy,
      completedAt: session.completedAt ?? Date.now(),
    });
  }, [session]);

  if (!session || session.status !== "completed") {
    return <Navigate to="/setup" replace />;
  }

  const score = scoreChallenge(session);
  const timeUsed = formatTimeUsed(session);

  function retry() {
    clearActiveChallenge();
    navigate("/setup");
  }

  return (
    <main className="screen">
      <div className="results">
        <header className="results-header">
          <p className="eyebrow">Challenge complete</p>
          <h1>Good work.</h1>
          <p className="lede">
            {labelFor(CATEGORIES, session.config.category)}
            {" · "}
            {labelFor(DIFFICULTIES, session.config.difficulty)}
          </p>
        </header>

        <section className="score-grid" aria-label="Challenge score">
          <div className="score-primary">
            <span className="score-value">{score.correct}</span>
            <span className="score-label">correct</span>
          </div>
          <div className="score-stat">
            <span className="score-value">{score.accuracy}%</span>
            <span className="score-label">accuracy</span>
          </div>
          <div className="score-stat">
            <span className="score-value">{score.completion}%</span>
            <span className="score-label">completed</span>
          </div>
          <div className="score-stat">
            <span className="score-value">{timeUsed}</span>
            <span className="score-label">time used</span>
          </div>
        </section>

        <div className="results-summary" aria-label="Answer summary">
          <span>{score.incorrect} incorrect</span>
          <span>{score.unanswered} unanswered</span>
        </div>

        <section className="review" aria-labelledby="review-title">
          <div className="section-heading">
            <p className="eyebrow">Review</p>
            <h2 id="review-title">Every question</h2>
          </div>
          <div className="review-list">
            {session.questions.map((question, index) => {
              const result = score.results[index];
              if (!result || result.selectedOptionId === null) {
                return null;
              }

              const selectedOption = question.options.find(
                (option) => option.id === result?.selectedOptionId,
              );
              const correctOption = question.options.find(
                (option) => option.id === result?.correctOptionId,
              );

              return (
                <article
                  className={`review-item ${result?.isCorrect ? "review-item-correct" : ""}`}
                  key={question.id}
                >
                  <div className="review-question">
                    <span className="review-number">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{question.prompt}</h3>
                  </div>
                  <dl className="review-answers">
                    <div>
                      <dt>Your answer</dt>
                      <dd>{selectedOption?.text ?? "Unanswered"}</dd>
                    </div>
                    <div>
                      <dt>Correct answer</dt>
                      <dd>{correctOption?.text ?? "Not available"}</dd>
                    </div>
                  </dl>
                  {result?.explanation ? (
                    <p className="explanation">{result.explanation}</p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <button type="button" className="start retry" onClick={retry}>
          Try another challenge
        </button>
      </div>
    </main>
  );
}
