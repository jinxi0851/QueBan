// @ts-ignore;
import React, { useState, useEffect } from 'react';

import Home from './pages/home';
import Square from './pages/square';
import Profile from './pages/profile';
import { TabBar } from './components/TabBar';
export default function App(props) {
  const [activeTab, setActiveTab] = useState('home');
  const renderPage = () => {
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
  return <div className="min-h-screen">
      {renderPage()}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>;
}