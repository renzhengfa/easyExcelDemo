/**
 * @author guijinsong
 */

window.boxId = "";

var baseData;
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
// 初始化
var tableFile = function (mytable, url) {
    var table = layui.table,
        layer = layui.layer,
        $ = layui.$,
        form = layui.form;
    var mytbl;
    //.存储当前页数据集
    //.存储已选择数据集，用普通变量存储也行
    layui.data("checked", null);
    console.log(mytable);
    mytable.init({
        id: "archives_table",
        pageCode: "archives-admin",
        url: url
    }).then(function (table) {
        //监听工具条
        table.on("tool(archivesBox)", function (obj) {
            var data = obj.data;
            if (obj.event === "edit") {
                var archiveid = localStorage.getItem("archiveId");
                var tName = $("#hidden").val();
                localStorage.setItem("archiveId", data.id);
                localStorage.setItem("tableN", tName);
                window.location.href = "archive-change.html?id=" + data.id;
            } else if (obj.event === "check") {
                var table_name = $("#hidden").val();
                layer.confirm('是否确定删除？', {shade: 0}, function (index) {
                    app.post("archivesmodule/arcTbFiles/deleteFilesById", {
                        tableName: table_name,
                        id: data.id
                    }, function (msg) {
                        if (msg.state) {
                            layer.msg(msg.msg);
                            table.reload('archives_table', {
                                url: baseurl + 'archivesmodule/arcTbFiles/selectArcFiles?tableName=' + table_name
                                , where: {} //设定异步数据接口的额外参数
                            });
                        }
                    });
                });
            }
        });
    });
};
// 获取档案类型
var zNodes = {};
var setting = {};

function getAchievesType() {
    app.get("archivesmodule/arcTbArcType/selectAll", {}, function (msg) {
        console.log(msg);
        if (msg.state) {
            $("#hidden").val(msg.rows[0].id);
            localStorage.setItem("tableNames",msg.rows[0].id);
            //console.log(msg.rows);
            zNodes = msg.rows;
            setting = {
                view: {selectedMulti: false},
                check: {enable: false},
                data: {
                    simpleData: {enable: true, idKey: "id", pIdKey: "fkParentId", rootPId: null},
                    key: {name: "typeName"}
                },
                callback: {onClick: zTreeOnClick}
            };

            function zTreeOnClick(event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                zTree.expandNode(treeNode);
                //console.log(treeNode.id);
                $("#hidden").val(treeNode.id);
                localStorage.setItem("tableNames",treeNode.id);
                tableFile(mytable, "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + treeNode.id);
            }

            $(document).ready(function () {
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                // 节点查询
                $("#search").keyup(function () {
                    var txtObj = $("#search").val();
                    if (txtObj.length > 0) {
                        InitialZtree();
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var nodeList = zTree.getNodesByParamFuzzy("typeName", txtObj);
                        //console.log(nodeList);
                        $.fn.zTree.init($("#treeDemo"), setting, nodeList);
                    } else {
                        InitialZtree();
                    }
                });
            });
        }
    });
}

function InitialZtree() {
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
}

// 密级
function getSec() {
    app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=ofthem", {}, function (msg) {
        console.log(msg);
        if (msg.state) {
            var str1 = '<option value="">全部</option>';
            var str = "";
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
            }
            $(".miji").html(str1 + str);
            layui.form.render();
        }
    });
}

