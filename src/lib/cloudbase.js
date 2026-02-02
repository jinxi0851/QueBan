import cloudbase from '@cloudbase/js-sdk'

// 云开发初始化
const app = cloudbase.init({
  env: "cersay-0gtnza71ab2663d4", // 环境 ID
  region: "ap-shanghai" // 地域，不传默认为上海地域
})

export default app

// 导出常用方法
export const callFunction = (params) => {
  return app.callFunction(params)
}

export const getCloudInstance = () => {
  return app
}