import express from "express";
import RecentTransaction from "../models/RecentTransaction.js";

const router = express.Router();

// 🔹 Fetch all transactions for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tx = await RecentTransaction.find({ userId });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Save or update transaction for a user
router.put("/:userId/:title", async (req, res) => {
  try {
    const { userId, title } = req.params;
    const { amount } = req.body;

    const tx = await RecentTransaction.findOneAndUpdate(
      { userId, key: title },
      { amount, date: new Date(), key: title },
      { new: true, upsert: true } // if not found → create
    );

    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
