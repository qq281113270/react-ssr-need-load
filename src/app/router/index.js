import React from 'react'
// 路由
import {Route, Switch } from 'react-router-dom';
// redux
import  {ConnectedRouter}  from 'react-router-redux';
// 路由配置
import routesConfig from './routes';

const Routers=({history})=>(
  <ConnectedRouter history={history}>
    <div>
      {
        routesConfig.map(route=>(
          <Route key={route.path} exact={route.exact} path={route.path} component={route.component}  thunk={route.thunk}  />
        ))
      }
    </div>
  </ConnectedRouter>
)

export default Routers;