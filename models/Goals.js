import mongoose from "mongoose";

const GoalsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  target: { type: Number, required: true },
  achieved: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Goals || mongoose.model("Goals", GoalsSchema);
