import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 사용자 정보 타입 정의
interface User {
  email: string;
  // 다른 사용자 정보 필드 추가 (필요에 따라)
}

// 인증 상태 타입 정의
interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

// 초기 상태 설정
const initialState: AuthState = {
  isLoggedIn: !!sessionStorage.getItem('auth_token'),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;