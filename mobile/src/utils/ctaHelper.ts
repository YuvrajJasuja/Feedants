import { CompetitionDetails } from '../services/competitionApi';
import { ParticipationState } from '../services/participationApi';

export interface CTAConfig {
  text: string;
  subText?: string;
  icon: string;
  gradientColors: [string, string, ...string[]];
  disabled: boolean;
  actionType: 'REGISTER' | 'UPLOAD_SUBMISSION' | 'VIEW_RESULTS' | 'DISABLED';
}

/**
 * Clean helper function to map backend state and user participation state
 * to the primary CTA button parameters without nested JSX conditional clutter.
 */
export function getCompetitionCTA(
  competition: CompetitionDetails | null,
  participation: ParticipationState | null,
  isRegistering: boolean = false
): CTAConfig {
  if (isRegistering) {
    return {
      text: 'PROCESSING...',
      subText: 'Verifying registration slot with server',
      icon: '⏳',
      gradientColors: ['#F0D58C', '#E4BC66', '#B9892F'],
      disabled: true,
      actionType: 'DISABLED',
    };
  }

  if (!competition) {
    return {
      text: 'LOADING...',
      icon: '⏳',
      gradientColors: ['#374151', '#1F2937'],
      disabled: true,
      actionType: 'DISABLED',
    };
  }

  const isUserRegistered = participation?.isRegistered || competition.userParticipationState === 'REGISTERED';
  const userState = competition.userParticipationState || participation?.status || 'NOT_REGISTERED';
  const compState = competition.currentState || 'REGISTRATION_OPEN';

  // 1. User Completed / Winner State
  if (userState === 'WINNER') {
    return {
      text: 'VIEW RESULT & PRIZE',
      subText: 'Congratulations! You are a winner.',
      icon: '🏆',
      gradientColors: ['#F5DE98', '#D4A446', '#B88728'],
      disabled: false,
      actionType: 'VIEW_RESULTS',
    };
  }

  if (userState === 'COMPLETED' || compState === 'RESULTS_PUBLISHED' || compState === 'COMPLETED') {
    return {
      text: 'VIEW RESULTS',
      subText: 'Winner announcements published',
      icon: '📜',
      gradientColors: ['#10B981', '#059669'],
      disabled: false,
      actionType: 'VIEW_RESULTS',
    };
  }

  // 2. User Submitted / Under Review State
  if (userState === 'SUBMITTED' || userState === 'SUBMISSION_UPLOADED' || userState === 'UNDER_REVIEW') {
    return {
      text: 'SUBMISSION UNDER REVIEW',
      subText: 'Your video performance has been received',
      icon: '✅',
      gradientColors: ['#052A20', '#137854'],
      disabled: true,
      actionType: 'DISABLED',
    };
  }

  // 3. User Registered State
  if (isUserRegistered) {
    if (competition.isSubmissionActive || compState === 'SUBMISSION_OPEN') {
      return {
        text: 'UPLOAD SUBMISSION',
        subText: 'Express. Perform. Inspire.',
        icon: '📤',
        gradientColors: ['#F0D58C', '#E4BC66', '#B9892F'],
        disabled: false,
        actionType: 'UPLOAD_SUBMISSION',
      };
    } else {
      return {
        text: 'SUBMISSION OPENS SOON',
        subText: 'Registered — Waiting for submission window to open',
        icon: '✓',
        gradientColors: ['#1F2937', '#111827'],
        disabled: true,
        actionType: 'DISABLED',
      };
    }
  }

  // 4. Capacity Full State
  if (competition.remainingSpots <= 0 || compState === 'REGISTRATION_CLOSED') {
    if (competition.remainingSpots <= 0) {
      return {
        text: 'REGISTRATION FULL',
        subText: 'Maximum participant capacity reached',
        icon: '🚫',
        gradientColors: ['#374151', '#1F2937'],
        disabled: true,
        actionType: 'DISABLED',
      };
    } else {
      return {
        text: 'REGISTRATION CLOSED',
        subText: 'Registration deadline has passed',
        icon: '⏰',
        gradientColors: ['#374151', '#1F2937'],
        disabled: true,
        actionType: 'DISABLED',
      };
    }
  }

  // 5. Default Registration Open State
  return {
    text: `REGISTER NOW (₹${competition.entryFee})`,
    subText: `Only ${competition.remainingSpots} spots remaining`,
    icon: '🎟️',
    gradientColors: ['#F0D58C', '#E4BC66', '#B9892F'],
    disabled: false,
    actionType: 'REGISTER',
  };
}
