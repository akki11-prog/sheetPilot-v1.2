import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config.js";

import authRoutes from "./routes/auth.route.js";
import createRoutes from "./routes/create.route.js";
import retrieveRoutes from "./routes/retrive.route.js";
import updateRoutes from "./routes/update.route.js";
import deleteRoutes from "./routes/delete.route.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, msg: "SheetPilot API alive" }));

app.use("/api/auth", authRoutes);
app.use("/api/create", createRoutes);
app.use("/api/retrieve", retrieveRoutes);
app.use("/api/update", updateRoutes);
app.use("/api/delete", deleteRoutes);

app.use((req, res) => res.status(404).json({ msg: "Route not found" }));
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ msg: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SheetPilot (stub) → http://localhost:${PORT}`));
