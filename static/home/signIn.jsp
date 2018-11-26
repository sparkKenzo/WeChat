<%@page pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>申请入住</title>
    <%@ include file="/ta/inc.jsp" %>
    <link rel="stylesheet" href="<%=basePath %>mis/home/style/px2rem.css">
    <link rel="stylesheet" href="<%=basePath %>mis/home/style/footer.css">
    <link rel="stylesheet" href="<%=basePath %>mis/home/style/signIn.css">
    <link rel="stylesheet" href="<%=basePath %>mis/home/style/jq-slidingValidation.css">
    <!--[if (gte IE 9)|(!IE)]> --><!-- <![endif]-->
    <!--[if lt IE 9]><![endif]-->
</head>
<body>
<div class="header">
    <div class="header-title">
        <a class="logo" href="<%=basePath%>home/homeAction.do">银海药店管理软件</a>
    </div>
</div>
<div class="main">
    <div class="content">
        <div class="info-wrap">
            <h3>欢迎申请预约使用</h3>

            <form action="" id="form1">
                <div class="name-box">
                    <div class="input-box">
                        <input type="text" placeholder="请填写申请人姓名" class="name">
                    </div>
                    <span class="label label1">请填写申请人姓名</span>
                </div>
                <div class="company-box">
                    <div class="input-box">
                        <input type="text" placeholder="请填写公司名称" class="company">
                    </div>
                    <span class="label label1">请填写公司名称</span>
                </div>
                <div class="phone-box">
                    <div class="country-code">+86</div>
                    <div class="phone-wrap input-box">
                        <input type="text" placeholder="请输入手机号码" class="phone">

                    </div>
                    <span class="label label1">请输入手机号码</span>
                    <span class="label label2">手机号码格式不正确，请重新输入</span>

                </div>
                <div class="product-box">
                    <div class="input-box">
                        <input type="text" placeholder="请选择想要申请的产品" class="product" readonly data-value=""
                               onselectstart="return false">
                    </div>
                    <span class="label label1">请选择想要申请的产品</span>

                    <div class="product-list" data-show="0">
                        <ul class="">
                            <li data-value="CSMIS">单体药店管理系统</li>
                            <li class="" data-value="BSMIS">连锁药企管理系统</li>
                            <li class="no-border" data-value="YUNMIS">药店云MIS</li>
                        </ul>
                    </div>
                </div>
            </form>
            <div class="check-box">
                <div id="drag"></div>
                <div class="drag-label ">请拖动滑动验证码</div>
            </div>
            <div class="btn-box">
                <div class="btn-ok" onselectstart="return false">提交申请</div>
            </div>
        </div>
    </div>
</div>
<div class="footer">
    <div class="contact-box">
        <div class="left-contact-box">
            <div class="customer-service">
                <div class="phone-box">
                    <p>售前咨询热线：</p>

                    <p class="p2">(上午9:00--下午18:00)</p>

                    <h3>028-65516145</h3>
                </div>
            </div>
        </div>
        <div class="right-contact-box">
            <div class="address-box">
                <div>
                    <p>四川久远银海软件股份有限公司</p>

                    <p>股票代码：002777</p>

                    <p>www.yinhai.com</p>

                    <p>成都市锦江区三色路163号银海芯座</p>
                </div>
            </div>
            <div class="qr-box">
                <p>联系我们</p>
                <img src="<%=basePath %>mis/home/res/qr.png" alt="">
            </div>
        </div>
    </div>
    <div class="copyright-box">
        <p>© 2009-2018 yinhai.com 版权所有 ICP证：浙B2-20080101</p>
    </div>
</div>
</body>
<script src="<%=basePath %>mis/home/js/jquery.min.js"></script>
<script src="<%=basePath %>mis/home/layer/layer.js"></script>
<script src="<%=basePath %>mis/home/js/jq-slidingValidation.js"></script>
<script src="<%=basePath %>mis/home/js/signIn.js"></script>
</html>