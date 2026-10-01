import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  discardReadingSession,
  finishReadingSession,
  getActiveReadingSession,
  startReadingSession,
} from "../services/reading-session.service.js";

function getUserId(req: Request): string {
  return (req as AuthenticatedRequest).userId;
}

/**
 * POST /api/reading-sessions
 */
export async function startSession(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const { bookId } = req.body;

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

    const session =
      await startReadingSession({
        userId,
        bookId: bookId.trim(),
      });

    res.status(201).json({
      success: true,
      data: session,
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
        "BOOK_NOT_CURRENTLY_READING"
    ) {
      res.status(409).json({
        success: false,
        message:
          "Book must be currently reading to start a session",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "ACTIVE_SESSION_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message:
          "You already have an active reading session",
      });

      return;
    }

    console.error(
      "Failed to start reading session:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to start reading session",
    });
  }
}

/**
 * GET /api/reading-sessions/active
 */
export async function getActiveSession(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);

    const session =
      await getActiveReadingSession(userId);

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error(
      "Failed to fetch active reading session:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch active reading session",
    });
  }
}

/**
 * POST /api/reading-sessions/:sessionId/finish
 */
export async function finishSession(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const { sessionId } = req.params;
    const { endPage } = req.body;

    if (
      typeof sessionId !== "string" ||
      !sessionId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Session ID is required",
      });

      return;
    }

    if (
      endPage !== undefined &&
      (
        typeof endPage !== "number" ||
        !Number.isInteger(endPage) ||
        endPage < 0
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "endPage must be a non-negative integer",
      });

      return;
    }

    const session =
      await finishReadingSession({
        userId,
        sessionId: sessionId.trim(),
        endPage,
      });

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "READING_SESSION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message:
          "Reading session not found",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "READING_SESSION_ALREADY_FINISHED"
    ) {
      res.status(409).json({
        success: false,
        message:
          "Reading session has already been finished",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "INVALID_END_PAGE"
    ) {
      res.status(400).json({
        success: false,
        message:
          "endPage must be a non-negative integer",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "END_PAGE_EXCEEDS_PAGE_COUNT"
    ) {
      res.status(400).json({
        success: false,
        message:
          "endPage cannot exceed the book's page count",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "END_PAGE_BEFORE_START_PAGE"
    ) {
      res.status(400).json({
        success: false,
        message:
          "endPage cannot be before the session start page",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "BOOK_NOT_CURRENTLY_READING"
    ) {
      res.status(409).json({
        success: false,
        message:
          "Book must be currently reading to finish a session",
      });

      return;
    }

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
      "Failed to finish reading session:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to finish reading session",
    });
  }
}

/**
 * DELETE /api/reading-sessions/:sessionId
 */
export async function discardSession(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const { sessionId } = req.params;

    if (
      typeof sessionId !== "string" ||
      !sessionId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Session ID is required",
      });

      return;
    }

    await discardReadingSession({
      userId,
      sessionId: sessionId.trim(),
    });

    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "READING_SESSION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message:
          "Reading session not found",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "READING_SESSION_ALREADY_FINISHED"
    ) {
      res.status(409).json({
        success: false,
        message:
          "Finished reading sessions cannot be discarded",
      });

      return;
    }

    console.error(
      "Failed to discard reading session:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to discard reading session",
    });
  }
}