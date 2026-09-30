import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  addBookToLibrary,
  getLibraryEntry,
  getUserLibrary,
  removeBookFromLibrary,
  READING_STATUSES,
  LIBRARY_SORT_OPTIONS,
  updateLibraryEntry,
  type ReadingStatus,
  type LibrarySort,
} from "../services/library.service.js";

function getUserId(req: Request): string {
  return (req as AuthenticatedRequest).userId;
}

function isReadingStatus(
  value: unknown,
): value is ReadingStatus {
  return (
    typeof value === "string" &&
    READING_STATUSES.includes(
      value as ReadingStatus,
    )
  );
}

function isLibrarySort(
  value: unknown,
): value is LibrarySort {
  return (
    typeof value === "string" &&
    LIBRARY_SORT_OPTIONS.includes(
      value as LibrarySort,
    )
  );
}

function parseOptionalDate(
  value: unknown,
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error("INVALID_DATE");
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("INVALID_DATE");
  }

  return date;
}

/**
 * GET /api/library
 */
/**
 * GET /api/library
 */
export async function getLibrary(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);

    const {
      status,
      search,
      sort,
      favorite,
    } = req.query;

    if (
      status !== undefined &&
      !isReadingStatus(status)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid reading status",
      });

      return;
    }

    if (
      search !== undefined &&
      typeof search !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid search query",
      });

      return;
    }

    if (
      sort !== undefined &&
      !isLibrarySort(sort)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid library sort",
      });

      return;
    }

    if (
      favorite !== undefined &&
      favorite !== "true" &&
      favorite !== "false"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid favorite filter",
      });

      return;
    }

    const normalizedSearch =
      typeof search === "string"
        ? search.trim()
        : undefined;

    const normalizedSort =
      typeof sort === "string"
        ? sort
        : undefined;

    const normalizedFavorite =
      favorite === undefined
        ? undefined
        : favorite === "true";

    const library =
      await getUserLibrary(
        userId,
        status as ReadingStatus | undefined,
        normalizedSearch,
        normalizedSort as
          | LibrarySort
          | undefined,
        normalizedFavorite,
      );

    res.json({
      success: true,
      data: library,
    });
  } catch (error) {
    console.error(
      "Failed to fetch library:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch library",
    });
  }
}

/**
 * GET /api/library/:bookId
 */
export async function getLibraryBook(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const { bookId } = req.params;

    if (
      typeof bookId !== "string" ||
      !bookId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
      return;
    }

    const entry = await getLibraryEntry(
      userId,
      bookId.trim(),
    );

    if (!entry) {
      res.status(404).json({
        success: false,
        message:
          "Book is not in your library",
      });
      return;
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error(
      "Failed to fetch library entry:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch library entry",
    });
  }
}

/**
 * POST /api/library
 */
export async function addToLibrary(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);

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

    if (
      status !== undefined &&
      !isReadingStatus(status)
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
        bookId: bookId.trim(),
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

/**
 * PATCH /api/library/:bookId
 */
export async function updateLibrary(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const { bookId } = req.params;

    if (
      typeof bookId !== "string" ||
      !bookId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
      return;
    }

    const {
      status,
      currentPage,
      startedAt,
      finishedAt,
      isFavorite,
    } = req.body;

    if (
      status !== undefined &&
      !isReadingStatus(status)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid reading status",
      });
      return;
    }

    if (
      currentPage !== undefined &&
      (
        typeof currentPage !== "number" ||
        !Number.isInteger(currentPage) ||
        currentPage < 0
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "currentPage must be a non-negative integer",
      });
      return;
    }

    if (
      isFavorite !== undefined &&
      typeof isFavorite !== "boolean"
    ) {
      res.status(400).json({
        success: false,
        message: "isFavorite must be a boolean",
      });
      return;
    }

    let parsedStartedAt:
      | Date
      | null
      | undefined;

    let parsedFinishedAt:
      | Date
      | null
      | undefined;

    try {
      parsedStartedAt =
        parseOptionalDate(startedAt);

      parsedFinishedAt =
        parseOptionalDate(finishedAt);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "INVALID_DATE"
      ) {
        res.status(400).json({
          success: false,
          message:
            "startedAt and finishedAt must be valid dates",
        });
        return;
      }

      throw error;
    }

    const libraryEntry =
      await updateLibraryEntry({
        userId,
        bookId: bookId.trim(),
        status,
        currentPage,
        startedAt: parsedStartedAt,
        finishedAt: parsedFinishedAt,
        isFavorite,
      });

    res.json({
      success: true,
      data: libraryEntry,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "LIBRARY_ENTRY_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message:
          "Book is not in your library",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "CURRENT_PAGE_EXCEEDS_PAGE_COUNT"
    ) {
      res.status(400).json({
        success: false,
        message:
          "currentPage cannot exceed the book's page count",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "BOOK_PAGE_COUNT_UNAVAILABLE"
    ) {
      res.status(422).json({
        success: false,
        message:
          "This book does not have a page count and cannot be marked as completed",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "FAVORITE_LIMIT_REACHED"
    ) {
      res.status(409).json({
        success: false,
        message: "You can have up to 10 favorite books",
      });
      return;
    }

    console.error(
      "Failed to update library entry:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update library entry",
    });
  }
}

/**
 * DELETE /api/library/:bookId
 */
export async function removeFromLibrary(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const { bookId } = req.params;

    if (
      typeof bookId !== "string" ||
      !bookId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
      return;
    }

    await removeBookFromLibrary(
      userId,
      bookId.trim(),
    );

    res.json({
      success: true,
      message: "Book removed from library",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "LIBRARY_ENTRY_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message:
          "Book is not in your library",
      });
      return;
    }

    console.error(
      "Failed to remove book from library:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to remove book from library",
    });
  }
}