// /backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/auth.js";
import contactsRoutes from "./routes/contactsRoutes.js";
import customPropertyRoutes from "./routes/customPropertyRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import pipelineRoutes from "./routes/pipelineRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/custom-properties", customPropertyRoutes);
app.use("/api", uploadRoutes);
app.use("/api/contacts", uploadRoutes);
app.use("/api/pipelines", pipelineRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
