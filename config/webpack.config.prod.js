const path = require("path");
const webpack = require("webpack");
// 清理文件夹文件
const CleanWebpackPlugin = require("clean-webpack-plugin");
// html 插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
//一个用于生成资产清单的Webpack插件。 webpack及其插件似乎“知道”应该哪些文件生成。答案是，通过 manifest，webpack 能够对「你的模块映射到输出 bundle 的过程」保持追踪。
const ManifestPlugin = require("webpack-manifest-plugin");
// react loadable
const { ReactLoadablePlugin } = require("react-loadable/webpack");
// 拷贝静态文件插件
const CopyWebpackPlugin = require("copy-webpack-plugin");
// extract-text-webpack-plugin该插件的主要是为了抽离css样式,
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const isServer = process.env.BUILD_TYPE === "server";
const rootPath = path.join(__dirname, "../");

const prodConfig = {
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
    path: path.resolve(rootPath, "./dist"),
    publicPath: "/",
    chunkFilename: "[name]-[hash:8].js",
    // libraryTarget: isServer?'commonjs2':'umd',
  },
  resolve: {
    // 映入模块文件后缀 可以省略
    extensions: [".js", ".jsx", ".css", ".less", ".scss", ".png", ".jpg"],
    modules: [path.resolve(rootPath, "src"), "node_modules"],
  },
  // loader
  module: {
    rules: [
      {
        test: /\.jsx?$/,
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
        // extract-text-webpack-plugin该插件的主要是为了抽离css样式,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader", //style-loader将css chunk 插入到html中
          use: [
            {
              loader: "css-loader", //css-loader 是处理css文件中的url(),require()等
              options: {
                minimize: true,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [
                  require("autoprefixer")({ browsers: "last 5 versions" }),
                ],
                minimize: true,
              },
            },
            {
              loader: "sass-loader",
              options: {
                minimize: true,
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

  plugins: [
    //一个用于生成资产清单的Webpack插件。 webpack及其插件似乎“知道”应该哪些文件生成。答案是，通过 manifest，webpack 能够对「你的模块映射到输出 bundle 的过程」保持追踪。
    new ManifestPlugin(),
    //使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
    new webpack.NoEmitOnErrorsPlugin(),
    // extract-text-webpack-plugin该插件的主要是为了抽离css样式,
    new ExtractTextPlugin({
      filename: "css/style.[hash].css",
      allChunks: true,
    }),
    // 拷贝静态文件插件
    new CopyWebpackPlugin([{ from: "favicon.ico", to: rootPath + "./dist" }]),
    // 拷贝静态文件插件
    new CleanWebpackPlugin(["./dist"], { root: rootPath }),
    //DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // html 插件
    new HtmlWebpackPlugin({
      title: "yyy",
      filename: "index.html",
      template: "./index.ejs",
    }),
    // 拆包编译
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendors", "manifest"],
      minChunks: 2,
    }),
    // react loadable
    new ReactLoadablePlugin({
      filename: path.join(rootPath, "./dist/react-loadable.json"),
    }),
  ],
};

module.exports = prodConfig;
