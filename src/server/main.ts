import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import ViteExpress from "vite-express";
import appRouter from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const isProduction = process.env.NODE_ENV === "production";

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use("/api", appRouter);

// In production, serve static files from dist
if (isProduction) {
  const distPath = path.join(__dirname, "../../dist");
  app.use(express.static(distPath));

  // Handle client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  // Production server start
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
} else {
  // Development mode with ViteExpress
  ViteExpress.listen(app, PORT, () =>
    console.log(`Server is listening on port ${PORT}...`)
  );
}
