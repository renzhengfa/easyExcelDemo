/**
 * @author tangli
 * @description 档案中心-档案盒管理
 * 
 */
var info = {
    startTime: '',
    endTime: '',
    state: '',
    fkTypeId: '',
    keywords: '',
    miji: '',
    table_name: ''
};
localStorage.setItem('tableN', 42);
var baseData = {};

$(function (mytable) {
        layui.use(["table", "layer", "form", "laydate"], function () {
            var table = layui.table;
            var form = layui.form;
            var layer = layui.layer;
            getMenuBar();//自定义面包屑，引用public-menu.js
            // 搜索
            mybtn.date('#date_picker1', '#date_picker2');
            getAchievesType();
            fileSearch();
            mytableinit(table);
            getSec();
            getState();
            destroy();
            addToFile();
            addArchiveBox();
            openFile();
            // distinguish();
            pageManageQuery(table);
            //导出
            form.on('select(output)', function (data) {
                if (data.value === "1") {
                    window.location.href = window.baseurl +
                        "archivesmodule/arcTbFiles/exportFilesBoxExcel?tableName=" + $('#hidden').val();
                } else if (data.value === "0") {
                    window.location.href = window.baseurl +
                        "archivesmodule/arcTbFiles/exportFilesBoxExcel?tableName=" +
                        $('#hidden').val() + "&currentPage=" +
                        curr + "&pageSize=" + pagesize;
                }
            });
        });
    }(mytable));

// 档案查询
function pageManageQuery(table) {
    // var table=layui.table;
    $("#btn-find").on("click", function () {
        var miji = $(".miji").find("option:selected").html();
        if (miji == "全部") {
            miji = "";
        }
        var data = {};
        data.miji = miji;
        data.table_name = $("#hidden").val();
        data.condition = $(".condition").find("option:selected").val();

        var start_time=$("#date_picker1").val();
        var end_time=$("#date_picker2").val();
        if(start_time!='' || end_time!=''){
             data.start_time = $("#date_picker1").val() + ' 00:00:00';
             data.end_time = $("#date_picker2").val() + ' 23:59:59'; 
        }

        if(start_time==''){
            data.start_time='';
        }
        if(end_time==''){
            data.end_time='';
        }
        data.keywords = $(".search-tips").val() || '';
        info = data;
        table.reload('historical_records_content', {
            url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?tableName=' +
                data.table_name + "&fkSecretName=" +
                data.miji + "&state=" +
                data.condition + "&createTime=" +
                data.start_time + "&endTime=" +
                data.end_time + "&comprehensive=" +
                data.keywords

        });
    }
    );
}

// 添加至档案盒
$(".add-to-file-box").on("click", function () {
    var data = layui.table.checkStatus('file_info').data;
    // localStorage.setItem('selectedArchive',JSON.stringify( getCheckedData())); 
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].state !== '在架') {
                layui.layer.msg('请选择在架档案!!');
                return;
            }
        }
        $('#addboxtoBox').trigger('click');
    } else {
        layui.layer.msg('请选择档案！');
        return;
    }
});

