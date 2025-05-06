import { User, ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAppSelector } from '../../redux/hooks';

export default function Logo() {
  const navigate = useNavigate();
    const { isLoggedIn } = useAppSelector((state) => state.auth);

  const handleUserClick = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    } else {
      navigate('/login');
    }
  };

  return (
      <>
        <h1 className="w-100 row-flex align-end between mb-2">
          <a href="/" className="montserrat-extra-bold fs-30 txt-center">
            Yummy
            <br />
            Market
          </a>
          <div className="row-flex-center gap-10 hd_nav">
            <div className="row-flex-center gap-3">
              <div className="user_icon pointer" onClick={handleUserClick}>
                <User />
              </div>
              {/*<a href="" className="gmarket-medium fs-18 ">로그인</a>*/}
            </div>
            <div className="row-flex-center gap-3">
              <div className="cart_icon pointer">
                <Heart />
              </div>
              {/*<a href="" className="gmarket-medium fs-18 ">찜한상품</a>*/}
            </div>

            <div className="row-flex-center gap-3">
              <div className="cart_icon pointer">
                <ShoppingCart />
              </div>
              {/*<a href="" className="gmarket-medium fs-18 ">장바구니</a>*/}
            </div>
          </div>
        </h1>
      </>
  );
}