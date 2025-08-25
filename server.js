import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import goalsRoutes from "./routes/goals.js";
import accountRoutes from "./routes/accountRoutes.js";
import expensesRouter from "./routes/expenses.js";
import statsRoutes from "./routes/stats.js";
import transactionRoutes from "./routes/transactionRoutes.js"; 
import recentTransactionRoutes from "./routes/recentTransaction.js";
import userRoutes from "./routes/user.js";
import billRoutes from "./routes/billRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";

const app = express();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());

// ✅ CORS setup (yaha rakho, routes se pehle hi)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://frontend-six-sooty-32.vercel.app",
    ],
    credentials: true,
  })
);

// ✅ Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true,
    },
  })
);


// ✅ Passport initialize
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/stats", statsRoutes);
app.use("/api/recent-transactions", recentTransactionRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/password", passwordRoutes);

// ✅ Routes
app.use("/api/bills", billRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/expenses", expensesRouter);
app.use("/api/transactions", transactionRoutes);
app.use("/api/user", userRoutes);
// ✅ Default route check
app.get("/", (req, res) => {
  res.json({ message: "🚀 API running fine!" });
});
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Backend Error:", err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});
// ✅ Mongo connect + server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000, () =>
      console.log("✅ Server running on http://localhost:5000")
    );
  })
  .catch((err) => console.error("❌ MongoDB connect error:", err));
