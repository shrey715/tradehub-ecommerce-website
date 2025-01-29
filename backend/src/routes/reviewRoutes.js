import { addReview, deleteReview, updateReview, getReviews } from "../controllers/reviewController.js";
import express from "express";

const reviewRouter = express.Router();

reviewRouter.get("/:id", getReviews);
reviewRouter.post("/add-review", addReview);
reviewRouter.put("/update-review", updateReview);
reviewRouter.delete("/delete-review", deleteReview);

export default reviewRouter;