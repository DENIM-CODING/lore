import { Router } from "express";

import {
  createBook,
  getBookById,
  getBooks,
  getOrCreateGoogleBook,
  searchBooks,
} from "../controllers/book.controller.js";

const router = Router();

router.get("/", getBooks);
router.post("/", createBook);
router.get("/search", searchBooks);
router.get("/google/:externalId", getOrCreateGoogleBook);
router.get("/:id", getBookById);

export default router;