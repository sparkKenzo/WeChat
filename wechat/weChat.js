'use strict';
const   fs=require("fs"),
        path=require('path'),
        https=require("https"),
        crypto=require('crypto'),
        util=require("util"),//引入node 的util工具包
        axios=require("axios"),
        menus=require('./menus'),
        accessTokenJson=require('./accessToken'),//引入本地存储的access_token
        jsapiTicket=require('./jsapiTicket'),//引入本地存储的jsapiTicket
        utils=require("../utils/utils_factory");//引入工具函数

const WeChat=function (config) {
  this.config=config;
  this.token=config.token;
  this.appID=config.appID;
  this.appSecret=config.appSecret;
  this.apiDomain=config.apiDomain;
  this.apiURL=config.apiURL;
  //用于处理https GET请求方法
  this.requestGet=function (url) {
      return new Promise((resolve,reject)=>{
        https.get(url,res=>{
            const buffer=[];
            let result="";
            //监听data事件
            res.on('data',data=>{
                buffer.push(data);
            });
            //监听数据传输完成事件
            res.on('end',()=>{
                result=Buffer.concat(buffer).toString('utf-8');
                //将最后结果返回
                resolve(result);
            });
        }).on('error',err=>{
            reject(err);
        })
      })
  }
};

/**
 * 微信接入验证
 */
WeChat.prototype.auth=function (ctx) {
    const that=this;
    this.getAccessToken().then(data=>{
        //格式化请求链接
        const url=util.format(that.apiURL.createMenu,that.apiDomain,data);
        axios.post(url,menus).then(response=>{
            const result=response['data'];
            if(result.errcode === 0){
                console.log("菜单创建成功");
            }else{
                console.log("菜单创建失败");
                console.log(result);
            }
        })
    });
    const {signature,timestamp,nonce}=ctx.query;
    const arr=[this.token,timestamp,nonce].sort();
    //创建加密类型
    const hashCode=crypto.createHash("sha1");
    //对传入的字符串进行加密
    const result=hashCode.update(arr.join(""),"utf8").digest("hex");
    return result === signature;
};
/**
 * 获取微信基础接口的access_token
 * @returns {Promise<any>}
 */
WeChat.prototype.getAccessToken=function(){
    const that=this;
    return new Promise((resolve,reject)=>{
        //获取当前时间
        const currentTime=new Date().getTime();
        //格式化请求地址
        const url=util.format(that.apiURL.accessTokenApi,that.apiDomain,that.appID,that.appSecret);
        //判断本地存储的access_token是否有效
        if(accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime){
            //axios.get(url)
            that.requestGet(url)
                .then(data=>{
                    //const result=data["data"];
                    const result=JSON.parse(data);
                    if(!result.errcode){
                        accessTokenJson.access_token=result.access_token;
                        accessTokenJson.expires_time=new Date().getTime()+(parseInt(result.expires_in)-200)*1000;
                        //更新本地存储
                        fs.writeFile(path.join(__dirname,'./accessToken.json'),JSON.stringify(accessTokenJson),err=>{
                            if(err)throw  err;
                            console.log("accessToken已保存!");
                        });
                        //将获取后的access_token返回
                        resolve(result.access_token);
                    }else{
                        //将错误返回
                        resolve(result);
                    }
                })
                .catch(err=>{
                    //请求出错
                    reject(err);
                })
        }else{
            //将本地存储的access_token返回
            resolve(accessTokenJson.access_token);
        }
    })
};
/**
 * 获取网页授权的access_token
 * @param code
 * @returns {Promise<any>}
 */
WeChat.prototype.getAuthAccessToken=function(code){
    const that=this;
    return new Promise((resolve,reject)=>{
        //格式化请求地址
        const url=util.format(that.apiURL.authAccessToken,that.apiDomain,that.appID,that.appSecret,code);
        axios.get(url)
            .then(res=>{
                resolve(res["data"]);
            })
            .catch(err=>{
                //请求出错
                console.log("请求出错");
                reject(err);
            })
    })
};
/**
 * 获取用户信息
 * @param info
 * @returns {Promise<any>}
 */
