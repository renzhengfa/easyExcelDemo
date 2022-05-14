/**
 * @author guijinsong
 */

window.boxId = "";
var baseData;
// var wsValue = webinit(window.wsUri)
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
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "archives_table",
        pageCode: "archives-admin",
        limit: 20,height:"full-"+demoTable_height+"",
        url: url
    }).then(function (table) {
        //监听工具条
        table.on("tool(archivesBox)", function (obj) {
            var data = obj.data, typeId = $("#hidden").val();
            if (obj.event === "edit") {
                var archiveid = localStorage.getItem("archiveId");
                var tName = $("#hidden").val();
                localStorage.setItem("archiveId", data.id);
                localStorage.setItem("tableN", tName);
                window.location.href = "archive-change.html?id=" + data.id+'&page=1';
				console.log('编辑')
            }else if (obj.event === "check") {
                var table_name = $("#hidden").val();
                layer.confirm('是否确定删除？', {shade: 0}, function (index) {
                    app.post("archivesmodule/arcTbFiles/deleteFilesById", {
                        tableName: table_name,
                        id: data.id
                    }, function (msg) {
                        if (msg.state) {
                            layer.msg(msg.msg);
                            reload(table_name);
                        }
                    });
                });
            } else if (obj.event === "offShelves") {  //下架
                app.post('archivesmodule/arcTbFiles/updateByFilesState', {
                    tableName: typeId,
                    id: data.id,
                    upDownFlag: 0
                }, function (res) {
                    layer.msg(res.msg);
                    $('.layui-laypage-btn').click();
                });
            } else if (obj.event === "putaway") {  //上架
                app.post('archivesmodule/arcTbFiles/updateByFilesState', {
                    tableName: typeId,
                    id: data.id,
                    upDownFlag: 1
                }, function (res) {
                    layer.msg(res.msg);
                    $('.layui-laypage-btn').click();
                });

            } else if(obj.event === "showinfo"){
                var archiveid = localStorage.getItem("archiveId");
                var tName = $("#hidden").val();
                localStorage.setItem("archiveId", data.id);
                localStorage.setItem("tableN", tName);
                window.location.href = "archive-change-preview.html?id=" + data.id;
            }else if (obj.event === "exportPDF") {  //导出PDF
                console.log(data);
                document.location.href = baseurl + "archivesmodule/excelConvertPdf/fileExportPdf?fileId="+data.id+"&typeId="+data.fkTypeId;
            }
        });
        //监听允许借阅按钮
        form.on('switch(borrow)', function (obj) {
            var achiveId, typeId;
            typeId = $("#hidden").val();
            achiveId = (obj.othis.prev().attr('id'));
            app.post('archivesmodule/arcTbFiles/updateByFilesAllowborrow', {
                id: achiveId,
                allowBorrow: this.value == '是' ? '否' : '是',
                tableName: typeId,
            }, function (msg) {
                console.log(msg)
                if(!msg.state) {
                    layer.msg(msg.msg)
                }
                $('.layui-laypage-btn').click();
            });
        });
    });
};

// 添加至档案盒弹出框
function layerInfo(title) {
    var table_name = $("#hidden").val();
    var layer = layui.layer;
    var table = layui.table;
    layer.open({
        title: ['<i class="" style="display: inline-block; padding-right: 20px"><img src="../../static/images/add.png" width="17" height="18"></i>' +
        title, "font-size: 18px;text-align: center;"],
        area: ["780px", "670px"],
        type: 1,
        btnAlign: 'c',
        btn: ["确定", "取消"],
        shadeClose: false, //点击遮罩关闭
        shade: 0,
        content: $("#layer-page"),
        success: function (index, layero) {
            $(".layui-layer-content").css("height","78%");
            var form = layui.form;
            mytable.init({
                id: "file_info",
                pageCode: "archivesBoxs-admin",
                limit: 10,height:460,
                url: "archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=" + table_name
                // url: "archivesmodule/arcTbFiles/selectInsertArcFilesBox?tableName=" + table_name
            }).then(function (table) {
                table.on("radio(archivesBoxInfo)", function (obj) {
                    boxId = obj.data.id;
                });
                //监听工具条
            });
        },
        yes: function (index, layero) {
            app.post("archivesmodule/arcTbFiles/insertArcToBox", {
                    tableName: table_name,
                    boxId: boxId,
                    ids: mySelected
                },
                function (msg) {
                    if (msg.state) {
                        layer.close(index);
                        layer.msg(msg.msg);
                        reload(table_name);
                    }else{
                        layer.msg(msg.msg);
                    }
                }
            );
        }
        ,btn2: function(index, layero){
            layer.close(index);
        }
        ,cancel: function(index){
            layer.close(index);
        }
    });
}

