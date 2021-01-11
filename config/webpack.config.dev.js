const path = require("path");
const webpack = require("webpack");
// html 插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 编译进度条显示
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
// 拷贝静态文件插件
const CopyWebpackPlugin = require("copy-webpack-plugin");
// extract-text-webpack-plugin该插件的主要是为了抽离css样式,
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const rootPath = path.join(__dirname, "../");
const devConfig = {
  // 上下文 路劲缩写解析
  context: path.join(rootPath, "./src"),
  // 入口
  entry: {
    client: "./index.js",
    vendors: [
      "react",
      "react-dom",
      "react-loadable",
      "react-redux",
      "redux",
      "react-router-dom",
      "react-router-redux",
      "redux-thunk",
    ],
  },
  // 出口
  output: {
    filename: "[name].[hash:8].js",
    path: path.resolve(rootPath, "./dist/client"),
    publicPath: "/",
    chunkFilename: "[name]-[hash:8].js",
  },
  //
  resolve: {
    // 映入模块文件后缀 可以省略
    extensions: [".js", ".jsx", "css", "less", "scss", "png", "jpg"],
    //
    modules: [path.resolve(rootPath, "src"), "node_modules"],
  },
  // dev服务 开发是用的是dev服务
  devServer: {
    contentBase: "assets",
    hot: true,
    historyApiFallback: true,
    port:3003,
  },
  //编译打包source-map
  devtool: "source-map",
  // loader
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: path.resolve(rootPath, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", "react", "stage-0"],
            plugins: ["transform-runtime", "add-module-exports"],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        include: path.resolve(rootPath, "src"),
        use: ExtractTextPlugin.extract({
          fallback: "style-loader", //style-loader 将css插入到页面的style标签
          use: [
            {
              loader: "css-loader", //css-loader 是处理css文件中的url(),require()等
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [
                  require("autoprefixer")({ browsers: "last 5 versions" }),
                ],
                sourceMap: true,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            limit: 1024,
            name: "img/[sha512:hash:base64:7].[ext]",
          },
        },
      },
    ],
  },
  // 插件
  plugins: [
    //使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
    new webpack.NoEmitOnErrorsPlugin(),
    // 拷贝静态文件插件
    new CopyWebpackPlugin([{ from: "favicon.ico" }]),
    //缓存包 热启动
    new webpack.HotModuleReplacementPlugin(),
    new ProgressBarPlugin({ summary: false }),
    // extract-text-webpack-plugin该插件的主要是为了抽离css样式,
    new ExtractTextPlugin({ filename: "style.[hash].css" }),
    //DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
    }),
    // 拆包编译
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendors", "manifest"],
      minChunks: 2,
    }),
    // html 插件
    new HtmlWebpackPlugin({
      title: "test1",
      filename: "index.html",
      template: "./index.ejs",
    }),
  ],
};

module.exports = devConfig;
