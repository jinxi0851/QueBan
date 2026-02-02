// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'; // @ts-ignore;
import { Heart, MessageCircle, Bookmark, Share2, Flame, Clock } from 'lucide-react';export default function Square(props) {const { $w } = props;const { toast } = useToast();const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hot');
  useEffect(() => {
    loadPosts();
  }, [activeTab]);
  const loadPosts = async () => {
    setLoading(true);
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      let query = db.collection('posts');
      if (activeTab === 'hot') {
        // 热门：按点赞数排序
        query = query.orderBy('likeCount', 'desc');
      } else if (activeTab === 'new') {
        // 最新：按时间排序
        query = query.orderBy('createTime', 'desc');
      }
      const result = await query.limit(20).get();
      if (result.data.length > 0) {
        setPosts(result.data);
      } else {
        // 如果没有数据，使用虚拟数据
        setPosts(getMockPosts());
      }
    } catch (error) {
      console.error('加载广场数据失败:', error);
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      // 使用虚拟数据
      setPosts(getMockPosts());} finally {setLoading(false);}};const getMockPosts = () => {return [{ _id: '1', menu: { name: '番茄炒蛋', tags: ['家常', '快手'], difficulty: '简单', time: '10分钟', message: '今天辛苦啦，给你做顿好吃的~' }, authorName: '小美', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', likeCount: 128, commentCount: 23, createTime: new Date(Date.now() - 3600000).toISOString(), aiComment: '这道菜简单又营养，番茄的酸甜配上嫩滑的鸡蛋，简直是绝配！适合忙碌的工作日快速准备~' }, { _id: '2', menu: { name: '红烧肉', tags: ['经典', '下饭'], difficulty: '中等', time: '45分钟', message: '这道菜超适合今天的你！' }, authorName: '大厨阿强', authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      likeCount: 256,
      commentCount: 45,
      createTime: new Date(Date.now() - 7200000).toISOString(),
      aiComment: '红烧肉是中华料理的经典！肥而不腻，入口即化，配上热腾腾的米饭，幸福感满满~' },
    {
      _id: '3',
      menu: {
        name: '清蒸鲈鱼',
        tags: ['清淡', '营养'],
        difficulty: '简单',
        time: '15分钟',
        message: '为你准备的专属菜单，请查收~' },

      authorName: '健康达人',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
      likeCount: 89,
      commentCount: 12,
      createTime: new Date(Date.now() - 10800000).toISOString(),
      aiComment: '清蒸鲈鱼保留了鱼肉的鲜美，低脂高蛋白，是健康饮食的绝佳选择！' },
    {
      _id: '4',
      menu: {
        name: '麻婆豆腐',
        tags: ['川菜', '下饭'],
        difficulty: '简单',
        time: '20分钟',
        message: '吃饭啦吃饭啦，不许挑食哦~' },

      authorName: '川菜爱好者',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
      likeCount: 167,
      commentCount: 34,
      createTime: new Date(Date.now() - 14400000).toISOString(),
      aiComment: '麻婆豆腐麻辣鲜香，豆腐嫩滑，是下饭神器！记得多准备点米饭哦~' },
    {
      _id: '5',
      menu: {
        name: '糖醋排骨',
        tags: ['酸甜', '经典'],
        difficulty: '中等',
        time: '40分钟',
        message: '今天的菜单，是为你量身定制的！' },

      authorName: '甜食控',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
      likeCount: 198,
      commentCount: 41,
      createTime: new Date(Date.now() - 18000000).toISOString(),
      aiComment: '糖醋排骨酸甜可口，色泽诱人，老少皆宜！是家庭聚餐的明星菜品~' }];

  };
  const handleLike = async (postId) => {
    if (!$w.auth.currentUser?.userId) {
      toast({
        title: '请先登录',
        description: '登录后才能点赞哦~',
        variant: 'destructive' });

      return;
    }
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();

      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      // 检查是否已点赞
      const existingLike = await db.collection('likes').where({ postId: postId, _openid: tcb.auth().currentUser?.openid }).get();if (existingLike.data.length > 0) {// 取消点赞
        await db.collection('likes').where({ postId: postId, _openid: tcb.auth().currentUser?.openid }).remove();await db.collection('posts').doc(postId).update({ likeCount: posts.find((p) => p._id === postId).likeCount - 1 });setPosts(posts.map((p) => p._id === postId ? { ...p, likeCount: p.likeCount - 1 } : p));toast({ title: '已取消点赞' });} else {// 点赞
        await db.collection('likes').add({ postId: postId, createTime: new Date().toISOString() });await db.collection('posts').doc(postId).update({ likeCount: posts.find((p) => p._id === postId).likeCount + 1 });setPosts(posts.map((p) => p._id === postId ? { ...p, likeCount: p.likeCount + 1 } : p));toast({
          title: '点赞成功！' });

      }
    } catch (error) {
      console.error('点赞失败:', error);
      toast({
        title: '操作失败',
        description: '请稍后重试',
        variant: 'destructive' });

    }
  };
  const handleCollect = async (postId) => {
    if (!$w.auth.currentUser?.userId) {
      toast({
        title: '请先登录',
        description: '登录后才能收藏哦~',
        variant: 'destructive' });

      return;
    }
    toast({
      title: '收藏成功！' });

  };
  const formatTime = (timeString) => {
    const now = new Date();
    const time = new Date(timeString);
    const diff = now - time;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}天前`;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF5F0] via-[#FFECD9] to-[#FF9A8B]/20 pb-24">
      {/* 顶部标题 */}
      <div className="pt-12 pb-6 px-6 animate-fadeIn bg-sky-100">
        <h1 className="text-3xl font-bold text-[#2D3436] mb-2" style={{
        fontFamily: 'Noto Serif SC, serif' }}>

          广场
        </h1>
        <p className="text-[#636E72] text-lg">
          看看其他夫妻都在吃什么~
        </p>
      </div>

      {/* 标签切换 */}
      <div className="px-6 mb-6 animate-fadeIn bg-blue-100" style={{
      animationDelay: '0.1s' }}>

        <div className="bg-white/60 backdrop-blur-sm rounded-full p-1 flex gap-1">
          <Button onClick={() => setActiveTab('hot')} className={`flex-1 rounded-full transition-all ${activeTab === 'hot' ? 'bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] text-white' : 'text-[#636E72] hover:bg-[#FFECD9]'}`}>
            <Flame className="w-4 h-4 mr-2" />
            热门
          </Button>
          <Button onClick={() => setActiveTab('new')} className={`flex-1 rounded-full transition-all ${activeTab === 'new' ? 'bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] text-white' : 'text-[#636E96] hover:bg-[#FFECD9]'}`}>
            <Clock className="w-4 h-4 mr-2" />
            最新
          </Button>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="px-6 space-y-4 bg-blue-100">
        {loading ? <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9A8B] mx-auto"></div>
            <p className="text-[#636E72] mt-4">加载中...</p>
          </div> : posts.map((post, index) => <div key={post._id} className="animate-fadeIn" style={{
        animationDelay: `${0.2 + index * 0.1}s` }}>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-3xl overflow-hidden card-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full bg-[#FFECD9]" />
                      <div>
                        <div className="font-semibold text-[#2D3436]">{post.authorName}</div>
                        <div className="text-xs text-[#636E72]">{formatTime(post.createTime)}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* 菜单信息 */}
                  <div className="bg-gradient-to-r from-[#FF9A8B]/10 to-[#FF6B6B]/10 rounded-2xl p-4 mb-4">
                    <h3 className="text-xl font-bold text-[#2D3436] mb-2" style={{
                fontFamily: 'Noto Serif SC, serif' }}>

                      {post.menu.name}
                    </h3>
                    <p className="text-[#636E72] italic mb-3">{post.menu.message}</p>
                    <div className="flex gap-4 text-sm text-[#636E72]">
                      <span>难度：{post.menu.difficulty}</span>
                      <span>用时：{post.menu.time}</span>
                    </div>
                  </div>

                  {/* AI评论 */}
                  <div className="bg-[#FFECD9]/50 rounded-xl p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="text-[#FF6B6B] font-bold text-sm">AI点评：</span>
                      <p className="text-[#2D3436] text-sm flex-1">{post.aiComment}</p>
                    </div>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.menu.tags.map((tag, tagIndex) => <span key={tagIndex} className="bg-[#FFECD9] text-[#2D3436] px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>)}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#FFECD9]">
                    <Button onClick={() => handleLike(post._id)} className="flex items-center gap-2 text-[#636E72] hover:text-[#FF6B6B] bg-transparent hover:bg-transparent">
                      <Heart className="w-5 h-5" />
                      <span>{post.likeCount}</span>
                    </Button>
                    <Button className="flex items-center gap-2 text-[#636E72] hover:text-[#FF6B6B] bg-transparent hover:bg-transparent">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.commentCount}</span>
                    </Button>
                    <Button onClick={() => handleCollect(post._id)} className="flex items-center gap-2 text-[#636E72] hover:text-[#FF6B6B] bg-transparent hover:bg-transparent">
                      <Bookmark className="w-5 h-5" />
                      <span>收藏</span>
                    </Button>
                    <Button className="flex items-center gap-2 text-[#636E72] hover:text-[#FF6B6B] bg-transparent hover:bg-transparent">
                      <Share2 className="w-5 h-5" />
                      <span>分享</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>)}
      </div>
    </div>;
}