import React, {useState, useEffect} from 'react';
import {Eye, EyeOff, LogIn, User, Lock} from 'lucide-react';


export default function Mynav() {


  return (
      <>
        <div className="my-side-nav bd-d7 w-20  pt-1 pb-1">
          <div className="col-flex flex-center gmarket-medium fs-18 ">

            <div className="my-side-nav_1 col-flex flex-center  bd-bottom-d7 gap-5 mb-2">
              <a href="">주문내역</a>
              <a href="">장바구니</a>
              <a href="">찜한상품</a>
              <a href="">취소/환불내역</a>
            </div>

            <div className="my-side-nav_1 col-flex flex-center bd-bottom-d7 gap-5 mb-2" >
              <a href="">회원정보</a>
              <a href="">배송지주소관리</a>
            </div>

            <div className="my-side-nav_1 col-flex flex-center gap-5">
              <a href="">문의내역</a>
              <a href="">고객센터</a>
            </div>
          </div>
        </div>
      </>
  );

}