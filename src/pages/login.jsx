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
  useEffect(() => {
    // 获取跳转参数
    const params = $w.page.dataset.params || {};
    if (params.redirect) {
      setRedirectUrl(params.redirect);
    }
  }, []);
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

        {/* 登录方式 */}
        <div className="space-y-4 animate-fadeIn" style={{
        animationDelay: '0.1s'
      }}>
          {/* 微信一键登录 */}
          <Button onClick={handleWechatLogin} disabled={loading} className="w-full bg-[#07C160] hover:bg-[#06AD56] text-white rounded-2xl py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            {loading ? <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                登录中...
              </> : <>
                <Smartphone className="w-6 h-6 mr-3" />
                微信一键登录
              </>}
          </Button>

          {/* 功能说明 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 mt-8">
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