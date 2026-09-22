import { apiClient, ApiResponse } from './api';

export interface CompetitionDetails {
  _id: string;
  id: string;
  title: string;
  category: string;
  description: string;
  prizePool: number;
  entryFee: number;
  maxParticipants: number;
  registeredParticipants: number;
  remainingSpots: number;
  currentState: string;
  isRegistrationActive: boolean;
  isSubmissionActive: boolean;
  status: string;
  registrationStart: string;
  registrationEnd: string;
  submissionStart: string;
  submissionEnd: string;
  resultDate: string;
  judge: {
    name: string;
    profession: string;
    experience: string;
    image: string;
    videoUrl?: string;
  };
  rewards: Array<{ position: string; amount: number; label?: string }>;
  previousWinners: Array<{ name: string; position: string; image: string; videoUrl?: string; prizeAmount?: string }>;
  judgingParameters: string;
  rules: string;
  eligibility: string;
  images?: {
    heroImage?: string;
    bannerImage?: string;
  };
  userParticipationState?: string;
  userParticipation?: any;
  userSubmission?: any;
}

export const competitionApi = {
  getCompetitionDetails: async (id: string, userId?: string): Promise<ApiResponse<CompetitionDetails>> => {
    const url = `/competitions/${id}${userId ? `?userId=${userId}` : ''}`;
    return apiClient.get<CompetitionDetails>(url);
  },

  getAllCompetitions: async (): Promise<ApiResponse<CompetitionDetails[]>> => {
    return apiClient.get<CompetitionDetails[]>('/competitions');
  },
};
