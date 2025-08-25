import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Normal Signup & Login
router.post("/signup", signup);
router.post("/login", login);

// ✅ Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect("http://localhost:3000/login?error=NoUser");
      }

      // ✅ JWT with user info
      const token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name || req.user.displayName || "User",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // ✅ Redirect frontend with token + name + email
      res.redirect(
        `http://localhost:3000/?token=${token}&name=${encodeURIComponent(
          req.user.name || req.user.displayName || "User"
        )}&email=${encodeURIComponent(req.user.email)}`
      );
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect("http://localhost:3000/login?error=ServerError");
    }
  }
);

// ✅ Example Protected Route (user details)
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

export default router;
