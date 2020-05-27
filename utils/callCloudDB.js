const rp = require('request-promise')
//获取access_token
const getAccessToken = require('./getAccessToken.js')

//fnName : 处理数据库的方式（13种）//query:查询指令
const callCloudDB = async(ctx,fnName,query = {})=>{
    //获取access_token
    const access_token = await getAccessToken()
    //触发云函数HTTP　API
    const url = `https://api.weixin.qq.com/tcb/${fnName}?access_token=${access_token}`
    var options = {
        method: 'POST',
        uri: url,
        body: {
            query,
            env: ctx.state.env
        },
        json: true // Automatically stringifies the body to JSON
    };
    
    return await rp(options)
        .then( (res) => {
           //console.log(res)
           return res
        })
        .catch(function (err) {
            // POST failed...
        });
}

module.exports = callCloudDB