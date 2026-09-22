const COMPETITION_STATES = {
  UPCOMING: 'UPCOMING',
  REGISTRATION_OPEN: 'REGISTRATION_OPEN',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  SUBMISSION_OPEN: 'SUBMISSION_OPEN',
  SUBMISSION_CLOSED: 'SUBMISSION_CLOSED',
  JUDGING: 'JUDGING',
  RESULTS_PUBLISHED: 'RESULTS_PUBLISHED',
  COMPLETED: 'COMPLETED',
};

/**
 * Dynamically computes competition lifecycle state and remaining spots based on dates & capacity.
 * @param {Object} competition - Competition mongoose doc or plain object
 * @returns {Object} { currentState, remainingSpots, isRegistrationActive, isSubmissionActive }
 */
function calculateCompetitionState(competition) {
  const now = new Date();

  const regStart = new Date(competition.registrationStart);
  const regEnd = new Date(competition.registrationEnd);
  const subStart = new Date(competition.submissionStart);
  const subEnd = new Date(competition.submissionEnd);
  const resultDate = new Date(competition.resultDate);

  const maxParticipants = Number(competition.maxParticipants) || 0;
  const registeredCount = Number(competition.registeredParticipants) || 0;
  const remainingSpots = Math.max(0, maxParticipants - registeredCount);

  let currentState = COMPETITION_STATES.UPCOMING;

  if (now >= resultDate) {
    currentState = COMPETITION_STATES.RESULTS_PUBLISHED;
  } else if (now >= subEnd && now < resultDate) {
    currentState = COMPETITION_STATES.JUDGING;
  } else if (now >= subStart && now <= subEnd) {
    currentState = COMPETITION_STATES.SUBMISSION_OPEN;
  } else if (now >= regStart && now <= regEnd) {
    if (remainingSpots === 0) {
      currentState = COMPETITION_STATES.REGISTRATION_CLOSED;
    } else {
      currentState = COMPETITION_STATES.REGISTRATION_OPEN;
    }
  } else if (now > regEnd && now < subStart) {
    currentState = COMPETITION_STATES.REGISTRATION_CLOSED;
  } else if (now < regStart) {
    currentState = COMPETITION_STATES.UPCOMING;
  }

  const isRegistrationActive =
    now >= regStart && now <= regEnd && remainingSpots > 0;

  const isSubmissionActive = now >= subStart && now <= subEnd;

  return {
    currentState,
    remainingSpots,
    isRegistrationActive,
    isSubmissionActive,
    maxParticipants,
    registeredParticipants: registeredCount,
  };
}

module.exports = {
  COMPETITION_STATES,
  calculateCompetitionState,
};
