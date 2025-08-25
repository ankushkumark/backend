import Account from "../models/Account.js";
import mongoose from "mongoose";

// ✅ Get all accounts of a user
export const getAccounts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    const accounts = await Account.find({ userId });
    res.json(accounts);
  } catch (err) {
    console.error("getAccounts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create account
export const createAccount = async (req, res) => {
  try {
    let { userId, type, number, balance, color } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }

    const account = new Account({
      userId: new mongoose.Types.ObjectId(userId),
      type,
      number,
      balance,
      color,
    });

    await account.save();
    res.json(account);
  } catch (err) {
    console.error("❌ Error saving account:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete account
export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("deleteAccount error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Balance (popup one) + Transaction add
export const updateBalance = async (req, res) => {
  try {
    let { balance } = req.body; 
    balance = Number(balance);

    if (isNaN(balance)) {
      return res.status(400).json({ message: "Balance must be a number" });
    }

    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    const oldBalance = account.balance;
    const difference = balance - oldBalance;

    // ✅ Balance update
    account.balance = balance;

    // ✅ Transaction push 
    if (difference !== 0) {
      account.transactions.push({
        date: new Date(),
        type: difference > 0 ? "Credit" : "Debit",
        status: difference > 0 ? "Amount Added" : "Amount Deducted",
        amount: Math.abs(difference),
      });
    }

    await account.save();
    res.json(account); 
  } catch (err) {
    console.error("❌ updateBalance error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add Transaction manually
export const addTransaction = async (req, res) => {
  try {
    let { amount, type } = req.body;
    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    if (type === "Credit") account.balance += amount;
    else if (type === "Debit") account.balance -= amount;
    else return res.status(400).json({ message: "Invalid transaction type" });

    account.transactions.push({
      date: new Date(),
      type,
      status: "Completed",
      amount,
    });

    await account.save();
    res.json(account);
  } catch (err) {
    console.error("addTransaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get single account
export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.json(account);
  } catch (err) {
    console.error("getAccountById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
