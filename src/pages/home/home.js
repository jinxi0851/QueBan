// 首页逻辑
const app = getApp();

Page({
  data: {
    menu: null,
    loading: false,
    isLiked: false,
    user: null,
    remainingCount: 5,
    sweetMessage: '',
    dailyImage: ''
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.checkUserStatus();
  },

  initPage() {
    // 初始化页面数据
    this.setData({
      dailyImage: 'https://cersay-0gtnza71ab2663d4-1397510798.tcloudbaseapp.com/resources/2026-02/lowcode-2424451'
    });
    this.loadMenu();
  },

  checkUserStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ user: userInfo });
    }
  },

  // 生成菜单
  async generateMenu() {
    if (this.data.remainingCount <= 0) {
      wx.showToast({
        title: '今日次数已用完',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    try {
      // 模拟菜单生成
      const menuDatabase = this.getMenuDatabase();
      const randomMenu = menuDatabase[Math.floor(Math.random() * menuDatabase.length)];
      
      this.setData({
        menu: randomMenu,
        remainingCount: this.data.remainingCount - 1,
        sweetMessage: this.getRandomSweetMessage()
      });

      // 保存到本地存储
      this.saveMenuToHistory(randomMenu);

    } catch (error) {
      console.error('生成菜单失败:', error);
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 获取菜单数据库
  getMenuDatabase() {
    return [
      {
        name: '温馨家常套餐',
        dishes: [
          { name: '番茄炒蛋', tags: ['家常', '快手'], difficulty: '简单', time: '10分钟' },
          { name: '蒜蓉西兰花', tags: ['清淡', '健康'], difficulty: '简单', time: '8分钟' },
          { name: '冬瓜排骨汤', tags: ['汤品', '营养'], difficulty: '简单', time: '1小时' }
        ],
        tags: ['家常', '营养', '温馨'],
        totalTime: '1小时20分钟'
      },
      {
        name: '经典下饭菜',
        dishes: [
          { name: '红烧肉', tags: ['经典', '下饭'], difficulty: '中等', time: '45分钟' },
          { name: '麻婆豆腐', tags: ['川菜', '下饭'], difficulty: '简单', time: '20分钟' },
          { name: '白灼菜心', tags: ['清淡', '快手'], difficulty: '简单', time: '5分钟' }
        ],
        tags: ['经典', '下饭', '川菜'],
        totalTime: '1小时10分钟'
      }
      // 可以添加更多菜单...
    ];
  },

  // 获取随机俏皮话
  getRandomSweetMessage() {
    const messages = [
      '今天辛苦啦，给你做顿好吃的~',
      '这道菜超适合今天的你！',
      '为你准备的专属菜单，请查收~',
      '吃饭啦吃饭啦，不许挑食哦~',
      '今天的菜单，是为你量身定制的！'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  // 保存菜单到历史记录
  saveMenuToHistory(menu) {
    const history = wx.getStorageSync('menuHistory') || [];
    history.unshift({
      ...menu,
      createTime: new Date().toISOString()
    });
    // 只保留最近20条记录
    if (history.length > 20) {
      history.splice(20);
    }
    wx.setStorageSync('menuHistory', history);
  },

  // 点赞功能
  toggleLike() {
    if (!this.data.user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    this.setData({
      isLiked: !this.data.isLiked
    });

    wx.showToast({
      title: this.data.isLiked ? '已点赞' : '取消点赞',
      icon: 'success'
    });
  },

  // 分享菜单
  shareMenu() {
    if (!this.data.menu) {
      wx.showToast({
        title: '请先生成菜单',
        icon: 'none'
      });
      return;
    }

    wx.showShareMenu({
      withShareTicket: true
    });
  },

  // 跳转到我的拿手菜
  navigateToMyDishes() {
    wx.navigateTo({
      url: '/pages/my-dishes/my-dishes'
    });
  },

  // 跳转到广场
  navigateToSquare() {
    wx.switchTab({
      url: '/pages/square/square'
    });
  }
});