// 档案查询
function searchArchives() {
    $(".btn-find").on("click", function () {
        var miji = $(".miji").find("option:selected").html();
        if(miji == "全部"){
            miji = "";
        }
        var table_name = $("#hidden").val();
        var condition = $(".condition").find("option:selected").val();
        var start_time = $(".start-time").val();
        var end_time = $(".end-time").val();
        if (start_time != "") {
            start_time = $(".start-time").val() + " 00:00:00";
        }
        if (end_time != "") {
            end_time = $(".end-time").val() + " 23:59:59";
        }
        if (start_time != "" && end_time != "") {
            start_time = $(".start-time").val() + " 00:00:00";
            end_time = $(".end-time").val() + " 23:59:59";
        }
        var keywords = $(".search-tips").val();
        app.get("archivesmodule/arcTbFiles/selectArcFiles", {
                tableName: table_name,
                fkSecretName: miji,
                state: condition,
                createTime: start_time,
                endTime: end_time,
                comprehensive: keywords
            }, function (msg) {
                //console.log(msg);
                tableFile(mytable, "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + table_name + "&fkSecretName=" + miji + "&state=" + condition + "&createTime=" + start_time + "&endTime=" + end_time + "&comprehensive=" + keywords);
            }
        );
    });
}

// 查询档案和档案盒的状态
function getState() {
    app.get("authmodule/sysTbDictCode/selectByArchivalStatus", {}, function (msg) {
        console.log(msg);
        if (msg.state) {
            var str = "";
            var str1 = '<option value="">全部</option>';
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].code + '">' + msg.rows[i].svalue + "</option>";
            }
            $(".condition").html(str1 + str);
        }
    });
}

// 导出
function select_exports() {
    var form = layui.form;
    form.on('select(output)', function (data) {
        var miji = $(".miji").find("option:selected").html();
        var tname = $("#hidden").val();
        var condition = $(".condition").find("option:selected").val();
        var start_time = $(".start-time").val();
        var end_time = $(".end-time").val();
        if (start_time != "" && end_time != "") {
            start_time = $(".start-time").val() + " 00:00:00";
            end_time = $(".end-time").val() + " 23:59:59";
        }
        var keywords = $(".search-tips").val();
        console.log(data.value); //得到被选中的值
        switch (data.value) {
            case "0":
                document.location.href = baseurl + "archivesmodule/arcTbFiles/exportFilesPageExcel?tableName=" + tname;
                break;
            case "1":
                document.location.href = baseurl + "archivesmodule/arcTbFiles/exportFilesPageExcel?tableName=" + tname + "&fkSecretName=" + miji + "&state=" + condition + "&createTime=" + start_time + "&endTime=" + end_time + "&comprehensive=" + keywords;
                break;
            case "2":
                document.location.href = baseurl + "archivesmodule/arcTbFiles/exportFilesPageExcel?tableName=" + tname + "&currentPage=" + curr + "&pageSize=" + pagesize;
                break;
        }
    });
}

// 获取选中数据
function getCheckedData() {
    var getChecked = layui.table.checkStatus('archives_table');
     return getChecked.data;
}

// 添加至临时文件夹
function addToFile() {
    $(".add-to-file").on("click", function () {
        var table = layui.table;
        var table_name = $("#hidden").val();
        if (localStorage.getItem("myselected").length == 0) {
            layer.msg("请选择档案！", {time: 1000});
        } else {
            app.get("archivesmodule/arcTbFiles/selectFilesByIds", {
                tableName: table_name,
                fileIds: localStorage.getItem("myselected").toString()
            }, function (msg) {
                if (msg.state) {
                    layer.msg("添加至临时文件夹成功！");
                    localStorage.removeItem("myselected");
                    localStorage.removeItem("archives");
                    localStorage.setItem("archives", JSON.stringify(msg.rows));
                    table.reload("archives_table", {
                        url: baseurl + "archivesmodule/arcTbFiles/selectArcFiles?tableName="+ $("#hidden").val(),
                        where: {} //设定异步数据接口的额外参数
                    });
                }
            });
        }
    });
}

