import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';


export default function Mynav() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');

      if (token) {
        // 로그아웃 API 호출
        await axios.post('/api/v1/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // 세션스토리지에서 토큰 제거
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('refresh_token');

        // 리덕스 상태 업데이트
        dispatch(logout());

        alert('로그아웃되었습니다.');
        navigate('/');
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);

      // 오류가 발생해도 클라이언트 측 로그아웃 처리
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('refresh_token');
      dispatch(logout());

      alert('로그아웃 중 오류가 발생했습니다. 다시 로그인해주세요.');
      navigate('/');
    }
  };

  return (
      <>
        <div className="my-side-nav bd-d7 w-20 pt-1 pb-1">
          <div className="col-flex flex-center gmarket-medium fs-18 ">
            <div className="my-side-nav_1 col-flex flex-center bd-bottom-d7 gap-5 mb-2">
              <a href="/mypage/orders">주문내역</a>
              <a href="/cart">장바구니</a>
              <a href="/wishlist">찜한상품</a>
              <a href="/mypage/refunds">취소/환불내역</a>
            </div>

            <div className="my-side-nav_1 col-flex flex-center bd-bottom-d7 gap-5 mb-2">
              <a href="/mypage/profile">회원정보</a>
              <a href="/mypage/address">배송지주소관리</a>
            </div>

            <div className="my-side-nav_1 col-flex flex-center bd-bottom-d7 gap-5">
              <a href="/mypage/inquiries">문의내역</a>
              <a href="/customer-service">고객센터</a>
            </div>

            <div className="my-side-nav_1 col-flex flex-center gap-5">
              {/* 로그아웃 링크를 버튼으로 변경 */}
              <button
                  onClick={handleLogout}
                  className="logout-button gmarket-medium fs-18"
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </>
  );
}