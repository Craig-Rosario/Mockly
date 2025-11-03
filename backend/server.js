import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);

app.get("/api/protected", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    res.json({ message: "✅ Authenticated route access granted!", userId });
  } catch (error) {
    console.error("Protected route error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("✅ Backend running and Clerk connected!");
});

export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running locally on http://localhost:${PORT}`)
  );
}
