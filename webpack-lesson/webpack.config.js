// 引入 path
const path = require('path');
// 抽里 html的插件
const HtmlWebpcakPlugin = require('html-webpack-plugin');
// 抽里css 的插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//  这个插件用来来缩小你的css。
const OptimizeCssAssetsWebpackPlugin=require('optimize-css-assets-webpack-plugin');
//  这个插件用来缩小你的JavaScript。
const TerserWebpackPlugin=require('terser-webpack-plugin');
// 引入 webpack 
const webpack = require('webpack')
// 这个插件用来在html中引入 cdn 优化
const AddAssetHtmlCdnWebpackPlugin = require('add-asset-html-cdn-webpack-plugin');
// 每次打包都清除dist文件插件
const {CleanWebpackPlugin} =require("clean-webpack-plugin");
// 拷贝插件
const  CopyWebpackPlugin=require('copy-webpack-plugin');
// 多线程happypack
const happypack = require('happypack')
// 解析vue中
const vueLoaderPlugin = require('vue-loader/lib/plugin')

// reslove函数用来返回一个绝对路径
const resolve = file => path.resolve(__dirname, file);
// 抛出
module.exports = {
  //  生产环境
  mode: 'production',
  // 开发环境
  // mode: 'development',

  entry: './src/index.js',
  output: {
    path: resolve('dist'),
    // 创建js文件夹
    filename:'js/main.js',
    // 全部添加域名 也可以给css || img 自己加域名
    // publicPath:'www.baidu.com'
  },
  // 启动服务器
  devServer: {
    port: 3000,
    // 目录里面 如果没有dist文件夹 会在内存里面自动创建
    contentBase: './dist',

    compress: true,
    // 是否自动启动浏览器
    open: true,
    // 跨域
    proxy: {},
    // 告诉devServer 我要启动热更新
    hot:true, 
    // 可以在webpack中配置请求
    before(app) {
      app.get('/ban', (req, res) => {
        res.json({ name: 'leilei' });
      });
    },
    // overlay: true, // eslint 报错弹框
  }, //end devServer

  // 源码映射 解决报错问题的时候在控制台中可以很清晰的找到
  devtool:'source-map',

// 优化项 
  optimization: { //优化
    usedExports:true,
    
    minimizer: [
      // css 压缩优化
      new OptimizeCssAssetsWebpackPlugin({}),
      // js 压缩优化
      new TerserWebpackPlugin({}),
    ]
  }, //end optimization

// 忽略打包项(主要是引入cdn资源的时候)
  externals:{
    // 忽略 jquery 文件打包因为它引入了 cdn
    jquery:"jQuery"
  }, // end externals

// 引入插件
  plugins: [
    // 使用vue插件
    new vueLoaderPlugin(),
    // 多线程打包
    new happypack({
      id:"js",
      use:["babel-loader"]
    }),
    // 忽略语言包 
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    // 启动热更新
    new webpack.HotModuleReplacementPlugin(),
    // 告诉你那个模块更新了，只起提示作用
    new webpack.NamedModulesPlugin(),
    //   抽里 html
    new HtmlWebpcakPlugin({
      // 初始化模板
      template: './public/index.html',
      // html 文件名
      filename: 'index.html',
      // 是否配置哈希值
      hash: true,
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
    }),
    // 抽里css
    new MiniCssExtractPlugin({
      // 抽里出来的css的文件名
      filename: 'css/main.css', 
      // css 域名
    }),
      // 引入jquery 第二种方法
    // webpack jquery
    new webpack.ProvidePlugin({
      // 在 webpack 中定义内置 jquery
      $:'jquery'
    }),

    // 引入cdn 优化
    new AddAssetHtmlCdnWebpackPlugin(true,{
      jquery:'http://code.jquery.com/jquery-3.4.1.js',
      vue: '//cdn.bootcss.com/vue/2.5.16/vue.min.js',
      vueRouter: '//cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
      axios: '//cdn.bootcss.com/axios/0.18.0/axios.min.js'
    }),
    // 每次打包都清除dist文件插件
    new CleanWebpackPlugin(),
    // 作者 版权
    new webpack.BannerPlugin('make by lxp, 版本号：webpack4.0'),
    // dist下面拷贝静态资源
    new CopyWebpackPlugin([
      {
        // 从那里拷贝
        from:'./src/static',
         // 拷贝到哪里
        to:'./static'
      }
    ]),


    // 查看环境变量
    /**  查看环境变量 有两种方法
     * 1.直接在页面的js文件中使用 process.env.NODE_ENV
     * console.log(process.env.NODE_ENV)
     * 
     * 2.在webpack.config.js 里面的 plugins 中定义
     * new webpack.DefinePlugin({
     *  evn:JSON.stringify('production'),
     * })
     * evn 的使用
     * 在页面中的js 文件里面 console.log(evn)
     * 
     */
    new webpack.DefinePlugin({
      // 字符串必须包2层
      // evn:"'production'",
      evn:JSON.stringify('production'),
    })

  ], // end plugins

  /**********配置扩展名***********/
  resolve: {
    extensions: ['.js','.json', '.vue'],
    alias: {
      '@': resolve('src'),
      "vue$":'vue/dist/vue.esm.js'
    },
  }, //end resolve

  /*******配置模板****************/ 
  module: {
    // 优化 不解析 jquer
    noParse:'/jquer/',
    rules: [
      // vue 
      {
        test:/\.vue$/,
        use:'vue-loader',
      },
      // 引入jquery 第一种方法直接引入
      // {
      //   test:require.resolve('jquery'),
      //   loader:"expose-loader?$"
      // },
      // {
      //   test: /\.(jpg|gif|jpeg|png)$/,
      //   use:{ 
      //     loader:'file-loader',
      //     options:{
      //       limit: 8*1024,
      //       output: '/img',
      //     }
      //   },
      // },
      // 图片打包
      {
        test: /\.(jpg|gif|jpeg|png)$/,
        use:{ 
          loader:'url-loader',
          options:{
            limit: 8*1024,
            outputPath:'/img/',
            // 单独域名
            // publicPath:'www.baidu.com'
          }
        },
      },
      // 处理html图片不显示问题
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      // css
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },      
      // less
      {
        test: /\.less$/,
        // 内联样式
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
       // js 单线程  3436ms 在文件很少的是后使用
      // {
      //   test: /\.js$/,
      //   use: 'babel-loader',
      //   include: resolve('src'),
      //   exclude: /node_modules/,
      // },
      // 多线程打包 4764ms 在文件很多的时候使用
      {
        test: /\.js$/,
        // 告诉
        use: 'happypack/loader?id=js',
        include: resolve('src'),
        exclude: /node_modules/,
      },
       // eslint 
      // {
      //   enforce: 'pre',
      //   test: /\.js$/,
      //   use: 'eslint-loader',
      //   // 不需要检查的地方
      //   include: resolve('src'),
      //   exclude: /node_modules/,

      // },
    ],
  },
};

