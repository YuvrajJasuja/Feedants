const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/:id/reviews', reviewController.getReviews);
router.post('/:id/reviews', reviewController.createReview);

module.exports = router;