//更新table
function reload(tableName) {
    mySelected=[];
    var table = layui.table;
    table.reload("archives_table", {
        url: baseurl + "archivesmodule/arcTbFiles/selectArcFiles?field=fileNum&sort=asc&tableName=" +tableName ,
        where: {} //设定异步数据接口的额外参数
    });
}

// 获取档案类型
var zNodes = {};
var setting = {};

function getAchievesType() {
    app.get("archivesmodule/arcTbArcType/selectAll", {}, function (msg) {
        if (msg.state) {
            $("#hidden").val(msg.rows[0].id);
            var postId=msg.rows[0].id;
            localStorage.setItem("archivesTableNamesId", msg.rows[0].id);
            zNodes = msg.rows;
            setting = {
                view: {selectedMulti: false,showLine: false,showIcon: true},
                check: {enable: false},
                data: {
                    simpleData: {enable: true, idKey: "id", pIdKey: "fkParentId", rootPId: null},
                    key: {name: "typeName"}
                },
                callback: {onClick: zTreeOnClick}
            };

            function zTreeOnClick(event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                // zTree.expandNode(treeNode);
                $("#hidden").val(treeNode.id);
                tableFile(mytable, "archivesmodule/arcTbFiles/selectArcFiles?field=fileNum&sort=asc&tableName=" + treeNode.id);
            }

            $(document).ready(function () {
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                //默认第一个节点选中
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");//获取ztree对象
                var node = zTree.getNodeByParam('id', postId);//获取id为1的点
                zTree.selectNode(node);//选择点
                zTree.setting.callback.onClick(null, zTree.setting.treeId, node);//调用事件

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
        // console.log(msg);
        if (msg.state) {
            var str1 = '<option value="">全部</option>';
            var str = "";
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
            }
            $(".miji").html(str1 + str);
            form.render();
        }
    });
}

// 档案查询
function searchArchives() {
    $(".btn-find").on("click", function () {
        var miji = $(".miji").find("option:selected").html();
        if (miji == "全部") {
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
        var pattern = /[`^&% { } | ?]/im;
        if(!keywords || (keywords && !pattern.test(keywords))) {
            tableFile(mytable, "archivesmodule/arcTbFiles/selectArcFiles?field=fileNum&sort=asc&tableName=" + table_name + "&fkSecretName=" + miji + "&state=" + condition + "&createTime=" + start_time + "&endTime=" + end_time + "&comprehensive=" + keywords);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
        // app.get("archivesmodule/arcTbFiles/selectArcFiles", {
        //         tableName: table_name,
        //         fkSecretName: miji,
        //         state: condition,
        //         createTime: start_time,
        //         endTime: end_time,
        //         comprehensive: keywords
        //     }, function (msg) {
        //         //console.log(msg);
        //         tableFile(mytable, "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + table_name + "&fkSecretName=" + miji + "&state=" + condition + "&createTime=" + start_time + "&endTime=" + end_time + "&comprehensive=" + keywords);
        //     }
        // );
    });
}

// 查询档案和档案盒的状态
function getState() {
    app.get("authmodule/sysTbDictCode/selectByArchivalStatus", {}, function (msg) {
        // console.log(msg);
        if (msg.state) {
            var str = "";
            var str1 = '<option value="">全部</option>';
            for (var i = 0; i < msg.rows.length; i++) {
                if(msg.rows[i].code!='tba'&&msg.rows[i].code!='ita'){
                    str += '<option value="' + msg.rows[i].code + '">' + msg.rows[i].svalue + "</option>";
                  }
            }
            $(".condition").html(str1 + str);
            form.render();
        }
    });
}

// 添加至档案盒
function addToBox() {
    $(".add-to-box").on("click", function () {
        if (mySelected.length == 0) {
            layer.msg("请选择档案！", {time: 1000});
        } else {
            if(arr_state){
                for(var i = 0; i < arr_state.length; i++){
                    if(arr_state[i] != "在架"){
                        layer.msg("请选择在架档案！", {time: 1000});
                        return;
                    }
                }
            }
            layerInfo("添加至档案盒");
            // 添加至档案盒查询档案盒
            $(".ser-box").on("click", function () {
                var table = layui.table;
                var key_words = $(".key-val").val();
                var table_name = $("#hidden").val();
                // archivesmodule/arcTbFiles/selectInsertArcFilesBox
                table.reload("file_info", {
                    url: baseurl + "archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=" + table_name + "&comprehensive=" + key_words,
                    where: {} //设定异步数据接口的额外参数
                });
            });
        }
    });
}

// 当前任务
function currentTask() {
    $('#taskPrebtn').on('click', function () {  
        $('#taskPre').trigger('click');  
    })
}
// 批量上架 下架
function manyTaskUp(){    
    $('#taskManyUpbtn').on('click', function () {  
        $('#taskManyUp').trigger('click');  
    })
}

function manyTaskDown(){
    $('#taskManyDownbtn').on('click', function () {  
        $('#taskManyDown').trigger('click');  
    })
}



// 导出，批量操作
function select_exports() {
    var form = layui.form;
    form.on('select(output)', function (data) {
        var miji = $(".miji").find("option:selected").html();
        if(miji == "全部"){
            miji = "";
        }
        var tname = $("#hidden").val();
        var condition = $(".condition").find("option:selected").val();
        var start_time = $(".start-time").val();
        var end_time = $(".end-time").val();
        if (start_time != "" && end_time != "") {
            start_time = $(".start-time").val() + " 00:00:00";
            end_time = $(".end-time").val() + " 23:59:59";
        }
        var keywords = $(".search-tips").val();
        // console.log(data.value); //得到被选中的值
        switch (data.value) {
            case "0":
                document.location.href = baseurl + "archivesmodule/arcTbFiles/exportFilesPageExcel?field=fileNum&sort=asc&pageSize=" + pagesize+"&tableName=" + tname;
                break;
            case "1":           
                if(miji || condition || start_time || end_time || keywords){
                    document.location.href = baseurl + "archivesmodule/arcTbFiles/exportFilesPageExcel?field=fileNum&sort=asc&pageSize=" + pagesize+"&tableName=" + tname + "&fkSecretName=" + miji + "&state=" + condition + "&createTime=" + start_time + "&endTime=" + end_time + "&comprehensive=" + keywords;
                    
                }else{
                    layer.msg("请先搜索再导出！");
                }
                break;
            case "2":
                document.location.href = baseurl + "archivesmodule/arcTbFiles/exportFilesPageExcel?field=fileNum&sort=asc&tableName=" + tname + "&currentPage=" + curr + "&pageSize=" + pagesize;
                break;
        }
    });
    form.on('select(batch)', function (data) {
        var batchData = getCheckedData();
        if (batchData.length > 0) {
            switch (data.value) {
                case "0":
                    var tableData=[];
                    for(var i = 0; i < batchData.length; i++){
                        if(batchData[i].state !== '未上架') {
                            layui.layer.msg('只有未上架档案才能上架!');
                            return;
                        }
                        tableData.push(batchData[i].id);
                    }
                    app.post("archivesmodule/arcTbFiles/batchRack", {ls:1, ids:tableData}, function (msg) {
                        console.log(msg);
                        if (msg.state) {
                            layer.msg(msg.msg);
                            $('.layui-laypage-btn').click();
                        }
                        else{
                            layer.msg(msg.msg);
                        }
                    });
                    break;
                case "1":
                    var tableData=[];
                    for(var i = 0; i < batchData.length; i++){
                        if(batchData[i].state !== '在架') {
                            layui.layer.msg('只有在架档案才能下架!');
                            return;
                        }
                        tableData.push(batchData[i].id);
                    }
                    app.post("archivesmodule/arcTbFiles/batchRack", {ls:2, ids:tableData}, function (msg) {
                        if (msg.state) {
                            layer.msg(msg.msg);
                            $('.layui-laypage-btn').click();
                        }
                    });
                    break;
            }
        } else {
            layui.layer.msg('请选择数据！！！');
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
        if (mySelected.length == 0) {
            layer.msg("请选择档案！", {time: 1000});
        } else {
            app.get("archivesmodule/arcTbFiles/selectFilesByIds", {
                tableName: table_name,
                fileIds: mySelected.toString()
            }, function (msg) {
                if (msg.state) {
                    let arr=JSON.parse(localStorage.getItem("archives")) || [];
                    arr = [...arr, ...msg.rows]
                    let obj = {};
                    arr= arr.reduce(function(item, next) {
                        obj[next.id] ? " " : (obj[next.id] = true && item.push(next));
                        return item;
                    }, []);
                    layer.msg("添加至临时文件夹成功！");
                    localStorage.setItem("archives", JSON.stringify(arr));                    
                    reload($("#hidden").val());
                }
            });
        }
    });
}
//临时文件夹的
function fileTable(filesInfo) {
    mySelectedId=[];
    layui.table.render({
        elem: "#file_info_layer",
        data: filesInfo, //数据
        page: true, //开启分页
        cols: [[
            {type: "checkbox", title: "", fixed: "left", align: "center"},
            {title: "序号", align: "center", width: 60,templet:'<div>{{d.LAY_TABLE_INDEX+1}}</div>'},
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
}
// 打开临时文件夹
var mySelectedId = [];
var filesInfo;
function openAddedFile(title) {
    var table_name = $("#hidden").val();
    $(".open").on("click", function () {
        var files = localStorage.getItem("archives");
        if (files) {
            var long = JSON.parse(files).length;
            filesInfo = JSON.parse(files);
            filesInfo.sort(function (a, b) {
                return SortByProps(a, b, { "fileNum": "ascending" });
            });
            layer.open({
                // title: ['<i class="" style="display: inline-block; padding-right: 20px"><img src="../../static/images/role/modify.png" width="17" height="18"></i>' +
                // title, "font-size: 18px;text-align: center;"],
                title: [title, "font-size: 18px;text-align: center;"],
                area: ["1200px", "680px"],
                type: 1,
                btn: ["关闭"],
                shadeClose: false, //点击遮罩关闭
                shade: 0,
                content: $("#open_temp_file"),
                success: function (index, layero) {
                    var table = layui.table;
                    fileTable(filesInfo);
                    table.on('checkbox(file_info_layer)', function (obj) {
                        var data = obj.type == 'one' ? [obj.data] : filesInfo;
                        //.遍历数据
                        $.each(data, function (k, v) {
                            if (obj.checked) {
                                layui.data('file_info_layer', {
                                    key: v.id,
                                    value: v
                                });
                                mySelectedId.push(v.id)
                            } else {
                                //.删除
                                layui.data('file_info_layer', {
                                    key: v.id,
                                    remove: true
                                });
                                mySelectedId.splice(mySelectedId.indexOf(v.id), 1);
                            }
                        });
                        // $.each(layui.data('checked'), function (k, v) {
                        //     SelectedId.push(v.id)
                        // });
                        console.log(mySelectedId)
                        // mySelectedId = SelectedId;
                    });
                },
                yes: function (index, layero) {
                    mySelectedId = [];
                    layer.close(index);
                },
                cancel: function(index, layero){
                    mySelectedId = [];
                    layer.close(index);
                }
                // btn2: function (index, layero) {
                //     mySelectedId = [];
                //     layer.close(index);
                // }
            });
        } else {
            layer.msg("请先添加档案至临时文件夹！", {time: 1000});
        }

    });
}
function openAddedFileClick() {
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
                area: ["800px", "320px"],
                type: 1,
                btn: ["确定", "取消"],
                btnAlign: 'c',
                shadeClose: false, //点击遮罩关闭
                shade: 0,
                content: $("#all_position_revise"),
                success: function (index, layero) {
                    // 获取库房名称、区、列、节、层......
                    app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function (msg) {
                        if (msg.state) {
                            var str1 = '<option value=""></option>';
                            var str = "";
                            for (var i = 0; i < msg.rows.length; i++) {
                                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + '</option>';
                            }
                            $("#store_Room").html(str1 + str);
                            form.on("select(storeroom)", function (data) {
                                // console.log(data.value);
                                app.get("storeroommodule/stoTbRegion/selectByBind", {fkStoreId: data.value}, function (msg) {
                                    if (msg.state) {
                                        var str1 = '<option value=""></option>';
                                        var str = "";
                                        for (var i = 0; i < msg.rows.length; i++) {
                                            str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
                                        }
                                        $("#area").html(str1 + str);
                                        form.render('select');
                                        form.on("select(areaName)", function (data) {
                                            //console.log(data);
                                            app.get("storeroommodule/stoTbRegion/selectByRegionId", {id: data.value}, function (msg) {
                                                if (msg.state) {
                                                    var str1 = '<option value=""></option>';
                                                    var str2 = "";
                                                    var str3 = "";
                                                    var str4 = "";
                                                    $("#regionNum").val(msg.row.regionNum);
                                                    if(msg.row.gdlType=='左边'){
                                                        for (var i = 0; i < msg.row.cols; i++) {
                                                            str2 += '<option value="' + i + '">' + i + '</option>';
                                                        }
                                                    }else{
                                                        for (var i = 1; i <= msg.row.cols; i++) {
                                                            str2 += '<option value="' + i + '">' + i + '</option>';
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
                    if (fileData["fkStoreName"] === "" || fileData["fkRegionName"] === "" || fileData["colNum"] === "" || fileData["divNum"] === "" || fileData["laysNum"] === "" || fileData["direction"] === "") {
                        layer.msg("位置为必填项");
                        return false;
                    } else {
                        app.post("archivesmodule/arcTbFiles/updateLocation", fileData, function (msg) {
                            //console.log(msg);
                            layer.msg(msg.msg);
                            if (msg.state) {
                                mySelectedId = [];
                                fomrReset();
                                layer.close(index);
                                layer.closeAll('page'); //关闭所有页面层
                                reload($("#hidden").val());
                            }
                        });
                    }
                }
            });
        }

    });
    // 批量清除
    $(".batch-clean").on("click", function () {
        if (mySelectedId.length === 0) {
            layer.msg("请选择档案！", {
                time: 1000
            });
        } else {
            for(var fileId of mySelectedId){
                var newArr = filesInfo.filter(function(obj){
                    return fileId !== obj.id;
                });
                filesInfo=newArr;
            }
            localStorage.setItem("archives", JSON.stringify(filesInfo));
            fileTable(filesInfo);
        }

    });
    // 添加至档案盒
    $(".add-to-file-box").on("click", function () {
        if (mySelectedId.length == "") {
            layer.msg("请选择档案！");
        } else {
            layer.open({
                title: ['<i class="" style="display: inline-block; padding-right: 20px"></i>添加至档案盒', "font-size: 18px;text-align: center;"],
                area: ["780px", "680px"],
                type: 1,
                btn: ["确定", "取消"],
                btnAlign: 'c',
                shadeClose: false, //点击遮罩关闭
                shade: 0,
                content: $('#layer-page-box'),
                success: function (index, layero) {
                    var form = layui.form;
                    mytable.init({
                        id: "file_info_box",
                        pageCode: "archivesBoxs-admin",
                        url: "archivesmodule/arcTbFiles/selectArcFilesBox?tableName=" + table_name
                    }).then(function (table) {
                        table.on("radio(archivesBoxInfos)", function (obj) {
                            boxId = obj.data.id;
                        });
                    });
                    $(".ser-box").on("click", function () {
                        var table = layui.table;
                        var key_words = $(".key-val").val();
                        var table_name = $("#hidden").val();
                        table.reload("file_info_box", {
                            url: baseurl + "archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=" + table_name + "&comprehensive=" + key_words,
                            where: {} //设定异步数据接口的额外参数
                        });
                    });
                },
                yes: function (index, layero) {
                    app.post("archivesmodule/arcTbFiles/insertArcToBox", {
                            tableName: table_name,
                            boxId: boxId,
                            ids: mySelectedId
                        },
                        function (msg) {
                            if (msg.state) {
                                layer.closeAll('page');
                                layer.msg(msg.msg);
                                reload($("#hidden").val());
                            }
                        }
                    );
                }
            })
        }
    });
}

// 销毁
function destroy() {
    $('#destroy').on('click', function () {
        var data = getCheckedData();
        if (data.length > 0) {
            for(var i = 0; i < data.length; i++){
                if(data[i].state !== '在架') {
                    layui.layer.msg('只有在架才能销毁!!');
                    return;
                }
            }
            $('#details').trigger('click');
        } else {
            layui.layer.msg('请选择数据！！！');
        }
    })
}
// 离开页面关闭服务
window.onbeforeunload = function () {
	app.bindingget("rfid/end", {}, function (msg) {
		if ((msg.code = 200)) {
			console.log("关闭");
		} else {
			console.log(msg.msg);
		}
	});
};
var form;
$(function (mytable) {
    // 进入页面开启读取RFID服务
    app.bindingget("rfid/start", {}, function (msg) {
        if ((msg.code = 200)) {
            console.log("开始读取");
        } else {
            console.log(msg.msg);
        }
    });
    mySelected = [];
    layui.use(["form", "element", "layer", "table", "laydate", "upload"], function () {
        var element = layui.element;
        var layer = layui.layer;
        form = layui.form;
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
        getMenuBar();//自定义面包屑，引用public-menu.js
        getAchievesType();
        searchArchives();
        getState();
        getSec();
        destroy();
        // onFocus();

        addToBox();
        // 当前任务
        currentTask();

        // 批量上下架
        manyTaskUp();
        manyTaskDown();
        
        addToFile();
        openAddedFile("临时文件夹");
        openAddedFileClick();
        select_exports();
        distinguish();
        mybtn.date('#test1','#test2');
        form.render();
    });
}(mytable));

   //rfid识别搜索
   /*
   function distinguish() {
       
    $('#identify_tag').on('click',function () {
        console.log('是这里吗')
     var data={ wsUri: window.wsUri, cmd: 'readMany'};
     mycmd.rfid(data,function(res){
         var res=JSON.parse(res);
         if(res.state){
             if(res.row){
                 // layer.msg(res.msg);
                 $('#rfid').val(res.row.EPC);
             }
         }else{
             console.log(res.msg);
             // layer.msg(res.msg);
             return;
         }
     });
    })*/
	
	function distinguish(){
		$('#identify_tag').on('click', function() {
            console.log('发送')
			$('#rfid').val('');
			
            // wsValue.send('start')
            app.bindingget("rfid/getMessage", {}, function (msg) {
                if (msg.data) {
                    if (msg.data.length > 1) {
                        layer.msg("请保证RFID识别区附近有且仅有一张电子标签");
                    }
                    else if (msg.data[0].code == 0) {
                        readRFID(msg.data[0].rfid);
                    } else {
                        layer.msg(msg.data[0].msg);
                    }
                } else {
                    layer.msg("当前未识别到有效的电子标签");
                }
            });
			})
    }
    



function onFocus() {
    $('#rfid').focus(function () {
        readRFID();
    })
}

//rfid
function RFID(data) {
    $('#rfid').val(data);
}

function firstRefresh() {
    $(".layui-laypage-skip input").val(1);
    $(".layui-laypage-btn")[0].click();
}

function testRefresh() {
    $(".layui-laypage-btn")[0].click();
}
function fomrReset(){
    document.getElementById("revisePos").reset();
}


// function webinit(url) {
// 	var ws = new WebSocket(url);
// 	let that = this;
// 	ws.onopen = e => {
// 		ws.send("connect");
// 		console.log("连接成功");
// 	};
// 	ws.onmessage = e => {
// 		let result = /^EPC/.test(e.data);
// 		//let result = 'EPCE22200174010016614808282'
// 		let notice = /error/.test(e.data);
// 		let reconnect = /reconnect/.test(e.data);
// 		console.log("接收的信息", e.data,result);
// 		let error = '设备连接失败'
// 		if(error== e.data){
// 			$("#identify_error").text('设备连接失败')
// 		}
// 		if(result){
// 			console.log(e.data,'检测RFID')
// 			if(e.data.length>4){
// 				let res = e.data.slice(3)
// 				readRFID(res)
// 				console.log('你没执行啊')
// 			}else{
// 				// 弹框
// 				$("#identify_error").text('RFID为空')
				               
// 				console.log(!e.data,'RFID为空？')
// 			}
// 		}
// 		console.log("接收数据", e.data);
// 	};
// 	ws.onclose = e => {
// 		$('.rfid-loading').hide();
		
// 		$("#identify_error").text('连接关闭')
// 		console.log("连接关闭");
// 	};
// 	ws.onerror = e => {
// 		$('.rfid-loading').hide();
		
// 		$("#identify_error").text('设备连接失败')
// 		console.log("出错情况");
// 	};
// 	return ws;
// }


function readRFID(rfid){
	if(rfid){
		$('.rfid-loading').hide();
		console.log('rfid赋值',rfid)
		// 发送请求
        $('#rfid').val(rfid);
        
		app.get('archivesmodule/arcTbFile/validateRfidIfExist', {
			"id": "",
			"rfid": rfid
		}, function(res) {
			if (!res.state) {
				$("#identify_error").empty();
				$("#identify_error").text(res.msg)
				//$("#rfid").after('<label id="identify_error" class="error" for="fondsId">' + res.msg + '</label>');
			} else {
				layer.msg("电子标签正确！");
				$("#identify_error").text('')
			}
        });
        
	}else{
        layer.msg('RFID为空')
		return
	}
	  

}