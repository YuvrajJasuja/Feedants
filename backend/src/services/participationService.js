const Competition = require('../models/Competition');
const Participation = require('../models/Participation');
const User = require('../models/User');
const { calculateCompetitionState } = require('../utils/competitionState');

const registerUserForCompetition = async (competitionId, userId) => {
  // 1. Verify user exists or resolve placeholder
  let user = await User.findById(userId);
  if (!user) {
    user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Demo Participant',
        email: `participant_${Date.now()}@feedants.com`,
        passwordHash: 'hashed_placeholder_pass',
      });
    }
  }
  const effectiveUserId = user._id;

  // 2. Check existing participation - HTTP 409 Conflict if already registered
  const existing = await Participation.findOne({
    competitionId,
    userId: effectiveUserId,
  });
  if (existing) {
    const error = new Error('You are already registered for this competition.');
    error.statusCode = 409;
    error.code = 'ALREADY_REGISTERED';
    throw error;
  }

  // 3. Inspect competition to verify existence & dates
  const rawComp = await Competition.findById(competitionId);
  if (!rawComp) {
    const error = new Error('Competition not found.');
    error.statusCode = 404;
    error.code = 'COMPETITION_NOT_FOUND';
    throw error;
  }

  const stateInfo = calculateCompetitionState(rawComp);
  const now = new Date();

  if (now < new Date(rawComp.registrationStart)) {
    const error = new Error('Registration has not started yet.');
    error.statusCode = 400;
    error.code = 'REGISTRATION_NOT_STARTED';
    throw error;
  }

  if (now > new Date(rawComp.registrationEnd)) {
    const error = new Error('Registration for this competition has closed.');
    error.statusCode = 400;
    error.code = 'REGISTRATION_CLOSED';
    throw error;
  }

  if (stateInfo.remainingSpots <= 0) {
    const error = new Error('Competition has reached maximum participant capacity.');
    error.statusCode = 400;
    error.code = 'COMPETITION_FULL';
    throw error;
  }

  /**
   * ATOMIC CONCURRENCY STRATEGY:
   * Execute an atomic findOneAndUpdate operation in MongoDB.
   * Condition: registeredParticipants MUST be strictly less than maxParticipants ($lt).
   * This guarantees that even under concurrent burst requests, MongoDB atomically
   * increments registeredParticipants without race conditions or overbooking.
   */
  const updatedCompetition = await Competition.findOneAndUpdate(
    {
      _id: competitionId,
      $expr: { $lt: ['$registeredParticipants', '$maxParticipants'] },
      registrationStart: { $lte: now },
      registrationEnd: { $gte: now },
    },
    { $inc: { registeredParticipants: 1 } },
    { new: true }
  );

  if (!updatedCompetition) {
    const currentComp = await Competition.findById(competitionId);
    if (currentComp && currentComp.registeredParticipants >= currentComp.maxParticipants) {
      const error = new Error('Competition has reached maximum participant capacity.');
      error.statusCode = 400;
      error.code = 'COMPETITION_FULL';
      throw error;
    }
    const error = new Error('Registration failed because competition is closed or unavailable.');
    error.statusCode = 400;
    error.code = 'REGISTRATION_CLOSED';
    throw error;
  }

  // 4. Create Participation Record enforcing compound unique index ({ userId, competitionId })
  try {
    const participation = await Participation.create({
      userId: effectiveUserId,
      competitionId,
      status: 'REGISTERED',
      paymentStatus: 'COMPLETED',
      registeredAt: new Date(),
    });

    const updatedStateInfo = calculateCompetitionState(updatedCompetition);

    return {
      participation,
      competitionState: updatedStateInfo,
    };
  } catch (dbErr) {
    // Catch duplicate registration race condition via unique index -> HTTP 409
    if (dbErr.code === 11000) {
      // Rollback the atomic increment
      await Competition.findByIdAndUpdate(competitionId, { $inc: { registeredParticipants: -1 } });
      const error = new Error('You are already registered for this competition.');
      error.statusCode = 409;
      error.code = 'ALREADY_REGISTERED';
      throw error;
    }
    throw dbErr;
  }
};

const getUserParticipationStatus = async (competitionId, userId) => {
  const participation = await Participation.findOne({
    competitionId,
    userId,
  }).lean();

  if (!participation) {
    return {
      status: 'NOT_REGISTERED',
      isRegistered: false,
    };
  }

  return {
    status: participation.status,
    isRegistered: true,
    participation,
  };
};

module.exports = {
  registerUserForCompetition,
  getUserParticipationStatus,
};
