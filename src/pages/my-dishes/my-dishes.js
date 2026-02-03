// 拿手菜管理页面逻辑
Page({
  data: {
    dishes: [],
    loading: true,
    user: null,
    showAddForm: false,
    editingDish: null,
    formData: {
      name: '',
      description: '',
      difficulty: '简单',
      time: '',
      ingredients: '',
      steps: '',
      tags: []
    }
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.loadUserDishes();
  },

  initPage() {
    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }, 1500);
      return;
    }
    
    this.setData({ user: userInfo });
    this.loadUserDishes();
  },

  // 加载用户拿手菜
  loadUserDishes() {
    this.setData({ loading: true });
    
    try {
      const userDishes = wx.getStorageSync('userDishes') || [];
      this.setData({
        dishes: userDishes,
        loading: false
      });
    } catch (error) {
      console.error('加载拿手菜失败:', error);
      this.setData({ loading: false });
    }
  },

  // 显示添加表单
  showAddForm() {
    this.setData({
      showAddForm: true,
      editingDish: null,
      formData: {
        name: '',
        description: '',
        difficulty: '简单',
        time: '',
        ingredients: '',
        steps: '',
        tags: []
      }
    });
  },

  // 隐藏表单
  hideForm() {
    this.setData({
      showAddForm: false,
      editingDish: null
    });
  },

  // 编辑拿手菜
  editDish(e) {
    const dishId = e.currentTarget.dataset.dishId;
    const dish = this.data.dishes.find(d => d.id === dishId);
    
    if (dish) {
      this.setData({
        showAddForm: true,
        editingDish: dish,
        formData: {
          name: dish.name,
          description: dish.description,
          difficulty: dish.difficulty,
          time: dish.time,
          ingredients: dish.ingredients,
          steps: dish.steps,
          tags: dish.tags || []
        }
      });
    }
  },

  // 删除拿手菜
  deleteDish(e) {
    const dishId = e.currentTarget.dataset.dishId;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这道拿手菜吗？',
      success: (res) => {
        if (res.confirm) {
          const dishes = this.data.dishes.filter(d => d.id !== dishId);
          wx.setStorageSync('userDishes', dishes);
          this.setData({ dishes });
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 表单输入处理
  onFormInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      formData: {
        ...this.data.formData,
        [field]: value
      }
    });
  },

  // 选择难度
  onDifficultyChange(e) {
    this.setData({
      formData: {
        ...this.data.formData,
        difficulty: e.detail.value
      }
    });
  },

  // 添加标签
  addTag(e) {
    const tag = e.detail.value.trim();
    if (tag && !this.data.formData.tags.includes(tag)) {
      this.setData({
        formData: {
          ...this.data.formData,
          tags: [...this.data.formData.tags, tag]
        }
      });
    }
  },

  // 删除标签
  removeTag(e) {
    const index = e.currentTarget.dataset.index;
    const tags = this.data.formData.tags.filter((_, i) => i !== index);
    
    this.setData({
      formData: {
        ...this.data.formData,
        tags
      }
    });
  },

  // 保存拿手菜
  saveDish() {
    const { formData, editingDish } = this.data;
    
    // 验证表单
    if (!formData.name.trim()) {
      wx.showToast({
        title: '请输入菜名',
        icon: 'none'
      });
      return;
    }
    
    if (!formData.description.trim()) {
      wx.showToast({
        title: '请输入描述',
        icon: 'none'
      });
      return;
    }
    
    if (!formData.time.trim()) {
      wx.showToast({
        title: '请输入制作时间',
        icon: 'none'
      });
      return;
    }

    const dishData = {
      ...formData,
      id: editingDish ? editingDish.id : 'dish_' + Date.now(),
      createTime: editingDish ? editingDish.createTime : new Date().toISOString(),
      updateTime: new Date().toISOString()
    };

    let dishes;
    if (editingDish) {
      // 编辑模式
      dishes = this.data.dishes.map(d => d.id === editingDish.id ? dishData : d);
    } else {
      // 新增模式
      dishes = [dishData, ...this.data.dishes];
    }

    // 保存到本地存储
    wx.setStorageSync('userDishes', dishes);
    
    this.setData({
      dishes,
      showAddForm: false,
      editingDish: null
    });

    wx.showToast({
      title: editingDish ? '已更新' : '已添加',
      icon: 'success'
    });
  },

  // 分享拿手菜
  shareDish(e) {
    const dishId = e.currentTarget.dataset.dishId;
    const dish = this.data.dishes.find(d => d.id === dishId);
    
    if (dish) {
      wx.showShareMenu({
        withShareTicket: true
      });
      
      wx.showToast({
        title: '分享成功',
        icon: 'success'
      });
    }
  },

  // 返回上一页
  navigateBack() {
    wx.navigateBack();
  }
});