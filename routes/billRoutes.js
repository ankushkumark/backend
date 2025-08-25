// backend/routes/billRoutes.js
import express from "express";
import Bill from "../models/Bill.js"; 

const router = express.Router();

// Add bill
router.post("/", async (req, res) => {
  try {
    const { userId, title, category, amount, dueDate } = req.body;

    const bill = new Bill({
      userId, // 
      title,
      category,
      amount,
      dueDate,
    });

    await bill.save();
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get bills for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete bill
router.delete("/:id", async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
