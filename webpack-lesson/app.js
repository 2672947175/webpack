// 配置数据启动服务器
let express = require('express')
let app = express()
let webpack = require('webpack')
let middleware = require('webpack-dev-middleware')
const config = require('./webpack.config')

let compile = webpack(config) // 使用webpack编译 webpack 的配置文件
app.use(middleware(compile)) // 使用middleware中间件编译webpack 和当前服务器同源

// 再启动端口webpack  好处同一个端口 不从在跨域
app.get('/a',(req,res)=>{
    res.json({
        name:'zhangchang'
    })
})
app.listen(300)