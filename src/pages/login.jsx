// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';
// @ts-ignore;
import { Smartphone, ArrowLeft, Heart, Sparkles } from 'lucide-react';

export default function Login(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [loginMethod, setLoginMethod] = useState('wechat'); // 'wechat' | 'sms'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationInfo, setVerificationInfo] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [smsLoading, setSmsLoading] = useState(false);
  useEffect(() => {
    // 获取跳转参数
    const params = $w.page.dataset.params || {};
    if (params.redirect) {
      setRedirectUrl(params.redirect);
    }
  }, []);
  // 微信登录
  const handleWechatLogin = async () => {
    setLoading(true);
    try {
      // 调用微信一键登录
      const tcb = await $w.cloud.getCloudInstance();

      // 使用托管登录页进行微信登录
      tcb.auth().toDefaultLoginPage({
        config_version: "env",
        redirect_uri: redirectUrl || window.location.origin,
        query: {
          s_domain: $w.utils.resolveStaticResourceUrl("/").replace(/^https?:\/\//, "").split("/")[0]
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      toast({
        title: '登录失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // 获取短信验证码
  const handleGetVerificationCode = async () => {
    if (!phoneNumber || !/^1[3-9]\d{9}$/.test(phoneNumber)) {
      toast({
        title: '请输入正确的手机号',
        variant: 'destructive'
      });
      return;
    }
    setSmsLoading(true);
    try {
      const result = await $w.cloud.callFunction({
        name: 'smsAuth',
        data: {
          action: 'getVerification',
          phoneNumber: `+86 ${phoneNumber}`
        }
      });
      if (result.result.success) {
        setVerificationInfo(result.result.verificationInfo);
        setCountdown(60);
        toast({
          title: '验证码发送成功',
          description: '请查看手机短信'
        });

        // 开始倒计时
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        throw new Error(result.result.error);
      }
    } catch (error) {
      console.error('获取验证码失败:', error);
      toast({
        title: '获取验证码失败',
        description: error.message || '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setSmsLoading(false);
    }
  };

  // 短信验证码登录
  const handleSmsLogin = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: '请输入6位验证码',
        variant: 'destructive'
      });
      return;
    }
    setLoading(true);
    try {
      const result = await $w.cloud.callFunction({
        name: 'smsAuth',
        data: {
          action: 'signInWithSms',
          phoneNumber: `+86 ${phoneNumber}`,
          verificationCode,
          verificationInfo
        }
      });
      if (result.result.success) {
        // 刷新用户信息
        await $w.auth.getUserInfo({
          force: true
        });
        toast({
          title: '登录成功',
          description: '欢迎回来！'
        });

        // 跳转到指定页面
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          $w.utils.navigateTo({
            pageId: 'home',
            params: {}
          });
        }
      } else {
        throw new Error(result.result.error);
      }
    } catch (error) {
      console.error('登录失败:', error);
      toast({
        title: '登录失败',
        description: error.message || '验证码错误，请重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      $w.utils.navigateBack();
    }
  };
  return <div className="min-h-screen from-[#FFF5F0] via-[#FFECD9] to-[#FF9A8B]/20 pb-24">
      {/* 顶部导航 */}
      <div className="pt-12 pb-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={handleBack} variant="ghost" className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-6 h-6 text-[#2D3436]" />
          </Button>
          <h1 className="text-xl font-bold text-[#2D3436]" style={{
          fontFamily: 'Noto Serif SC, serif'
        }}>
            登录
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* 登录内容区 */}
      <div className="px-6">
        {/* 欢迎区域 */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#2D3436] mb-4" style={{
            fontFamily: 'Noto Serif SC, serif'
          }}>
              欢迎来到今晚吃什么
            </h2>
            <p className="text-[#636E72] text-lg leading-relaxed">
              登录后即可享受专属菜单推荐<br />
              和伴侣分享美食的快乐时光
            </p>
          </div>
        </div>

        {/* 登录方式切换 */}
        <div className="flex bg-white/40 backdrop-blur-sm rounded-2xl p-1 mb-6 animate-fadeIn" style={{
        animationDelay: '0.1s'
      }}>
          <button onClick={() => setLoginMethod('wechat')} className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${loginMethod === 'wechat' ? 'bg-white text-[#2D3436] shadow-md' : 'text-[#636E72] hover:text-[#2D3436]'}`}>
            微信登录
          </button>
          <button onClick={() => setLoginMethod('sms')} className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${loginMethod === 'sms' ? 'bg-white text-[#2D3436] shadow-md' : 'text-[#636E72] hover:text-[#2D3436]'}`}>
            短信登录
          </button>
        </div>

        {/* 登录方式 */}
        <div className="space-y-4 animate-fadeIn" style={{
        animationDelay: '0.2s'
      }}>
          {loginMethod === 'wechat' ? (/* 微信一键登录 */
        <Button onClick={handleWechatLogin} disabled={loading} className="w-full bg-[#07C160] hover:bg-[#06AD56] text-white rounded-2xl py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              {loading ? <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  登录中...
                </> : <>
                  <Smartphone className="w-6 h-6 mr-3" />
                  微信一键登录
                </>}
            </Button>) : (/* 短信验证码登录 */
        <div className="space-y-4">
              {/* 手机号输入 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                <label className="block text-[#2D3436] font-medium mb-2">手机号</label>
                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="请输入手机号" className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 outline-none transition-all duration-300" maxLength={11} />
              </div>

              {/* 验证码输入 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                <label className="block text-[#2D3436] font-medium mb-2">验证码</label>
                <div className="flex space-x-3">
                  <input type="text" value={verificationCode} onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="请输入验证码" className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 outline-none transition-all duration-300" maxLength={6} />
                  <Button onClick={handleGetVerificationCode} disabled={smsLoading || countdown > 0 || !phoneNumber} variant="outline" className="px-6 py-3 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white rounded-xl transition-all duration-300">
                    {smsLoading ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Button>
                </div>
              </div>

              {/* 登录按钮 */}
              <Button onClick={handleSmsLogin} disabled={loading || !verificationCode || !phoneNumber} className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-2xl py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                {loading ? <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    登录中...
                  </> : '登录'}
              </Button>
            </div>)}

          {/* 功能说明 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 mt-8 animate-fadeIn" style={{
          animationDelay: '0.3s'
        }}>
            <h3 className="text-[#2D3436] font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#FF6B6B]" />
              登录后享受
            </h3>
            <div className="space-y-3 text-[#636E72]">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#FF6B6B] rounded-full mr-3"></div>
                <span>每日5次免费菜单生成</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#FF6B6B] rounded-full mr-3"></div>
                <span>专属美食推荐</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#FF6B6B] rounded-full mr-3"></div>
                <span>与伴侣分享菜单</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#FF6B6B] rounded-full mr-3"></div>
                <span>收藏喜欢的菜品</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-12 animate-fadeIn" style={{
        animationDelay: '0.2s'
      }}>
          <p className="text-[#636E72] text-sm">
            登录即表示同意
            <span className="text-[#FF6B6B] mx-1">《用户协议》</span>
            和
            <span className="text-[#FF6B6B] mx-1">《隐私政策》</span>
          </p>
        </div>
      </div>
    </div>;
}