const rp = require('request-promise')
//获取access_token
const getAccessToken = require('./getAccessToken.js')

//fnName:云函数名称  params:云函数需要的数据
const callCloudFn = async(ctx,fnName,params)=>{
    //获取access_token
    const access_token = await getAccessToken()
    //触发云函数HTTP　API
    const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ctx.state.env}&name=${fnName}`
    var options = {
        method: 'POST',
        uri: url,
        body: {
            ...params
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

module.exports = callCloudFn