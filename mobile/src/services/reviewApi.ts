import { apiClient, ApiResponse } from './api';

export interface ReviewItem {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
  } | string;
  competitionId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviewApi = {
  getCompetitionReviews: async (competitionId: string): Promise<ApiResponse<ReviewItem[]>> => {
    return apiClient.get<ReviewItem[]>(`/competitions/${competitionId}/reviews`);
  },

  submitReview: async (
    competitionId: string,
    payload: { userId: string; rating: number; comment: string }
  ): Promise<ApiResponse<ReviewItem>> => {
    return apiClient.post<ReviewItem>(`/competitions/${competitionId}/reviews`, payload);
  },
};
