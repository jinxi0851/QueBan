// 个人中心页面逻辑
const Page = function(config) {
  return config;
};

Page({
  data: {
    user: null,
    stats: {
      totalMenus: 0,
      totalLikes: 0,
      totalShares: 0
    },
    menuHistory: [],
    loading: true
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.loadUserData();
  },

  initPage() {
    this.loadUserData();
  },

  // 加载用户数据
  loadUserData() {
    const userInfo = wx.getStorageSync('userInfo');
    const menuHistory = wx.getStorageSync('menuHistory') || [];
    
    if (userInfo) {
      this.setData({
        user: userInfo,
        menuHistory: menuHistory.slice(0, 10), // 只显示最近10条
        stats: {
          totalMenus: menuHistory.length,
          totalLikes: Math.floor(Math.random() * 100), // 模拟数据
          totalShares: Math.floor(Math.random() * 50) // 模拟数据
        }
      });
    }
    
    this.setData({ loading: false });
  },

  // 跳转到登录页面
  navigateToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 跳转到我的拿手菜
  navigateToMyDishes() {
    wx.navigateTo({
      url: '/pages/my-dishes/my-dishes'
    });
  },

  // 跳转到设置页面
  navigateToSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 跳转到收藏列表
  navigateToFavorites() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 跳转到历史记录
  navigateToHistory() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 清除历史记录
  clearHistory() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('menuHistory');
          this.setData({
            menuHistory: [],
            stats: {
              ...this.data.stats,
              totalMenus: 0
            }
          });
          wx.showToast({
            title: '已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 分享应用
  shareApp() {
    wx.showShareMenu({
      withShareTicket: true
    });
    
    wx.showToast({
      title: '分享成功',
      icon: 'success'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          this.setData({
            user: null,
            menuHistory: [],
            stats: {
              totalMenus: 0,
              totalLikes: 0,
              totalShares: 0
            }
          });
          wx.showToast({
            title: '已退出',
            icon: 'success'
          });
        }
      }
    });
  },

  // 格式化时间
  formatTime(timeStr) {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // 1分钟内
      return '刚刚';
    } else if (diff < 3600000) { // 1小时内
      return Math.floor(diff / 60000) + '分钟前';
    } else if (diff < 86400000) { // 1天内
      return Math.floor(diff / 3600000) + '小时前';
    } else {
      return date.toLocaleDateString();
    }
  }
});