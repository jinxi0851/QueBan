// 广场页面逻辑
const app = getApp();

Page({
  data: {
    posts: [],
    loading: true,
    activeTab: 'hot'
  },

  onLoad() {
    this.loadPosts();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadPosts();
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
    this.loadPosts();
  },

  // 加载广场数据
  async loadPosts() {
    this.setData({ loading: true });

    try {
      // 模拟数据加载
      const mockPosts = this.getMockPosts();
      
      // 按标签排序
      let sortedPosts = mockPosts;
      if (this.data.activeTab === 'hot') {
        sortedPosts = mockPosts.sort((a, b) => b.likeCount - a.likeCount);
      } else if (this.data.activeTab === 'new') {
        sortedPosts = mockPosts.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
      }
      
      this.setData({
        posts: sortedPosts
      });
    } catch (error) {
      console.error('加载广场数据失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 获取模拟数据
  getMockPosts() {
    return [
      {
        _id: '1',
        menu: {
          name: '番茄炒蛋',
          tags: ['家常', '快手'],
          difficulty: '简单',
          time: '10分钟',
          message: '今天辛苦啦，给你做顿好吃的~'
        },
        authorName: '小美',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        likeCount: 128,
        commentCount: 23,
        createTime: new Date(Date.now() - 3600000).toISOString(),
        aiComment: '这道菜简单又营养，番茄的酸甜配上嫩滑的鸡蛋，简直是绝配！适合忙碌的工作日快速准备~'
      },
      {
        _id: '2',
        menu: {
          name: '红烧肉',
          tags: ['经典', '下饭'],
          difficulty: '中等',
          time: '45分钟',
          message: '这道菜超适合今天的你！'
        },
        authorName: '大厨阿强',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        likeCount: 256,
        commentCount: 45,
        createTime: new Date(Date.now() - 7200000).toISOString(),
        aiComment: '红烧肉是中华料理的经典！肥而不腻，入口即化，配上热腾腾的米饭，幸福感满满~'
      },
      {
        _id: '3',
        menu: {
          name: '清蒸鲈鱼',
          tags: ['清淡', '营养'],
          difficulty: '简单',
          time: '15分钟',
          message: '为你准备的专属菜单，请查收~'
        },
        authorName: '健康达人',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
        likeCount: 89,
        commentCount: 12,
        createTime: new Date(Date.now() - 10800000).toISOString(),
        aiComment: '清蒸鲈鱼保留了鱼肉的鲜美，低脂高蛋白，是健康饮食的绝佳选择！'
      }
    ];
  },

  // 点赞功能
  toggleLike(e) {
    const postId = e.currentTarget.dataset.postId;
    const userInfo = wx.getStorageSync('userInfo');
    
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    const posts = this.data.posts.map(post => {
      if (post._id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likeCount: isLiked ? post.likeCount + 1 : post.likeCount - 1
        };
      }
      return post;
    });

    this.setData({ posts });

    wx.showToast({
      title: posts.find(p => p._id === postId).isLiked ? '已点赞' : '取消点赞',
      icon: 'success'
    });
  },

  // 收藏功能
  toggleBookmark(e) {
    const postId = e.currentTarget.dataset.postId;
    const userInfo = wx.getStorageSync('userInfo');
    
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    const posts = this.data.posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    });

    this.setData({ posts });

    wx.showToast({
      title: posts.find(p => p._id === postId).isBookmarked ? '已收藏' : '取消收藏',
      icon: 'success'
    });
  },

  // 分享功能
  sharePost(e) {
    const postId = e.currentTarget.dataset.postId;
    const post = this.data.posts.find(p => p._id === postId);
    
    if (!post) return;

    wx.showShareMenu({
      withShareTicket: true
    });

    wx.showToast({
      title: '分享成功',
      icon: 'success'
    });
  },

  // 跳转到评论页面
  navigateToComments(e) {
    const postId = e.currentTarget.dataset.postId;
    wx.navigateTo({
      url: `/pages/comments/comments?postId=${postId}`
    });
  }
});