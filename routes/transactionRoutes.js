import express from "express";
import { createTransaction, getTransactions, updateTransaction } from "../controllers/transactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST - create new transaction

router.put("/:id", authMiddleware, updateTransaction);
router.get("/", authMiddleware, getTransactions);
router.post("/", authMiddleware, createTransaction);


export default router;
