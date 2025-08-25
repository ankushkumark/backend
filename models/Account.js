import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["Credit", "Debit"], required: true },
  status: { type: String, default: "Completed" },
  amount: { type: Number, required: true },
});

const accountSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    number: { type: String, required: true },
    balance: { type: Number, default: 0 },
    color: { type: String, required: true },

    // 🔥 FIX: userId should be ObjectId
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    transactions: { type: [transactionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Account ||
  mongoose.model("Account", accountSchema);
