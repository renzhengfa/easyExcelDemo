var form;
$(function() {
    layui.use(["form", "element", "layer", "table"], function() {
        var element = layui.element;
        var layer = layui.layer;
        form = layui.form;
        var table = layui.table;
        getMenuBar();//自定义面包屑，引用public-menu.js
        initTree('select');
        getPageName();
        search();
        form.on("select(layer_pageName)", function(data) {
            app.get("authmodule/authTbPageols/selectByListmarker",{
                    fkPageCode: data.value
                },function(msg) {
                    var str = "";
                    if (msg.state) {
                        var str1 = '<option value=""></option>';
                        for (var i = 0; i < msg.rows.length; i++) {
                            str += '<option value="' + msg.rows[i].marker + '">' + msg.rows[i].marker + "</option>";
                        }
                        $("#marker").html(str1 + str);
                        form.render("select");
                    } else {
                        layer.msg(msg.msg);
                    }
                }
            );
        });
        form.render();
        selectAll("authmodule/authTbPageols/selectPagecolsAll");
        add();
    });
    $("body").keydown(function(event) {
        if (event.keyCode == "13") {
            $(".btn-search").click();
        }
    });
});

// 获取页面
function getPageName() {
    var str = "";
    app.get("authmodule/authTbPage/selectByPageType", {}, function(msg) {
        if (msg.state) {
            var str1 = '<option value="">全部</option>';
            //console.log(msg.rows);
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].pageCode + '">' + msg.rows[i].pageName + "</option>";
            }
            $("#pageName").html(str1 + str);
            $("#layer_pageName").html(str1 + str);
            form.render();
        } else {
            console.log(msg);
        }
    });
}
// 获取标志
function getMarker(){
    var str = "";
    app.get("archivesmodule/arcTbArcType/selectAll", {}, function(msg) {
        if (msg.state) {
            var str1 = '<option value="">全部</option>';
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].typeName + "</option>";
            }
            $("#mark").html(str1 + str);
            form.render();
        } else {
            console.log(msg);
        }
    });
}
function selectAll(url) {
    var table = layui.table;
    // var index = layer.load(1, { offset: ["50%", "50%"], shade: false }); //添加laoding,0-2两种方式
    var token = window.localStorage.getItem("token");
    var demoTable_height=$(".demoTable").outerHeight(true)+100;
    table.render({
        elem: "#allInfo",
        url: baseurl + url, //数据接口
        headers: {"authorization": token},
        page: true, //开启分页
        limit: 20,height:"full-"+demoTable_height+"",
        loading: true,
        cellMinWidth: 60,
        even: true, // 开启隔行背景
        request: {
            pageName: "currentPage", //页码的参数名称，默认：page
            limitName: "pageSize" //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: "code",
            statusCode: 1,
            msgName: "msg", // 对应 msg
            countName: "total", // 对应 count
            dataName: "rows" // 对应 data
        },
        // ,initSort: {
        //      field: 'id' //排序字段，对应 cols 设定的各字段名
        //     ,type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
        // }
        cols: [[
                //表头
            { title: "序号", fixed: "left", width: 60,templet:'<div>{{d.LAY_TABLE_INDEX+1}}</div>'},
            {field: "field", title: "字段名"},
            {field: "title", title: "标题"},
            {field: "sort", title: "是否排序",templet: "#state_Tpl"},
            {field: "fixed", title: "位置"},
            {field: "width", title: "宽度", sort: true},
            {field: "minWidth", title: "最小宽度"},
            {field: "hide",title: "初始显示",templet: "#state_Tpl1"},
            {field: "orderIndex", title: "显示位置"},
            {field: "disabled",title: "显示状态",templet: "#state_Tpl2"},
            {field: "", title: "操作", toolbar: "#operate", fixed: "right"}]
        ],
        done: function(res) {
            // layer.close(index); //返回数据关闭loading
        }
    });

    //监听工具条------编辑&&删除
    table.on("tool(control)", function(obj) {
        var data = obj.data;
        if (obj.event === "del") {
            window.parent.layer.confirm('确认删除吗？', {
                btnAlign: 'c',
                anim: 5,
                title: '提示',
                shade: [0.01, '#fff']
            }, function (index, layero) {
                app.post('authmodule/authTbPageols/delectPagecols', {id: data.id}, function (res) {
                    if(res.state){
                        table.reload("allInfo", {
                            url: baseurl + "authmodule/authTbPageols/selectPagecolsAll",
                            where: {} //设定异步数据接口的额外参数
                        });
                        parent.layer.close(index);
                    }
                    parent.layer.msg(res.msg);
                })
            }, function (index) {
                parent.layer.close(index);
            });
            
        }
    });

    //监听排序
    table.on("sort(control)", function(obj) {
        table.reload("allInfo", {
            initSort: obj, //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
            where: {
                //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                field: obj.field, //排序字段
                order: obj.type //排序方式
            }
        });
    });
}

