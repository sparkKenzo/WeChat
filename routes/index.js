const   router=require('koa-router')(),
        controller=require('../controller/index'),
        config=require('../config/config'),
        wechat=require('../wechat/weChat'),
        wechatApp=new wechat(config.wechat);
const ypxx=require("./ypxx");
router
    .get('/',controller.getHandle)
    .post('/',controller.postHandle)
    .get('/getAccessToken',ctx=>{
        wechatApp.getAccessToken().then(data=>{
            ctx.body=data;
        })
    })
    .get('/getUserInfo',controller.getUserInfo)
    .get('/getQRcode/:orgid',controller.getQRcode)
    .post('/getwxjs',controller.getWxJsConfig);
router.use("/api/ypxx",ypxx.routes()).use(ypxx.allowedMethods());
module.exports=router;