import type {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.lore_token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });

    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined");

    res.status(500).json({
      success: false,
      message: "Authentication configuration error",
    });

    return;
  }

  try {
    const payload = jwt.verify(
      token,
      jwtSecret,
    ) as JwtPayload;

    if (
      !payload.userId ||
      typeof payload.userId !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });

      return;
    }

    (req as AuthenticatedRequest).userId =
      payload.userId;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
}