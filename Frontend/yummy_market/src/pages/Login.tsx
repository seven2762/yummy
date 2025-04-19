import React, {useState, FormEvent} from 'react';
import {Eye, EyeOff, LogIn, User, Lock} from 'lucide-react';
import '../styles/login.css'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit =
      async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
          setError('이메일과 비밀번호를 모두 입력해주세요.');
          return;
        }

        setIsLoading(true);

        // 실제 로그인 로직을 여기에 구현합니다
        // API 호출이나 인증 로직 등을 추가할 수 있습니다
        try {
          // API 호출을 시뮬레이션합니다
          await new Promise(resolve => setTimeout(resolve, 1500));
          console.log('로그인 시도:', {email});

          // 성공 메시지 (실제 구현에서는 리다이렉트 등의 로직으로 대체)
          alert('로그인 성공!');
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEmail(e.target.value)}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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