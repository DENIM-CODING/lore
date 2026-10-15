import { useBlocker } from "react-router-dom";

import { useReadingSession } from "@/context/ReadingSessionContext";

export function ReadingSessionNavigationLock() {
  const { activeSession, sessionLoading } =
    useReadingSession();

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (sessionLoading || !activeSession) {
      return false;
    }

    const currentBookPath =
      `/book/${activeSession.bookId}`;

    const isOnCurrentBook =
      currentLocation.pathname === currentBookPath;

    const isNavigatingAway =
      nextLocation.pathname !== currentBookPath;

    return isOnCurrentBook && isNavigatingAway;
  });

  if (blocker.state === "blocked") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
          <div className="mb-5">
            <h2 className="font-display text-2xl text-zinc-100">
              Reading session in progress
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              You can't leave this book while your
              reading session is active. Finish or
              discard the session before navigating
              elsewhere.
            </p>
          </div>

          <button
            type="button"
            onClick={() => blocker.reset()}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-800"
          >
            Stay on this book
          </button>
        </div>
      </div>
    );
  }

  return null;
}