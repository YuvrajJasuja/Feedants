const participationService = require('../services/participationService');

const registerForCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Derive user identity strictly from req.user (authenticated token) or fallback to req.body.userId
    const userId = req.user ? (req.user.id || req.user._id) : req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required to register for competition.',
        },
      });
    }

    const result = await participationService.registerUserForCompetition(id, userId);

    res.status(201).json({
      success: true,
      message: 'Successfully registered for competition!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getParticipationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? (req.user.id || req.user._id) : (req.query.userId || req.headers['x-user-id']);

    if (!userId) {
      // Unauthenticated visitor
      return res.json({
        success: true,
        data: {
          isRegistered: false,
          status: 'NOT_REGISTERED',
          registeredAt: null,
          hasSubmitted: false,
        },
      });
    }

    const status = await participationService.getUserParticipationStatus(id, userId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForCompetition,
  getParticipationStatus,
};
