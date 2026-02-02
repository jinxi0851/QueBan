// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, Square, User, X, Menu } from 'lucide-react';

export default function SideNav({
  activeTab,
  onTabChange,
  isOpen,
  onToggle
}) {
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: Home,
    description: '随机菜单生成'
  }, {
    id: 'square',
    label: '广场',
    icon: Square,
    description: '分享菜单广场'
  }, {
    id: 'profile',
    label: '我的',
    icon: User,
    description: '个人中心'
  }];
  return <>
      {/* 汉堡菜单按钮 */}
      <button onClick={onToggle} style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 10001,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }} onMouseEnter={e => {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
    }} onMouseLeave={e => {
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }}>
        <Menu size={24} color="#FF6B6B" />
      </button>

      {/* 遮罩层 */}
      {isOpen && <div onClick={onToggle} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 10000,
      opacity: 0,
      animation: 'fadeIn 0.3s ease forwards'
    }} />}

      {/* 侧边导航 */}
      <div style={{
      position: 'fixed',
      top: 0,
      left: isOpen ? 0 : '-300px',
      width: '280px',
      height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid #FFECD9',
      zIndex: 10001,
      transition: 'left 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
        {/* 头部 */}
        <div style={{
        padding: '20px',
        borderBottom: '1px solid #FFECD9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
          <h2 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#2D3436'
        }}>
            导航菜单
          </h2>
          <button onClick={onToggle} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '8px',
          transition: 'all 0.2s ease'
        }} onMouseEnter={e => {
          e.target.style.backgroundColor = '#FFECD9';
        }} onMouseLeave={e => {
          e.target.style.backgroundColor = 'transparent';
        }}>
            <X size={20} color="#636E72" />
          </button>
        </div>

        {/* 导航项 */}
        <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
          {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return <button key={tab.id} onClick={() => {
            onTabChange(tab.id);
            onToggle();
          }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            backgroundColor: isActive ? '#FFECD9' : 'transparent',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            color: isActive ? '#FF6B6B' : '#2D3436'
          }} onMouseEnter={e => {
            if (!isActive) {
              e.target.style.backgroundColor = '#FFECD9';
              e.target.style.transform = 'translateX(4px)';
            }
          }} onMouseLeave={e => {
            if (!isActive) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'translateX(0)';
            }
          }}>
                <Icon size={24} style={{
              color: isActive ? '#FF6B6B' : '#636E72',
              transform: isActive ? 'scale(1.1)' : 'scale(1)'
            }} />
                <div>
                  <div style={{
                fontSize: '16px',
                fontWeight: isActive ? '600' : '500',
                marginBottom: '2px'
              }}>
                    {tab.label}
                  </div>
                  <div style={{
                fontSize: '12px',
                color: '#636E72'
              }}>
                    {tab.description}
                  </div>
                </div>
              </button>;
        })}
        </div>

        {/* 底部信息 */}
        <div style={{
        padding: '20px',
        borderTop: '1px solid #FFECD9',
        textAlign: 'center'
      }}>
          <div style={{
          fontSize: '12px',
          color: '#636E72',
          marginBottom: '8px'
        }}>
            美味菜单生成器
          </div>
          <div style={{
          fontSize: '10px',
          color: '#B2BEC3'
        }}>
            v1.0.0
          </div>
        </div>
      </div>
    </>;
}