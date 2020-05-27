const Router = require('koa-router')
const router = new Router()

//引入调用云数据库模板
const callCloudDB = require('../utils/callCloudDB.js')
//引入调用云存储模板
const cloudStorage = require('../utils/callCloudStorage.js')

//获取轮播图
router.get('/list',async(ctx,next)=>{
    //1 调用云数据库获取云文件fileId
    const query = `db.collection('0swiper').get()`
    const res = await callCloudDB(ctx, 'databasequery',query)
    //2 云存储下载文件链接
    //2.1 构造符合调用格式的flieList
    let fileList = []
    const data = res.data
    for(let i=0,len = data.length;i< len;i++){
        fileList.push({
            fileid: JSON.parse(data[i]).fileId,
            max_age: 7200
        })
    }
    //2.2 调用云存储获取文件下载链接
    const dlRes = await cloudStorage.download(ctx, fileList)
    //console.log(dlRes)
    //3 构造返回前端的数据格式  
    let returnData = []
    for(let i=0,len = dlRes.file_list.length;i<len;i++){
        returnData.push({
            download_url:dlRes.file_list[i].download_url,
            fileid:dlRes.file_list[i].fileid,
            _id: JSON.parse(data[i])._id
        })
    }
    ctx.body = {
        code: 20000 ,//vue-admin-template前端模板要求的
        data: returnData
    }
    
})


//上传轮播图
router.post('/upload',async(ctx,next)=>{
    const fileid = await cloudStorage.update(ctx)
    //console.log(fileid)
    //3 fileid(cloud://格式)写入数据库
    const query = `
        db.collection('0swiper').add({
            data:{
                fileId:'${fileid}'
            }
        })
    `
    const res = await callCloudDB(ctx,'databaseadd',query)
    ctx.body = {
        code:20000,
        id_list: res.id_list
    }
})

//删除轮播图
router.get('/del',async(ctx,next) => {
    const params = ctx.request.query
    //1 删除数据库
    const query = `db.collection('0swiper').doc('${params._id}').remove()`
    const delDBRes = await callCloudDB(ctx,'databasedelete',query) 

    //2 删除云存储
    const delStorageRes = await cloudStorage.delete(ctx,[params.fileid])
    ctx.body = {
        code: 20000,
        data: {
            delDBRes,
            delStorageRes
        }
    }

})

module.exports = router 