import mongoose from "mongoose";

const recentTransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  key: { type: String, required: true }, 
  amount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("RecentTransaction", recentTransactionSchema);
