const Competition = require('../models/Competition');
const Participation = require('../models/Participation');
const Submission = require('../models/Submission');
const { calculateCompetitionState } = require('../utils/competitionState');

const getCompetitionById = async (id, userId = null) => {
  const competition = await Competition.findById(id).lean();
  if (!competition) {
    const error = new Error('Competition not found');
    error.statusCode = 404;
    error.code = 'COMPETITION_NOT_FOUND';
    throw error;
  }

  const stateInfo = calculateCompetitionState(competition);

  let userParticipationState = 'NOT_REGISTERED';
  let userParticipation = null;
  let userSubmission = null;

  if (userId) {
    userParticipation = await Participation.findOne({
      competitionId: id,
      userId: userId,
    }).lean();

    if (userParticipation) {
      userParticipationState = userParticipation.status;
      if (userParticipation.submissionId) {
        userSubmission = await Submission.findById(userParticipation.submissionId).lean();
      }
    }
  }

  return {
    ...competition,
    id: competition._id,
    currentState: stateInfo.currentState,
    remainingSpots: stateInfo.remainingSpots,
    isRegistrationActive: stateInfo.isRegistrationActive,
    isSubmissionActive: stateInfo.isSubmissionActive,
    userParticipationState,
    userParticipation,
    userSubmission,
  };
};

const getAllCompetitions = async (page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (p - 1) * l;

  const total = await Competition.countDocuments();
  const competitions = await Competition.find()
    .skip(skip)
    .limit(l)
    .sort({ createdAt: -1 })
    .lean();

  const items = competitions.map((comp) => {
    const stateInfo = calculateCompetitionState(comp);
    return {
      ...comp,
      id: comp._id,
      currentState: stateInfo.currentState,
      remainingSpots: stateInfo.remainingSpots,
      isRegistrationActive: stateInfo.isRegistrationActive,
      isSubmissionActive: stateInfo.isSubmissionActive,
    };
  });

  return {
    items,
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l) || 1,
    },
  };
};

module.exports = {
  getCompetitionById,
  getAllCompetitions,
};
