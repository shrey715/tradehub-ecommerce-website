import Review from "../models/Review.js"
import mongoose from "mongoose";

// route to get all reviews of a seller
const getReviews = async (req, res) => {
  console.log("Fetching reviews for ID:", req.params.id);
  try {
    const seller_id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ reviewee_id: seller_id })
      .populate({
        path: 'reviewer_id',
        select: 'fname lname email '
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ reviewee_id: seller_id });
    
    const avgRating = await Review.aggregate([
      { $match: { reviewee_id: new mongoose.Types.ObjectId(seller_id) } },
      { $group: { _id: null, average: { $avg: "$rating" } } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
        averageRating: avgRating[0]?.average || 0
      }
    });

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message
    });
  }
};

// route to add a review
const addReview = async (req, res) => {
  console.log("Adding review for ID:", req.body.reviewee_id);
  try {
    const { reviewee_id, rating, review } = req.body;
    const reviewer_id = req.userID;

    const existingReview = await Review.findOne({
      reviewer_id,
      reviewee_id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this seller"
      });
    }

    if (reviewer_id.toString() === reviewee_id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot review yourself"
      });
    }

    const newReview = await Review.create({
      reviewer_id,
      reviewee_id,
      rating,
      review
    });

    await newReview.populate('reviewer_id', 'fname lname email');

    return res.status(201).json({
      success: true,
      data: newReview
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this seller"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message
    });
  }
};

// route to update a review
const updateReview = async (req, res) => {
  console.log("Updating review for ID:", req.params.id);
  try {
    const { rating, review } = req.body;
    const reviewId = req.params.id;
    const userId = req.user._id;

    const existingReview = await Review.findById(reviewId);
    
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review
    if (existingReview.reviewer_id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review"
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, review, date: Date.now() },
      { new: true }
    ).populate('reviewer_id', 'fname lname email');

    return res.status(200).json({
      success: true,
      data: updatedReview
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message
    });
  }
};

// route to delete a review
const deleteReview = async (req, res) => {
  console.log("Deleting review for ID:", req.params.id);
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review
    if (review.reviewer_id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review"
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message
    });
  }
};

export { getReviews, addReview, updateReview, deleteReview };