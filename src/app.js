// 小程序入口文件
App({
  onLaunch(options) {
    // 小程序启动时的初始化
    this.initApp();
  },

  initApp() {
    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  // 全局数据
  globalData: {
    userInfo: null,
    activeTab: 'home'
  }
});