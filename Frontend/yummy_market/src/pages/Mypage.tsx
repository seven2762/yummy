
import React from "react";
import Profile from "../components/mypage/Profile";
import Mynav from "../components/mypage/Mynav";
import MyContents from "../components/mypage/MyContents";

import '../styles/mypage.css'


export default function Mypage(){
  return(
      <>
        <div className="my-page pt-5 pb-5" >
          <Profile/>

          <div className="center">
            <Mynav/>
            <MyContents />
          </div>
        </div>

      </>
  );
}