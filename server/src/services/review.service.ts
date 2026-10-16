import { prisma } from "../config/prisma.js";

const MIN_RATING = 1;
const MAX_RATING = 5;

function validateRating(rating: number) {
  if (!Number.isInteger(rating)) {
    throw new Error("INVALID_RATING");
  }

  if (rating < MIN_RATING || rating > MAX_RATING) {
    throw new Error("INVALID_RATING");
  }
}

export async function getBookReviews(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true },
  });

  if (!book) {
    throw new Error("BOOK_NOT_FOUND");
  }

  return prisma.review.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });
}

export async function getUserReview(
  userId: string,
  bookId: string,
) {
  return prisma.review.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
  });
}

export async function createReview(data: {
  userId: string;
  bookId: string;
  rating: number;
  content?: string;
  spoiler?: boolean;
}) {
  validateRating(data.rating);

  const book = await prisma.book.findUnique({
    where: { id: data.bookId },
    select: { id: true },
  });

  if (!book) {
    throw new Error("BOOK_NOT_FOUND");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_bookId: {
        userId: data.userId,
        bookId: data.bookId,
      },
    },
    select: { id: true },
  });

  if (existingReview) {
    throw new Error("REVIEW_ALREADY_EXISTS");
  }

  return prisma.review.create({
    data: {
      userId: data.userId,
      bookId: data.bookId,
      rating: data.rating,
      content: data.content?.trim() || null,
      spoiler: data.spoiler ?? false,
    },
  });
}

export async function updateReview(data: {
  userId: string;
  bookId: string;
  rating: number;
  content?: string;
  spoiler?: boolean;
}) {
  validateRating(data.rating);

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_bookId: {
        userId: data.userId,
        bookId: data.bookId,
      },
    },
    select: { id: true },
  });

  if (!existingReview) {
    throw new Error("REVIEW_NOT_FOUND");
  }

  return prisma.review.update({
    where: { id: existingReview.id },
    data: {
      rating: data.rating,
      content: data.content?.trim() || null,
      spoiler: data.spoiler ?? false,
    },
  });
}

export async function deleteReview(
  userId: string,
  bookId: string,
) {
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_bookId: {
        userId,
        bookId,
      },
    },
    select: { id: true },
  });

  if (!existingReview) {
    throw new Error("REVIEW_NOT_FOUND");
  }

  await prisma.review.delete({
    where: { id: existingReview.id },
  });
}