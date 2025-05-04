export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}