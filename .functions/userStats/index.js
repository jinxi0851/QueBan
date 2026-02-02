const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, userId } = event;
  const { OPENID } = cloud.getWXContext();
  
  try {
    switch (action) {
      case 'getStats':
        return await getUserStats(OPENID);
      case 'getPartnerInfo':
        return await getPartnerInfo(OPENID);
      case 'getCommunications':
        return await getCommunications(OPENID);
      case 'getMyMenus':
        return await getMyMenus(OPENID);
      case 'bindPartner':
        return await bindPartner(event.partnerInviteCode, OPENID);
      case 'generateInviteCode':
        return await generateInviteCode(OPENID);
      default:
        return {
          success: false,
          error: '不支持的操作'
        };
    }
  } catch (error) {
    console.error('用户统计操作失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 获取用户统计信息
async function getUserStats(openid) {
  try {
    // 查询用户发布的帖子
    const postsResult = await db.collection('posts').where({
      _openid: openid
    }).get();
    
    let totalLikes = 0;
    let totalComments = 0;
    postsResult.data.forEach(post => {
      totalLikes += post.likeCount || 0;
      totalComments += post.commentCount || 0;
    });
    
    // 查询收藏数
    const favoritesResult = await db.collection('favorites').where({
      _openid: openid
    }).get();
    
    return {
      success: true,
      stats: {
        likes: totalLikes,
        favorites: favoritesResult.data.length,
        comments: totalComments,
        posts: postsResult.data.length
      }
    };
  } catch (error) {
    throw error;
  }
}

// 获取伴侣信息
async function getPartnerInfo(openid) {
  try {
    const result = await db.collection('cersay_bind_relations').where({
      _openid: openid
    }).get();
    
    if (result.data.length > 0) {
      return {
        success: true,
        partner: result.data[0]
      };
    } else {
      return {
        success: true,
        partner: null
      };
    }
  } catch (error) {
    throw error;
  }
}

// 获取通信记录
async function getCommunications(openid) {
  try {
    // 获取用户信息
    const userResult = await db.collection('users').where({
      _openid: openid
    }).get();
    
    if (userResult.data.length === 0) {
      return {
        success: true,
        communications: []
      };
    }
    
    const user = userResult.data[0];
    
    const result = await db.collection('cersay_communications').where({
      toUserId: user.userId
    }).orderBy('createTime', 'desc').limit(10).get();
    
    return {
      success: true,
      communications: result.data
    };
  } catch (error) {
    throw error;
  }
}

// 获取我的菜单
async function getMyMenus(openid) {
  try {
    const result = await db.collection('menus').where({
      _openid: openid
    }).get();
    
    return {
      success: true,
      menus: result.data
    };
  } catch (error) {
    throw error;
  }
}

// 绑定伴侣
async function bindPartner(partnerInviteCode, openid) {
  try {
    if (!partnerInviteCode) {
      return {
        success: false,
        error: '请输入邀请码'
      };
    }
    
    // 查找邀请码对应的用户
    const usersResult = await db.collection('users').where({
      inviteCode: partnerInviteCode
    }).get();
    
    if (usersResult.data.length === 0) {
      return {
        success: false,
        error: '邀请码无效'
      };
    }
    
    const partnerUser = usersResult.data[0];
    
    // 检查是否已经绑定
    const existingRelation = await db.collection('cersay_bind_relations').where({
      _openid: openid
    }).get();
    
    if (existingRelation.data.length > 0) {
      return {
        success: false,
        error: '已经绑定过伴侣了'
      };
    }
    
    // 创建绑定关系
    await db.collection('cersay_bind_relations').add({
      data: {
        partnerId: partnerUser._id,
        partnerName: partnerUser.nickName,
        bindTime: new Date().toISOString(),
        _openid: openid
      }
    });
    
    return {
      success: true,
      message: '绑定成功！',
      partner: {
        partnerId: partnerUser._id,
        partnerName: partnerUser.nickName
      }
    };
  } catch (error) {
    throw error;
  }
}

// 生成邀请码
async function generateInviteCode(openid) {
  try {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // 保存邀请码到用户表
    await db.collection('users').where({
      _openid: openid
    }).update({
      inviteCode: inviteCode
    });
    
    return {
      success: true,
      inviteCode: inviteCode,
      message: '邀请码已生成'
    };
  } catch (error) {
    throw error;
  }
}