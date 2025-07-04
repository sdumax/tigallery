import express from "express";
import ViteExpress from "vite-express";
import appRouter from "./app.js";

const app = express();

app.use(express.json());
app.use("/api", appRouter);

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
