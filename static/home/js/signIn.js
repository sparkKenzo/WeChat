/**
 * Created by zhangwei on 2018/6/12.
 */
$(function () {
    var $product = $(".product"),
        $productItem = $(".product-list li"),
        $productBox = $(".product-list"),
        isDrag = false;
    //生成滑动验证
    $('#drag').drag(
        {width: "3.20rem", height: ".40rem"},
        function () {
            isDrag = true;
            $(".drag-label").text("请拖动滑动验证码").hide();
        },
        function () {
            isDrag = false;
            $(".drag-label").text("验证失败,请刷新重试").hide();
        });
    function checkInput() {
        var isPass = true;
        //检查是否为空
        $("#form1 input").each(function () {
            if (!$(this).val()) {
                $(this).parent().css({"border-color": "#F15533"}).parent().find(".label1").show();
                isPass = false;
            } else {
                $(this).parent().parent().find(".label1").hide();
            }
        });
        if (!checkPhone($(".phone").val())) {
            $(".phone").parent().css({"border-color": "#F15533"}).parent().find(".label2").show();
            isPass = false;
        }
        if (!checkDrag()) {
            isPass = false;
        }
        return isPass
    }//验证输入框输入
    function checkPhone(value) {
        var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        return phoneReg.test(value);
    }

    //滑动验证
    function checkDrag() {
        if (!isDrag) {
            $(".drag-label").show();
            return isDrag
        } else {
            $(".drag-label").hide();
            return isDrag
        }
    }

    function submitForm() {
        if (!checkInput()) {
            return
        }
        var name = $(".name").val(),
            phone = $(".phone").val(),
            company = $(".company").val(),
            productType = $(".product").attr("data-value");
        var param = {
            "dto['name']": name,
            "dto['phone']": phone,
            "dto['company']": company,
            "dto['productType']": productType
        };
        layer.load(1, {
            shade: [0.3, '#fff'] //0.1透明度的白色背景
        });

        $.ajax({
            url: ECBase.basePath + "home/homeAction!addOrder.do",
            type: "POST",
            data: param,
            dataType: "json",
            success: function (data) {
                if (data.success + "" === "true") {
                    layer.open({
                        content: '预约成功'
                        , btn: ['确定']
                        , yes: function (index, layero) {
                            param = null;
                            $("#form1 input").val("");
                            layer.closeAll();
                            window.location.href = ECBase.basePath + "home/homeAction.do"
                        }
                        , cancel: function () {
                            return false
                        }
                    });
                } else {
                    layer.open({
                        content: '预约失败,请重试'
                        , btn: ['确定']
                        , yes: function (index, layero) {
                            layer.closeAll();
                        }
                        , cancel: function () {
                            //return false
                        }
                    });
                }
            },
            complete: function () {
                layer.closeAll('loading');
            }
        })
    }

    $product.on("click", function (e) {
        e.stopPropagation();
        $productBox.attr("data-show") == "0" ?
            $productBox.attr("data-show", "1").animate({"height": "130px"}, 100).prev().css({"border-color": "green"}) :
            $productBox.attr("data-show", "0").animate({"height": "0"}, 100).prev().css({"border-color": "#cccccc"});
    });//产品列表
    $(document).on("click", function () {
        $productBox.attr("data-show") == "0" ? "" : $productBox.attr("data-show", "0").animate({"height": "0"}, 100).prev().css({"border-color": "#cccccc"});
    });//点击空白收起列表
    $productItem.on("click", function () {
        $product.val($(this).text()).attr("data-value", $(this).attr("data-value"));
        $productBox.attr("data-show", "0").animate({"height": "0"}, 0).prev().css({"border-color": "#cccccc"});
    });//产品选择
    $("input").on({
        "focus": function () {
            $(this).parent().css({"border-color": "green"}).parent().find(".label").hide();
        },
        "blur": function () {
            $(this).parent().css({"border-color": "#cccccc"}).parent().find(".label").hide();
        }
    });
    $("input.phone").on("blur", function () {
        $(this).val() ?
            (checkPhone($(this).val()) ?
                $(this).parent().css({"border-color": "#cccccc"}).parent().find(".label2").hide() :
                $(this).parent().css({"border-color": "#F15533"}).parent().find(".label2").show()) :
            "";
    });//电话输入框失去焦点验证
    //点击提交
    $(".btn-ok").on("click", function () {
        submitForm();
    });
});