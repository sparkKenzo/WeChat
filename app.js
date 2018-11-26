const   path=require("path"),
        Koa=require('koa'),
        app=new Koa(),
        cors=require("koa2-cors"),
        bodyParser=require("koa-bodyparser"),
        koaStatic=require("koa-static"),
        xmlParser=require("./middleware/xmlParse"),
        router=require('./routes/index');

//配置跨域
app.use(cors({
    origin:'*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
//配置post请求的xml解析中间件
app.use(xmlParser());
//使用ctx.body解析中间件
app.use(bodyParser());
//配置静态资源加载中间件
app.use(koaStatic(path.join(__dirname,"static")));
//加载路由
app.use(router.routes()).use(router.allowedMethods());
//启动服务
app.listen(3000,()=>{
    console.log("server is running at port 3000 now.");
});