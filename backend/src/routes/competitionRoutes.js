const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const participationController = require('../controllers/participationController');
const submissionController = require('../controllers/submissionController');
const reviewController = require('../controllers/reviewController');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { validateRegistration } = require('../validators/participationValidator');
const { validateSubmission } = require('../validators/submissionValidator');

// GET /api/competitions - List all competitions
router.get('/', competitionController.getCompetitions);

// GET /api/competitions/:id - Complete competition details
router.get('/:id', optionalAuth, competitionController.getCompetitionDetails);

// POST /api/competitions/:id/register - Register for competition (ATOMIC CONCURRENCY SAFE)
router.post(
  '/:id/register',
  requireAuth,
  participationController.registerForCompetition
);

// GET /api/competitions/:id/participation - Check user participation state
router.get('/:id/participation', optionalAuth, participationController.getParticipationStatus);

// POST /api/competitions/:id/submissions - Submit performance entry
router.post(
  '/:id/submissions',
  requireAuth,
  submissionController.submitEntry
);

// GET /api/competitions/:id/submissions - Get user submission
router.get('/:id/submissions', optionalAuth, submissionController.getUserSubmission);

// GET /api/competitions/:id/reviews - Get competition reviews
router.get('/:id/reviews', reviewController.getReviews);

// POST /api/competitions/:id/reviews - Submit review
router.post('/:id/reviews', requireAuth, reviewController.createReview);

module.exports = router;
