import React, {useState, FormEvent, ChangeEvent, useEffect} from 'react';
import {Eye, EyeOff, LogIn, User, Lock, Check, AlertTriangle, Phone, MapPinCheckInside} from 'lucide-react';
import '../styles/login.css'
import axios from 'axios';
import { DaumPostcodeData } from '../types/daum';

const SignupPage = () => {
  const [name, setName] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
  const [zip, setZip] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [etc, setEtc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);


// 비밀번호 핸들링
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const inputPassWord: string = e.target.value;
    setPassword(inputPassWord);
  }

// 비밀번호 확인 핸들링
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const confirmValue = e.target.value;
    setConfirmPassword(confirmValue);
    setPasswordMatch(password === confirmValue);
  }


// 회원가입핸들링
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!passwordMatch){
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if(!name || !email || !password || !tel){
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    const userData = {
      name,
      email,
      password,
      tel,
      address:{
        zip, street, etc
      }
    };

    try {
      // 로딩 상태 활성화
      setIsLoading(true);
      setError('');

      // 회원가입 요청 보내기 (백엔드 API 엔드포인트로 전송)
      console.log('회원가입 데이터:', userData);
      // 슬래시로 시작하는 엔드포인트 사용 (프록시 설정과 함께 작동)
      const response = await axios.post('/api/v1/user/signUp', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // 성공적인 응답 처리
      if (response.status === 200 || response.status === 201) {
        // 회원가입 성공 - 로그인 페이지로 리다이렉트 또는 성공 메시지 표시
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
      }
    } catch (err:any) {
      // 오류 응답 처리
      console.error('회원가입 오류:', err);
      setError(
          err.response?.data?.message ||
          '회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 다음 주소 api
  const sample6_execDaumPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data: DaumPostcodeData) {
          // 나머지 코드는 동일
          let addr = '';

          if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
          } else {
            addr = data.jibunAddress;
          }

          setZip(data.zonecode);
          setStreet(addr);

          // null 체크 추가
          const detailAddrInput = document.getElementById("detailAddress");
          if (detailAddrInput) {
            detailAddrInput.focus();
          }
        }
      }).open();
    } else {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  }

  return (
      <div className="center">
        <div className="login_wrap col-flex align-center justify-center">
          {/* 에러 메시지 표시 */}
          <form className="login_form mt-8" onSubmit={handleSubmit}>
            <div className="col-flex gap-10">
              <div>
                <label htmlFor="email" className="su-medium fc-888">
                  이름
                </label>
                <div className="relative input_wrap row-flex-center between relative mt-1">
                  <div className="absolute flex m-align-center pl-3">
                    <User className=""/>
                  </div>
                  <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setName(e.target.value)}
                      className="block pl-15 pr-3 su-regular fs-18"
                      placeholder="이름을 입력해주세요."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="su-medium fc-888">
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
                      className="block pl-15 pr-3 su-regular fs-18"
                      placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password"
                       className="su-medium fc-888">
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
                      onChange={handlePassword}
                      className="block pl-15 pr-3 su-regular fs-18"
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
                      className="block pl-15 pr-3 su-regular fs-18"
                      placeholder="비밀번호 확인"
                  />
                  <button
                      type="button"
                      className="absolute flex align-center pr-3 pl-3 eye_icon"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {confirmPassword && passwordMatch ? (
                        <Check className="fc-green"/>
                    ) : (
                        <AlertTriangle className="fc-red"/>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="su-medium fc-888">
                  연락처
                </label>
                <div className="relative input_wrap row-flex-center between relative mt-1">
                  <div className="absolute flex m-align-center pl-3">
                    <Phone className=""/>
                  </div>
                  <input
                      id="tel"
                      name="tel"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={tel}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTel(e.target.value)}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const value = e.currentTarget.value;
                        e.currentTarget.value = value.replace(/[^0-9]/g, '');
                      }}
                      className="block pl-15 pr-3 su-regular fs-18"
                      placeholder="연락처를 입력해주세요."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="su-medium fc-888">주소(선택)</label>
                <div className="row-flex-center gap-10 mt-1">
                  <div className="input_wrap row-flex-center between">
                    <input
                        id="sample6_postcode"
                        type="text"
                        value={zip}
                        readOnly
                        placeholder="우편번호"
                        className="block pr-3 su-regular fs-18"
                        style={{width: '280px'}}
                    />
                    <button
                        type="button"
                        onClick={sample6_execDaumPostcode}
                        className="search_btn su-medium fs-14"
                        style={{
                          width: '108px', marginLeft: '10px', height: '50px', background: "#f6f6f6",
                          borderRadius: '5px', border: ' 1px solid #d7d7d7',
                        }}
                    >
                      우편번호찾기
                    </button>
                  </div>
                </div>

                <div className="relative input_wrap row-flex-center between mt-1">
                  <input
                      id="sample6_address"
                      type="text"
                      value={street}
                      readOnly
                      placeholder="주소"
                      className="block pr-3 su-regular fs-18"
                  />
                </div>

                <div className="relative input_wrap row-flex-center between mt-1">
                  <input
                      id="detailAddress"
                      type="text"
                      value={etc}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEtc(e.target.value)}
                      placeholder="상세주소"
                      className="block pr-3 su-regular fs-18"
                  />
                </div>
              </div>

              {error && (
                  <div className="error-message mt-2 fc-red su-regular fs-14">
                    {error}
                  </div>
              )}

              <button
                  type="submit"
                  disabled={isLoading}
                  className="join_submit_btn bd-radius-5 su-medium fs-18">
                {isLoading ? '처리 중...' : '회원가입'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            {/* SNS 로그인 API 주석 처리 부분 */}
          </div>
        </div>
      </div>
  );
}; 

export default SignupPage;