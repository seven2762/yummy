// api.ts 파일의 refreshAccessToken 함수 수정
import {TokenResponse} from "../types/auth";
import axios from "axios";

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = sessionStorage.getItem('refresh_token');

    if (!refreshToken) {
      window.location.href = '/login';
      return null;
    }

    const response = await axios.post<TokenResponse>('/api/v1/auth/refresh', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Refresh-Token': refreshToken
      }
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (accessToken) {
      sessionStorage.setItem('auth_token', accessToken);

      if (newRefreshToken) {
        sessionStorage.setItem('refresh_token', newRefreshToken);
      }

      return accessToken;
    } else {
      throw new Error('새로운 액세스 토큰을 받지 못했습니다.');
    }
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
    window.location.href = '/login';
    return null;
  }
};