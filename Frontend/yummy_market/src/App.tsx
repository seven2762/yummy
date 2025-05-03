import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import './App.css';
import './styles/font.css'
import './styles/default.css'
import './styles/common.css'
import './styles/common_components.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import HeaderComp from "./components/header/Header";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";

function App() {
  return (
      <BrowserRouter>
        {/* 헤더 컴포넌트를 Routes 외부에 배치하여 모든 페이지에 표시 */}
        <HeaderComp />
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/mypage' element={<Mypage />} />
        </Routes>

      </BrowserRouter>

  );
}

export default App;
