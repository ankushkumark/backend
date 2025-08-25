// models/UserExpenses.js
import mongoose from "mongoose";

const userExpensesSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // unique user id
  email: { type: String, required: true },    // ✅ saving user email 
  category: { type: String, required: true }, // ✅ e.g. "Food", "Shopping"
  key: { type: String, required: true },      // put title same
  amount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const UserExpenses = mongoose.model("UserExpenses", userExpensesSchema);
export default UserExpenses;
