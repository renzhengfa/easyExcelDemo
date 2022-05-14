//修改用户时，将该值传到后端
var selectedUserId=null;
// //动态渲染账号类型
// app.get('codeDict/selectSysTbDictCodeByfkType', {type:"account_type"}, function (res) {
//     console.log(res);
//     var optionList = res.rows, option;
//     for (var key in optionList) {
//         option = '<option value="' + optionList[key].code + '">' + optionList[key].svalue + '</option>';
//         $('#acc_type').append(option);
//     }
// });
  
//获取部门
function getPostsName(value) {
    var treeNodes = [];
    app.get("authmodule/AuthTbDepartment/selectByType", '', function (msg) {
        if (msg.state) {
            var data = msg.rows;
            if (value) {
                $("#department_name").val(data[0].sname);
                $("#department_id").val(data[0].id);
            } else {
                for (var key in data) {
                    treeNodes[key] = {};
                    treeNodes[key]['id'] = data[key].id;
                    treeNodes[key]['name'] = data[key].sname;
                    treeNodes[key]['pId'] = data[key].parentId;
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

// 岗位信息
function getPosts(id) {
    app.get("authmodule/AuthTbDepartment/selectById",{id},function(msg) {
            if (msg.state) {
                var str = "";
                for (var i = 0; i < msg.rows.length; i++) {
                    str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].sname + "</option>";
                }
                $("#posts").html(str);
                layui.form.render();
            }
        }
    );
}

// 获取弹出框角色信息
function layer_rolename() {
    var form = layui.form;
    app.get("authmodule/authTbRole/selectEnableRoles", {}, function(msg) {
        if (msg.state) {
            var str = "";
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<input type="checkbox" class="input-rname" value="' + msg.rows[i].id + '" name="roleN">' + msg.rows[i].roleName + "&nbsp;&nbsp;";
                //str += '<input type="checkbox" value="'+ msg.rows[i].id +'" name="" title="'+ msg.rows[i].roleName +'" lay-skin="primary">';
            }
            $(".rName").html(str);
            layui.form.render();
        }
    });
}

// 上传头像
var picUrl = "";

function uploadfile() {
    layui.use("upload", function() {
        var upload = layui.upload;
        var uploadInst = upload.render({
            elem: "#uploadfile",
            // auto: false,
            // bindAction: '#upload',
            size: 10240,
            url: imgurl + "filemodule/file/uploadHeadImg",
            done: function(res) {
                if (res.state) {
                    console.log(res)
                    //$(".ok").fadeIn();
                    //layer.tips(res.msg, "#uploadfile");
                    $("#head_img").attr("src",imgurl + res.row).show();
                    picUrl = res.row;
                    $("#uploadButton").val("");
                } else {
                    console.log(res.msg);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
}



$(function(){
    // layui.use(["form", "element", "layer", "table"], function() {
    //     var element = layui.element;
    //     var layer = layui.layer;
    //     var form = layui.form;
    //     var table = layui.table;
    //     //uploadfile();
    //     getPostsName();
    //     layer_rolename();
    //     form.render();
    // });
});