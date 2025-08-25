import express from "express";
import { 
  getAccounts, 
  createAccount, 
  deleteAccount, 
  updateBalance, 
  addTransaction,
  getAccountById
} from "../controllers/accountController.js";

const router = express.Router();

// ✅ Routes
router.get("/user/:userId", getAccounts);   // Get all accounts of user
router.post("/", createAccount);            // Create account
router.delete("/:id", deleteAccount);       // Delete account
router.put("/:id", updateBalance);          // Update balance (and auto add transaction)
router.post("/:id/transaction", addTransaction); // Add transaction
router.get("/:id", getAccountById);         // Get single account

export default router;
