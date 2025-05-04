import React, { useState } from 'react';
import axios from 'axios';

const TokenRefreshTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 토큰 갱신 테스트
// 토큰 갱신 테스트
  const testTokenRefresh = async () => {
    setLoading(true);
    setResult('토큰 갱신 테스트 중...');

    try {
      // 세션 스토리지에서 리프레시 토큰 가져오기
      const refreshToken = sessionStorage.getItem('refresh_token');

      if (!refreshToken) {
        setResult('오류: 리프레시 토큰이 없습니다. 먼저 로그인하세요.');
        setLoading(false);
        return;
      }

      // 토큰 갱신 요청 - 헤더에 리프레시 토큰 포함
      console.log('리프레시 토큰으로 갱신 요청 시작:', refreshToken);

      const response = await axios.post('/api/v1/auth/refresh', {}, {
        headers: {
          'Content-Type': 'application/json',
          'Refresh-Token': refreshToken
        }
      });

      // 응답 확인
      console.log('갱신 응답:', response.data);

      if (response.data.accessToken) {
        // 새 토큰 저장
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        sessionStorage.setItem('auth_token', newAccessToken);
        sessionStorage.setItem('refresh_token', newRefreshToken);

        setResult('성공: 토큰이 갱신되었습니다!\n' +
            '이전 토큰: ' + refreshToken.substring(0, 10) + '...\n' +
            '새 토큰: ' + newAccessToken.substring(0, 10) + '...');
      } else {
        setResult('오류: 서버에서 새 토큰을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      setResult(`토큰 갱신 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  // 보호된 API 호출 테스트
  const testProtectedApi = async () => {
    setLoading(true);
    setResult('보호된 API 테스트 중...');

    try {
      // 액세스 토큰 가져오기
      const accessToken = sessionStorage.getItem('auth_token');

      if (!accessToken) {
        setResult('오류: 액세스 토큰이 없습니다. 먼저 로그인하세요.');
        setLoading(false);
        return;
      }

      // 보호된 API 호출
      const response = await axios.get('/api/v1/auth/test-auth', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      setResult('성공: 보호된 API 호출 성공!\n응답: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('API 호출 실패:', error);
      setResult(`API 호출 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="token-test mt-5 p-4 border rounded">
        <h3 className="mb-3">토큰 관리 테스트</h3>

        <div className="d-flex gap-3 mb-3">
          <button
              onClick={testTokenRefresh}
              disabled={loading}
              className="gmarket-medium fs-14 login_submit_btn"
          >
            {loading ? '처리 중...' : '토큰 수동 갱신 테스트'}
          </button>

          <button
              onClick={testProtectedApi}
              disabled={loading}
              className="gmarket-medium fs-14 login_submit_btn"
          >
            {loading ? '처리 중...' : '보호된 API 호출 테스트'}
          </button>
        </div>

        {result && (
            <div className="mt-3 p-3 border rounded bg-light">
              <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
            </div>
        )}
      </div>
  );
};

export default TokenRefreshTest;