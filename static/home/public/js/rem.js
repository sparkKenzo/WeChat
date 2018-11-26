function resize(){
    var domEle=document.documentElement;
    var domWidth=domEle.getBoundingClientRect().width;
    var fontSize=domWidth*100/1920;
    fontSize=fontSize > 85 ? fontSize :85;
    domEle.style.fontSize=fontSize+"px";
}
window.onresize=resize;
window.onload=resize;