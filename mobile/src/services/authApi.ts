import { apiClient, ApiResponse } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/register', payload);
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/login', payload);
  },

  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    return apiClient.get<{ user: User }>('/auth/me');
  },
};
