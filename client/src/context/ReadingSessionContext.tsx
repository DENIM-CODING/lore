import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  discardReadingSession,
  finishReadingSession,
  getActiveReadingSession,
  startReadingSession,
  type ReadingSession,
} from "@/lib/api";

interface ReadingSessionContextValue {
  activeSession: ReadingSession | null;
  sessionLoading: boolean;
  sessionActionLoading: boolean;

  startSession: (
    bookId: string,
  ) => Promise<ReadingSession>;

  finishSession: (
    sessionId: string,
    endPage: number,
  ) => Promise<ReadingSession>;

  discardSession: (
    sessionId: string,
  ) => Promise<void>;

  refreshActiveSession: () => Promise<void>;
}

const ReadingSessionContext =
  createContext<ReadingSessionContextValue | null>(
    null,
  );

export function ReadingSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSession, setActiveSession] =
    useState<ReadingSession | null>(null);

  const [sessionLoading, setSessionLoading] =
    useState(true);

  const [sessionActionLoading, setSessionActionLoading] =
    useState(false);

  const refreshActiveSession =
    useCallback(async () => {
      try {
        setSessionLoading(true);

        const session =
          await getActiveReadingSession();

        setActiveSession(session);
      } catch (error) {
        console.error(
          "Failed to load active reading session:",
          error,
        );
      } finally {
        setSessionLoading(false);
      }
    }, []);

  useEffect(() => {
    refreshActiveSession();
  }, [refreshActiveSession]);

  const startSession = useCallback(
    async (bookId: string) => {
      try {
        setSessionActionLoading(true);

        const session =
          await startReadingSession(bookId);

        setActiveSession(session);

        return session;
      } finally {
        setSessionActionLoading(false);
      }
    },
    [],
  );

  const finishSession = useCallback(
    async (
      sessionId: string,
      endPage: number,
    ) => {
      try {
        setSessionActionLoading(true);

        const session =
          await finishReadingSession(
            sessionId,
            endPage,
          );

        setActiveSession(null);

        return session;
      } finally {
        setSessionActionLoading(false);
      }
    },
    [],
  );

  const discardSession = useCallback(
    async (sessionId: string) => {
      try {
        setSessionActionLoading(true);

        await discardReadingSession(
          sessionId,
        );

        setActiveSession(null);
      } finally {
        setSessionActionLoading(false);
      }
    },
    [],
  );

  return (
    <ReadingSessionContext.Provider
      value={{
        activeSession,
        sessionLoading,
        sessionActionLoading,
        startSession,
        finishSession,
        discardSession,
        refreshActiveSession,
      }}
    >
      {children}
    </ReadingSessionContext.Provider>
  );
}

export function useReadingSession() {
  const context = useContext(
    ReadingSessionContext,
  );

  if (!context) {
    throw new Error(
      "useReadingSession must be used within a ReadingSessionProvider",
    );
  }

  return context;
}