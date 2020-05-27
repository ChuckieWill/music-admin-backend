const Router = require('koa-router')
const router = new Router()
//引入调用云函数模板
const callCloudFn = require('../utils/callCloudFn.js')
//引入调用云数据库模板
const callCloudDB = require('../utils/callCloudDB.js')


router.get('/list',async(ctx,next)=>{
    const query = ctx.request.query//前端传来的参数
    const res = await callCloudFn(ctx, 'music',{
        $url: 'playlist',
        skip: parseInt(query.skip),
        limit: parseInt(query.limit)
    })

    let data = []
    if(res.resp_data){
        data = JSON.parse(res.resp_data).data
    }
    ctx.body = {
        data,
        code:20000 //vue-admin-template前端模板要求的
    }
})

router.get('/getById',async(ctx,next)=>{
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery',query)
    ctx.body = {
        code: 20000 ,//vue-admin-template前端模板要求的
        data: JSON.parse(res.data)
    }
})

router.get('/del',async(ctx,next)=>{
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').remove()`
    const res = await callCloudDB(ctx, 'databasedelete',query)
    ctx.body = {
        code: 20000 ,//vue-admin-template前端模板要求的
        data: res
    }
})

router.post('/updatePlaylist',async(ctx,next) => {
    const params = ctx.request.body
    const query = `
        db.collection('playlist').doc('${params._id}').update({
            data:{
                name: '${params.name}',
                copywriter: '${params.copywriter}'
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate',query)
    console.log(res)
    ctx.body = {
        code: 20000 ,//vue-admin-template前端模板要求的
        data: res
    }
})

module.exports = router