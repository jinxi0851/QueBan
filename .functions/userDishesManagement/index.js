const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { action, dishData, dishId } = event;
  const { OPENID } = cloud.getWXContext();
  
  try {
    switch (action) {
      case 'getDishes':
        return await getUserDishes(OPENID);
      case 'addDish':
        return await addDish(dishData, OPENID);
      case 'deleteDish':
        return await deleteDish(dishId, OPENID);
      default:
        return {
          success: false,
          error: '不支持的操作'
        };
    }
  } catch (error) {
    console.error('拿手菜操作失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 获取用户拿手菜
async function getUserDishes(openid) {
  try {
    const result = await db.collection('user_dishes').where({
      _openid: openid
    }).get();
    
    return {
      success: true,
      dishes: result.data || []
    };
  } catch (error) {
    throw error;
  }
}

// 添加拿手菜
async function addDish(dishData, openid) {
  try {
    if (!dishData.name || !dishData.name.trim()) {
      return {
        success: false,
        error: '菜名不能为空'
      };
    }
    
    const newDish = {
      name: dishData.name.trim(),
      difficulty: dishData.difficulty || '中等',
      time: dishData.time || '20分钟',
      description: dishData.description || '',
      createTime: new Date().toISOString(),
      _openid: openid
    };
    
    const result = await db.collection('user_dishes').add({
      data: newDish
    });
    
    return {
      success: true,
      dishId: result._id,
      message: '添加成功'
    };
  } catch (error) {
    throw error;
  }
}

// 删除拿手菜
async function deleteDish(dishId, openid) {
  try {
    if (!dishId) {
      return {
        success: false,
        error: '菜品ID不能为空'
      };
    }
    
    // 检查菜品是否存在且属于当前用户
    const dishResult = await db.collection('user_dishes').doc(dishId).get();
    
    if (dishResult.data._openid !== openid) {
      return {
        success: false,
        error: '无权删除该菜品'
      };
    }
    
    await db.collection('user_dishes').doc(dishId).remove();
    
    return {
      success: true,
      message: '删除成功'
    };
  } catch (error) {
    throw error;
  }
}