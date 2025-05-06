import React, { useState } from 'react';
import '../styles/login.css';
import LoginForm from '../components/login/LoginForm';

const LoginPage = () => {
  const [error, setError] = useState('');


  // 로그인 성공시
  const handleLoginSuccess = () => {
    alert('환영합니다!');
    window.location.href = '/';
  };

  // 에러 발생 메시지
  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
      <div className="center">
        <div className="login_wrap col-flex align-center justify-center">
          {error && <div className="">{error}</div>}

          <LoginForm
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
          />

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