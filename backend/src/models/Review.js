import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  reviewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer ID is required']
  },
  reviewee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewee ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true
  }
}, {
  timestamps: true,
  indexes: [
    { 
      fields: { reviewer_id: 1, reviewee_id: 1 },
      unique: true,
      name: 'unique_reviewer_reviewee'
    }
  ]
});

const Review = mongoose.model('Review', ReviewSchema);

export default Review;