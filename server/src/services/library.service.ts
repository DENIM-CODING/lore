import { prisma } from "../config/prisma.js";

export const READING_STATUSES = [
  "WANT_TO_READ",
  "READING",
  "ON_HOLD",
  "COMPLETED",
  "DROPPED",
] as const;

export const MAX_FAVORITES = 10;

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
  favorite?: boolean,
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

      ...(favorite !== undefined
        ? { isFavorite: favorite }
        : {}),

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
  isFavorite?: boolean;
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

  if (
    data.isFavorite === true &&
    !existingEntry.isFavorite
  ) {
    const favoriteCount =
      await prisma.libraryEntry.count({
        where: {
          userId: data.userId,
          isFavorite: true,
        },
      });

    if (favoriteCount >= MAX_FAVORITES) {
      throw new Error(
        "FAVORITE_LIMIT_REACHED",
      );
    }
  }

  const nextStatus =
    data.status ?? existingEntry.status;

  const updateData: {
    status?: ReadingStatus;
    currentPage?: number;
    startedAt?: Date | null;
    finishedAt?: Date | null;
    isFavorite?: boolean;
  } = {};

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.isFavorite !== undefined) {
    updateData.isFavorite =
      data.isFavorite;
  }

  /*
   * Validate requested page against the book's
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
   * Starting a book:
   *
   * The first time the user enters READING,
   * record the start date.
   *
   * If the book was previously started, preserve
   * the original startedAt value.
   */
  if (
    nextStatus === "READING" &&
    existingEntry.startedAt === null
  ) {
    updateData.startedAt = new Date();
  }

  /*
   * Completing a book is server-controlled.
   *
   * The server moves the user to the final page
   * and records the finish date.
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

    /*
     * A user can complete a book directly from
     * WANT_TO_READ, so make sure it also gets
     * a start date.
     */
    if (existingEntry.startedAt === null) {
      updateData.startedAt = now;
    }
  }

  /*
   * Any non-completed status means the book is
   * not currently finished.
   *
   * We clear finishedAt when moving away from
   * COMPLETED.
   */
  if (
    existingEntry.status === "COMPLETED" &&
    nextStatus !== "COMPLETED"
  ) {
    updateData.finishedAt = null;
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