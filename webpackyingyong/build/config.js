const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

module.exports={
    entry:{ //多入口配置
        index:"./src/index.js",
        other:'./src/other.js'
    },
    output:{
        path:path.resolve(__dirname,'../dist'),
        // 你起啥名打包啥名
        filename:'[name].js'

    },
    plugins:[
         new HtmlWebpackPlugin({
             template:'./public/index.html',
             filename:'index.html',
            //  使用chunks 可以保证引入对应的js模块
             chunks:['index'],
             //压缩配置
            minify:{ 
                //去除双引号
                removeAttributeQuotes:true, 
                //折叠去除空格
                collapseWhitespace: true,  
              }
             
         }),
         new HtmlWebpackPlugin({
            template:'./public/other.html',
            filename:'other.html',
            chunks:['other','index'],
            //压缩配置
            minify:{ 
                //去除双引号
                removeAttributeQuotes:true, 
                //折叠去除空格
                collapseWhitespace: true,  
              }
        }),
        new BundleAnalyzerPlugin({})
    ],
    module:{
        rules:[
            {
                test:/\.js$/,
                use:'babel-loader'
            }
        ]
    }
}