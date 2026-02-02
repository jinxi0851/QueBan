// @ts-ignore;
import React from 'react';

// 美食图片数据
const foodImages = [{
  url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  name: '健康沙拉',
  tags: ['清淡', '营养']
}, {
  url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  name: '意式披萨',
  tags: ['西餐', '浪漫']
}, {
  url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  name: '精致牛排',
  tags: ['经典', '美味']
}, {
  url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  name: '日式便当',
  tags: ['精致', '可爱']
}, {
  url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
  name: '法式甜点',
  tags: ['甜蜜', '治愈']
}, {
  url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  name: '新鲜蔬菜',
  tags: ['健康', '新鲜']
}];
export function FoodGallery() {
  return <div className="px-6 mb-6 animate-fadeIn" style={{
    animationDelay: '0.15s'
  }}>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {foodImages.map((food, index) => <div key={index} className="flex-shrink-0 w-40 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <div className="relative">
              <img src={food.url} alt={food.name} className="w-full h-28 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm font-medium truncate">{food.name}</p>
                <div className="flex gap-1 mt-1">
                  {food.tags.map((tag, tagIndex) => <span key={tagIndex} className="text-xs text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>)}
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}