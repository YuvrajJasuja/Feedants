import { apiClient, ApiResponse } from './api';

export interface SubmissionPayload {
  competitionId: string;
  userId?: string;
  title: string;
  description?: string;
  videoUrl: string;
}

export interface SubmissionResponse {
  submissionId: string;
  status: 'received' | 'under_review' | 'accepted';
  submittedAt: string;
}

export const submissionApi = {
  submitEntry: async (payload: SubmissionPayload): Promise<ApiResponse<SubmissionResponse>> => {
    return apiClient.post<SubmissionResponse>(`/competitions/${payload.competitionId}/submissions`, payload);
  },

  getUserSubmission: async (competitionId: string, userId?: string): Promise<ApiResponse<SubmissionResponse>> => {
    const query = userId ? `?userId=${userId}` : '';
    return apiClient.get<SubmissionResponse>(`/competitions/${competitionId}/submissions${query}`);
  },
};
