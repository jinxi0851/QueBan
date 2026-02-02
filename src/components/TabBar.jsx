// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, Square, User } from 'lucide-react';

export default function TabBar({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: Home
  }, {
    id: 'square',
    label: '广场',
    icon: Square
  }, {
    id: 'profile',
    label: '我的',
    icon: User
  }];
  return <div style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid #FFECD9',
    padding: '12px 24px',
    zIndex: 9999
  }}>
      <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: isActive ? '#FF6B6B' : '#636E72',
          transition: 'all 0.3s ease'
        }}>
              <Icon size={24} style={{
            transform: isActive ? 'scale(1.1)' : 'scale(1)'
          }} />
              <span style={{
            fontSize: '12px',
            fontWeight: isActive ? '600' : '400'
          }}>
                {tab.label}
              </span>
            </button>;
      })}
      </div>
    </div>;
}