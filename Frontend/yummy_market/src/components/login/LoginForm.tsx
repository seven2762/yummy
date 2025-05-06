import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import axios from "axios";
import { LoginData, TokenResponse, LoginFormProps } from '../../types/auth';
import {Link} from "react-router-dom";

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState<string>('');
  const [emailValid, setEmailValid] = useState<boolean>(true);

  const [password, setPassword] = useState<string>('');
  const [pwValid, setPwValid] = useState<boolean>(true);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [pwTouched, setPwTouched] = useState<boolean>(false);


  // 이메일 정규식 검증
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const inputEmail: string = e.target.value;
    setEmail(inputEmail);

    const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    setEmailValid(regex.test(inputEmail));
  };

  // 비밀번호 정규식  검증
  const handlePassWord = (e: ChangeEvent<HTMLInputElement>) => {
    const inputPassWord: string = e.target.value;
    setPassword(inputPassWord);
    setPwTouched(true);
    setErrorMessage('');

    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    setPwValid(regex.test(inputPassWord));
  }

  // 폼 제출
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      if (onError) onError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // LoginData 타입 사용
    const userData: LoginData = {
      email,
      password
    };

    try {
      setIsLoading(true);
      setError('');

      // TokenResponse 타입 사용
      const response = await axios.post<TokenResponse>('/api/v1/auth/login', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      if (accessToken) {
        const jwtToken = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken;

        sessionStorage.setItem('auth_token', jwtToken);
        sessionStorage.setItem('refresh_token', refreshToken);

        if (onSuccess) onSuccess();
        else {
          alert('환영합니다!');
          window.location.href = '/';
        }
      } else {
        throw new Error('인증 토큰을 받지 못했습니다.');
      }
    } catch (err) {
      const errorMsg = '로그인에 실패했습니다. 다시 시도해주세요.';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      console.error('로그인 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 렌더링 부분
  return (
      <form className="login_form mt-8 " onSubmit={handleSubmit}>
        <div className="col-flex gap-10 ">
          <div>
            <label htmlFor="email" className="gmarket-medium fc-888">
              이메일
            </label>
            <div className="relative input_wrap row-flex-center between relative mt-1">
              <div className="absolute flex m-align-center pl-3">
                <User className=""/>
              </div>
              <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmail}
                  className="block pl-15 pr-3 prt-regular fs-18"
                  placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="gmarket-medium fc-888">
              비밀번호
            </label>
            <div className="relative input_wrap row-flex-center between mt-1">
              <div className="absolute flex m-align-center pl-3">
                <Lock className="bg-white"/>
              </div>
              <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePassWord}
                  className="block pl-15 pr-3 prt-regular fs-18"
                  placeholder="••••••••"
              />
              <button
                  type="button"
                  className="absolute flex align-center pr-3 pl-3 eye_icon"
                  onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                    <EyeOff className=""/>
                ) : (
                    <Eye className=""/>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="row-flex-center between mt-5 w-100">
          <div className="forgot_pw gmarket-medium fs-14 fc-888">
            <Link to="/findpw" className="">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </div>

        <div>
          <button
              type="submit"
              disabled={isLoading}
              className="flex-center w-100 login_submit_btn mt-10 gmarket-medium fs-18 fc-ccc"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </div>
      </form>
  );
};

export default LoginForm;