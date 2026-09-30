import { prisma } from "../config/prisma.js";

export const READING_STATUSES = [
  "WANT_TO_READ",
  "READING",
  "ON_HOLD",
  "COMPLETED",
  "DROPPED",
] as const;

export type ReadingStatus =
  (typeof READING_STATUSES)[number];

export const LIBRARY_SORT_OPTIONS = [
  "recently_updated",
  "recently_added",
  "title_asc",
  "title_desc",
  "author_asc",
  "author_desc",
] as const;

export type LibrarySort =
  (typeof LIBRARY_SORT_OPTIONS)[number];

export async function getUserLibrary(
  userId: string,
  status?: ReadingStatus,
  search?: string,
  sort: LibrarySort = "recently_updated",
) {
  const orderBy =
    sort === "recently_added"
      ? { addedAt: "desc" as const }
      : sort === "title_asc"
        ? { book: { title: "asc" as const } }
        : sort === "title_desc"
          ? { book: { title: "desc" as const } }
          : sort === "author_asc"
            ? { book: { author: "asc" as const } }
            : sort === "author_desc"
              ? { book: { author: "desc" as const } }
              : { updatedAt: "desc" as const };

  return prisma.libraryEntry.findMany({
    where: {
      userId,

      ...(status ? { status } : {}),

      ...(search
        ? {
            book: {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  author: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          }
        : {}),
    },

    include: {
      book: true,
    },

    orderBy,
  });
}
export async function getLibraryEntry(
  userId: string,
  bookId: string,
) {
  return prisma.libraryEntry.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
    include: {
      book: true,
    },
  });
}

export async function addBookToLibrary(data: {
  userId: string;
  bookId: string;
  status?: ReadingStatus;
}) {
  const book = await prisma.book.findUnique({
    where: {
      id: data.bookId,
    },
  });

  if (!book) {
    throw new Error("BOOK_NOT_FOUND");
  }

  return prisma.libraryEntry.upsert({
    where: {
      userId_bookId: {
        userId: data.userId,
        bookId: data.bookId,
      },
    },
    update: {
      status:
        data.status ?? "WANT_TO_READ",
    },
    create: {
      userId: data.userId,
      bookId: data.bookId,
      status:
        data.status ?? "WANT_TO_READ",
    },
    include: {
      book: true,
    },
  });
}

export async function updateLibraryEntry(data: {
  userId: string;
  bookId: string;
  status?: ReadingStatus;
  currentPage?: number;
  startedAt?: Date | null;
  finishedAt?: Date | null;
}) {
  const existingEntry =
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

  if (!existingEntry) {
    throw new Error("LIBRARY_ENTRY_NOT_FOUND");
  }

  const nextStatus =
    data.status ?? existingEntry.status;

  const updateData: {
    status?: ReadingStatus;
    currentPage?: number;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  } = {};

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  /*
   * COMPLETED is a server-controlled state.
   *
   * We need the book's page count so that the server
   * can move the user to the final page.
   */
  if (nextStatus === "COMPLETED") {
    if (existingEntry.book.pageCount === null) {
      throw new Error(
        "BOOK_PAGE_COUNT_UNAVAILABLE",
      );
    }

    const now = new Date();

    updateData.currentPage =
      existingEntry.book.pageCount;

    updateData.finishedAt = now;

    if (existingEntry.startedAt === null) {
      updateData.startedAt = now;
    }
  } else {
    /*
     * Validate the requested page against the book's
     * page count when the page count is available.
     */
    if (data.currentPage !== undefined) {
      if (
        existingEntry.book.pageCount !== null &&
        data.currentPage >
          existingEntry.book.pageCount
      ) {
        throw new Error(
          "CURRENT_PAGE_EXCEEDS_PAGE_COUNT",
        );
      }

      updateData.currentPage =
        data.currentPage;
    }

    /*
     * A completed book moved back to another status
     * is no longer currently completed.
     */
    if (
      existingEntry.status === "COMPLETED" &&
      data.status !== undefined
    ) {
      updateData.finishedAt = null;
    }

    if (data.startedAt !== undefined) {
      updateData.startedAt =
        data.startedAt;
    }

    if (data.finishedAt !== undefined) {
      updateData.finishedAt =
        data.finishedAt;
    }
  }

  return prisma.libraryEntry.update({
    where: {
      id: existingEntry.id,
    },

    data: updateData,

    include: {
      book: true,
    },
  });
}

export async function removeBookFromLibrary(
  userId: string,
  bookId: string,
) {
  const existingEntry =
    await prisma.libraryEntry.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

  if (!existingEntry) {
    throw new Error("LIBRARY_ENTRY_NOT_FOUND");
  }

  await prisma.libraryEntry.delete({
    where: {
      id: existingEntry.id,
    },
  });
}