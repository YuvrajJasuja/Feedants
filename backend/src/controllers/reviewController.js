const Review = require('../models/Review');

const getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ competitionId: id })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const sumRating = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const averageRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 0;

    res.json({
      success: true,
      data: reviews,
      stats: {
        averageRating,
        totalReviews,
      },
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

    const numRating = Number(rating);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required to post a review.',
        },
      });
    }

    if (!rating || isNaN(numRating) || numRating < 1 || numRating > 5 || !comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Rating must be between 1 and 5 stars, and comment cannot be empty.',
        },
      });
    }

    const review = await Review.create({
      competitionId: id,
      userId,
      rating: numRating,
      comment: comment.trim(),
    });

    const populatedReview = await Review.findById(review._id).populate('userId', 'name profileImage').lean();

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
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
