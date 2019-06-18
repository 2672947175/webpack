const merge = require('webpack-merge') 
const config = require('./config') 
const dev = require('./webpack.dev.config') 
const prod = require('./webpack.prod.config') 
module.exports =(env)=> {
    // console.log(env)
    if(env.development){
       return merge(config,dev)
    }else{
       return merge(config,prod)

    }
}
