const rp = require('request-promise')
//获取access_token
const getAccessToken = require('./getAccessToken.js')
const fs = require('fs')


const cloudStorage = {
    async download(ctx,fileList) {
    //获取access_token
    const access_token = await getAccessToken()
    //触发云函数HTTP　API
    const url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${access_token}`
    var options = {
        method: 'POST',
        uri: url,
        body: {
            env: ctx.state.env,
            file_list: fileList
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
            console.log(err)
        });
    },

    async update(ctx){
        //1 获取上传文件的链接
        const file = ctx.request.files.file
        const path = `0swiper/${Date.now()}-${Math.random()*1000000}-${file.name}`
        //获取access_token
        const access_token = await getAccessToken()
        //触发云函数HTTP　API
        const url = `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`
        var options = {
            method: 'POST',
            uri: url,
            body: {
                path,
                env: ctx.state.env
            },
            json: true // Automatically stringifies the body to JSON
        };
        const info = await rp(options)
            .then( (res) => {
                return res
            })
            .catch(function (err) {
                console.log(err)
            });

        //2 上传文件
        const params = {
            method: 'post',
            headers: {
                'content-type': 'multipart/form-data'
            },
            uri: info.url,
            formData:{
                key:path,
                Signature:info.authorization,
                'x-cos-security-token':info.token,
                'x-cos-meta-fileid':info.cos_file_id,
                file:fs.createReadStream(file.path)  //转化成二进制
            }
        }
        await rp(params)
        return info.file_id
    },

        //参数 fileIdList : 文件ID （cloud://格式）
    async delete(ctx,fileIdList){
        //获取access_token
        const access_token = await getAccessToken()
        //触发云函数HTTP　API
        const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${access_token}`
        const options = {
            method: 'POST',
            uri: url,
            body: {
                env: ctx.state.env,
                fileid_list: fileIdList
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
                console.log(err)
            });
    }



}

module.exports = cloudStorage