const Participation = require('../models/Participation');
const Competition = require('../models/Competition');
const { calculateCompetitionState } = require('../utils/competitionState');

/**
 * GET /api/me/competitions
 * Returns all competitions the authenticated user is registered in
 */
const getMyCompetitions = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    const participations = await Participation.find({ userId })
      .populate('competitionId')
      .sort({ registeredAt: -1 });

    const userCompetitions = participations
      .filter((p) => p.competitionId !== null)
      .map((p) => {
        const comp = p.competitionId.toObject ? p.competitionId.toObject() : p.competitionId;
        const currentState = calculateCompetitionState(comp);
        return {
          competition: {
            ...comp,
            id: comp._id,
            currentState,
            isRegistrationActive: currentState === 'REGISTRATION_OPEN' && comp.remainingSpots > 0,
          },
          participation: {
            isRegistered: true,
            status: p.status,
            registeredAt: p.registeredAt,
            hasSubmitted: !!p.submissionId || p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW',
          },
        };
      });

    return res.status(200).json({
      success: true,
      data: userCompetitions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCompetitions,
};
