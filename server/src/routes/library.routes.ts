import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";

import {
  addToLibrary,
  getLibrary,
  getLibraryBook,
  removeFromLibrary,
  updateLibrary,
} from "../controllers/library.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", getLibrary);

router.get("/:bookId", getLibraryBook);

router.post("/", addToLibrary);

router.patch("/:bookId", updateLibrary);

router.delete(
  "/:bookId",
  removeFromLibrary,
);

export default router;