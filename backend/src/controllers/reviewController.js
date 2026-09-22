const Review = require('../models/Review');

const getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const totalReviews = await Review.countDocuments({ competitionId: id });
    const allReviews = await Review.find({ competitionId: id }).lean();
    const sumRating = allReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const averageRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 0;

    const paginatedReviews = await Review.find({ competitionId: id })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: paginatedReviews,
      stats: {
        averageRating,
        totalReviews,
      },
      pagination: {
        page,
        limit,
        total: totalReviews,
        totalPages: Math.ceil(totalReviews / limit) || 1,
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
