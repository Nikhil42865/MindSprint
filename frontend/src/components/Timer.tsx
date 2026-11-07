import { useEffect, useRef, useState } from "react";
import { getRemainingSeconds } from "../engine/timer.ts";

type TimerProps = {
  expiresAt: number | null;
  onExpire: () => void;
};

function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

export default function Timer({ expiresAt, onExpire }: TimerProps) {
  const [now, setNow] = useState(() => Date.now());
  const expiredRef = useRef(false);

  useEffect(() => {
    expiredRef.current = false;

    if (expiresAt === null) {
      return;
    }

    const expiry = expiresAt;

    function refresh() {
      const currentTime = Date.now();
      setNow(currentTime);
      const remaining = getRemainingSeconds(expiry);
      if (remaining === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
    }

    refresh();
    const intervalId = window.setInterval(refresh, 250);
    return () => window.clearInterval(intervalId);
  }, [expiresAt, onExpire]);

  const seconds = expiresAt === null ? 0 : getRemainingSeconds(expiresAt, now);
  const clock = expiresAt === null ? "--:--" : formatClock(seconds);

  return (
    <p className="timer" aria-label={`Time limit ${clock}`}>
      {clock}
    </p>
  );
}
