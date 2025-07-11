import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "./config";
import dotenv from "dotenv";
dotenv.config();

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const userMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Authorization token is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log("✅ Decoded token:", decoded);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err);
    res
      .status(401)
      .json({ message: "You are not logged in or session expired" });
  }
};
