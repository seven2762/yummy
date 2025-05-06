// src/pages/FindPassword.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FindPwPhone from '../components/login/FindPwPhone';
import FindPwEmail from '../components/login/FindPwEmail';
import '../styles/login.css';

const FindPw = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // 탭 상태 추가 ('email' 또는 'phone')
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  const handleSuccess = () => {
    setSuccess(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: 'email' | 'phone') => {
    setActiveTab(tab);
  };


  return (
      <div className="center">
        <div className="login_wrap col-flex align-center justify-center">
          <h2 className="gmarket-medium fs-24 fc-black">비밀번호 찾기</h2>

          {/* 탭 UI 추가 */}
          <div className="tabs-container row-flex w-100 mt-6">
            <button
                className={`tab-button ${activeTab === 'email' ? 'active-tab' : ''} fs-16 gmarket-medium w-50`}
                onClick={() => handleTabChange('email')}
            >
              이메일로 찾기
            </button>
            <button
                className={`tab-button ${activeTab === 'phone' ? 'active-tab' : ''} fs-16 gmarket-medium w-50`}
                onClick={() => handleTabChange('phone')}
            >
              휴대폰 인증
            </button>
          </div>

          {success ? (
              <div className="success-container col-flex align-center justify-center">
                <div className="success-message mt-4">
                  <p className="gmarket-medium fs-18 fc-black">
                    비밀번호가 성공적으로 변경되었습니다.
                  </p>
                </div>

                <Link to="/login" className="flex-center w-100 login_submit_btn mt-10 gmarket-medium fs-18 fc-ccc">
                  로그인 페이지로 이동
                </Link>
              </div>
          ) : (
              <>
                {activeTab === 'email' ? (
                    <FindPwEmail onSuccess={handleSuccess} onError={handleError} />
                ) : (
                    <FindPwPhone />
                )}
              </>
          )}

          <div className="txt-center mt-4">
            <p className="gmarket-medium fs-14 fc-888">
              계정이 기억나셨나요?{' '}
              <Link to="/login" className="gmarket-medium fs-14 fc-black">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default FindPw;