const participationService = require('../services/participationService');

const registerForCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

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
    const userId = req.query.userId || req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_USER_ID',
          message: 'userId query parameter or header is required.',
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
