const Competition = require('../models/Competition');
const Participation = require('../models/Participation');
const Submission = require('../models/Submission');
const { calculateCompetitionState } = require('../utils/competitionState');

const createSubmission = async ({ competitionId, userId, title, description, mediaUrl, videoUrl }) => {
  const url = mediaUrl || videoUrl;

  const competition = await Competition.findById(competitionId);
  if (!competition) {
    const error = new Error('Competition not found.');
    error.statusCode = 404;
    error.code = 'COMPETITION_NOT_FOUND';
    throw error;
  }

  const participation = await Participation.findOne({ competitionId, userId });
  if (!participation) {
    const error = new Error('You must be registered for this competition before submitting.');
    error.statusCode = 403;
    error.code = 'NOT_REGISTERED';
    throw error;
  }

  const now = new Date();
  const subStart = new Date(competition.submissionStart);
  const subEnd = new Date(competition.submissionEnd);

  if (now < subStart) {
    const error = new Error('Submission period has not started yet.');
    error.statusCode = 400;
    error.code = 'SUBMISSION_NOT_STARTED';
    throw error;
  }

  if (now > subEnd) {
    const error = new Error('Submission period for this competition has ended.');
    error.statusCode = 400;
    error.code = 'SUBMISSION_CLOSED';
    throw error;
  }

  const existingSubmission = await Submission.findOne({ competitionId, userId });
  if (existingSubmission) {
    const error = new Error('You have already submitted an entry for this competition.');
    error.statusCode = 400;
    error.code = 'ALREADY_SUBMITTED';
    throw error;
  }

  const submission = await Submission.create({
    competitionId,
    userId,
    title,
    description: description || '',
    mediaUrl: url,
    status: 'UPLOADED',
    submittedAt: new Date(),
  });

  participation.status = 'SUBMITTED';
  participation.submissionId = submission._id;
  await participation.save();

  return submission;
};

const getSubmissionByUser = async (competitionId, userId) => {
  return Submission.findOne({ competitionId, userId }).lean();
};

module.exports = {
  createSubmission,
  getSubmissionByUser,
};
