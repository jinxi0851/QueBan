const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { userId, userDishes = [] } = event;
  const { OPENID } = cloud.getWXContext();
  
  try {
    // 获取用户信息
    const userResult = await db.collection('users').where({
      _openid: OPENID
    }).get();
    
    if (userResult.data.length === 0) {
      return {
        success: false,
        error: '用户不存在'
      };
    }
    
    const user = userResult.data[0];
    
    // 检查剩余次数
    if (user.remainingCount <= 0) {
      return {
        success: false,
        error: '今日生成次数已用完'
      };
    }
    
    // 预设菜单库
    const menuDatabase = [
      {
        name: '温馨家常套餐',
        dishes: [
          { name: '番茄炒蛋', tags: ['家常', '快手'], difficulty: '简单', time: '10分钟' },
          { name: '蒜蓉西兰花', tags: ['清淡', '健康'], difficulty: '简单', time: '8分钟' },
          { name: '冬瓜排骨汤', tags: ['汤品', '营养'], difficulty: '简单', time: '1小时' }
        ],
        tags: ['家常', '营养', '温馨'],
        totalTime: '1小时20分钟'
      },
      {
        name: '经典下饭菜',
        dishes: [
          { name: '红烧肉', tags: ['经典', '下饭'], difficulty: '中等', time: '45分钟' },
          { name: '麻婆豆腐', tags: ['川菜', '下饭'], difficulty: '简单', time: '20分钟' },
          { name: '白灼菜心', tags: ['清淡', '快手'], difficulty: '简单', time: '5分钟' }
        ],
        tags: ['经典', '下饭', '川菜'],
        totalTime: '1小时10分钟'
      },
      {
        name: '清淡营养套餐',
        dishes: [
          { name: '清蒸鲈鱼', tags: ['清淡', '营养'], difficulty: '简单', time: '15分钟' },
          { name: '蒸蛋羹', tags: ['清淡', '营养'], difficulty: '简单', time: '10分钟' },
          { name: '清炒时蔬', tags: ['清淡', '健康'], difficulty: '简单', time: '8分钟' }
        ],
        tags: ['清淡', '营养', '健康'],
        totalTime: '35分钟'
      }
    ];
    
    // 俏皮话库
    const sweetMessages = [
      '今天辛苦啦，给你做顿好吃的~',
      '这道菜超适合今天的你！',
      '猜猜今天吃什么？惊喜来啦~',
      '为你准备的专属菜单，请查收~',
      '今天也要好好吃饭哦！',
      '这道菜里有我对你的爱~',
      '吃饭啦吃饭啦，不许挑食哦~',
      '今天的菜单，是为你量身定制的！'
    ];
    
    // 随机选择菜单
    const randomMenu = menuDatabase[Math.floor(Math.random() * menuDatabase.length)];
    const randomMessage = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
    
    // 如果有用户拿手菜，替换其中一道菜
    if (userDishes.length > 0) {
      const randomDishIndex = Math.floor(Math.random() * randomMenu.dishes.length);
      const randomUserDish = userDishes[Math.floor(Math.random() * userDishes.length)];
      randomMenu.dishes[randomDishIndex] = {
        name: randomUserDish.name,
        tags: ['拿手菜', '个性化'],
        difficulty: randomUserDish.difficulty,
        time: randomUserDish.time
      };
    }
    
    // 保存菜单生成记录
    const menuData = {
      ...randomMenu,
      message: randomMessage,
      userId: userId,
      createTime: new Date().toISOString(),
      _openid: OPENID
    };
    
    const menuResult = await db.collection('menus').add({
      data: menuData
    });
    
    // 更新用户剩余次数
    await db.collection('users').where({
      _openid: OPENID
    }).update({
      remainingCount: _.inc(-1)
    });
    
    // 记录生成历史
    await db.collection('menu_generations').add({
      data: {
        menuId: menuResult._id,
        generationDate: new Date().toISOString().split('T')[0],
        generationTime: Date.now(),
        isShared: false,
        _openid: OPENID
      }
    });
    
    return {
      success: true,
      menu: {
        ...randomMenu,
        message: randomMessage,
        _id: menuResult._id
      },
      remainingCount: user.remainingCount - 1
    };
  } catch (error) {
    console.error('菜单生成失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};