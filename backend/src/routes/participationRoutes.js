const express = require('express');
const router = express.Router();
const participationController = require('../controllers/participationController');
const validateRequest = require('../middleware/validateRequest');
const { validateRegistration } = require('../validators/participationValidator');

router.post(
  '/:id/register',
  validateRequest(validateRegistration),
  participationController.registerForCompetition
);

router.get('/:id/status', participationController.getParticipationStatus);

module.exports = router;
