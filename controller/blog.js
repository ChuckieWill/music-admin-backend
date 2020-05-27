const Router = require('koa-router')
const router = new Router()
//引入调用云数据库模板
const callCloudDB = require('../utils/callCloudDB.js')
//引入调用云存储模板
const cloudStorage = require('../utils/callCloudStorage.js')

router.get('/list',async(ctx,next)=>{
    const params = ctx.request.query
    const query = `
        db.collection('blog').skip(${params.start}).limit(${params.count}).orderBy('createTime','desc').get()
    `
    const res = await callCloudDB(ctx, 'databasequery',query)
    ctx.body = {
        code:20000,
        data:res.data
    }
})

router.post('/del',async(ctx,next)=>{
    const params = ctx.request.body
    //1 删除DB-blog
    const queryBlog = `
        db.collection('blog').doc('${params._id}').remove()
    `
    const blogRes = await callCloudDB(ctx,'databasedelete',queryBlog)

    //2 删除DB-blog-comment
    const queryComment = `
        db.collection('blog-comment').where({
            blogId:'${params._id}'
        }).remove()
    `
    const commentRes = await callCloudDB(ctx,'databasedelete',queryComment)

    //3 删除Storage 图片
    const storageRes = await  cloudStorage.delete(ctx,params.img)
    
    ctx.body = {
        code :20000,
        data:{
            blogRes,
            commentRes,
            storageRes
        }
    }
})


module.exports = router