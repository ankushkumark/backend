import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ ye add karna
    title: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
