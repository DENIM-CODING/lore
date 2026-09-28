import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { addToLibrary } from "../controllers/library.controller.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  addToLibrary,
);

export default router;