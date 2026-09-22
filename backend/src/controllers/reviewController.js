const Review = require('../models/Review');

const getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ competitionId: id })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user.id || req.user._id) : req.body.userId;
    const { rating, comment } = req.body;

    if (!userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Rating and comment are required.',
        },
      });
    }

    const review = await Review.create({
      competitionId: id,
      userId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_REVIEW',
          message: 'You have already submitted a review for this competition.',
        },
      });
    }
    next(error);
  }
};

module.exports = {
  getReviews,
  createReview,
};
