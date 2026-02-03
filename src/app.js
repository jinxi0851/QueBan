// 小程序入口文件
Page({
  data: {
    activeTab: 'home',
    isSideNavOpen: false,
    currentPage: 'home'
  },

  onLoad(options) {
    // 页面加载时的初始化
    this.initApp();
  },

  initApp() {
    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        user: userInfo
      });
    }
  },

  // 切换页面
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab,
      currentPage: tab
    });
  },

  // 切换侧边导航
  toggleSideNav() {
    this.setData({
      isSideNavOpen: !this.data.isSideNavOpen
    });
  },

  // 关闭侧边导航
  closeSideNav() {
    this.setData({
      isSideNavOpen: false
    });
  },

  // 页面跳转
  navigateTo(e) {
    const page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: `/pages/${page}/${page}`
    });
  }
});