// 打开临时文件夹
function openAddedFile(title) {
    $(".open").on("click", function () {
        var files = localStorage.getItem("archives");
        var long = JSON.parse(files).length;
        var filesInfo = JSON.parse(files);
        var mySelectedId = [];
        layer.open({
            title: ['<i class="" style="display: inline-block; padding-right: 20px"><img src="../../static/images/role/modify.png" width="17" height="18"></i>' +
            title, "font-size: 18px;text-align: center;"],
            area: ["1200px", "680px"],
            type: 1,
            btn: ["确定", "取消"],
            shadeClose: false, //点击遮罩关闭
            shade: 0,
            content: $("#open_temp_file"),
            success: function (index, layero) {
                var table = layui.table;
                table.render({
                    elem: "#file_info_layer",
                    data: filesInfo, //数据
                    page: true, //开启分页
                    cols: [[
                        {type: "checkbox", title: "", fixed: "left", align: "center"},
                        {type: "numbers", title: "序号", align: "center"},
                        {field: "fileNum", title: "档号", align: "center"},
                        {field: "fileName", title: "题名", align: "center"},
                        {field: "fondsId", title: "全宗号", align: "center"},
                        {field: "fkSecretName", title: "密级", align: "center"},
                        {field: "fkTypeName", title: "类型", align: "center"},
                        {field: "boxName", title: "所属档案盒", align: "center"},
                        {field: "locationName", title: "所在位置", align: "center"},
                        {field: "state", title: "当前状态", align: "center"}
                    ]]
                });
                table.on('checkbox(file_info_layer)', function (obj) {
                    var SelectedId = [];
                    var data = obj.type == 'one' ? [obj.data] : filesInfo;
                    //.遍历数据
                    $.each(data, function (k, v) {
                        if (obj.checked) {
                            layui.data('checked', {
                                key: v.id,
                                value: v
                            })
                        } else {
                            //.删除
                            layui.data('checked', {
                                key: v.id,
                                remove: true
                            })
                        }
                    });
                    $.each(layui.data('checked'), function (k, v) {
                        SelectedId.push(v.id)
                    });
                    console.log(SelectedId);
                    mySelectedId = SelectedId;
                });
                // 导出
                $(".file-exports").on("click", function (obj) {
                    var leixing = $("#hidden").val();
                    if (mySelectedId.length == 0) {
                        layer.msg("请选择档案！", {
                            time: 1000
                        });
                    } else {
                        document.location.href = baseurl + "archivesmodule/arcTbFiles/exportTemporaryFilesExecl?tableName=" + leixing + "&fileIds=" + mySelectedId.toString();
                    }
                });
                // 批量修改位置
                $(".revise-position").on("click", function () {
                    if (mySelectedId.length == 0) {
                        layer.msg("请选择档案！", {
                            time: 1000
                        });
                    } else {
                        layer.open({
                            title: ['<i class="" style="display: inline-block; padding-right: 20px"></i>批量修改位置', "font-size: 18px;text-align: center;"],
                            area: ["800px", "300px"],
                            type: 1,
                            btn: ["确定", "取消"],
                            btnAlign: 'c',
                            shadeClose: false, //点击遮罩关闭
                            shade: 0,
                            content: $("#all_position_revise"),
                            success: function (index, layero) {
                                // 获取库房名称、区、列、节、层......
                                app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function (msg) {
                                    if (msg.state == true) {
                                        var str1 = '<option value=""></option>';
                                        var str = "";
                                        for (var i = 0; i < msg.rows.length; i++) {
                                            str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + '</option>';
                                        }
                                        $("#store_Room").html(str1 + str);
                                        form.on("select(storeroom)", function (data) {
                                            console.log(data.value);
                                            app.get("storeroommodule/StoTbRegion/select",{fkStoreId: data.value},function(msg){
                                                if(msg.state){
                                                    var str1 = '<option value=""></option>';
                                                    var str = "";
                                                    var str2 = "";
                                                    var str3 = "";
                                                    var str4 = "";
                                                    for (var i = 0; i < msg.rows.length; i++) {
                                                        str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
                                                    }
                                                    $("#area").html(str1 + str);
                                                    form.render('select');
                                                    form.on("select(areaName)", function (data) {
                                                        //console.log(data);
                                                        app.get("storeroommodule/StoTbRegion/selectByRegionId",{id: data.value},function(msg){
                                                            if(msg.state){
                                                                if(msg.row.gdlType=='左边'){
                                                                    for(var i = 0; i < msg.row.cols; i++){
                                                                        str2 += '<option value="'+ i +'">'+ i +'</option>';
                                                                    } 
                                                                }else{
                                                                   for(var i = 1; i <= msg.row.cols; i++){
                                                                        str2 += '<option value="'+ i +'">'+ i +'</option>';
                                                                    } 
                                                                }
                                                                for (var i = 1; i <= msg.row.lays; i++) {
                                                                    str3 += '<option value="' + i + '">' + i + '</option>';
                                                                }
                                                                for (var i = 1; i <= msg.row.divs; i++) {
                                                                    str4 += '<option value="' + i + '">' + i + '</option>';
                                                                }
                                                                $("#cols").html(str1 + str2);
                                                                $("#lays").html(str1 + str3);
                                                                $("#divs").html(str1 + str4);
                                                                form.render('select');
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        });
                                        form.render('select');
                                    }
                                });
                                form.render();
                            },
                            yes: function (index, layero) {
                                var TNAME = $("#hidden").val();
                                var fkStoreName = $("#store_Room").find("option:selected").html();
                                var fkStoreID = $("#store_Room").find("option:selected").val();
                                var fkRegionName = $("#area").find("option:selected").html();
                                var fkRegionID = $("#area").find("option:selected").val();
                                var posInfo = $('#revisePos').serializeArray();
                                //console.log(posInfo);
                                var fileData = {};
                                $.each(posInfo, function () {
                                    fileData[this.name] = this.value;
                                    fileData["tableName"] = TNAME;
                                    fileData["fkStoreName"] = fkStoreName;
                                    fileData["fkRegionName"] = fkRegionName;
                                    fileData["fkStoreId"] = fkStoreID;
                                    fileData["fkRegionId"] = fkRegionID;
                                    fileData["fileIds"] = mySelectedId.toString();
                                });
                                console.log(fileData);
                                app.post("archivesmodule/arcTbFiles/updateLocation", fileData, function (msg) {
                                    //console.log(msg);
                                    if (msg.state) {
                                        mySelectedId = [];
                                        layer.msg(msg.msg);
                                        layer.close(index);
                                        layer.closeAll('page'); //关闭所有页面层  
                                        table.reload("archives_table", {
                                            url: baseurl + "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + $("#hidden").val(),
                                            where: {} //设定异步数据接口的额外参数
                                        });
                                    }
                                });
                            }
                        });
                    }

                });
                // 添加到档案盒
            },
            yes: function (index, layero) {
                layer.close(index);
            },
            btn2: function(index, layero){
                mySelectedId = [];
                layer.close(index);
            }
        });
    });
}


$(function (mytable) {
    mySelected = [];
    getMenuBar();//自定义面包屑，引用public-menu.js
    getAchievesType();
    searchArchives();
    getState();
    getSec();
    layui.use(["form", "element", "layer", "table", "laydate", "upload"], function () {
        var element = layui.element;
        var layer = layui.layer;
        var form = layui.form;
        var table = layui.table;
        var laydate = layui.laydate;
        var upload = layui.upload;
        var uploadInst = upload.render({
            elem: '#up_file' //绑定元素
            , url: '' //上传接口
            , done: function (res) {
                //上传完毕回调
            }
            , error: function () {
                //请求异常回调
            }
        });
        tableFile(mytable, "archivesmodule/arcTbFiles/selectArcFiles?tableName="+ $("#hidden").val());
        //addToBox();
        addToFile();
        openAddedFile("临时文件夹");
        select_exports();
        mybtn.date('#test1','#test2');
        form.render();
    });
}(mytable));
function firstRefresh(){
    $(".layui-laypage-skip input").val(1);
    $(".layui-laypage-btn")[0].click();
}
function testRefresh(){
    $(".layui-laypage-btn")[0].click();
}