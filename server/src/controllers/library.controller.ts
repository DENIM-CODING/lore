import type { Request, Response } from "express";

import { addBookToLibrary } from "../services/library.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function addToLibrary(
  req: Request,
  res: Response,
) {
  try {
    const userId = (
      req as AuthenticatedRequest
    ).userId;

    const { bookId, status } = req.body;

    if (
      typeof bookId !== "string" ||
      !bookId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "bookId is required",
      });

      return;
    }

    const validStatuses = [
      "WANT_TO_READ",
      "READING",
      "ON_HOLD",
      "COMPLETED",
      "DROPPED",
    ];

    if (
      status !== undefined &&
      !validStatuses.includes(status)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid reading status",
      });

      return;
    }

    const libraryEntry =
      await addBookToLibrary({
        userId,
        bookId,
        status,
      });

    res.status(201).json({
      success: true,
      data: libraryEntry,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "BOOK_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });

      return;
    }

    console.error(
      "Failed to add book to library:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to add book to library",
    });
  }
}