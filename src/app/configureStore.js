//redux
import { createStore, applyMiddleware, compose } from "redux";
// redux 中间件加载
import thunkMiddleware from "redux-thunk";
// 路由跳转
import { createHashHistory as createHistory } from "history";
// router-redux
import { routerReducer, routerMiddleware } from "react-router-redux";
// 根目录路由文件
import rootReducer from "../store/reducers/index.js";
// 加载路由中间件
const routerReducers = routerMiddleware(createHistory()); //路由
const composeEnhancers =
  process.env.NODE_ENV == "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const middleware = [thunkMiddleware, routerReducers];

let configureStore = (initialState) =>
  // 创建 store
  createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );

export default configureStore;
