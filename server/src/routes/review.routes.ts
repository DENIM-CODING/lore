import { Router } from "express";

import {
  createReviewHandler,
  deleteReviewHandler,
  getMyReview,
  getReviews,
  updateReviewHandler,
} from "../controllers/review.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/:bookId/me",
  requireAuth,
  getMyReview,
);

router.get("/:bookId", getReviews);

router.post(
  "/",
  requireAuth,
  createReviewHandler,
);

router.patch(
  "/:bookId",
  requireAuth,
  updateReviewHandler,
);

router.delete(
  "/:bookId",
  requireAuth,
  deleteReviewHandler,
);

export default router;