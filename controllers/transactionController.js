import Transaction from "../models/RecentTransaction.js";

// ✅ Create new transaction
export const createTransaction = async (req, res) => {
  try {
    const { accountId, type, status, amount, date } = req.body;

    if (!amount || !type) {
      return res.status(400).json({ error: "Amount and type are required" });
    }

    const newTx = new Transaction({
      userEmail: req.user.email, // 👈 logged-in user link
      accountId: accountId || null,
      type,
      status: status || "pending",
      amount,
      date: date || new Date(),
    });

    const savedTx = await newTx.save();
    res.status(201).json(savedTx);
  } catch (err) {
    console.error("❌ Create Transaction Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all transactions (user-specific)
export const getTransactions = async (req, res) => {
  try {
    const txns = await Transaction.find({ userEmail: req.user.email }).sort({ date: -1 });
    res.json(txns);
  } catch (err) {
    console.error("❌ Get Transactions Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update transaction (only user's own transactions)
// ✅ Update transaction (only user's own transactions)
export const updateTransaction = async (req, res) => {
  try {
    console.log("👉 Update Transaction Hit");
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("User:", req.user);

    const { id } = req.params;
    const { amount, type, status } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userEmail: req.user.email },
      { $set: { ...(amount && { amount }), ...(type && { type }), ...(status && { status }) } },
      { new: true }
    );

    if (!updated) {
      console.log("❌ Transaction not found or unauthorized");
      return res.status(404).json({ error: "Transaction not found or not authorized" });
    }

    console.log("✅ Transaction Updated:", updated);
    res.json(updated);
  } catch (err) {
    console.error("❌ Update Transaction Error:", err);
    res.status(500).json({ error: err.message });
  }
};
