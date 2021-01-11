import React from 'react';
// 按需加载插件
import Loadable from 'react-loadable';
// redux actions
import {homeThunk} from '../../store/actions/thunk';
//Loading组件提示
const Loading=(props)=>{
  console.log(props)
  return <div>Loading...</div>
}
// 路由组件引入
const LoadableHome = Loadable({
  loader: () =>import(/* webpackChunkName: 'Home' */'../../containers/Home'),
  loading: Loading,
});
const LoadableUser = Loadable({
  loader: () =>import(/* webpackChunkName: 'User' */'../../containers/User'),
  loading: Loading,
});

// 路由配置
const routesConfig=[{
  path: '/',
  exact: true,
  component: LoadableHome,
  thunk: homeThunk,
}, {
  path: '/user',
  component: LoadableUser,
  thunk: ()=>{},
}];

export default routesConfig;




