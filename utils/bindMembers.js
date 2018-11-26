const query=require("./mysql").query;

module.exports=async function (openid,orgid) {

    const selectSql=`SELECT COUNT(*) AS count FROM members WHERE status=1 AND openid=? AND orgid=?`;
    const insertSql=`INSERT INTO members (create_time,openid,orgid) VALUES (Now(),?,?)`;
    const res=await query(selectSql,[openid,orgid]);
    if(res[0].count === 0){
        query(insertSql,[openid,orgid]);
    }
};