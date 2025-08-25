import express from "express";
import UserExpenses from "../models/UserExpenses.js";

const router = express.Router();  

// GET expenses
router.get("/:userId", async (req, res) => {
  try {
    const expenses = await UserExpenses.find({ userId: req.params.userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT expense update
router.put("/:userId/:key", async (req, res) => {
  try {
    const { userId, key } = req.params;
    const { amount, date, category, email } = req.body;

    const updatedExpense = await UserExpenses.findOneAndUpdate(
      { userId, key },
      {
        userId,
        email,
        key,
        category,
        amount: Number(amount),
        date: date ? new Date(date) : new Date(),
      },
      { new: true, upsert: true }
    );

    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;   
