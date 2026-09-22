import { apiClient, ApiResponse } from './api';

export interface ParticipationState {
  competitionId: string;
  userId: string;
  isRegistered: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'none';
  hasSubmitted?: boolean;
  status?: string;
  participation?: any;
}

export const participationApi = {
  getUserStatus: async (competitionId: string, userId: string): Promise<ApiResponse<ParticipationState>> => {
    return apiClient.get<ParticipationState>(`/competitions/${competitionId}/participation?userId=${userId}`);
  },

  registerForCompetition: async (competitionId: string, userId: string): Promise<ApiResponse<ParticipationState>> => {
    return apiClient.post<ParticipationState>(`/competitions/${competitionId}/register`, { userId });
  },
};