WeChat.prototype.getUserInfo=function(info){
    const that=this;
    return new Promise((resolve,reject)=>{
        //格式化拉取用户信息地址
        const infoUrl=util.format(that.apiURL.userInfo,that.apiDomain,info.access_token,info.openid);
        axios.get(infoUrl)
            .then(res=>{
                resolve(res["data"]);
            })
            .catch(err=>{
                //请求出错
                console.log("请求出错");
                reject(err);
            })
    });
};
/**
 * 生成带参数的二维码
 * @param token
 * @param orgid
 * @returns {Promise<any>}
 */
WeChat.prototype.getQRcode=function(token,orgid){
    const that=this;
    return new Promise((resolve,reject)=>{
        //格式化获取ticket地址
        const url=util.format(that.apiURL.qrcodeTicket,that.apiDomain,token);
        axios.post(url,{
            action_name:"QR_LIMIT_STR_SCENE",
            action_info:{
                "scene": {"scene_str": orgid}
            }
        })
        .then(res=>{
            const qrUrl=encodeURI(util.format(that.apiURL.showQRcode,res["data"].ticket));
            /*https.get(qrUrl,res=>{
                let rawData="";
                res.setEncoding("binary");
                res.on("data",chunk=>{
                    rawData+=chunk;
                });
                res.on("end",()=>{
                    resolve(Buffer.from(rawData,"binary"));
                })
            })*/
            axios.get(qrUrl,{
                responseType:"arraybuffer"
            })
                .then(res=>{
                    resolve(Buffer.from(res["data"],"binary"));
                })
        })
        .catch(err=>{
            //请求出错
            console.log("请求出错");
            reject(err);
        })
    })
};
/**
 * 发送客服消息
 * @param toUser
 * @param msg
 * @returns {Promise<any>}
 */
WeChat.prototype.sendCustomServiceMsg=function(toUser,msg){
    const that=this;
    return new Promise(async (resolve,reject)=>{
        //格式化发送客服消息地址
        const token=await that.getAccessToken();
        const url=util.format(that.apiURL.customerService,that.apiDomain,token);
        axios.post(url,{
            "touser":toUser,
            "msgtype":"text",
            "text": {
                "content":msg
            }
        })
        .then(res=>{
            resolve(res["data"]);
        })
        .catch(err=>{
            //请求出错
            console.log("请求出错");
            reject(err);
        })
    })
};
/**
 * 获取jsapiTicket
 * @returns {Promise<any>}
 */
WeChat.prototype.getJsapiTicket=function(){
    const that=this;
    return new Promise(async (resolve,reject)=>{
        //获取当前时间
        const now=Date.now();
        //判断本地的ticket是否有效
        if(jsapiTicket.ticket === "" || jsapiTicket.expires_time < now){
            const token=await that.getAccessToken();
            //格式化请求jsapi_ticket的url
            const url=util.format(that.apiURL.jsapiTicket,that.apiDomain,token);
            axios.get(url)
                .then(res=>{
                    const {errmsg,ticket,expires_in}=res["data"];
                    if(errmsg === "ok"){
                        jsapiTicket.ticket=ticket;
                        jsapiTicket.expires_time=Date.now()+(parseInt(expires_in)-200)*1000;
                        //更新本地存储的jsapiTicket
                        fs.writeFile(path.join(__dirname,"./jsapiTicket.json"),JSON.stringify(jsapiTicket),err=>{
                            if(err) throw err;
                            console.log("jsapiTicket保存成功.");
                        });
                        resolve(ticket);
                    }else{
                        //将错误返回
                        resolve(res["data"]);
                    }
                })
                .catch(err=>{
                    reject(err);
                })
        }else{
            //将本地存储的ticket返回
            resolve(jsapiTicket.ticket);
        }

    })
};
WeChat.prototype.getJSSDKConfig=async function(url){
    const ticket=await this.getJsapiTicket();
    const noncestr=utils.randomStr(16);
    const timestamp=Date.now();
    const str=`jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
    //创建加密类型
    const sha1=crypto.createHash("sha1");
    //对传入的字符串进行加密
    const signature=sha1.update(str,"utf8").digest("hex");
    return {
        appId:this.appID,
        timestamp:timestamp,
        noncestr:noncestr,
        signature:signature
    }
};
module.exports=WeChat;
