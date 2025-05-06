// src/components/auth/FindPwEmail.tsx

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { User, Eye, EyeOff, Send, KeyRound, Mail } from 'lucide-react';
import axios from 'axios';
import { PasswordResetProps, PasswordResetData, VerificationData, NewPasswordData } from '../../types/auth';
import InputField from './InputField';

const FindPwEmail: React.FC<PasswordResetProps> = ({ onSuccess, onError }) => {
  // 단계 관리 (1: 이메일 입력, 2: 인증번호 입력, 3: 새 비밀번호 설정)
  const [step, setStep] = useState<number>(1);

  // 이메일 상태
  const [email, setEmail] = useState<string>('');
  const [emailValid, setEmailValid] = useState<boolean>(true);

  // 인증번호 상태
  const [verificationCode, setVerificationCode] = useState<string>('');

  // 새 비밀번호 상태
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // 이메일 유효성 검사
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    setEmailValid(regex.test(inputEmail));
  };

  // 인증번호 입력 처리
  const handleVerificationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  // 새 비밀번호 입력 처리
  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputPassword = e.target.value;
    setNewPassword(inputPassword);

    // 비밀번호 유효성 검사 (특수문자, 숫자, 영문자 포함 8자 이상)
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    setPasswordValid(regex.test(inputPassword));

    // 비밀번호 일치 여부 검사
    if (confirmPassword) {
      setPasswordsMatch(inputPassword === confirmPassword);
    }
  };

  // 비밀번호 확인 입력 처리
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputConfirmPassword = e.target.value;
    setConfirmPassword(inputConfirmPassword);
    setPasswordsMatch(newPassword === inputConfirmPassword);
  };

  // 이메일 검증 요청 처리
  const handleRequestVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailValid || !email) {
      setError('유효한 이메일을 입력해주세요.');
      if (onError) onError('유효한 이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 이메일 존재 여부 확인 및 인증 요청 API 호출
      const data: PasswordResetData = { email };
      await axios.post('/api/v1/auth/request-reset', data);

      // 성공 시 다음 단계로 이동
      setStep(2);
    } catch (err) {
      const errorMsg = '해당 이메일을 찾을 수 없습니다.';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      console.error('비밀번호 찾기 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 확인 처리
  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!verificationCode) {
      setError('인증번호를 입력해주세요.');
      if (onError) onError('인증번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 인증번호 확인 API 호출
      const data: VerificationData = { email, code: verificationCode };
      await axios.post('/api/v1/auth/verify-code', data);

      // 성공 시 다음 단계로 이동
      setStep(3);
    } catch (err) {
      const errorMsg = '인증번호가 올바르지 않습니다.';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      console.error('인증번호 확인 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 새 비밀번호 설정 처리
  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordValid) {
      setError('비밀번호는 특수문자, 숫자, 영문자를 포함하여 8자 이상이어야 합니다.');
      if (onError) onError('비밀번호는 특수문자, 숫자, 영문자를 포함하여 8자 이상이어야 합니다.');
      return;
    }

    if (!passwordsMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      if (onError) onError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 새 비밀번호 설정 API 호출
      const data: NewPasswordData = {
        email,
        verificationCode,
        newPassword
      };
      await axios.post('/api/v1/auth/reset-password', data);

      // 성공 시 콜백 호출
      if (onSuccess) {
        onSuccess();
      } else {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        window.location.href = '/login';
      }
    } catch (err) {
      const errorMsg = '비밀번호 변경에 실패했습니다.';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      console.error('비밀번호 변경 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 단계에 따른 폼 렌더링
  return (
      <div className="findpw_form_container">
        {step === 1 && (
            <form className="login_form mt-8" onSubmit={handleRequestVerification}>
              <div className="col-flex gap-10">
                <InputField
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="name@example.com"
                    icon={<Mail />}
                    label="이메일"
                    required
                    autoComplete="email"
                />
              </div>

              {error && <div className="error-message mt-2">{error}</div>}

              <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-center w-100 login_submit_btn mt-10 gmarket-medium fs-18 fc-ccc"
                >
                  {isLoading ? '처리 중...' : '인증번호 요청'}
                </button>
              </div>
            </form>
        )}

        {step === 2 && (
            <form className="login_form mt-8" onSubmit={handleVerifyCode}>
              <div className="col-flex gap-10">
                <InputField
                    id="verification"
                    name="verification"
                    type="text"
                    value={verificationCode}
                    onChange={handleVerificationChange}
                    placeholder="인증번호 6자리"
                    icon={<Send />}
                    label="인증번호"
                    required
                />
              </div>

              {error && <div className="error-message mt-2">{error}</div>}

              <div className="mt-4 email-sent-message">
                <p className="gmarket-medium fs-14 fc-888">
                  {email}로 인증번호가 발송되었습니다.
                </p>
              </div>

              <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-center w-100 login_submit_btn mt-10 gmarket-medium fs-18 fc-ccc"
                >
                  {isLoading ? '처리 중...' : '인증번호 확인'}
                </button>
              </div>
            </form>
        )}

        {step === 3 && (
            <form className="login_form mt-8" onSubmit={handleResetPassword}>
              <div className="col-flex gap-10">
                <InputField
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    placeholder="••••••••"
                    icon={<KeyRound />}
                    label="새 비밀번호"
                    required
                    rightIcon={showPassword ? <EyeOff /> : <Eye />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                />

                <InputField
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="••••••••"
                    icon={<KeyRound />}
                    label="비밀번호 확인"
                    required
                />
              </div>

              {!passwordValid && newPassword && (
                  <div className="validation-message mt-2">
                    <p className="gmarket-medium fs-14 fc-red">
                      비밀번호는 특수문자, 숫자, 영문자를 포함하여 8자 이상이어야 합니다.
                    </p>
                  </div>
              )}

              {!passwordsMatch && confirmPassword && (
                  <div className="validation-message mt-2">
                    <p className="gmarket-medium fs-14 fc-red">
                      비밀번호가 일치하지 않습니다.
                    </p>
                  </div>
              )}

              {error && <div className="error-message mt-2">{error}</div>}

              <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-center w-100 login_submit_btn mt-10 gmarket-medium fs-18 fc-ccc"
                >
                  {isLoading ? '처리 중...' : '비밀번호 변경'}
                </button>
              </div>
            </form>
        )}
      </div>
  );
};

export default FindPwEmail;