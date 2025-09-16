import express from "express";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", adminAuth, (req, res) => {
  res.json({ message: "Welcome to Admin Panel", user: req.user });
});

export default router;
