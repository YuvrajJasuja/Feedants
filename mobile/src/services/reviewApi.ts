import { apiClient, ApiResponse } from './api';

export interface ReviewItem {
  _id: string;
  userId: {
    _id?: string;
    id?: string;
    name?: string;
    profileImage?: string;
  } | string;
  competitionId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewsResponseData {
  data: ReviewItem[];
  stats?: ReviewStats;
}

export const reviewApi = {
  getCompetitionReviews: async (
    competitionId: string
  ): Promise<ApiResponse<ReviewItem[]> & { stats?: ReviewStats }> => {
    return apiClient.get<ReviewItem[]>(`/competitions/${competitionId}/reviews`);
  },

  submitReview: async (
    competitionId: string,
    payload: { rating: number; comment: string; userId?: string }
  ): Promise<ApiResponse<ReviewItem>> => {
    return apiClient.post<ReviewItem>(`/competitions/${competitionId}/reviews`, payload);
  },
};
