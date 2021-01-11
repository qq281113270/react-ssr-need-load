import React from "react";
// react 服务器渲染插件
import { renderToString } from "react-dom/server";
// 路由跳转插件
import { createHashHistory as createHistory } from "history";
//
import { getBundles } from "react-loadable/webpack";

import stats from "../dist/react-loadable.json";
// react-helmet 管理对文档头的所有更改 demo https://blog.csdn.net/ziyer666/article/details/105512860
import Helmet from "react-helmet";

import { matchPath } from "react-router-dom";

import { matchRoutes } from "react-router-config";

import client from "../src/app/index.js";
// 路劲解析包
import path from "path";
// 文件读写包
import fs from "fs";
// redux
let configureStore = client.configureStore;
// react 根组件
let createApp = client.createApp;
// 路由配置
let routesConfig = client.routesConfig;
// 创建redux Store
const createStore = (configureStore) => {
  let store = configureStore();
  return store;
};

// 创建标签，script 和 css 标签
const createTags = (modules) => {
  let bundles = getBundles(stats, modules);
  let scriptfiles = bundles.filter((bundle) => bundle.file.endsWith(".js"));
  let stylefiles = bundles.filter((bundle) => bundle.file.endsWith(".css"));
  let scripts = scriptfiles
    .map((script) => `<script src="/${script.file}"></script>`)
    .join("\n");
  let styles = stylefiles
    .map((style) => `<link href="/${style.file}" rel="stylesheet"/>`)
    .join("\n");
  return { scripts, styles };
};
// 解析html
const prepHTML = (
  data,
  { html, head, rootString, scripts, styles, initState }
) => {
  //替换html
  data = data.replace("<html", `<html ${html}`);
  //添加样式
  data = data.replace("</head>", `${head} \n ${styles}</head>`);
  //添加内容
  data = data.replace(
    '<div id="root"></div>',
    `<div id="root">${rootString}</div>`
  );
  // 添加 body 内容
  data = data.replace(
    "<body>",
    `<body> \n <script>window.__INITIAL_STATE__ =${JSON.stringify(
      initState
    )}</script>`
  );
  // 添加 script
  data = data.replace("</body>", `${scripts}</body>`);
  //返回html
  return data;
};

// 路由解析
const getMatch = (routesArray, url) => {
  return routesArray.some((router) =>
    matchPath(url, {
      path: router.path,
      exact: router.exact,
    })
  );
};

const makeup = (
  ctx,  // koa ctx
  store, // redux
  createApp,  // 组件
  html //html
  ) => {
  // 获取redux state
  let initState = store.getState();
  // 创建路由对象
  let history = createHistory({ initialEntries: [ctx.req.url] });

  let modules = [];
  // 把组件转换成html string
  let rootString = renderToString(createApp({ store, history, modules }));
  // 创建 scripts 和 styles 标签
  let { scripts, styles } = createTags(modules);
  // 创建 头文件模板
  const helmet = Helmet.renderStatic();
  // 替换html
  let renderedHtml = prepHTML(html, {
    // html
    html: helmet.htmlAttributes.toString(),
    // 头文件
    head:
      helmet.title.toString() + helmet.meta.toString() + helmet.link.toString(),
    // 内容
    rootString,
    // scripts标签
    scripts,
    // 样式标签
    styles,
    // redux
    initState,
  });
  //返回html
  return renderedHtml;
};

const clientRouter = async (ctx, next) => {
  // 读取打包后的html
  let html = fs.readFileSync(
    path.join(path.resolve(__dirname, "../dist"), "index.html"),
    "utf-8"
  );
  // 获取store
  let store = createStore(configureStore);

  let branch = matchRoutes(routesConfig, ctx.req.url);

  let promises = branch.map(({ route, match }) => {
    return route.thunk ? route.thunk(store) : Promise.resolve(null);
  });
  await Promise.all(promises).catch((err) => console.log("err:---", err));
   // 路由解析
  let isMatch = getMatch(routesConfig, ctx.req.url);

  if (isMatch) {
    //渲染html
    let renderedHtml = await makeup(
      ctx,  // koa ctx
      store, // redux
      createApp,  // 组件
      html //html
    );
    // 把html传递给客户端
    ctx.body = renderedHtml;
  }
  await next();
};

export default clientRouter;
