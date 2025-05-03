import React, {useState, useEffect} from 'react';
import {Eye, EyeOff, LogIn, User, Lock} from 'lucide-react';


export default function Profile(){


  return(
      <>
        <div className="center mb-4">
          <div className="my-profile row-flex-center
          flex-wrap between">

            <span className="gmarket-medium fs-28 ">
조은별 님 , 반갑습니다.
          </span>

            <div className="">
              <div className="row-flex-center gap-5 gmarket-medium fs-20">
                최근주문내역
                <button className="my_profile_btn gmarket-medium fs-16 on ">이번주</button>
                <button className="my_profile_btn gmarket-medium fs-16">최근3개월</button>
                <button className="my_profile_btn gmarket-medium fs-16">최근6개월</button>
                <button className="my_profile_btn gmarket-medium fs-16">상세조회</button>
              </div>
            </div>

          </div>

        </div>

      </>
  );

}