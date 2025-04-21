import React, {useState, FormEvent, ChangeEvent} from 'react';
import {Eye, EyeOff, LogIn, User, Lock, Check, AlertTriangle} from 'lucide-react';
import '../styles/login.css'


const SignupPage = () => {
  const [name, setName] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);


  const [zip, setZip] = useState<string>('');
  const [addr1, setAddr1] = useState<string>('');
  const [addr2, setAddr2] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

const handlePassword = (e:ChangeEvent<HTMLInputElement>) =>{
  const inputPassWord: string =e.target.value;
  setPassword(inputPassWord);
}

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>{
    const confirmValue = e.target.value;
    setConfirmPassword(confirmValue);
    setPasswordMatch(password === confirmValue);
  }

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
                      onChange= {handlePassword}
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

                <div className="relative input_wrap row-flex-center between mt-1">
                  <div className="absolute flex m-align-center pl-3">
                    <Lock className="bg-white fc-ccc"/>
                  </div>
                  <input
                      id="confirm-password"
                      name="confirm-passowrd"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className="block pl-15 pr-3 prt-regular fs-18"
                      placeholder="비밀번호 확인"
                  />
                  <button
                      type="button"
                      className="absolute flex align-center pr-3 pl-3 eye_icon"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {confirmPassword  && passwordMatch ? (
                        <Check className="fc-green"/>
                    ) : (
                        <AlertTriangle className="fc-red"/>
                    )}
                  </button>
                </div>
              </div>
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


        </div>
      </div>
  );
};

export default SignupPage;