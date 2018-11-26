const randomStr=function (len) {
    let str='';
    const randomChar=function(){
        const n=Math.floor(Math.random()*62);
        if(n<10) return n;//0-9
        if(n<36) return String.fromCharCode(n+55);//A-Z
        return String.fromCharCode(n+61);//a-z
    };
    while (str.length<len){
        str+=randomChar();
    }
    return str;
};
const parseSearchStr=function(str){
    const reg=/[^?&=]+/gim;
    const arr=str.match(reg);
    const result={};
    if(arr.length>0){
        arr.forEach((item,index)=>{
            if(index % 2 === 0){
                result[arr[index]]=arr[index+1]
            }
        })
    }
    return result;
};
module.exports={
    randomStr,
    parseSearchStr
};