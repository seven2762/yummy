import React, {useState, FormEvent, ChangeEvent, useEffect} from 'react';
import {Eye, EyeOff, LogIn, User, Lock} from 'lucide-react';
import '../styles/login.css'
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [emailValid , setEmailValid] = useState<boolean>(true);

  const [password, setPassword] = useState<string>('');
  const [pwValid, setPwValid] = useState<boolean>(true);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [pwTouched, setPwTouched] = useState<boolean>(false);



// 이메일 검증
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const inputEmail: string = e.target.value;
    setEmail(inputEmail);

    const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    const isValid = regex.test(inputEmail);

    setEmailValid(isValid);
  };

  // 비밀번호 검증
  const handlePassWord = (e : ChangeEvent<HTMLInputElement>) => {
    const inputPassWord: string =e.target.value;
    setPassword(inputPassWord);
    setPwTouched(true);
    setErrorMessage('');
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    setPwValid(regex.test(inputPassWord));
  }


  const handleSubmit =
      async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
          setError('이메일과 비밀번호를 모두 입력해주세요.');
          return;
        }

        const userData = {
          email,
          password
        };

        try {
          // 로딩 상태 활성화
          setIsLoading(true);
          setError('');

          console.log('로그인 데이터:', userData);

          // 슬래시로 시작하는 엔드포인트 사용 (프록시 설정과 함께 작동)
          const response = await axios.post('/api/v1/auth/login', userData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

// 헤더가 아닌 응답 본문(body)에서 토큰 가져오기
          const accessToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;

          if (accessToken) {
            // 토큰이 "Bearer [토큰값]" 형식으로 오는 경우 처리
            const jwtToken = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken;

            // 세션스토리지에 토큰 저장
            sessionStorage.setItem('auth_token', jwtToken);

            // 필요하다면 리프레시 토큰도 저장
            sessionStorage.setItem('refresh_token', refreshToken);

            alert('환영합니다!');
            window.location.href = '/'; // 메인 페이지로 리다이렉트
          } else {
            // 토큰이 없는 경우 처리
            throw new Error('인증 토큰을 받지 못했습니다.');
          }

        } catch (err) {
          setError('로그인에 실패했습니다. 다시 시도해주세요.');
          console.error('로그인 오류:', err);
        } finally {
          setIsLoading(false);
        }
      };

  return (
      <div className="center">
        <div className="login_wrap col-flex align-center justify-center ">
          {error && (
              <div className="">
                {error}
              </div>
          )}

          <form className="login_form mt-8 " onSubmit={handleSubmit}>
            <div className="col-flex gap-10 ">
              <div>
                <label htmlFor="email" className="gmarket-medium fc-888"
                      >
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
                <label htmlFor="password"
                       className="gmarket-medium fc-888">
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

              <div className="flex align-center">
                <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className=""
                />
                <label htmlFor="remember-me" className="ws-nowrap
                gmarket-medium fs-14 ml-2 ">
                  로그인 상태 유지
                </label>
              </div>

              <div className="forgot_pw gmarket-medium fs-14 fc-888">
                <a href="#" className="">
                  비밀번호를 잊으셨나요?
                </a>
              </div>

            </div>

            <div>
              <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-center w-100 login_submit_btn mt-10
                  gmarket-medium fs-18 fc-ccc"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>

          <div className="mt-6">

            {/*sns 로그인 api*/}

            {/*<div className="relative">*/}
            {/*  <div className="absolute flex align-center">*/}
            {/*    <div className=""></div>*/}
            {/*  </div>*/}
            {/*  <div className="relative flex justify-center ">*/}
            {/*    <span className="bg-white gmarket-medium">또는</span>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*<div className="">*/}
            {/*  <button*/}
            {/*      type="button"*/}
            {/*      className=""*/}
            {/*  >*/}
            {/*    <span>Google로 계속</span>*/}
            {/*  </button>*/}
            {/*  <button*/}
            {/*      type="button"*/}
            {/*      className=""*/}
            {/*  >*/}
            {/*    <span>Apple로 계속</span>*/}
            {/*  </button>*/}
            {/*</div>*/}


          </div>

          <div className="txt-center mt-4">
            <p className="gmarket-medium fs-14 fc-888">
              계정이 없으신가요?{' '}
              <a href="/signup" className="gmarket-medium fs-14 fc-black">
                회원가입
              </a>
            </p>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;

function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}
