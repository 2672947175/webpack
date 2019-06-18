## 打包多页应用

- 文件目录
- src
  - index.js
  - other.js
  - a.css
- public
  - index.html
  - other.html
- webpackconfig.js

* 入口需要配置成对象
* npx webpack 命令等于我们之前配置 npm run build

```
entry:{
		home:'./src/index.js'
		other:'./src/other.js'
	}
```

- 出口需要多个出口，改变 filename 的写法
  filename:'[name.js]'
- 保证 html 页面引入自己对应的 js
  使用 chunks 代码块 来完成  
  chunks:['home']  
  如果 home 也许使用 other
  chunks:['home','other']

```
  let pages = [{
    filename:'index.html',
    chunk:'index'
},{
    filename:'login.html',
    chunk:'login'
}].map((item)=>{ // webpack splitChunks 可以配置公共文件的
    return new HtmlWebpackPlugin({ // 配置输出的html格式
        filename:item.filename,
        title:'hello',
        minify:{
            removeAttributeQuotesd:true,
            collapseWhitespace:true,
        },
        chunks:[item.chunk], // 设置引用的代码块
        hash:true, // ? 后面的名字
        template:'./public/index.html'
    })
})
```

## 区分环境

webpack.config.js 改成 webpack.base.js
新建文件 webpack.prod.js 和 webpack.dev.js

- 配置开发环境的写法

```
webpack.dev.js
let {smart} = require('webpack-merge');
let base = require('./webpack.base.js');

module.exports = smart(base,{
   mode: 'development',
   devServer:{

   },
   devtool:'source-map'
})
```

- 配置生产环境的写法

```
let {smart} = require('webpack-merge');
let base = require('./webpack.base.js');

module.exports = smart(base,{
   mode: 'production',
   optimization:{
     minimizer:[

     ]
   },
   plugins:[]
})
```

##区分生产环境和开发环境配置

1. webpack 配置目录

- build
  - webpack.config.js
  - webpack.prod.config.js
  - webpack.dev.config.js

2. 下载 webpack 合并配置的插件 npm install webpack-merge
3. 拆分生产环境和开发环境的写法
4. 配置 package.json 脚本可以配置--env. 后跟我们的环境变量

```
package.json配置
```

scripts": {
"dev":"webpack-dev-server --env.development --config ./build/webpack.config.js",
"build": "webpack --env.production --config ./build/webpack.config.js"
}

```
let merge = require('webpack-merge');
module.exports = (env) => {
  console.log(process.env.xxx); // 可以通过cross-env 来设置环境变量
  if(env.production){
    // 生产环境
    return merge(base,prod);
  }else{
    return merge(base,dev);
  }
}
```

## 代码拆分

6. 抽离公共代码(多入口)

```
optimization:{ // commonChunkPlugins
    splitChunks:{ // 分割代码块
      cacheGroups:{ // 缓存组
        common:{ // 公共的模块
          chunks:'initial',
          minSize:0,
          minChunks:2,
        },
        vendor:{ //第三方模块
          priority:1, //权重
          test:/node_modules/, // 把你抽离出来
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      }
    }
  }
```

wepack 框架配置 vue 的使用

## 打包分析插件 帮助我们做 webpack 优化的

webpack 分析插件  
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
