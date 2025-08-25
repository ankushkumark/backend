import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; 

const router = express.Router();

// ✅ Password update route
router.put("/update/:id", async (req, res) => {
    console.log("Password update hit for ID:", req.params.id);
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Old password check
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
