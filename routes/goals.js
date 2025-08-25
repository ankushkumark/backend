import express from "express";
import { getGoals, createGoal } from "../controllers/goalsController.js";
// import { auth } from "../middleware/authMiddleware.js";  
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// ✅ Routes with auth


router.get("/", authMiddleware, getGoals);
router.post("/", authMiddleware, createGoal);


export default router;
