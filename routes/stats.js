import express from "express";
import UserExpenses from "../models/UserExpenses.js"; 
import mongoose from "mongoose";
import dayjs from "dayjs";

const router = express.Router();

// 🔹 Weekly Stats
router.get("/weekly/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // back 7 days
    const startDate = dayjs().subtract(6, "day").startOf("day").toDate();
    const endDate = dayjs().endOf("day").toDate();

    const expenses = await UserExpenses.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyTotals = [];

    for (let i = 0; i < 7; i++) {
      const date = dayjs().subtract(6 - i, "day"); // last 7 days
      const total = expenses
        .filter((e) => dayjs(e.date).isSame(date, "day"))
        .reduce((sum, e) => sum + e.amount, 0);

      dailyTotals.push({
        day: days[date.day()],
        thisWeek: total,
        lastWeek: Math.floor(Math.random() * 500) + 50, // dummy
      });
    }

    res.json(dailyTotals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔹 Monthly Stats
router.get("/monthly/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // last day of last month

    // this month
    const thisMonth = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startOfThisMonth } } },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // last month
    const lastMonth = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // normalize 1–31 days
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const data = days.map((day) => {
      const thisDay = thisMonth.find((d) => d._id === day);
      const lastDay = lastMonth.find((d) => d._id === day);
      return {
        day: `Day ${day}`,
        thisMonth: thisDay ? thisDay.total : 0,
        lastMonth: lastDay ? lastDay.total : 0,
      };
    });

    res.json(data);
  } catch (err) {
    console.error("Error in monthly stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
