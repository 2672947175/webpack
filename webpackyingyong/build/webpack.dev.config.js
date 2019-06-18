// 开发环境
module.exports = {
    mode:'development',
    devServer:{
        port:3032,
        contentBase:'./dist',
        proxy:{},
        compress:true,
        open:true,
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    }  
}