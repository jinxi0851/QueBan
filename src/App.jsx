// @ts-ignore;
import React, { useState, useEffect } from 'react';

import Home from './pages/home';
import Square from './pages/square';
import Profile from './pages/profile';
import Login from './pages/login';
import { TabBar } from './components/TabBar';
export default function App(props) {
  const [activeTab, setActiveTab] = useState('home');
  const renderPage = () => {
    // 检查是否是登录页面
    if (props.$w?.page?.dataset?.params?.pageId === 'login') {
      return <Login {...props} />;
    }
    switch (activeTab) {
      case 'home':
        return <Home {...props} />;
      case 'square':
        return <Square {...props} />;
      case 'profile':
        return <Profile {...props} />;
      default:
        return <Home {...props} />;
    }
  };
  // 检查是否是登录页面
  const isLoginPage = props.$w?.page?.dataset?.params?.pageId === 'login';
  return <div className="min-h-screen">
      {renderPage()}
      {!isLoginPage && <TabBar activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>;
}