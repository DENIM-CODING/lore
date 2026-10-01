import { prisma } from "../config/prisma.js";

export async function startReadingSession(data: {
  userId: string;
  bookId: string;
}) {
  const libraryEntry =
    await prisma.libraryEntry.findUnique({
      where: {
        userId_bookId: {
          userId: data.userId,
          bookId: data.bookId,
        },
      },
      include: {
        book: {
          select: {
            id: true,
            pageCount: true,
          },
        },
      },
    });

  if (!libraryEntry) {
    throw new Error("LIBRARY_ENTRY_NOT_FOUND");
  }

  if (libraryEntry.status !== "READING") {
    throw new Error("BOOK_NOT_CURRENTLY_READING");
  }

  const activeSession =
    await prisma.readingSession.findFirst({
      where: {
        userId: data.userId,
        endedAt: null,
      },
    });

  if (activeSession) {
    throw new Error("ACTIVE_SESSION_EXISTS");
  }

  return prisma.readingSession.create({
    data: {
      userId: data.userId,
      bookId: data.bookId,
      startedAt: new Date(),
      startPage: libraryEntry.currentPage,
    },
    include: {
      book: true,
    },
  });
}

export async function getActiveReadingSession(
  userId: string,
) {
  return prisma.readingSession.findFirst({
    where: {
      userId,
      endedAt: null,
    },
    include: {
      book: true,
    },
    orderBy: {
      startedAt: "desc",
    },
  });
}

export async function finishReadingSession(data: {
  userId: string;
  sessionId: string;
  endPage?: number;
}) {
  const session =
    await prisma.readingSession.findFirst({
      where: {
        id: data.sessionId,
        userId: data.userId,
      },
      include: {
        book: {
          select: {
            id: true,
            pageCount: true,
          },
        },
      },
    });

  if (!session) {
    throw new Error(
      "READING_SESSION_NOT_FOUND",
    );
  }

  if (session.endedAt !== null) {
    throw new Error(
      "READING_SESSION_ALREADY_FINISHED",
    );
  }

  const libraryEntry =
    await prisma.libraryEntry.findUnique({
      where: {
        userId_bookId: {
          userId: data.userId,
          bookId: session.bookId,
        },
      },
    });

  if (!libraryEntry) {
    throw new Error("LIBRARY_ENTRY_NOT_FOUND");
  }

  if (libraryEntry.status !== "READING") {
    throw new Error("BOOK_NOT_CURRENTLY_READING");
  }

  const resolvedEndPage =
    data.endPage ??
    session.startPage ??
    undefined;

  if (resolvedEndPage !== undefined) {
    if (!Number.isInteger(resolvedEndPage)) {
      throw new Error("INVALID_END_PAGE");
    }

    if (resolvedEndPage < 0) {
      throw new Error("INVALID_END_PAGE");
    }

    if (
      session.book.pageCount !== null &&
      resolvedEndPage >
        session.book.pageCount
    ) {
      throw new Error(
        "END_PAGE_EXCEEDS_PAGE_COUNT",
      );
    }

    if (
      session.startPage !== null &&
      resolvedEndPage < session.startPage
    ) {
      throw new Error(
        "END_PAGE_BEFORE_START_PAGE",
      );
    }
  }

  const endedAt = new Date();

  const durationMilliseconds =
    endedAt.getTime() -
    session.startedAt.getTime();

  const durationMinutes = Math.max(
    1,
    Math.round(
      durationMilliseconds / 60000,
    ),
  );

  const pagesRead =
    session.startPage !== null &&
    resolvedEndPage !== undefined
      ? Math.max(
          0,
          resolvedEndPage -
            session.startPage,
        )
      : null;

  return prisma.$transaction(
    async (tx) => {
      const finishedSession =
        await tx.readingSession.update({
          where: {
            id: session.id,
          },
          data: {
            endedAt,
            durationMinutes,
            endPage:
              resolvedEndPage ?? null,
            pagesRead,
          },
          include: {
            book: true,
          },
        });

      if (resolvedEndPage !== undefined) {
        await tx.libraryEntry.update({
          where: {
            id: libraryEntry.id,
          },
          data: {
            currentPage: resolvedEndPage,
          },
        });
      }

      return finishedSession;
    },
  );
}

export async function discardReadingSession(data: {
  userId: string;
  sessionId: string;
}) {
  const session =
    await prisma.readingSession.findFirst({
      where: {
        id: data.sessionId,
        userId: data.userId,
      },
    });

  if (!session) {
    throw new Error(
      "READING_SESSION_NOT_FOUND",
    );
  }

  if (session.endedAt !== null) {
    throw new Error(
      "READING_SESSION_ALREADY_FINISHED",
    );
  }

  await prisma.readingSession.delete({
    where: {
      id: session.id,
    },
  });
}