import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";

import {
  discardSession,
  finishSession,
  getActiveSession,
  startSession,
} from "../controllers/reading-session.controller.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/active",
  getActiveSession,
);

router.post(
  "/",
  startSession,
);

router.post(
  "/:sessionId/finish",
  finishSession,
);

router.delete(
  "/:sessionId",
  discardSession,
);

export default router;