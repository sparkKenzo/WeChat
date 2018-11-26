'use strict';

const xmlTool=require("../utils/xmlTool");

exports.txtMsg=function (toUser,fromUser,content) {
    return xmlTool.jsonToXml({
        xml:{
            ToUserName:toUser,
            FromUserName:fromUser,
            CreateTime:Date.now(),
            MsgType:"text",
            Content:content
        }
    })
};
exports.graphicMsg=function (toUser,fromUser,contentArr) {
    return xmlTool.jsonToXml({
        xml:{
            ToUserName:toUser,
            FromUserName:fromUser,
            CreateTime:Date.now(),
            MsgType:"news",
            ArticleCount:contentArr.length,
            Articles:{
                item:contentArr
            }
        }
    });
};