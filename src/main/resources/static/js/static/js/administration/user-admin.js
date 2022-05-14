// 初始化
var table = function(mytable, url) {
    var form = layui.form;
    mytable.init({id: "userTable",pageCode: "user-admin",url: url}).then(function(table) {
            //监听工具条
            table.on("tool(control)", function(obj) {
                var data = obj.data;
                if (obj.event === "edit") {
                    selectedUserId=data.id;
                    $("#uploadButton").val("");
                    app.get("authmodule/AuthTbDepartment/selectByType",{},function(msg) {
                        if (msg.state) {
                            var str = "";
                            for (var i = 0; i < msg.rows.length; i++) {
                                if (msg.rows[i].id == data.fkDepartmentId) {
                                    str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].sname + "</option>";
                                }else{
                                    str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].sname + "</option>";
                                }
                            }
                            $("#tree_partment").append(str);
                            $("#tree_partment").change(function() {
                                // 根据部门获取岗位
                                getPosts();
                            });
                        }
                    });

                    // 设置岗位默认状态
                    app.get("authmodule/AuthTbDepartment/selectById",{
                            id: data.fkDepartmentId
                        },function(msg) {
                            if (msg.state == true) {
                                var str = "";
                                for (var i = 0; i < msg.rows.length; i++) {
                                    if (msg.rows[i].id == data.fkPostId) {
                                        str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].sname + "</option>";
                                    }else{
                                        str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].sname + "</option>";
                                    }
                                }
                                $("#posts").html(str);
                            }
                        }
                    );

                    // 设置角色默认状态
                    app.get("authmodule/authTbUser/selectUserRoleByUserId", {
                            userId: data.id
                        }, function(msg) {
                            if (msg.state) {
                                for (var i = 0; i < msg.rows.length; i++) {
                                    if (msg.rows[i].selectFlag) {
                                        $(".input-rname").eq(i).attr("checked", true);
                                        layui.form.render();
                                    }
                                }
                            }
                        }
                    );
                    //layerInfo("编辑资料", obj);
                    $(".account").val(data.account);
                    $(".name").val(data.username);
                    var radios_sex = $('input:radio[name="sex"]');
                    data.sex == 0 ? $("input[name='sex'][value='0']").prop("checked", true) : $("input[name='sex'][value='1']").prop("checked", true);
                    layui.form.render();
                    $(".IDcard").val(data.idCard);
                    $(".jobNumber").val(data.jobNumber);
                    $(".phone").val(data.phone);
                    $(".email").val(data.email);
                    $("#tree_partment").val(data.fkDepartmentId);
                    $("#posts").val(data.postsID);
                    $("#head_img").attr("src",imgurl + data.headImgAddress).show();
                    var radios_sta = $('input:radio[name="state"]');
                    data.isLock == 0 ? radios_sta.eq(0).prop("checked", true) : radios_sta.eq(1).prop("checked", true);
                    layui.form.render();
                } else if (obj.event === "reset") {
                    // resetPsdLayer();
                    // $(".layui-layer-btn0").on("click", function() {
                    //     var newpsd = $(".setpsd").val();
                    //     app.post("authmodule/authTbUser/resetPassword",{
                    //             id: data.id,
                    //             originalPassword: newpsd
                    //         }, function(msg) {
                    //             console.log(msg);
                    //             if (msg.state == true) {
                    //                 layer.msg(msg.msg);
                    //                 /*setTimeout(function() {
                    //                     window.parent.location.href = "login.html";
                    //                 }, 2000);*/
                    //             }
                    //         }
                    //     );
                    // });

                }else if(obj.event==="delet"){
					layer.confirm(
						"是否删除该用户",
						{shade:0},
						function(){
							app.get(
								"/authmodule/authTbUser/deleteUser",
								{
									id:data.id
								},
								function(msg){
									if(msg.code==1){
                                        console.log('code')
										layer.msg("删除成功");
                                        shuax()
									}else{
										layer.msg(msg.msg)
									}
								}
							)
						}
					)
				}
            });
        });
};
var form;
$(function(mytable) {
    table(mytable, "authmodule/authTbUser/selectUsers");
    layui.use(["form", "element", "layer", "table"], function() {
        var element = layui.element;
        var layer = layui.layer;
        form = layui.form;
        var table = layui.table;
        //layer_rolename();
        getMenuBar();//自定义面包屑，引用public-menu.js
        getRole();
        // getPart();
        user_search();
    });
    //addUser();
    $(".hign-search").on("click", function() {
        if($('.more').hasClass('moreblock')){
            $(".hign-search").removeClass("hign-search-change");
            $(".demoTable .more").removeClass("moreblock");
        }else {
            $(".hign-search").addClass("hign-search-change");
            $(".demoTable .more").addClass("moreblock");
        }
    });
    $("body").keydown(function(event) {
        if (event.keyCode == "13") {
            $(".btn-search").click();
        }
    });
}(mytable));
//修改用户时，将该值传到后端
var selectedUserId=null;

