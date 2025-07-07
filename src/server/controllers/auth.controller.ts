import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  sendValidationError,
  sendSuccessResponse,
  handleDatabaseError,
  logError,
} from "../utils/errorHandling.js";

const prisma = new PrismaClient();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username validation (alphanumeric and underscore, 3-20 chars)
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password }: RegisterRequest = req.body;

    // Validate input
    if (!email || !username || !password) {
      sendValidationError(res, "Email, username, and password are required");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      sendValidationError(res, "Please provide a valid email address", "email");
      return;
    }

    if (!USERNAME_REGEX.test(username)) {
      sendValidationError(
        res,
        "Username must be 3-20 characters long and contain only letters, numbers, and underscores",
        "username"
      );
      return;
    }

    if (password.length < 8) {
      sendValidationError(
        res,
        "Password must be at least 8 characters long",
        "password"
      );
      return;
    }

    if (password.length > 128) {
      sendValidationError(
        res,
        "Password must be less than 128 characters",
        "password"
      );
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username }],
      },
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === email.toLowerCase() ? "email" : "username";
      const conflictMessage =
        conflictField === "email"
          ? "Email already exists"
          : "Username already exists";

      res.status(409).json({
        success: false,
        message: conflictMessage,
        field: conflictField,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    sendSuccessResponse(
      res,
      {
        user,
        token,
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    handleDatabaseError(res, "register", error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      sendValidationError(res, "Email and password are required");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal whether email exists or not
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Log failed login attempt
      logError(
        "login - invalid password",
        new Error("Invalid password attempt"),
        {
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
        }
      );

      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    sendSuccessResponse(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
        },
        token,
      },
      "Login successful"
    );
  } catch (error) {
    handleDatabaseError(res, "login", error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User profile not found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    sendSuccessResponse(
      res,
      {
        user: {
          ...user,
          commentsCount: user._count.comments,
          likesCount: user._count.likes,
        },
      },
      "Profile retrieved successfully"
    );
  } catch (error) {
    handleDatabaseError(res, "getProfile", error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Generate new token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });

    sendSuccessResponse(res, { token }, "Token refreshed successfully");
  } catch (error) {
    logError("refreshToken", error, { userId: (req as any).user?.id });
    res.status(500).json({
      success: false,
      message: "Failed to refresh token",
      timestamp: new Date().toISOString(),
    });
  }
};
