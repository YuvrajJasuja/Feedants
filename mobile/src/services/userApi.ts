import { apiClient, ApiResponse } from './api';
import { CompetitionDetails } from './competitionApi';
import { ParticipationState } from './participationApi';

export interface UserCompetitionItem {
  competition: CompetitionDetails;
  participation: ParticipationState;
}

export const userApi = {
  getMyCompetitions: async (): Promise<ApiResponse<UserCompetitionItem[]>> => {
    return apiClient.get<UserCompetitionItem[]>('/me/competitions');
  },
};
