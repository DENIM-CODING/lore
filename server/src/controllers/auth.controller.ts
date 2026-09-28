import type { Request, Response } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });

      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });

      return;
    }

    if (!trimmedEmail) {
      res.status(400).json({
        success: false,
        message: "Email cannot be empty",
      });

      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });

      return;
    }

    const user = await registerUser({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });

      return;
    }

    console.error("Failed to register user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

      return;
    }

    if (!email.trim()) {
      res.status(400).json({
        success: false,
        message: "Email cannot be empty",
      });

      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: "Password cannot be empty",
      });

      return;
    }

    const result = await loginUser({
      email,
      password,
    });

    res.cookie("lore_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }

    console.error("Failed to login user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
}

export async function getMe(
  req: Request,
  res: Response,
) {
  try {
    const userId = (
      req as AuthenticatedRequest
    ).userId;

    const user = await getCurrentUser(userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User account no longer exists",
      });

      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "Failed to fetch current user:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
    });
  }
}

export async function logout(
  _req: Request,
  res: Response,
) {
  res.clearCookie("lore_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
}