//动态渲染账号类型
app.get('authmodule/sysTbDictCode/selectSysTbDictCodeByfkType', {type:"account_type"}, function (res) {
    var optionList = res.rows, option;
    for (var key in optionList) {
        option = '<option value="' + optionList[key].code + '">' + optionList[key].svalue + '</option>';
        $('#acc_type').append(option);
    }
    layui.form.render();
});

function firstRefresh(){
	$(".layui-laypage-skip input").val(1);
	try {
		$(".layui-laypage-btn")[0].click();
	} catch (error) {
		$(".curSelectedNode").click();
	}
}
function testRefresh(){
	$(".layui-laypage-btn")[0].click(); 
}
// 获取角色
function getRole() {
    var str = "";
    app.get("authmodule/authTbRole/selectRoles", {}, function(msg) {
        if (msg.state) {
            var str1 = '<option value="">全部</option>';
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].roleName + "</option>";
            }
            $("#rolename").html(str1 + str);
            form.render();
        }
    });
}


// 获取部门
// function getPart() {
//     var str = "";
//     app.get("authmodule/AuthTbDepartment/selectByType", {}, function(msg) {
//         if (msg.state) {
//             var str1 = '<option value="">全部</option>';
//             for (var i = 0; i < msg.rows.length; i++) {
//                 str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].sname + "</option>";
//             }
//             $("#partment").html(str1 + str);
//             form.render();
//         }
//     });
// }

function initTree(value) {
    var treeNodes = [];
    app.get("authmodule/AuthTbDepartment/selectByType", '', function (msg) {
        if (msg.state) {
            var data = msg.rows;
            if (value) {
                $("#department_name").val("全部");
                $("#department_id").val("");
                // $('#btnyear').click();
            } else {
                /*ztree树状图的数据结构-liuyuru*/
                treeNodes[0] = {};
                treeNodes[0]['id'] = "";
                treeNodes[0]['name'] = "全部";
                treeNodes[0]['pId'] = "";
                for (var key in data) {
                    var numkey=parseInt(key)+1;
                    treeNodes[numkey] = {};
                    treeNodes[numkey]['id'] = data[key].id;
                    treeNodes[numkey]['name'] = data[key].sname;
                    treeNodes[numkey]['pId'] = data[key].parentId;
                }
                treeDiv("departmentTree", "departmentTreeDiv", "department_name", "department_id", treeNodes, data,function selectclick(){
                    return false;
                });
            }
        } else {
            console.log(msg.msg)
        }
    });
}

// 修改密码弹窗
// function resetPsdLayer() {
//     layer.open({
//         title: ["重置密码", "font-size: 18px;text-align: center;"],
//         btn: ["确定", "取消"],
//         shadeClose: false, //点击遮罩关闭
//         shade: 0,
//         btnAlign: "c",
//         content: '<form class="layui-form" action="" style="text-align: center">'+
//                     '<label class="">密码：</label>'+
//                     '<div class="layui-input-inline">'+
//                         '<input type="password" name="psd" required lay-verify="required" placeholder="请输入操作密码" autocomplete="off" class="layui-input setpsd">'+
//                     '</div>'+
//                 '</form>'
//     });
// }
//刷新
function shuax() {
    var rolename = $("#rolename").val();
    // var partment = $("#partment").val();
    var partment=$('#department_id').val() || "";
    var keyword = $(".search").val();
    var acc_type = $("#acc_type").val();
    var states = $("#states").val();
    var pattern = /[`^&% { } | ?]/im;
    if(!keyword||  keyword && !pattern.test(keyword)) { 
        table(mytable,"authmodule/authTbUser/selectUsers?map[content-like]=" + keyword + "&map[roleId]=" + rolename + "&map[fkDepartmentId]=" + partment + "&map[accountType]=" + acc_type + "&map[isLock]=" + states);
    }else {
        layer.msg('查询条件不能包含特殊字符');
    }
}
// 用户查询
function user_search() {
    $(".btn-search").on("click", function() {
        var rolename = $("#rolename").val();
        // var partment = $("#partment").val();
        var partment=$('#department_id').val() || "";
        var keyword = $(".search").val();
        var acc_type = $("#acc_type").val();
        var states = $("#states").val();
        var pattern = /[`^&% { } | ?]/im;
        if(!keyword||  keyword && !pattern.test(keyword)) { 
            table(mytable,"authmodule/authTbUser/selectUsers?map[content-like]=" + keyword + "&map[roleId]=" + rolename + "&map[fkDepartmentId]=" + partment + "&map[accountType]=" + acc_type + "&map[isLock]=" + states);
        }else {
            layer.msg('查询条件不能包含特殊字符');
        }
    });
}
function resetForm(){
    $("#account").val("");
    $("#userName").val("");

    $("#head_img").attr({"src":"","alt":""});
    $(".gender input").prop("checked",false);
    $("#idCard").val("");
    $("#jobNum").val("");
    $("#phoneNum").val("");
    $("#e_mail").val("");
    //$("#accountState input").prop("checked",false);
    $("#tree_partment").val("");
    $("#posts").val("");
    $("#uploadButton").val("上传图片");
    layui.form.render();

}

