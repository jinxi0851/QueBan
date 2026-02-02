const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  const { action, phoneNumber, verificationCode, verificationInfo } = event;
  
  try {
    switch (action) {
      case 'getVerification':
        // 获取短信验证码
        const verificationResult = await cloud.auth().getVerification({
          phone_number: phoneNumber
        });
        
        return {
          success: true,
          verificationInfo: verificationResult,
          message: '验证码发送成功'
        };
        
      case 'signInWithSms':
        // 短信验证码登录
        const signInResult = await cloud.auth().signInWithSms({
          verificationInfo,
          verificationCode,
          phoneNum: phoneNumber
        });
        
        return {
          success: true,
          user: signInResult.user,
          message: '登录成功'
        };
        
      default:
        return {
          success: false,
          error: '不支持的操作'
        };
    }
  } catch (error) {
    console.error('短信验证错误:', error);
    return {
      success: false,
      error: error.message || '操作失败'
    };
  }
};