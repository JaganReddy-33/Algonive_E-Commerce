import express from "express";
import { getReviews,createReview } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/:productId", getReviews);
router.post("/:productId", authMiddleware, createReview);

export default router;
