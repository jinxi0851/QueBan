// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, Square, User } from 'lucide-react';

export function TabBar({
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
  return <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-[#FFECD9] px-6 py-3 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-[#FF6B6B]' : 'text-[#636E72]'}`}>
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>;
      })}
      </div>
    </div>;
}
export default TabBar;