// 表单正则验证
function check() {
    $(".name").blur(function() {
        var val = $(".name").val();
        var pattern = /^[a-zA-Z0-9]{4,20}$/;
        if (val) {
            var res = pattern.test(val);
            console.log(res);
            if (res === false) {
                layer.tips("请输入4-20位字母或数字", "#filedName", {
                    tips: [3, "#000"],
                    time: 1000
                });
                $("#filedName")[0].focus();
            }
        } else {
            layer.tips("输入不能为空", "#filedName", {
                tips: [3, "#000"],
                time: 1000
            });
            $("#filedName")[0].focus();
        }
    });
    $("#tit").blur(function() {
        var pattern = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,18}$/;
        var val = $("#tit").val();
        if (val) {
            var res = pattern.test(val);
            console.log(res);
            if (res === false) {
                layer.tips("请输入2-18位字母或数字或汉字", "#tit", {
                    tips: [3, "#000"],
                    time: 1000
                });
                $("#tit")[0].focus();
            }
        } else {
            layer.tips("输入不能为空", "#tit", {
                tips: [3, "#000"],
                time: 1000
            });
            $("#tit")[0].focus();
        }
    });
    $("#wid").blur(function() {
        var pattern = /^\d{2,6}$/;
        var val = $("#wid").val();
        if (val) {
            var res = pattern.test(val);
            console.log(res);
            if (res === false) {
                layer.tips("请输入2-6位数字", "#wid", {
                    tips: [3, "#000"],
                    time: 1000
                });
                $("#wid")[0].focus();
            }
        } else {
            layer.tips("输入不能为空", "#wid", {
                tips: [3],
                time: 1000
            });
            $("#wid")[0].focus();
        }
    });
    $("#min_wid").blur(function() {
        var pattern = /^\d{2,6}$/;
        var val = $("#min_wid").val();
        if (val) {
            var res = pattern.test(val);
            console.log(res);
            if (res === false) {
                layer.tips("请输入2-6位数字", "#min_wid", {
                    tips: [3, "#000"],
                    time: 1000
                });
                $("#min_wid")[0].focus();
            }
        } else {
            layer.tips("输入不能为空", "#min_wid", {
                tips: [3, "#000"],
                time: 1000
            });
            $("#min_wid")[0].focus();
        }
    });
    $("#show_pos").blur(function() {
        var pattern = /^\d{1,6}$/;
        var val = $("#show_pos").val();
        if (val) {
            var res = pattern.test(val);
            console.log(res);
            if (res === false) {
                layer.tips("请输入1-6位数字", "#show_pos", {
                    tips: [3, "#000"],
                    time: 1000
                });
                $("#show_pos")[0].focus();
            }
        } else {
            layer.tips("输入不能为空", "#show_pos", {
                tips: [3, "#000"],
                time: 1000
            });
            $("#show_pos")[0].focus();
        }
    });
}

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


function resetForm(){
    $(".name").val("");
    $(".title-name").val("");
    $(".sort-flag input").prop("checked",false);
    $(".position").val("");
    $(".wid").val("");
    $(".min-wid").val("");
    $(".show-init input").prop("checked",false);
    $(".show-pos").val("");
    $(".status input").prop("checked",false);
    layui.form.render();

}

// 添加
function add() {
    $(".add").on("click", function() {
        $(".hide-pagename, .hide-marker").show();
        getPageName();
        resetForm();
        //layerInfo("添加");
        $(".pic-name").attr("src","../../static/images/add.png");
        check();
    });
}

// 查询
function search() {
    $(".btn-search").on("click", function() {
        var keyword = $(".search").val();
        var fk_page_code = $("#pageName").find("option:selected").val();
        var marker = $("#department_id").val();
        if (marker == undefined) {
            marker = "";
        }
        var pattern = /[`^&% { } | ?]/im;
        if(!keyword||  keyword && !pattern.test(keyword)) { 
            $.get(baseurl + "authmodule/authTbPageols/selectPagecolsAll?map[title-like]=" + keyword + "&map[fkPageCode]=" + fk_page_code + "&map[marker]=" + marker,function(data) {
                selectAll("authmodule/authTbPageols/selectPagecolsAll?map[title-like]=" + keyword + "&map[fkPageCode]=" + fk_page_code + "&map[marker]=" + marker);
            });
        }else {
            layer.msg('查询条件不能包含特殊字符');
        }
    });
}