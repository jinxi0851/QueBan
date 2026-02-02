// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui'; // @ts-ignore;
import { Heart, Bookmark, MessageCircle, Crown, Settings, Link2, Plus, User, UtensilsCrossed, ChevronRight, Gift } from 'lucide-react';
export default function Profile(props) {
  const {
    $w } =
  props;
  const {
    toast } =
  useToast();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    likes: 0,
    favorites: 0,
    comments: 0 });

  const [partner, setPartner] = useState(null);
  const [communications, setCommunications] = useState([]);
  const [myMenus, setMyMenus] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: '',
    tags: '',
    difficulty: '简单',
    time: '' });

  const [inviteCode, setInviteCode] = useState('');
  const [partnerInviteCode, setPartnerInviteCode] = useState('');
  useEffect(() => {
    loadUserInfo();
  }, []);
  const loadUserInfo = async () => {
    try {
      const currentUser = $w.auth.currentUser;
      if (currentUser?.userId) {
        setUser(currentUser);
        await Promise.all([loadUserStats(), loadPartnerInfo(), loadCommunications(), loadMyMenus()]);
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };
  const loadUserStats = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();

      // 查询用户发布的帖子
      // 查询用户发布的帖子
      const postsResult = await db.collection('posts').where({ _openid: tcb.auth().currentUser?.openid }).
      get();
      let totalLikes = 0;
      let totalComments = 0;
      postsResult.data.forEach((post) => {
        totalLikes += post.likeCount || 0;
        totalComments += post.commentCount || 0;
      });

      // 查询收藏数
      // 查询收藏数
      const favoritesResult = await db.collection('favorites').where({ _openid: tcb.auth().currentUser?.openid }).
      get();
      setStats({
        likes: totalLikes,
        favorites: favoritesResult.data.length,
        comments: totalComments });

    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };
  const loadPartnerInfo = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('cersay_bind_relations').where({
        _openid: tcb.auth().currentUser?.openid }).
      get();
      if (result.data.length > 0) {
        setPartner(result.data[0]);
      }
    } catch (error) {
      console.error('加载伴侣信息失败:', error);
    }
  };
  const loadCommunications = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('cersay_communications').where({
        toUserId: $w.auth.currentUser?.userId }).
      orderBy('createTime', 'desc').limit(10).get();
      setCommunications(result.data);
    } catch (error) {
      console.error('加载消息失败:', error);
    }
  };
  const loadMyMenus = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const result = await db.collection('menus').where({
        _openid: tcb.auth().currentUser?.openid }).
      get();
      setMyMenus(result.data);
    } catch (error) {
      console.error('加载我的菜单失败:', error);
    }
  };
  const handleLogin = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      tcb.auth().toDefaultLoginPage({
        config_version: "env",
        redirect_uri: window.location.href,
        query: {
          s_domain: $w.utils.resolveStaticResourceUrl("/").replace(/^https?:\/\//, "").split("/")[0] } });


    } catch (error) {
      console.error('登录失败:', error);
      toast({
        title: '登录失败',
        description: '请稍后重试',
        variant: 'destructive' });

    }
  };
  const handleLogout = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      await tcb.auth().signOut();
      await tcb.auth().signInAnonymously();
      await $w.auth.getUserInfo({
        force: true });

      setUser(null);
      toast({
        title: '已退出登录' });

    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };
  const generateInviteCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(code);
    toast({
      title: '邀请码已生成',
      description: `将邀请码 ${code} 发给你的另一半` });

  };
  const handleBindPartner = async () => {
    if (!partnerInviteCode) {
      toast({
        title: '请输入邀请码',
        description: '请输入你另一半的邀请码',
        variant: 'destructive' });

      return;
    }
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();

      // 查找邀请码对应的用户
      // 查找邀请码对应的用户
      const usersResult = await db.collection('users').where({ inviteCode: partnerInviteCode }).
      get();
      if (usersResult.data.length === 0) {
        toast({
          title: '邀请码无效',
          description: '请检查邀请码是否正确',
          variant: 'destructive' });

        return;
      }
      const partnerUser = usersResult.data[0];

      // 创建绑定关系
      // 创建绑定关系
      await db.collection('cersay_bind_relations').add({ partnerId: partnerUser._id,
        partnerName: partnerUser.nickName,
        bindTime: new Date().toISOString() });


      // 保存自己的邀请码
      // 保存自己的邀请码
      if (inviteCode) {await db.collection('users').where({
          _openid: tcb.auth().currentUser?.openid }).
        update({
          inviteCode: inviteCode });

      }
      toast({
        title: '绑定成功！',
        description: '现在可以和TA互相发送菜单啦~' });

      loadPartnerInfo();
    } catch (error) {
      console.error('绑定失败:', error);
      toast({
        title: '绑定失败',
        description: '请稍后重试',
        variant: 'destructive' });

    }
  };
  const handleAddMenu = async () => {
    if (!newMenu.name || !newMenu.time) {
      toast({
        title: '请填写完整信息',
        description: '菜名和用时是必填项',
        variant: 'destructive' });

      return;
    }
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      await db.collection('menus').add({
        name: newMenu.name,
        tags: newMenu.tags.split(',').map((tag) => tag.trim()),
        difficulty: newMenu.difficulty,
        time: newMenu.time,
        createTime: new Date().toISOString() });

      toast({
        title: '添加成功！',
        description: '你的拿手菜已添加到菜单库' });

      setNewMenu({
        name: '',
        tags: '',
        difficulty: '简单',
        time: '' });

      setShowAddMenu(false);
      loadMyMenus();
    } catch (error) {
      console.error('添加菜单失败:', error);
      toast({
        title: '添加失败',
        description: '请稍后重试',
        variant: 'destructive' });

    }
  };
  const handleUpgradeVip = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();

      // 调用云函数创建订单
      // 调用云函数创建订单
      const result = await tcb.callFunction({ name: 'createOrder',
        data: {
          planId: 1,
          planName: '月度会员',
          price: 9.9 } });


      if (result.result.paymentParams) {
        // 调起微信支付
        const wx = tcb.getWx();
        wx.requestPayment({
          ...result.result.paymentParams,
          success: () => {
            toast({
              title: '支付成功！',
              description: '恭喜你成为会员，享受无限菜单生成！' });

            loadUserInfo();
          },
          fail: (error) => {
            toast({
              title: '支付失败',
              description: error.errMsg,
              variant: 'destructive' });

          } });

      }
    } catch (error) {
      console.error('支付失败:', error);
      toast({
        title: '支付失败',
        description: '请稍后重试',
        variant: 'destructive' });

    }
  };
  return <div className="min-h-screen from-[#FFF5F0] via-[#FFECD9] to-[#FF9A8B]/20 pb-24 bg-white">
      {/* 顶部用户信息 */}
      <div className="pt-12 pb-6 px-6 animate-fadeIn">
        {user ? <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9A8B] to-[#FF6B6B] flex items-center justify-center text-white text-2xl font-bold">
              {user.nickName?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#2D3436]">{user.nickName || '用户'}</h1>
              <p className="text-[#636E72]">{user.vipLevel > 0 ? '✨ 会员用户' : '普通用户'}</p>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="text-[#636E72]">
              退出
            </Button>
          </div> : <div className="text-center">
            <User className="w-16 h-16 text-[#FF9A8B]/40 mx-auto mb-4" />
            <Button onClick={handleLogin} className="bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] text-white rounded-full px-8">
              微信登录
            </Button>
          </div>}
      </div>

      {user && <>
          {/* 统计数据 */}
          <div className="px-6 mb-6 animate-fadeIn" style={{
        animationDelay: '0.1s' }}>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-3xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF6B6B]">{stats.likes}</div>
                    <div className="text-[#636E72] text-sm mt-1">获赞</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF6B6B]">{stats.favorites}</div>
                    <div className="text-[#636E72] text-sm mt-1">收藏</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF6B6B]">{stats.comments}</div>
                    <div className="text-[#636E72] text-sm mt-1">评论</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 会员卡片 */}
          <div className="px-6 mb-6 animate-fadeIn" style={{
        animationDelay: '0.2s' }}>

            <Card className="bg-gradient-to-br from-[#FF9A8B] to-[#FF6B6B] shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">升级会员</h3>
                    <p className="text-white/80 text-sm">无限菜单生成，享受更多特权</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">¥9.9</div>
                    <div className="text-white/80 text-sm">/月</div>
                  </div>
                  <Button onClick={handleUpgradeVip} className="bg-white text-[#FF6B6B] hover:bg-white/90 rounded-full px-6">
                    立即开通
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 伴侣绑定 */}
          <div className="px-6 mb-6 animate-fadeIn" style={{
        animationDelay: '0.3s' }}>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-[#FF6B6B]" />
                  伴侣绑定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {partner ? <div className="flex items-center justify-between p-4 bg-[#FFECD9] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9A8B] to-[#FF6B6B] flex items-center justify-center text-white font-bold">
                        {partner.partnerName?.[0] || 'T'}
                      </div>
                      <div>
                        <div className="font-semibold text-[#2D3436]">{partner.partnerName}</div>
                        <div className="text-xs text-[#636E72]">已绑定</div>
                      </div>
                    </div>
                    <Heart className="w-6 h-6 text-[#FF6B6B]" />
                  </div> : <>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-[#636E72] mb-2 block">你的邀请码</label>
                        <div className="flex gap-2">
                          <Input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="点击生成邀请码" readOnly className="bg-[#FFECD9] border-0" />
                          <Button onClick={generateInviteCode} className="bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] text-white">
                            生成
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-[#636E72] mb-2 block">TA的邀请码</label>
                        <Input value={partnerInviteCode} onChange={(e) => setPartnerInviteCode(e.target.value)} placeholder="输入另一半的邀请码" className="bg-[#FFECD9] border-0" />
                      </div>
                      <Button onClick={handleBindPartner} className="w-full bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] text-white">
                        绑定伴侣
                      </Button>
                    </div>
                  </>}
              </CardContent>
            </Card>
          </div>

          {/* 我的菜单 */}
          <div className="px-6 mb-6 animate-fadeIn" style={{
        animationDelay: '0.4s' }}>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-3xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-[#FF6B6B]" />
                    我的拿手菜
                  </CardTitle>
                  <Button onClick={() => setShowAddMenu(!showAddMenu)} size="sm" className="bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    添加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddMenu && <div className="space-y-3 mb-4 p-4 bg-[#FFECD9] rounded-2xl">
                    <Input value={newMenu.name} onChange={(e) => setNewMenu({
                ...newMenu,
                name: e.target.value })}
              placeholder="菜名" className="bg-white border-0" />
                    <Input value={newMenu.tags} onChange={(e) => setNewMenu({
                ...newMenu,
                tags: e.target.value })}
              placeholder="标签（用逗号分隔）" className="bg-white border-0" />
                    <div className="flex gap-2">
                      <Input value={newMenu.time} onChange={(e) => setNewMenu({
                  ...newMenu,
                  time: e.target.value })}
                placeholder="用时（如：30分钟）" className="bg-white border-0 flex-1" />
                      <select value={newMenu.difficulty} onChange={(e) => setNewMenu({
                  ...newMenu,
                  difficulty: e.target.value })}
                className="bg-white border-0 rounded-lg px-3">
                        <option value="简单">简单</option>
                        <option value="中等">中等</option>
                        <option value="困难">困难</option>
                      </select>
                    </div>
                    <Button onClick={handleAddMenu} className="w-full bg-gradient-to-r from-[#FF9A8B] to-[#FF6B6B] text-white">
                      保存
                    </Button>
                  </div>}
                
                {myMenus.length > 0 ? <div className="space-y-2">
                    {myMenus.map((menu, index) => <div key={index} className="flex items-center justify-between p-3 bg-[#FFECD9] rounded-xl">
                        <div>
                          <div className="font-semibold text-[#2D3436]">{menu.name}</div>
                          <div className="text-xs text-[#636E72]">{menu.difficulty} · {menu.time}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#636E72]" />
                      </div>)}
                  </div> : <div className="text-center py-8 text-[#636E72]">
                    还没有添加拿手菜哦~
                  </div>}
              </CardContent>
            </Card>
          </div>

          {/* 收到的消息 */}
          {communications.length > 0 && <div className="px-6 mb-6 animate-fadeIn" style={{
        animationDelay: '0.5s' }}>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-[#FF6B6B]" />
                    收到的菜单
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {communications.map((comm, index) => <div key={index} className={`p-4 rounded-2xl ${comm.isRead ? 'bg-[#FFECD9]/50' : 'bg-gradient-to-r from-[#FF9A8B]/20 to-[#FF6B6B]/20'}`}>
                        <div className="font-semibold text-[#2D3436] mb-1">{comm.menu.name}</div>
                        <p className="text-sm text-[#636E72] italic">{comm.menu.message}</p>
                        <div className="text-xs text-[#636E72] mt-2">
                          {new Date(comm.createTime).toLocaleString()}
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </div>}
        </>}
    </div>;
}