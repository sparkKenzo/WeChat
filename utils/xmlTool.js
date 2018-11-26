const xml2js=require('xml2js');

module.exports={
    xmlToJson:str => {
        return new Promise((resolve, reject) => {
            xml2js.parseString(str,{explicitArray : false},(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    },
    jsonToXml:obj => {
        const builder=new xml2js.Builder();
        return builder.buildObject(obj);
    }
};