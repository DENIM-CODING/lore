import { prisma } from "../config/prisma.js";

export async function addBookToLibrary(data: {
  userId: string;
  bookId: string;
  status?:
    | "WANT_TO_READ"
    | "READING"
    | "ON_HOLD"
    | "COMPLETED"
    | "DROPPED";
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
      status: data.status ?? "WANT_TO_READ",
    },

    create: {
      userId: data.userId,
      bookId: data.bookId,
      status: data.status ?? "WANT_TO_READ",
    },

    include: {
      book: true,
    },
  });
}