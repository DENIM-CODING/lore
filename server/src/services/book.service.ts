import { prisma } from "../config/prisma.js";

export async function findAllBooks(search?: string) {
  return prisma.book.findMany({
    where: search
      ? {
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
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createBook(data: {
  externalId: string;
  source: string;
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  pageCount?: number;
  publishedAt?: Date;
  isbn?: string;
  language?: string;
  publisher?: string;
  externalRating?: number;
  externalRatingCount?: number;
}) {
  return prisma.book.create({
    data,
  });
}

export async function findBookById(id: string) {
  return prisma.book.findUnique({
    where: {
      id,
    },
  });
}

export async function findOrCreateGoogleBook(
  bookData: {
    externalId: string;
    source: "GOOGLE_BOOKS";
    title: string;
    author: string;
    description?: string;
    coverUrl?: string;
    pageCount?: number;
    publishedAt?: string;
    isbn?: string;
    language?: string;
    publisher?: string;
    externalRating?: number;
    externalRatingCount?: number;
  },
) {
  return prisma.book.upsert({
    where: {
      source_externalId: {
        source: bookData.source,
        externalId: bookData.externalId,
      },
    },

    update: {
      title: bookData.title,
      author: bookData.author,
      description: bookData.description,
      coverUrl: bookData.coverUrl,
      pageCount: bookData.pageCount,
      publishedAt: bookData.publishedAt
        ? new Date(bookData.publishedAt)
        : undefined,
      isbn: bookData.isbn,
      language: bookData.language,
      publisher: bookData.publisher,
      externalRating: bookData.externalRating,
      externalRatingCount: bookData.externalRatingCount,
    },

    create: {
      externalId: bookData.externalId,
      source: bookData.source,
      title: bookData.title,
      author: bookData.author,
      description: bookData.description,
      coverUrl: bookData.coverUrl,
      pageCount: bookData.pageCount,
      publishedAt: bookData.publishedAt
        ? new Date(bookData.publishedAt)
        : undefined,
      isbn: bookData.isbn,
      language: bookData.language,
      publisher: bookData.publisher,
      externalRating: bookData.externalRating,
      externalRatingCount: bookData.externalRatingCount,
    },
  });
}