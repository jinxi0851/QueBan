const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, postId, menuData } = event;
  const { OPENID } = cloud.getWXContext();
  
  try {
    switch (action) {
      case 'create':
        return await createPost(menuData, OPENID);
      case 'like':
        return await toggleLike(postId, OPENID);
      case 'collect':
        return await toggleCollect(postId, OPENID);
      case 'getPosts':
        return await getPosts(event.sortBy || 'hot');
      default:
        return {
          success: false,
          error: '不支持的操作'
        };
    }
  } catch (error) {
    console.error('帖子操作失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 创建帖子
async function createPost(menuData, openid) {
  // 获取用户信息
  const userResult = await db.collection('users').where({
    _openid: openid
  }).get();
  
  if (userResult.data.length === 0) {
    return {
      success: false,
      error: '用户不存在'
    };
  }
  
  const user = userResult.data[0];
  
  // AI评论生成
  const aiComments = [
    '这道菜简单又营养，番茄的酸甜配上嫩滑的鸡蛋，简直是绝配！适合忙碌的工作日快速准备~',
    '红烧肉是中华料理的经典！肥而不腻，入口即化，配上热腾腾的米饭，幸福感满满~',
    '清蒸鲈鱼保留了鱼肉的鲜美，低脂高蛋白，是健康饮食的绝佳选择！',
    '麻婆豆腐麻辣鲜香，豆腐嫩滑，是下饭神器！记得多准备点米饭哦~',
    '糖醋排骨酸甜可口，色泽诱人，老少皆宜！是家庭聚餐的明星菜品~'
  ];
  
  const randomAiComment = aiComments[Math.floor(Math.random() * aiComments.length)];
  
  const postData = {
    menu: menuData,
    authorName: user.nickName || '用户',
    authorAvatar: user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickName || 'User'}`,
    likeCount: 0,
    commentCount: 0,
    createTime: new Date().toISOString(),
    aiComment: randomAiComment,
    _openid: openid
  };
  
  const result = await db.collection('posts').add({
    data: postData
  });
  
  return {
    success: true,
    postId: result._id,
    post: {
      _id: result._id,
      ...postData
    }
  };
}

// 切换点赞状态
async function toggleLike(postId, openid) {
  // 检查是否已点赞
  const existingLike = await db.collection('likes').where({
    postId: postId,
    _openid: openid
  }).get();
  
  if (existingLike.data.length > 0) {
    // 取消点赞
    await db.collection('likes').where({
      postId: postId,
      _openid: openid
    }).remove();
    
    // 更新帖子点赞数
    await db.collection('posts').doc(postId).update({
      likeCount: _.inc(-1)
    });
    
    return {
      success: true,
      action: 'unlike',
      message: '已取消点赞'
    };
  } else {
    // 添加点赞
    await db.collection('likes').add({
      data: {
        postId: postId,
        createTime: new Date().toISOString(),
        _openid: openid
      }
    });
    
    // 更新帖子点赞数
    await db.collection('posts').doc(postId).update({
      likeCount: _.inc(1)
    });
    
    return {
      success: true,
      action: 'like',
      message: '点赞成功！'
    };
  }
}

// 切换收藏状态
async function toggleCollect(postId, openid) {
  // 检查是否已收藏
  const existingFavorite = await db.collection('favorites').where({
    postId: postId,
    _openid: openid
  }).get();
  
  if (existingFavorite.data.length > 0) {
    // 取消收藏
    await db.collection('favorites').where({
      postId: postId,
      _openid: openid
    }).remove();
    
    return {
      success: true,
      action: 'uncollect',
      message: '已取消收藏'
    };
  } else {
    // 添加收藏
    await db.collection('favorites').add({
      data: {
        postId: postId,
        createTime: new Date().toISOString(),
        _openid: openid
      }
    });
    
    return {
      success: true,
      action: 'collect',
      message: '收藏成功！'
    };
  }
}

// 获取帖子列表
async function getPosts(sortBy = 'hot') {
  let query = db.collection('posts');
  
  if (sortBy === 'hot') {
    // 热门：按点赞数排序
    query = query.orderBy('likeCount', 'desc');
  } else if (sortBy === 'new') {
    // 最新：按时间排序
    query = query.orderBy('createTime', 'desc');
  }
  
  const result = await query.limit(20).get();
  
  return {
    success: true,
    posts: result.data,
    total: result.data.length
  };
}