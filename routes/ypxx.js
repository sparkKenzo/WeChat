const router=require("koa-router")();
const mysql=require("../utils/mysql");

router.get("/cate",async ctx=>{
    const sql="SELECT a.YPLB AS cate,COUNT(b.YPBM) AS count,a.LBMC AS cate_name FROM base_ypxx_yplb a LEFT JOIN base_ypxx b ON a.YPLB=b.YPLB WHERE a.STATUS=1 AND a.LBMC <> '其他' AND a.YPLB_GRADE=? AND a.PORGID=? GROUP BY a.YPLB";
    ctx.body=await mysql.query(sql,[2,2]);
});
router.get("/goods",async ctx=>{
    const {cate,start=0}=ctx.query;
    const sql="SELECT YPBM AS ypbm,YPMC AS ypmc,GG AS gg,DW,XSJG AS price FROM base_ypxx WHERE YPLB=? LIMIT ?,10";
    ctx.body=await mysql.query(sql,[cate,+start]);
});
module.exports=router;