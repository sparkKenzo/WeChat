/**
 * Created by zhangwei on 2018/6/12.
 */
/***
 *
 * @options 参数 width height 需带单位
 * @callBack 验证通过回调
 * @err_callBack 验证失败回调
 */

(function ($) {
    $.fn.drag = function (options, callBack, err_callBack) {
        var x, drag = this, isMove = false, config = {}, startTime = new Date().getTime(), endTime, mouseDownTime;
        if (arguments.length !== 0) {
            config.width = options.width || "320px";
            config.height = options.height || "40px";
        } else {
            config.width = "320px";
            config.height = "40px";
        }
        //添加背景，文字，滑块
        var html = '<div class="drag_bg"></div>' +
            '<div class="drag-shadow drag_text " onselectstart="return false;" unselectable="on">请按住滑块,拖动到最右</div>' +
            '<div class="handler handler_bg"></div>';
        this.empty().append(html).css({
            "width": config.width,
            "height": config.height,
            "line-height": config.height
        });
        var handler = drag.find('.handler');
        var drag_bg = drag.find('.drag_bg');
        var text = drag.find('.drag_text');
        var maxWidth = drag.width() - handler.width();  //能滑动的最大间距
        //鼠标按下时候的x轴的位置
        handler.mousedown(function (e) {
            e.stopPropagation();
            if (e.button != 0) {
                return
            }
            isMove = true;
            mouseDownTime = new Date().getTime();
            x = e.pageX - parseInt(handler.css('left'), 10);
        });
        drag_bg.mousedown(function (e) {
            e.stopPropagation();
            if (e.button != 0) {
                return
            }
            isMove = true;
            mouseDownTime = new Date().getTime();
            x = e.pageX - parseInt(handler.css('left'), 10);
        });
        text.mousedown(function (e) {
            e.stopPropagation();
            if (e.button != 0) {
                return
            }
            isMove = true;
            mouseDownTime = new Date().getTime();
            x = e.pageX - parseInt(handler.css('left'), 10);
        });
        //鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
        $(document).mousemove(function (e) {
            var _x = e.pageX - x;
            if (isMove) {
                if (_x > 0 && _x < maxWidth - 5) {
                    handler.css({'left': _x});
                    drag_bg.css({'width': _x});
                } else if (_x >= maxWidth - 5) {  //鼠标指针移动距离达到最大时清空事件
                    endTime = new Date().getTime();
                    handler.css({'left': maxWidth});
                    drag_bg.css({
                        'width': maxWidth,
                        'color': '#fff'
                    });
                    var wait = '<div><span class="sp_1 sp"></span><span class="sp_2 sp"></span>' +
                        '<span class="sp_3 sp"></span>' +
                        '<span class="sp_4 sp"></span>' +
                        '<span class="sp_5 sp"></span>' +
                        '</div>';
                    text.empty().text("验证中").css({'color': '#fff'}).append(wait);
                    _unbind();
                    //页面停留超过5分钟未验证,则验证失败
                    if ((endTime - startTime) > 60000 * 5) {
                        setTimeout(function () {
                            dragFail(err_callBack);
                        }, (1000 + Math.round(Math.random() * 2500)));//随机一个延迟毫秒
                    } else if ((endTime - mouseDownTime) < 70) {//拖动时间小于70毫秒判断非人为验证
                        setTimeout(function () {
                            dragFail(err_callBack);
                        }, (1000 + Math.round(Math.random() * 2500)));//随机一个延迟毫秒
                    } else {
                        setTimeout(function () {
                            dragOk(callBack);
                        }, (1000 + Math.round(Math.random() * 2500)));//随机一个延迟毫秒
                    }
                    text.removeClass("drag-shadow");
                }
            }
        }).mouseup(function (e) {
            isMove = false;
            var _x = e.pageX - x;
            if (_x < maxWidth - 5) { //鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
                handler.animate({'left': 0}, 400);
                drag_bg.animate({'width': 0}, 400);
            }
        });

        //清空事件
        function _unbind() {
            handler.unbind('mousedown');
            drag_bg.unbind('mousedown');
            text.unbind('mousedown');
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
        }

        function dragOk(callback) {
            handler.removeClass('handler_bg').addClass('handler_ok_bg');
            text.removeClass("drag-shadow").removeClass("drag_wait").empty().text('验证通过');
            drag.css({'color': '#fff'});
            if (typeof callback == "function") {
                callback();
            }
        }

        function dragFail(callback) {
            var html = '<div class="drag-error">哎呀，出错了，点击 <span>刷新</span> 再来一次</div>';
            drag.empty().css({"background": "#ffffff"}).append(html);
            $(".drag-error span").on("click", function () {
                drag.css({"background": "#e8e8e8"}).drag(config, callBack, err_callBack);
            });
            if (typeof callback == "function") {
                callback();
            }
        }

    };
})(jQuery);
