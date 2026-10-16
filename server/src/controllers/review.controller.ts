import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createReview,
  deleteReview,
  getBookReviews,
  getUserReview,
  updateReview,
} from "../services/review.service.js";

function getBookId(req: Request): string {
  const { bookId } = req.params;

  if (typeof bookId !== "string") {
    throw new Error("INVALID_BOOK_ID");
  }

  return bookId;
}

function getUserId(req: Request): string {
  const authenticatedRequest =
    req as AuthenticatedRequest;

  if (!authenticatedRequest.userId) {
    throw new Error("UNAUTHORIZED");
  }

  return authenticatedRequest.userId;
}

export async function getReviews(
  req: Request,
  res: Response,
) {
  try {
    const bookId = getBookId(req);

    const reviews =
      await getBookReviews(bookId);

    return res.status(200).json({
      data: reviews,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Failed to fetch reviews",
      });
    }

    switch (error.message) {
      case "INVALID_BOOK_ID":
        return res.status(400).json({
          message: "Invalid book ID",
        });

      case "BOOK_NOT_FOUND":
        return res.status(404).json({
          message: "Book not found",
        });

      default:
        console.error(
          "Failed to fetch reviews:",
          error,
        );

        return res.status(500).json({
          message: "Failed to fetch reviews",
        });
    }
  }
}

export async function getMyReview(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const bookId = getBookId(req);

    const review =
      await getUserReview(
        userId,
        bookId,
      );

    return res.status(200).json({
      data: review,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Failed to fetch review",
      });
    }

    switch (error.message) {
      case "UNAUTHORIZED":
        return res.status(401).json({
          message: "Authentication required",
        });

      case "INVALID_BOOK_ID":
        return res.status(400).json({
          message: "Invalid book ID",
        });

      default:
        console.error(
          "Failed to fetch user review:",
          error,
        );

        return res.status(500).json({
          message: "Failed to fetch review",
        });
    }
  }
}

export async function createReviewHandler(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);

    const {
      bookId,
      rating,
      content,
      spoiler,
    } = req.body;

    if (
      typeof bookId !== "string" ||
      !bookId.trim()
    ) {
      return res.status(400).json({
        message: "Book ID is required",
      });
    }

    const review =
      await createReview({
        userId,
        bookId,
        rating,
        content,
        spoiler,
      });

    return res.status(201).json({
      data: review,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Failed to create review",
      });
    }

    switch (error.message) {
      case "UNAUTHORIZED":
        return res.status(401).json({
          message: "Authentication required",
        });

      case "BOOK_NOT_FOUND":
        return res.status(404).json({
          message: "Book not found",
        });

      case "INVALID_RATING":
        return res.status(400).json({
          message:
            "Rating must be an integer between 1 and 5",
        });

      case "REVIEW_ALREADY_EXISTS":
        return res.status(409).json({
          message:
            "You have already reviewed this book",
        });

      default:
        console.error(
          "Failed to create review:",
          error,
        );

        return res.status(500).json({
          message: "Failed to create review",
        });
    }
  }
}

export async function updateReviewHandler(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const bookId = getBookId(req);

    const {
      rating,
      content,
      spoiler,
    } = req.body;

    const review =
      await updateReview({
        userId,
        bookId,
        rating,
        content,
        spoiler,
      });

    return res.status(200).json({
      data: review,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Failed to update review",
      });
    }

    switch (error.message) {
      case "UNAUTHORIZED":
        return res.status(401).json({
          message: "Authentication required",
        });

      case "INVALID_BOOK_ID":
        return res.status(400).json({
          message: "Invalid book ID",
        });

      case "INVALID_RATING":
        return res.status(400).json({
          message:
            "Rating must be an integer between 1 and 5",
        });

      case "REVIEW_NOT_FOUND":
        return res.status(404).json({
          message: "Review not found",
        });

      default:
        console.error(
          "Failed to update review:",
          error,
        );

        return res.status(500).json({
          message: "Failed to update review",
        });
    }
  }
}

export async function deleteReviewHandler(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const bookId = getBookId(req);

    await deleteReview(
      userId,
      bookId,
    );

    return res.status(204).send();
  } catch (error) {
    if (!(error instanceof Error)) {
      return res.status(500).json({
        message: "Failed to delete review",
      });
    }

    switch (error.message) {
      case "UNAUTHORIZED":
        return res.status(401).json({
          message: "Authentication required",
        });

      case "INVALID_BOOK_ID":
        return res.status(400).json({
          message: "Invalid book ID",
        });

      case "REVIEW_NOT_FOUND":
        return res.status(404).json({
          message: "Review not found",
        });

      default:
        console.error(
          "Failed to delete review:",
          error,
        );

        return res.status(500).json({
          message: "Failed to delete review",
        });
    }
  }
}