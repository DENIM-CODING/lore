import cors from "cors";
import express from "express";
import { prisma } from "./config/prisma.js";
import bookRoutes from "./routes/book.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/books", bookRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Lore API is running",
  });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Lore API and database are connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

export default app;