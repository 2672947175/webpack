const path = require('path');
const HtmlWebpcakPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// reslove函数用来返回一个绝对路径
const resolve = file => path.resolve(__dirname, file);

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: resolve('dist'),
  },
  devServer: {
    port: 3000,
    contentBase: './dist',
    compress: true,
    open: true,
    proxy: {},
    before(app) {
      app.get('/ban', (req, res) => {
        res.json({ name: 'leilei' });
      });
    },
    overlay: true, // eslint 报错弹框
  },
  plugins: [
    //   抽里 html
    new HtmlWebpcakPlugin({
      template: './src/index.html',
      filename: 'index.html',
      hash: true,
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
    }),
    // 抽里css
    new MiniCssExtractPlugin({
      filename: 'main.css', // 抽里出来的css的文件名
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        // css 是抽出来的
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        // 内联样式
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'], // 预设
              plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]], // 插件
            },
          },
        ],
        include: resolve('src'),
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'eslint-loader',
        // 不需要检查的地方
        include: resolve('src'),
        exclude: /node_modules/,

      },
    ],
  },
};
