
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

// 추가할 타입 정의
export interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  autoComplete?: string;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

export interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}


// 비번찾기
export interface PasswordResetData {
  email: string;
}

export interface PasswordResetProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface VerificationData {
  email: string;
  code: string;
}

export interface NewPasswordData {
  email: string;
  verificationCode: string;
  newPassword: string;
}