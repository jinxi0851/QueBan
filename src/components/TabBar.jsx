// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, Grid3X3, User } from 'lucide-react';

export default function TabBar(props) {
  const {
    $w
  } = props;
  const {
    navigateTo
  } = $w.utils;
  const tabs = [{
    id: 'home',
    label: '首页',
    icon: Home,
    pageId: 'home'
  }, {
    id: 'square',
    label: '广场',
    icon: Grid3X3,
    pageId: 'square'
  }, {
    id: 'profile',
    label: '我的',
    icon: User,
    pageId: 'profile'
  }];
  const handleTabClick = pageId => {
    navigateTo({
      pageId,
      params: {}
    });
  };

  // 获取当前页面ID
  const getCurrentPageId = () => {
    const path = window.location.pathname;
    if (path.includes('/home')) return 'home';
    if (path.includes('/square')) return 'square';
    if (path.includes('/profile')) return 'profile';
    return 'home'; // 默认首页
  };
  const currentPageId = getCurrentPageId();
  return <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[#FFECD9] px-4 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentPageId === tab.pageId;
        return <button key={tab.id} onClick={() => handleTabClick(tab.pageId)} className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${isActive ? 'text-[#FF6B6B] bg-gradient-to-t from-[#FF9A8B]/20 to-transparent' : 'text-[#636E72] hover:text-[#FF6B6B] hover:bg-[#FFECD9]/50'}`}>
              <Icon className={`w-6 h-6 ${isActive ? 'text-[#FF6B6B]' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-[#FF6B6B]' : ''}`}>
                {tab.label}
              </span>
            </button>;
      })}
      </div>
    </div>;
}