import configureStore from './configureStore';
import createApp from './createApp';
import routesConfig from './router/routes';
//暴露给后端渲染用
export default {
  // redux
  configureStore,
  // 创建app 组件
  createApp,
  // 路由配置
  routesConfig
}