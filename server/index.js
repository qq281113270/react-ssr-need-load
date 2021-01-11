// 兼容日志
require("./ignore.js")();
require("babel-polyfill");
require("babel-register")({
  presets: ["env", "react", "stage-0"],
  plugins: [
    "react-loadable/babel",
    "syntax-dynamic-import",
    "dynamic-import-node",
  ],
});

// 获取app
const app = require("./app.js").default,
  // 获取路由
  clientRouter = require("./clientRouter.js").default,
  // 获取端口
  port = process.env.port || 3002,
  // 设置静态目录
  staticCache = require("koa-static-cache"),

  path = require("path"),
  //跨域设置
  cors = require("koa2-cors"),
  // react-loadable 按需加载
  Loadable = require("react-loadable");
// 跨域请求设置
app.use(cors());
// 加载路由
app.use(clientRouter);
// 设置静态目录
app.use(
  staticCache(path.resolve(__dirname, "../dist"), {
    maxAge: 365 * 24 * 60 * 60,
    gzip: true,
  })
);

//输出启动日志
console.log(
  `\n==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.\n`
);

Loadable.preloadAll().then(() => {
  // 启动服务
  app.listen(port);
});
