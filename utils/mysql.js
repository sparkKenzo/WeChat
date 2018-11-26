const mysql=require("mysql");
const config=require("../config/config").database;

const pool=mysql.createPool(config);
const query=function (sql,values) {
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connection)=>{
            if(err){
                reject(err);
            }else{
                connection.query(sql,values,(err,result)=>{
                    connection.release();
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            }
        })
    })
};
module.exports={
    query
};