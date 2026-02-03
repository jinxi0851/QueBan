// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { RefreshCw, Heart, Send, Sparkles, UtensilsCrossed } from 'lucide-react';

export default function Home(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [remainingCount, setRemainingCount] = useState(5);
  const [sweetMessage, setSweetMessage] = useState('');
  const [dailyImage, setDailyImage] = useState('');

  // 预设家常菜库
  const menuDatabase = [{
    name: '温馨家常套餐',
    dishes: [{
      name: '番茄炒蛋',
      tags: ['家常', '快手'],
      difficulty: '简单',
      time: '10分钟'
    }, {
      name: '蒜蓉西兰花',
      tags: ['清淡', '健康'],
      difficulty: '简单',
      time: '8分钟'
    }, {
      name: '冬瓜排骨汤',
      tags: ['汤品', '营养'],
      difficulty: '简单',
      time: '1小时'
    }],
    tags: ['家常', '营养', '温馨'],
    totalTime: '1小时20分钟'
  }, {
    name: '经典下饭菜',
    dishes: [{
      name: '红烧肉',
      tags: ['经典', '下饭'],
      difficulty: '中等',
      time: '45分钟'
    }, {
      name: '麻婆豆腐',
      tags: ['川菜', '下饭'],
      difficulty: '简单',
      time: '20分钟'
    }, {
      name: '白灼菜心',
      tags: ['清淡', '快手'],
      difficulty: '简单',
      time: '5分钟'
    }],
    tags: ['经典', '下饭', '川菜'],
    totalTime: '1小时10分钟'
  }, {
    name: '清淡营养套餐',
    dishes: [{
      name: '清蒸鲈鱼',
      tags: ['清淡', '营养'],
      difficulty: '简单',
      time: '15分钟'
    }, {
      name: '蒸蛋羹',
      tags: ['清淡', '营养'],
      difficulty: '简单',
      time: '10分钟'
    }, {
      name: '清炒时蔬',
      tags: ['清淡', '健康'],
      difficulty: '简单',
      time: '8分钟'
    }],
    tags: ['清淡', '营养', '健康'],
    totalTime: '35分钟'
  }, {
    name: '川菜经典组合',
    dishes: [{
      name: '宫保鸡丁',
      tags: ['川菜', '经典'],
      difficulty: '中等',
      time: '25分钟'
    }, {
      name: '鱼香肉丝',
      tags: ['川菜', '下饭'],
      difficulty: '中等',
      time: '20分钟'
    }, {
      name: '回锅肉',
      tags: ['川菜', '经典'],
      difficulty: '中等',
      time: '25分钟'
    }],
    tags: ['川菜', '经典', '下饭'],
    totalTime: '1小时10分钟'
  }, {
    name: '快手简单餐',
    dishes: [{
      name: '番茄炒蛋',
      tags: ['家常', '快手'],
      difficulty: '简单',
      time: '10分钟'
    }, {
      name: '酸辣土豆丝',
      tags: ['家常', '快手'],
      difficulty: '简单',
      time: '10分钟'
    }, {
      name: '蛋炒饭',
      tags: ['快手', '主食'],
      difficulty: '简单',
      time: '10分钟'
    }],
    tags: ['快手', '简单', '主食'],
    totalTime: '30分钟'
  }, {
    name: '创意美味套餐',
    dishes: [{
      name: '可乐鸡翅',
      tags: ['创意', '下饭'],
      difficulty: '简单',
      time: '30分钟'
    }, {
      name: '糖醋排骨',
      tags: ['酸甜', '经典'],
      difficulty: '中等',
      time: '40分钟'
    }, {
      name: '凉拌黄瓜',
      tags: ['凉菜', '快手'],
      difficulty: '简单',
      time: '5分钟'
    }],
    tags: ['创意', '酸甜', '下饭'],
    totalTime: '1小时15分钟'
  }, {
    name: '家常下饭组合',
    dishes: [{
      name: '青椒肉丝',
      tags: ['家常', '下饭'],
      difficulty: '简单',
      time: '15分钟'
    }, {
      name: '红烧茄子',
      tags: ['下饭', '经典'],
      difficulty: '中等',
      time: '30分钟'
    }, {
      name: '水煮肉片',
      tags: ['川菜', '下饭'],
      difficulty: '中等',
      time: '30分钟'
    }],
    tags: ['家常', '下饭', '经典'],
    totalTime: '1小时15分钟'
  }];

  // 俏皮话库
  const sweetMessages = ['今天辛苦啦，给你做顿好吃的~', '这道菜超适合今天的你！', '猜猜今天吃什么？惊喜来啦~', '为你准备的专属菜单，请查收~', '今天也要好好吃饭哦！', '这道菜里有我对你的爱~', '吃饭啦吃饭啦，不许挑食哦~', '今天的菜单，是为你量身定制的！'];

  // 每日精选图片库 - QueBan女王盛宴主题
  const dailyImages = ['https://cersay-0gtnza71ab2663d4-1397510798.tcloudbaseapp.com/resources/2026-02/lowcode-2424451'];
  useEffect(() => {
    loadUserInfo();
    // 随机选择一句小情话
    const randomMessage = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
    setSweetMessage(randomMessage);
    // 随机选择一张每日图片
    const randomImage = dailyImages[Math.floor(Math.random() * dailyImages.length)];
    setDailyImage(randomImage);
  }, []);
  const loadUserInfo = async () => {
    try {
      const currentUser = $w.auth.currentUser;
      if (currentUser?.userId) {
        setUser(currentUser);
        // 查询用户剩余次数
        const tcb = await $w.cloud.getCloudInstance();
        const db = tcb.database();
        const result = await db.collection('users').where({
          _openid: tcb.auth().currentUser?.openid
        }).get();
        if (result.data.length > 0) {
          setRemainingCount(result.data[0].remainingCount || 5);
        }
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };
  const generateMenu = async () => {
    // 检查登录状态
    if (!$w.auth.currentUser?.userId) {
      // 跳转到微信一键登录页面
      $w.utils.navigateTo({
        pageId: 'login',
        params: {
          redirect: window.location.href
        }
      });
      return;
    }

    // 检查剩余次数
    if (remainingCount <= 0) {
      toast({
        title: '今日生成次数已用完',
        description: '升级会员可无限生成菜单，仅需9.9元/月',
        variant: 'destructive'
      });
      return;
    }
    setLoading(true);
    try {
      // 模拟随机生成
      await new Promise(resolve => setTimeout(resolve, 800));
      const randomMenu = menuDatabase[Math.floor(Math.random() * menuDatabase.length)];
      setMenu(randomMenu);
      setRemainingCount(prev => prev - 1);

      // 保存生成记录
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('menu_generations').add({
        data: {
          userId: $w.auth.currentUser.userId,
          menuName: randomMenu.name,
          dishes: randomMenu.dishes,
          createdAt: new Date()
        }
      });
      toast({
        title: '菜单生成成功！',
        description: '为你精心挑选的美味菜单，请查收~'
      });
    } catch (error) {
      console.error('生成菜单失败:', error);
      toast({
        title: '生成失败',
        description: '网络异常，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleLike = async () => {
    if (!menu) return;
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      if (isLiked) {
        // 取消点赞
        await db.collection('likes').where({
          userId: $w.auth.currentUser?.userId,
          menuName: menu.name
        }).remove();
        setIsLiked(false);
      } else {
        // 添加点赞
        await db.collection('likes').add({
          data: {
            userId: $w.auth.currentUser?.userId,
            menuName: menu.name,
            createdAt: new Date()
          }
        });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      toast({
        title: '操作失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleShare = async () => {
    if (!menu) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `QueBan美食 - ${menu.name}`,
          text: `今天吃${menu.name}吧！包含${menu.dishes.length}道菜，总用时${menu.totalTime}`,
          url: window.location.href
        });
      } else {
        // 复制到剪贴板
        const shareText = `今天吃${menu.name}吧！包含${menu.dishes.length}道菜，总用时${menu.totalTime}。来自QueBan美食小程序`;
        await navigator.clipboard.writeText(shareText);
        toast({
          title: '分享内容已复制',
          description: '快去分享给朋友吧！'
        });
      }
    } catch (error) {
      console.error('分享失败:', error);
      toast({
        title: '分享失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* 顶部装饰 */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-200/30 to-amber-200/30 rounded-b-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 头部区域 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-8 h-8 text-orange-500 mr-2" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              QueBan美食
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            让本女王看看，今天准备了什么菜
          </p>
        </div>

        {/* 每日精选图片 */}
        {dailyImage && <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img src={dailyImage} alt="QueBan女王盛宴" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">QueBan女王盛宴</h3>
                <p className="text-sm opacity-90">让本女王看看，今天准备了什么菜</p>
              </div>
            </div>
          </div>}

        {/* 俏皮话 */}
        {sweetMessage && <div className="mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-orange-100">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
                <p className="text-gray-700 font-medium">{sweetMessage}</p>
              </div>
            </div>
          </div>}

        {/* 生成按钮 */}
        <div className="text-center mb-8">
          <Button onClick={generateMenu} disabled={loading} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            {loading ? <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                正在生成...
              </> : <>
                <Sparkles className="w-5 h-5 mr-2" />
                生成今日菜单
              </>}
          </Button>
          
          {user && <p className="text-sm text-gray-500 mt-2">
              今日剩余次数：{remainingCount} 次
            </p>}
        </div>

        {/* 菜单展示 */}
        {menu && <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                {menu.name}
              </CardTitle>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <UtensilsCrossed className="w-4 h-4 mr-1" />
                  {menu.dishes.length}道菜
                </span>
                <span>总用时：{menu.totalTime}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {menu.dishes.map((dish, index) => <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{dish.name}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          {dish.difficulty}
                        </span>
                        <span>{dish.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dish.tags.map((tag, tagIndex) => <span key={tagIndex} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          {tag}
                        </span>)}
                    </div>
                  </div>)}
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-center space-x-4 mt-6">
                <Button variant="outline" onClick={handleLike} className={`flex items-center space-x-2 ${isLiked ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-600'}`}>
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? '已收藏' : '收藏'}</span>
                </Button>
                
                <Button variant="outline" onClick={handleShare} className="flex items-center space-x-2 text-blue-600 border-blue-200 bg-blue-50">
                  <Send className="w-4 h-4" />
                  <span>分享</span>
                </Button>
              </div>
            </CardContent>
          </Card>}

        {/* 底部提示 */}
        {!menu && <div className="text-center text-gray-500">
            <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>点击上方按钮，开始你的美食之旅</p>
          </div>}
      </div>
    </div>;
}