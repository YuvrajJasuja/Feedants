const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

// GET /api/me/competitions
router.get('/competitions', requireAuth, userController.getMyCompetitions);

module.exports = router;