// 表格初始化
function mytableinit(table) {
    var url = "archivesmodule/arcTbFiles/selectArcFilesBox?tableName=" +
        localStorage.getItem("tableN");
    mytable.init({
        id: "historical_records_content",
        pageCode: "archivesBox-admin",
        url: url
    }).then(function (table) {
        //监听工具条
        table.on("tool(archivesBox)", function (obj) {
            var data = obj.data, typeId = $("#hidden").val();
            if (obj.event === "edit") {
                var archiveid = localStorage.getItem("archiveId");
                var tName = $("#hidden").val();
                // localStorage.setItem("archiveId", data.id);
                // localStorage.setItem("tableN", tName);
                // window.location.href = "archive-change.html?id=" + data.id;
                mySelected = [];
                app.get("archivesmodule/arcTbFiles/selectByBoxId", {
                    tableName: tName,
                    boxId: data.id
                }, function (msg) {
                    // console.log(msg);
                    // 获取条码
                    $("#hidden_input").val(msg.row.barCode);
                    $("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row.barCode);
                    // 生成条码
                    $(".beCode").on("click", function () {
                        app.get("archivesmodule/brcode/createCodeNum", {}, function (msg) {
                            if (msg.state) {
                                $("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row);
                                $("#hidden_input").val(msg.row);
                            }
                        });
                    });
                    // 打印条码
                    $('.print-code').on('click', function () {
                        $("#pic").jqprint();
                    });
                    //表单初始赋值
                    form.val('formTest', {
                        "fileNum": msg.row.fileNum,
                        "fileName": msg.row.fileName,
                        "author": msg.row.author,
                        "recordOrganize": msg.row.recordOrganize,
                        "rfid": msg.row.rfid
                    });
                    app.get("archivesmodule/arcTbFiles/selectLocationById", { id: msg.row.fkLocationId }, function (msg) {
                        locationId = msg.row.id;
                        fkStoreName = msg.row.fkStoreName;
                        fkRegionName = msg.row.fkRegionName;
                        colNum = msg.row.colNum;
                        laysNum = msg.row.laysNum;
                        divNum = msg.row.divNum;
                        direction = msg.row.direction;
                        // console.log(`数据：${JSON.stringify(msg)}`);
                        $("#dire").val(direction);
                        $(".quhao").val(msg.row.fkRegionNum);
                        $(".shuzi").val(msg.row.number);
                        $("#area").html('<option value="' + msg.row.id + '" selected>' + fkRegionName + '</option>');
                        $("#cols").html('<option value="' + colNum + '" selected>' + colNum + '</option>');
                        $("#lays").html('<option value="' + laysNum + '" selected>' + laysNum + '</option>');
                        $("#divs").html('<option value="' + divNum + '" selected>' + divNum + '</option>');
                        form.val('formTest', {
                            "locationName": msg.row.locationName
                        });
                        form.render("select");
                    });
                    // 获取库房名称、区、列、节、层......
                    app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function (msg) {
                        if (msg.state) {
                            var str1 = '<option value=""></option>';
                            var str = "";
                            for (var i = 0; i < msg.rows.length; i++) {
                                if (msg.rows[i].storeName == fkStoreName) {
                                    str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].storeName + '</option>';
                                } else {
                                    str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + '</option>';
                                }
                            }
                            $("#store_Room").html(str1 + str);
                            form.render('select');
                            form.on("select(storeroom)", function (data) {
                                app.get("storeroommodule/stoTbRegion/selectByBind", { fkStoreId: data.value }, function (msg) {
                                    if (msg.state) {
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
                                            app.get("storeroommodule/stoTbRegion/selectByRegionId", { id: data.value }, function (msg) {
                                                if (msg.state) {
                                                    $(".quhao").val(msg.row.regionNum);
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
                });
                layer_boxInfo("编辑档案盒", obj);

                // 拆盒
                $(".split-box").on("click", function () {
                    layer.confirm('是否确定拆盒？', { shade: 0 }, function (index) {
                        // 请求接口
                        app.post("archivesmodule/arcTbFiles/openBox", {
                            tableName: tName,
                            boxId: data.id
                        }, function (msg) {
                            if (msg.state) {
                                layer.msg(msg.msg);
                                table.reload('archivesBox_table', {
                                    url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?tableName=' + $("#hidden").val()
                                    , where: {} //设定异步数据接口的额外参数
                                });
                                table.reload('file_info', {
                                    url: baseurl + "archivesmodule/arcTbFiles/selectFilesByBoxId?tableName=" + tName + "&boxId=" + boxId
                                    , where: {} //设定异步数据接口的额外参数
                                });
                            } else {
                                layer.msg(msg.msg);
                            }
                        });
                    });
                });
                // 移除档案
                $(".remove-files").on("click", function () {
                    if (mySelected.length === "") {
                        layer.msg("请选择要移除的档案！", { time: 1000 });
                    } else {
                        layer.confirm('是否确定移除档案？', { shade: 0 }, function (index) {
                            // 请求接口
                            app.post("archivesmodule/arcTbFiles/removeInBoxFiles", {
                                tableName: tName,
                                ids: mySelected
                            }, function (msg) {
                                if (msg.state) {
                                    layer.msg(msg.msg);
                                    table.reload('archivesBox_table', {
                                        url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?tableName=' + $("#hidden").val()
                                        , where: {} //设定异步数据接口的额外参数
                                    });
                                    table.reload('file_info', {
                                        url: baseurl + "archivesmodule/arcTbFiles/selectFilesByBoxId?tableName=" + tName + "&boxId=" + boxId
                                        , where: {} //设定异步数据接口的额外参数
                                    });
                                } else {
                                    layer.msg(msg.msg);
                                }
                            });
                        });
                    }
                });

            } else if (obj.event == "offShelves") {  //下架
                app.post('archivesmodule/arcTbFiles/updateByFilesState', {
                    tableName: typeId,
                    id: data.id,
                    upDownFlag: 0
                }, function (res) {
                    layer.msg(res.msg);
                    $('.layui-laypage-btn').click();
                });
            } else if (obj.event == "putaway") {  //上架
                app.post('archivesmodule/arcTbFiles/updateByFilesState', {
                    tableName: typeId,
                    id: data.id,
                    upDownFlag: 1
                }, function (res) {
                    layer.msg(res.msg);
                    $('.layui-laypage-btn').click();
                });
            } else if (obj.event == 'delete') {
                layer.confirm('确定删除该档案盒？', { shade: 0 }, function (index) {
                    // 请求接口
                    app.post("archivesmodule/arcTbFiles/deleteFilesBoxById", {
                        tableName: typeId,
                        boxId: data.id
                    }, function (msg) {
                        if (msg.state) {
                            layer.msg(msg.msg);
                            table.reload('historical_records_content', {
                                url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?tableName=' + $("#hidden").val()
                                , where: {} //设定异步数据接口的额外参数
                            });
                        }
                        else {
                            layer.msg("请先移除该档案盒内档案！");
                        }
                    });
                });
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
                $('.layui-laypage-btn').click();
            });
        });
    });
};


// 编辑档案盒弹出框
function layer_boxInfo(title, obj) {
    var table_name = $("#hidden").val();
    var layer = layui.layer;
    layer.open({
        title: ['<i class="" style="display: inline-block; padding-right: 10px"><img src="../../../static/images/role/modify.png" width="17" height="18"></i>' + title, "font-size: 18px;text-align: center;"],
        area: ["1130px", "835px"],
        type: 1,
        btn: ["确定", "取消"],
        btnAlign: 'c',
        shadeClose: false, //点击遮罩关闭
        shade: 0,
        content: $('#layer-page'),
        success: function (index, layero) {
            var form = layui.form;
            boxId = obj.data.id;
            mytable.init({
                id: "file_info",
                pageCode: "filesBox_info",
                url: "archivesmodule/arcTbFiles/selectArcFilesInBox?tableName=" + table_name + "&boxId=" + boxId
            }).then(function (table) {

            });
        },
        yes: function (index, layero) {
            var table = layui.table;
            var danghao = $(".danghao").val();
            var timing = $(".timing").val();
            var zhuluren = $(".zhuluren").val();
            var fkStoreName = $("#store_Room").find("option:selected").html();
            var fkStoreID = $("#store_Room").find("option:selected").val();
            var fkRegionName = $("#area").find("option:selected").html();
            var fkRegionID = $("#area").find("option:selected").val();
            var cols = $("#cols").find("option:selected").val();
            var lays = $("#lays").find("option:selected").val();
            var divs = $("#divs").find("option:selected").val();
            var direction = $("#dire").find("option:selected").val();
            var quhao = $(".quhao").val();
            var number = $(".shuzi").val();
            var t2 = $('#layer_revise_files').serializeArray();
            var data = {};
            $.each(t2, function () {
                data[this.name] = this.value;
                data["boxId"] = boxId;
                data["tableName"] = table_name;
           
                data["fkStoreName"] = fkStoreName;
                data["fkRegionName"] = fkRegionName;
                data["fkStoreId"] = fkStoreID;
                data["fkRegionId"] = fkRegionID;
                data["colNum"] = cols;
                data["laysNum"] = lays;
                data["divNum"] = divs;
                data["direction"] = direction;
                data["number"] = number;
                data["fkRegionNum"] = quhao;
            });
            if (danghao !== "" && timing !== "" && zhuluren && fkStoreName !== "" && fkRegionName !== "" && cols !== "" && lays !== "" && divs !== "" && direction !== "" && number !== "") {
                app.post("archivesmodule/arcTbFiles/updateBoxAndLocation", data, function (msg) {
                    if (msg.state) {
                        layer.msg(msg.msg);
                        layer.close(index);
                        table.reload('archivesBox_table', {
                            url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?tableName=' + $("#hidden").val()
                            , where: {} //设定异步数据接口的额外参数
                        });
                    }
                    layer.msg(msg.msg)
                });
            }
            else {
                layer.msg("位置信息不完整！");
            }
        }
    })
}
// 文件查询 节点查询
function fileSearch() {
    $("#search").keyup(function () {
        var txtObj = $("#search").val();
        if (txtObj.length > 0) {
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodeList = zTree.getNodesByParamFuzzy("typeName", txtObj);
            //console.log(nodeList);
            $.fn.zTree.init($("#treeDemo"), setting, nodeList);
        } else {
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        }
    });
}
// 获取选中数据
function getCheckedData() {
    var getChecked = layui.table.checkStatus('historical_records_content');
    return getChecked.data;
}
// 销毁
function destroy() {
    $('#destroy').on('click', function () {
        var data = getCheckedData();
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].state !== '在架') {
                    layui.layer.msg('只有在架才能销毁!!');
                    return;
                }
            }
            $('#details').trigger('click');

        } else {
            layui.layer.msg('请选择档案！');
        }
    })
}

// 新增档案盒
function addArchiveBox() {
    $(".add-archiveBox").on("click", function () {
        window.location.href = 'add-archiveBox.html';
    });
}


// 添加至临时文件夹
function addToFile() {
    $("#add-to-file").on("click", function () {
        var mySelected = localStorage.getItem('myselected');
        var table = layui.table;
        var table_name = $("#hidden").val();
        if (getCheckedData().length == 0) {
            layer.msg("请选择档案！", { time: 1000 });
        } else {
            app.get("archivesmodule/arcTbFiles/selectFilesByIds", {
                tableName: table_name,
                fileIds: mySelected.toString()
            }, function (msg) {
                if (msg.state == true) {
                    layer.msg("添加至临时文件夹成功！");
                    localStorage.setItem("archivesBox", JSON.stringify(msg.rows));
                    table.reload("historical_records_content", {
                        url: baseurl + "archivesmodule/arcTbFiles/selectArcFilesBox?tableName=" + $("#hidden").val(),
                        where: {} //设定异步数据接口的额外参数
                    });
                }
            });
        }
    });
}

// 打开临时文件夹
function openFile() {
    $('.open').on('click', () => {
        var files = localStorage.getItem("archivesBox");
        if (files) {
            $('#openfile').trigger('click');
            // $('.layui-layer-btn .layui-layer-btn-c').hide();
        } else {
            layer.msg('临时文件夹没有数据！', { time: 1000 })
        }
    })
}
//rfid识别搜索
$('#identify_tag').on('click', function () {
    distinguish($('#rfid'));
})

$('.identify_tag1').on('click', function () {
    distinguish($('.rfid1'))
})

function distinguish(obj) {
    var data = { wsUri: window.wsUri, cmd: 'readMany' };
    mycmd.rfid(data, (res) => {
        var res = JSON.parse(res);
        if (res.state) {
            if (res.row) {
                // layer.msg(res.msg);
                obj.val(res.row.EPC)
            }
        } else {
            // layer.msg(res.msg);
            return;
        }
    });
}
// 节点点击
function zTreeOnClick(event, treeId, treeNode) {
    var table = layui.table;
    $('#hidden').val(treeNode.id);
    console.log(treeNode.id)
    localStorage.setItem('tableN', treeNode.id)
    // tableFile(mytable, "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + treeNode.id);
    table.reload('historical_records_content', {
        url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?tableName=' + treeNode.id
    });
}
// 初始化文件树
function getAchievesType() {
    myztree.archiveSearch("archivesmodule/arcTbArcType/selectAll", {}, function (msg) {
        if (msg.state == true) {
            $("#hidden").val(msg.rows[0].id);
            // 表格默认渲染节点1
            localStorage.setItem("tableN", msg.rows[0].id);
            zNodes = msg.rows;
            $(document).ready(function () {   //点击节点渲染当前id表格
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            })
        }
    })
}

// 初始密级下拉框
function getSec() {
    app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=ofthem", {}, function (msg) {
        if (msg.state == true) {
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

// 初始查询档案和档案盒的状态
function getState() {
    app.get("authmodule/sysTbDictCode/selectByArchivalStatus", {}, function (msg) {
        if (msg.state == true) {
            var str = "";
            var str1 = '<option value="">全部</option>';
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].code + '">' + msg.rows[i].svalue + "</option>";
            }
            $(".condition").html(str1 + str);
            form.render();
        }
    });
}

function firstRefresh() {
    $(".layui-laypage-skip input").val(1);
    $(".layui-laypage-btn")[0].click();
}

function testRefresh() {
    $(".layui-laypage-btn")[0].click();
}
function fomrReset() {
    document.getElementById("revisePos").reset();
}


