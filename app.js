const koa = require('koa')
const app = new koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')
//云开发环境
const ENV = 'test-8h1rt'

//解决跨域问题
app.use(cors({
    origin:['http://localhost:9528'] , //数组中存放  可以访问后端的前端域名
    credentials:true //证书  为true
}))

//接受post参数解析
app.use(koaBody({
    multipart: true
}))
 
//入口 -- 全局中间件
app.use(async (ctx, next) => {
    console.log('全局中间件')
    ctx.state.env = ENV
    await next()
})

//导入歌单列表方法
const playlist = require('./controller/playlist.js')
//导入轮播图列表方法
const swiper = require('./controller/swiper.js')
//导入博客列表方法
const blog = require('./controller/blog.js')
//设置路由 路由名为：'/bolg'
router.use('/blog',blog.routes())
//设置路由 路由名为：'/swiper'
router.use('/swiper',swiper.routes())
//设置路由 路由名为：'/playlist'
router.use('/playlist',playlist.routes())

//声明routes()方法的使用
app.use(router.routes())
//允许使用所有的方法
app.use(router.allowedMethods())




//设置后端端口
app.listen(3000,()=>{
    console.log('服务开启在3000端口')
})