// 登录页面逻辑
const Page = function(config) {
  return config;
};

Page({
  data: {
    phoneNumber: '',
    verificationCode: '',
    codeCountdown: 0,
    isCodeSent: false,
    loading: false
  },

  onLoad() {
    // 检查是否已经登录
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.switchTab({
        url: '/pages/home/home'
      });
    }
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({
      phoneNumber: e.detail.value
    });
  },

  // 输入验证码
  onCodeInput(e) {
    this.setData({
      verificationCode: e.detail.value
    });
  },

  // 发送验证码
  async sendVerificationCode() {
    const { phoneNumber } = this.data;
    
    // 验证手机号格式
    if (!this.validatePhoneNumber(phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    try {
      // 模拟发送验证码
      await this.simulateSendCode();
      
      this.setData({
        isCodeSent: true,
        codeCountdown: 60
      });
      
      // 开始倒计时
      this.startCountdown();
      
      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      });
      
    } catch (error) {
      console.error('发送验证码失败:', error);
      wx.showToast({
        title: '发送失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 模拟发送验证码
  simulateSendCode() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },

  // 开始倒计时
  startCountdown() {
    const timer = setInterval(() => {
      const { codeCountdown } = this.data;
      if (codeCountdown <= 1) {
        clearInterval(timer);
        this.setData({
          codeCountdown: 0,
          isCodeSent: false
        });
      } else {
        this.setData({
          codeCountdown: codeCountdown - 1
        });
      }
    }, 1000);
  },

  // 验证手机号格式
  validatePhoneNumber(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  // 登录
  async login() {
    const { phoneNumber, verificationCode } = this.data;
    
    // 验证输入
    if (!this.validatePhoneNumber(phoneNumber)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }
    
    if (!verificationCode || verificationCode.length !== 6) {
      wx.showToast({
        title: '请输入6位验证码',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    try {
      // 模拟登录验证
      await this.simulateLogin(phoneNumber, verificationCode);
      
      // 创建用户信息
      const userInfo = {
        userId: 'user_' + Date.now(),
        phoneNumber,
        name: '用户' + phoneNumber.slice(-4),
        nickName: '美食爱好者',
        type: '普通用户',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + phoneNumber,
        createTime: new Date().toISOString()
      };
      
      // 保存用户信息
      wx.setStorageSync('userInfo', userInfo);
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      // 延迟跳转
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 1500);
      
    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({
        title: '验证码错误',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 模拟登录验证
  simulateLogin(phone, code) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟验证码验证（实际应用中应该调用后端API）
        if (code === '123456') {
          resolve();
        } else {
          reject(new Error('验证码错误'));
        }
      }, 1500);
    });
  },

  // 微信授权登录
  wxLogin() {
    wx.showLoading({
      title: '登录中...'
    });
    
    wx.login({
      success: (res) => {
        if (res.code) {
          // 模拟微信登录
          this.simulateWxLogin(res.code);
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 模拟微信登录
  simulateWxLogin(code) {
    setTimeout(() => {
      wx.hideLoading();
      
      const userInfo = {
        userId: 'wx_user_' + Date.now(),
        name: '微信用户',
        nickName: '美食爱好者',
        type: '普通用户',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WX',
        createTime: new Date().toISOString()
      };
      
      wx.setStorageSync('userInfo', userInfo);
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 1500);
    }, 2000);
  },

  // 返回上一页
  navigateBack() {
    wx.navigateBack();
  }
});