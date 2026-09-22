const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const validateRequest = require('../middleware/validateRequest');
const { validateSubmission } = require('../validators/submissionValidator');

router.post(
  '/:id/submit',
  validateRequest(validateSubmission),
  submissionController.submitEntry
);

router.get('/:id/submission', submissionController.getUserSubmission);

module.exports = router;
