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

const getAllCompetitions = async () => {
  const competitions = await Competition.find().lean();
  return competitions.map((comp) => {
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
};

module.exports = {
  getCompetitionById,
  getAllCompetitions,
};
