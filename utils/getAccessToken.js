const rp = require('request-promise')
const APPID = 	'wx4585ed7abca6e338'
const APPSECRET = 'edf80ecdf2d5335e0ac8c41b52db06ba'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname,'./access_token.json')
//console.log(fileName)

// -------------------------------定义函数----------------------------
//更新AccessToken函数
const updateAccessToken = async () => {
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)
    //console.log(res)
    //写文件
    if(res.access_token){
        fs.writeFileSync(fileName, JSON.stringify({
            access_token:res.access_token,
            createTime: new Date()
        }))
    }else{
        //再次调用获取access_token的函数
        updateAccessToken()
    }
}

//从文件中读取access_token
const getAccessToken = async () => {
    try{
        const readRes = fs.readFileSync(fileName,'utf8')
        const readObj = JSON.parse(readRes)
        //console.log(readObj)
        const createTime = new Date(readObj.createTime).getTime()
        const nowTime = new Date().getTime() 
        if((nowTime - createTime) / 1000 / 60 / 60 >= 2){
            //时间超过了2小时则重新更新并获取
            await updateAccessToken()
            await getAccessToken()
        }
        return readObj.access_token
    }catch(error){
        //没获取则更新access_token
        await updateAccessToken()
        await getAccessToken()
    }
    
}

// -------------------------------调用函数----------------------------
//每两小时就更新一次  并且提前5分钟（官方建议）
setInterval(async () => {
    await updateAccessToken()
},(7200 - 300)*1000)
//updateAccessToken()
//console.log(getAccessToken())  
//将函数抛出
module.exports = getAccessToken