# music-admin-backend
* 开发环境：`node`
* 框架开发: `koa`
* 技术：
  * `koa-router`
  * `request-promise`
  * 跨域问题的解决：`koa2-cors`
  * 对第三方调用微信**云函数 、云数据库、云存储等**的封装

####  使用
* utils/getAccessToken.js

```js
const APPID = 	'微信小程序的appid'
const APPSECRET = '微信小程序的密钥'
```

* app.js

```js
const ENV = '微信小程序的云环境ID'
```

