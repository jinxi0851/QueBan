const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { planId, planName, price } = event;
  const { OPENID } = cloud.getWXContext();
  
  try {
    // 创建订单记录
    const orderData = {
      planId,
      planName,
      price,
      status: 'pending',
      createTime: new Date().toISOString(),
      _openid: OPENID,
    };
    
    const orderResult = await db.collection('orders').add({
      data: orderData,
    });
    
    // 调用微信支付统一下单接口
    // 注意：这里需要配置微信支付商户号等信息
    // 实际使用时需要替换为真实的支付参数
    const paymentParams = {
      timeStamp: String(Math.floor(Date.now() / 1000)),
      nonceStr: Math.random().toString(36).substring(2, 15),
      package: `prepay_id=wx${orderResult._id}`,
      signType: 'MD5',
      paySign: '模拟签名',
    };
    
    return {
      success: true,
      orderId: orderResult._id,
      paymentParams,
    };
  } catch (error) {
    console.error('创建订单失败:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};