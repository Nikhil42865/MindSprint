import type {
  ActiveChallengeSession,
  PreparedChallenge,
} from "../types/challenge.ts";

const ACTIVE_SESSION_KEY = "mindsprint:active-session";
const STORAGE_VERSION = 1;

type StoredActiveSession = {
  version: number;
  session: ActiveChallengeSession;
};

export function setActiveChallenge(challenge: PreparedChallenge): boolean {
  const session: ActiveChallengeSession = {
    ...challenge,
    sessionId: crypto.randomUUID(),
    status: "ready",
    currentQuestionIndex: 0,
    answers: {},
    startedAt: null,
    expiresAt: null,
    completedAt: null,
  };

  return writeSession(session);
}

export function getActiveChallenge(): ActiveChallengeSession | null {
  try {
    const raw = window.localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) {
      return null;
    }

    const stored = JSON.parse(raw) as StoredActiveSession;
    if (stored.version !== STORAGE_VERSION || !isActiveChallengeSession(stored.session)) {
      return null;
    }

    return stored.session;
  } catch {
    return null;
  }
}

export function updateActiveChallenge(
  update: Partial<ActiveChallengeSession>,
): boolean {
  const current = getActiveChallenge();
  return current ? writeSession({ ...current, ...update }) : false;
}

export function clearActiveChallenge(): void {
  try {
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch {
    // Storage may be disabled by the browser.
  }
}

function writeSession(session: ActiveChallengeSession): boolean {
  try {
    const stored: StoredActiveSession = { version: STORAGE_VERSION, session };
    window.localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}

function isActiveChallengeSession(value: unknown): value is ActiveChallengeSession {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as Partial<ActiveChallengeSession>;
  return (
    typeof session.sessionId === "string" &&
    typeof session.challengeId === "string" &&
    typeof session.bankVersion === "string" &&
    Array.isArray(session.questions) &&
    Array.isArray(session.answerKey) &&
    typeof session.config === "object" &&
    session.config !== null &&
    typeof session.currentQuestionIndex === "number" &&
    typeof session.answers === "object" &&
    session.answers !== null &&
    (session.status === "ready" || session.status === "active" || session.status === "completed") &&
    (session.startedAt === null || typeof session.startedAt === "number") &&
    (session.expiresAt === null || typeof session.expiresAt === "number") &&
    (session.completedAt === null || typeof session.completedAt === "number")
  );
}
