import React from 'react';
// redux 插件
import {Provider} from 'react-redux';
// 路由
import Routers from './router/index';
// react-loadable 可用于按需加载
import Loadable from 'react-loadable';

// 创建react app
const createApp=({store,history,modules})=>{
  console.log(process.env.NODE_ENV==='production',process.env.NODE_ENV)
  // 如果是生产环境
  if(process.env.NODE_ENV==='production'){
    return (
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <Provider store={store}>
          <Routers history={history} />
        </Provider>
      </Loadable.Capture>
    )

  }else{
    // 如果是开发环境
    return (
      <Provider store={store}>
        <Routers history={history} />
      </Provider>
    )
  }

}

export default createApp;
