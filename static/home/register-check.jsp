<%--
  Created by IntelliJ IDEA.
  User: Zhangwei
  Date: 2018/7/2
  Time: 11:01
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="ta" tagdir="/WEB-INF/tags/tatags" %>
<%@ taglib prefix="ec" tagdir="/WEB-INF/tags/ectags" %>
<!DOCTYPE html>
<html>
<head>
    <title>预约审核</title>
    <%@ include file="/ta/inc.jsp" %>
    <link rel="stylesheet" type="text/css">
</head>
<body>
<ta:panel cssStyle="margin-right:5px" key="预约申请待审核列表" expanded="true">
    <ec:tableTool tableid="ec_tool" cssClass="ec-table-tool">
    </ec:tableTool>
    <ec:table id="registerListInfo" cssClass="ec-table" tdClass="ec-td" thClass="ec-th" showIndex="true">
        <ec:tableColumn id="options" name="操作" html="operate" width="10%"></ec:tableColumn>
        <ec:tableColumn id="order_name" name="联系人姓名" width="18%"></ec:tableColumn>
        <ec:tableColumn id="order_phone" name="联系电话" width="18%"></ec:tableColumn>
        <ec:tableColumn id="order_company" name="公司名称" width="18%"></ec:tableColumn>
        <ec:tableColumn id="product_type" name="产品类型" width="18%"
                        codeValue="[{'id':'YUNMIS','name':'药店云mis'},{'id':'BSMIS','name':'连锁药企管理系统'},{'id':'CSMIS','name':'单体药企管理系统'}]"></ec:tableColumn>
        <ec:tableColumn id="order_time" name="申请日期" width="17%"></ec:tableColumn>
        <ec:tablePage url="${basePath}home/homeAction!getRegisterList.do"
                      id="page" pageStyle="analysis" formId="query"></ec:tablePage>
    </ec:table>
</ta:panel>
</body>
<script src="<%=basePath %>mis/home/layer/layer.js"></script>
<script>
    $(document).ready(function () {
        $("body").taLayout();
        $ec.TableRefresh("registerListInfo");
    });
    function operate(data) {
        var key = "<a order_id='" + data.order_id + "'order_company='" + data.order_company + "'product_type='" + data.product_type + "' href='javascript:;' class='operate' onclick='auditingRegister(event)'>拒绝</a>";
        var key0 = "<a order_id='" + data.order_id + "'order_name='" + data.order_name + "'order_company='" + data.order_company + "'product_type='" + data.product_type + "' href='javascript:;' class='operate' onclick='allowRegister(event)'>通过</a>";
        return key + key0;
    }
    function allowRegister(e) {
        var self = $(e.target);
        var order_id = self.attr("order_id"),
                order_company = self.attr("order_company"),
                product_type = self.attr("product_type"),
                order_name = self.attr("order_name"),
                orgtype = "",
                orgtype_desc = "";
        if (product_type == "CSMIS") {
            orgtype = "02";
            orgtype_desc = "单体药店";
        } else {
            orgtype = "01";
            orgtype_desc = "连锁药店";
        }
        var param = {
            "dto['orgtype']": orgtype,
            "dto['orgtype_desc']": orgtype_desc,
            "dto['orgname']": order_company,
            "dto['order_id']": order_id,
            "dto['w_name']": order_name
        };
        layer.prompt({title: '请分配管理员帐号，并确认', formType: 0}, function (pass, index) {
            layer.close(index);
            var confirm = layer.confirm("是否通过该公司申请预约,并分配管理员帐号:" + pass, {
                btn: ['确认', '取消'] //按钮
            }, function () {
                layer.close(confirm);
                param["dto['w_loginid']"] = pass;
                $.ajax({
                    url: ECBase.basePath + "home/homeAction!allowRegister.do",
                    type: "POST",
                    data: param,
                    dataType: "json",
                    success: function (data) {
                        $ec.TableRefresh("registerListInfo");
                        if (data.success + "" === "true") {
                            Base.msgTopTip("操作成功,审核已通过!");
                        } else {
                            Base.alert(data.err_msg, "error", function () {
                                $ec.TableRefresh("registerListInfo");
                            });
                        }

                    },
                    complete: function () {

                    }
                })

            }, function () {

            });

        })
    }
    function auditingRegister(e) {
        var order_id = $(e.target).attr("order_id");
        var param = {
            "dto['order_id']": order_id
        };
        var confirm2 = layer.confirm("是否拒绝该公司申请预约", {
            btn: ['确认', '取消'] //按钮
        }, function () {
            layer.close(confirm2);
            $.ajax({
                url: ECBase.basePath + "home/homeAction!auditingRegister.do",
                type: "POST",
                data: param,
                dataType: "json",
                success: function (data) {
                    $ec.TableRefresh("registerListInfo");
                    if (data.success + "" === "true") {
                        Base.msgTopTip("操作成功!");
                    } else {
                        Base.msgTopTip("操作失败,请重试或联系管理员!");
                    }

                },
                complete: function () {

                }
            })

        }, function () {

        });
    }
</script>
</html>
<%@ include file="/ta/incfooter.jsp" %>
