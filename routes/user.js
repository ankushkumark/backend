import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ new (use diskStorage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const email = req.user.email;
    const dir = `uploads/${email}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


// ✅ Get user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update profile (name, phone)
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Upload profile photo
router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("profile"),
  async (req, res) => {
    try {
const filePath = `${req.protocol}://${req.get("host")}/uploads/${req.user.email}/${req.file.filename}`;

      const updated = await User.findByIdAndUpdate(
        req.user.id,
        { profilePic: filePath },
        { new: true }
      ).select("-password");

      res.json({ success: true, user: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

export default router;
