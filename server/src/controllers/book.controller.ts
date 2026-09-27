import type { Request, Response } from "express";

import {
  createBook as createBookService,
  findAllBooks,
  findBookById,
  findOrCreateGoogleBook,
} from "../services/book.service.js";

import { getGoogleBookById } from "../services/google-books.service.js";
import { searchGoogleBooks } from "../services/google-books.service.js";

export async function getBooks(req: Request, res: Response) {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;

    const books = await findAllBooks(search);

    res.json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error("Failed to fetch books:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
}

export async function createBook(req: Request, res: Response) {
  try {
    const {
      externalId,
      source,
      title,
      author,
      description,
      coverUrl,
      pageCount,
      publishedAt,
      isbn,
      language,
      publisher,
      externalRating,
      externalRatingCount,
    } = req.body;

    if (!externalId || !source || !title || !author) {
      res.status(400).json({
        success: false,
        message: "externalId, source, title, and author are required",
      });

      return;
    }

    const book = await createBookService({
      externalId,
      source,
      title,
      author,
      description,
      coverUrl,
      pageCount,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      isbn,
      language,
      publisher,
      externalRating,
      externalRatingCount,
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Failed to create book:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
}

export async function getBookById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (Array.isArray(id)) {
    res.status(400).json({
        success: false,
        message: "Invalid book ID",
    });

    return;
    }

    const book = await findBookById(id);

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });

      return;
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Failed to fetch book:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
}

export async function searchBooks(req: Request, res: Response) {
  try {
    const query =
      typeof req.query.query === "string"
        ? req.query.query.trim()
        : "";

    if (!query) {
      res.status(400).json({
        success: false,
        message: "Search query is required",
      });

      return;
    }

    const books = await searchGoogleBooks(query);

    res.json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error("Failed to search Google Books:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search Google Books",
    });
  }
}

export async function getOrCreateGoogleBook(
  req: Request,
  res: Response,
) {
  try {
    const { externalId } = req.params;

    if (Array.isArray(externalId) || !externalId) {
      res.status(400).json({
        success: false,
        message: "Invalid Google Book ID",
      });

      return;
    }

    const googleBook =
      await getGoogleBookById(externalId);

    const book =
      await findOrCreateGoogleBook(googleBook);

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error(
      "Failed to fetch or save Google Book:",
      error,
    );

    if (
      error instanceof Error &&
      error.message === "Google Book not found"
    ) {
      res.status(404).json({
        success: false,
        message: "Google Book not found",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch or save Google Book",
    });
  }
}