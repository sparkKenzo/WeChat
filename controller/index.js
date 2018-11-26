const config=require('../config/config');
const wechat=require('../wechat/weChat');
const wechatApp=new wechat(config.wechat);
const msg=require("../wechat/msg");
const bindMembers=require("../utils/bindMembers");

module.exports={
    getHandle:async ctx=>{
        const result=wechatApp.auth(ctx);
        if(result){
            ctx.body=ctx.query.echostr;
        }else{
            ctx.body={
                code:-1,
                msg:"微信平台签名消息验证失败"
            }
        }
    },
    postHandle:async(ctx)=>{
        let data,//post请求发送过来的数据
            result,//返回的消息内容
            param;//扫描带参数二维码的参数值
        data=ctx.req.body ? ctx.req.body.xml : "";
        if(!data){
            ctx.body="error request";
            return;
        }
        const {ToUserName:toUser,FromUserName:fromUser}=data;
        if(data.MsgType.toLowerCase() === "event"){
            switch (data.Event.toLowerCase()){
                case 'subscribe':
                    //回复消息
                    let content = "欢迎关注 chen 公众号，一起斗图吧。回复以下数字：\n";
                    content += "1.你是谁\n";
                    content += "2.关于Node.js\n";
                    content += "回复 “文章”  可以得到图文推送哦~\n";
                    result=msg.txtMsg(fromUser,toUser,content);
                    if(data.EventKey){
                        param=data.EventKey.substr(8);
                        wechatApp.sendCustomServiceMsg(fromUser,`请先绑定${param}药店会员信息`);
                        bindMembers(fromUser,param);
                    }
                    break;
                case 'unsubscribe':
                    console.log("取消关注");
                    break;
                case "scan":
                    param=data.EventKey;
                    let text=`请先绑定${param}药店会员信息`;
                    result=msg.txtMsg(fromUser,toUser,text);
                    bindMembers(fromUser,param);
                    break;
            }
        }else if(data.MsgType.toLowerCase() === "text"){
            //根据消息内容返回消息信息
            switch (data.Content){
                case "1":
                    result=msg.txtMsg(fromUser,toUser,"Hello,我是chen。");
                    break;
                case "2":
                    result=msg.txtMsg(fromUser,toUser,"Node.js是一个开放源代码、跨平台的JavaScript语言运行环境，采用Google开发的V8运行代码,使用事件驱动、非阻塞和异步输入输出模型等技术来提高性能，可优化应用程序的传输量和规模。这些技术通常用于数据密集的事实应用程序");
                    break;
                case "文章":
                    const contentArr=[
                        {
                            Title:"Banner",
                            Description:"It's just banner",
                            PicUrl:"http://20100214.nat100.top/banner.png",
                            Url:"www.yinhai.com"
                        },
                        {
                            Title:"五边形",
                            Description:"It's just five border shape",
                            PicUrl:"http://20100214.nat100.top/block.png",
                            Url:"www.baidu.com"
                        }
                    ];
                    result=msg.graphicMsg(fromUser,toUser,contentArr);
                    break;
                default:
                    result=msg.txtMsg(fromUser,toUser,"没有这个选项。");
            }
        }
        ctx.type="application/xml";
        ctx.body=result;
    },
    //获取用户信息
    getUserInfo:async (ctx)=>{
        const code=ctx.query.code;
        const info=await wechatApp.getAuthAccessToken(code);
        ctx.body=await wechatApp.getUserInfo(info);
    },
    //根据传入的orgid生成带参数的公众号二维码
    getQRcode:async ctx=>{
        const orgid=ctx.params.orgid;
        const token=await wechatApp.getAccessToken();
        const result=await wechatApp.getQRcode(token,orgid);
        ctx.type="image/jpg";
        ctx.body=result;
    },
    //获取JS-SDK的配置信息
    getWxJsConfig:async ctx=>{
        const url=ctx.request.body.url;
        ctx.body=await wechatApp.getJSSDKConfig(url);
    }
};