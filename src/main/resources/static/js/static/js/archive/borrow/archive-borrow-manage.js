var baseData,demoTable_height;
var isBorrow = false;
// var wsValue = webinit(window.wsUri)
function fileRetrieval(mytable,url) {
    mytable.init({
        id: "tab_table_2",
        url: url,
        pageCode: "archives-admin",
        limit: 20,height:"full-"+demoTable_height+"",
        data: {}
    });
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
$(function (mytable) {
    // 进入页面开启读取RFID服务
    app.bindingget("rfid/start", {}, function (msg) {
        if ((msg.code = 200)) {
            console.log("开始读取");
        } else {
            console.log(msg.msg);
        }
    });
        layui.use(["table", "layer", "form", "element"], function () {
            var table = layui.table;
            var form = layui.form;
            var element = layui.element;
            var oprate = $('#operate');
            getMenuBar();//自定义面包屑，引用public-menu.js
            demoTable_height=$(".demoTable").outerHeight(true)+140;
            element.on("tab(docDemoTabBrief)", function (data) {
                if (data.index == 1) {
                    $('#borrow-manage-table1').hide();
                    var tool1 = `<a class="layui-btn-xs layui-btn-tablexs" lay-event="lend">借阅</a><a href="javascript:;" class="line"></a>
    <a class="layui-btn-xs layui-btn-tablexs" lay-event="pending">添加到待借阅</a>`;
                    oprate.empty();
                    oprate.append(tool1);

                    fileRetrieval(mytable,"archivesmodule/arcTbBorrowRun/fileRetrieval");
                    table.on('tool(tab_table_2_tool)', function (obj) {
                        var data = obj.data; //获得当前行数据
                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

                        if (layEvent === 'lend') {
                            if (data.state !== '在架') {
                                layui.layer.msg('只能借阅在架档案!!');
                            } else if (data.allowBorrow === "否") {
                                layui.layer.msg('档案不允许被借阅!!');
                            } else {
                                baseData = [data];
                                $('.modaljump').trigger('click');
                            }
                        } else if (layEvent === 'pending') {
                            if (data.state !== '在架') {
                                layui.layer.msg('只能添加在架档案!!');
                                return;
                            }
                            //连接websql数据库
                            webSqlExecute("borrow", 'INSERT INTO borrow (id,fileNum,fileName,fondsId,fkSecretName,fkTypeId,fkTypeName,boxName,createTime,locationName,integrity,state,allowBorrow) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.id, data.fileNum, data.fileName, data.fondsId, data.fkSecretName, data.fkTypeId, data.fkTypeName, data.boxName,data.createTime, data.locationName, data.integrity, data.state, data.allowBorrow], function (tx, re) {
                                if (tx) {
                                    layer.msg('添加成功');
                                } else {
                                    layer.msg('添加失败: ' + "不能重复添加");
                                }

                            });
                        } else {
                            layui.layer.msg('请选择档案之后再添加到待借阅！！');
                        }
                    });
                    $('#fileRetrieval').on('click', function () {
                        var value = $('input[name="fileRetrieval"]').val();
                        //     url = `archivesmodule/arcTbBorrowRun/fileRetrieval?fileName=${value}&fileNum=${value}&fkSecretName=${value}&fkTypeName=${value}&createUserName=${value}&search=term`;
                        // fileRetrieval(mytable,url);
                        var pattern = /[`^&% { } | ?]/im;
                        if(!value ||  value && !pattern.test(value)) { 
                            var url = `archivesmodule/arcTbBorrowRun/fileRetrieval?fileName=${value}&fileNum=${value}&fkSecretName=${value}&fkTypeName=${value}&createUserName=${value}&search=term`;
                            fileRetrieval(mytable,url);
                        }else {
                           layer.msg('查询条件不能包含特殊字符');
                          }
                    });
                } else if (data.index == 2) {
                    $('#borrow-manage-table1').hide();
                    var tool2 = `<a class="layui-btn-xs layui-btn-tablexs" lay-event="remove">移除</a><a href="javascript:;" class="line"></a>
    <a class="layui-btn-xs layui-btn-tablexs" lay-event="borrow">借阅</a>`;
                    oprate.empty();
                    oprate.append(tool2);
                    reloadTable();
                    table.on('tool(tab_table_3_tool)', function (obj) {
                        var data = obj.data; //获得当前行数据
                        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

                        if (layEvent === 'borrow') {
                            if (data.state !== '在架') {

                                layui.layer.msg('只能借阅在架档案!!');
                            } else if (data.allowBorrow === "否") {
                                layui.layer.msg('档案不允许被借阅!!');
                            } else {
                                isBorrow = true;
                                baseData = [data];
                                $('.modaljump').trigger('click');
                            }
                        } else if (layEvent === 'remove') {
                            //连接websql数据库
                            webSqlExecute("borrow", "delete from borrow where id=? ", [data.id], function (tx, re) {
                                if (tx) {
                                    reloadTable();
                                    layer.msg("移除成功");
                                } else {
                                    layer.msg('移除失败');
                                }

                            });

                        }
                    });

                } else if (data.index === 0) {
                    $('#borrow-manage-table1').show();
                }
            });

            getSelectData();
            // getDate()
            form.render();
            // 初始化表格
            mytableinit(mytable,"archivesmodule/arcTbBorrowRun/selectPage");
          
            form.render();
            borrowManageQuery(table);
            borrowManageBatchLend();
            borrowManageBatchReturn();
            borrowManageAddBorrowing();
            addPending();
            removePending();


            piborrow();
			distinguish()
        });
}(mytable));

function reloadTable() {
    var data = [];
    var cols = app.asyncGet("authmodule/authTbPageols/selectCols", {
        pageCode: "archives-admin"
    });
    var rows = [];
    rows[0] = {
        type: "checkbox",
        title: "type",
        width: 60,
        fixed: "left"
    };
    rows[1] = {
        type: 'numbers',
        title: '序号',
        width: 60,
        fixed: 'left'
    };
    for (var i = 2; i <= cols.rows.length + 1; i++) {
        rows[i] = cols.rows[i - 2];
    }
    data.push(rows);
    var values = [];
    //连接websql数据库
    webSqlExecute("borrow", 'SELECT * FROM borrow', [], function (tx, results) {
        if (tx) {
            for (var i = 0; i < results.rows.length; i++) {
                values.push(results.rows[i]);
            }

            layui.table.render({
                elem: '#tab_table_3',
                cols: data,
                page: {
                    theme: '#3a97ff'
                },
                limit: 20,height:"full-"+demoTable_height+"",
                loading: true,
                cellMinWidth: 60,
                even: true, // 开启隔行背景
                data: values,
            })
        } else {
            alert('查询失败');
        }
    });
}
// 初始化表格
function mytableinit(mytable,url){
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "borrow_manage_table_content",
        pageCode: "borrow-manage",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url 
    })
    // mytable.init({
    //     id: "borrow_manage_table_content",
    //     url: "archivesmodule/arcTbBorrowRun/selectPage",
    //     pageCode: "borrow-manage",
    //     limit: 20,height:"full-"+demoTable_height+"",
    //     data: {}
    // })
    .then(function (table) {
        // 编辑
        table.on("tool(borrow-manage-table-content-tool)", function (obj) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === "return") {
                app.post('archivesmodule/arcTbBorrowRun/batchReturn', { ids: data.id }, function (res) {
                    if (res.state) {
                        $("#query").click();
                        // table.reload('borrow_manage_table_content', {
                        //     url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPage'
                        //     , where: {} //设定异步数据接口的额外参数
                        //     //,height: 300
                        // });
                    }
                    layer.msg(res.msg);
                })
            } else if (layEvent === "lend") {
                app.post('archivesmodule/arcTbBorrowRun/bulkLending', { ids: data.id }, function (res) {
                    if (res.state) {
                        $("#query").click();
                        // table.reload('borrow_manage_table_content', {
                        //     url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPage'
                        //     , where: {} //设定异步数据接口的额外参数
                        //     //,height: 300
                        // });
                    }
                    layer.msg(res.msg);
                })
            } else if (layEvent === "cancel_borrow") {
                app.post('archivesmodule/arcTbBorrowRun/cancel', { ids: data.id }, function (res) {
                    if (res.state) {
                        $("#query").click();
                        // table.reload('borrow_manage_table_content', {
                        //     url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPage'
                        //     , where: {} //设定异步数据接口的额外参数
                        //     //,height: 300
                        // });
                    }
                    layer.msg(res.msg);
                })
            }
        });
    });
}


// rfidArr = [];
//rfid识别搜索
/*
function distinguish() {
    rfidArr = [];
    rfidArr2 = [];
    var data = { wsUri: window.wsUri, cmd: 'readMany' };
    mycmd.rfid(data, function (res) {
        var res = JSON.parse(res);
        if (res.state) {
            if (res.row) {
                console.log(res.row.EPC)
                $('#borrow_manage_input').val(res.row.EPC);
                app.get(`archivesmodule/arcTbBorrowRun/selectPage?map[rfid]=${res.row.EPC}`, {}, function (res) {
                    if (res.state) {
                        if (res.rows.length != 0) {
                            for (var item of rfidArr) {
                                if (item.id == res.rows[0].id) {
                                    return;
                                }
                            }
                            rfidArr.push(res.rows[0]);
                            rfidArr2.push(res.rows[0].rfid);
                            localStorage.setItem('rfidArr', rfidArr2)
                            tableinit(rfidArr);
                        } else {
                            console.log('有未借阅档案！');
                        }
                    }
                })
            }
        } else {
            // layer.msg(res.msg);
            return;
        }
    });
}


$('#distinguish').on('click', function () {
    $('#borrow_manage_table_content').next().css({ display: 'none' })
    // tableinit([]);
    distinguish();
})
*/
function tableinit(rfidArr) {
    layui.use(['form', 'table'], function () {
        var form = layui.form,
            table = layui.table;
        table.render({
            elem: '#tab_table_1',
            page: true,
            cols: [[
                { type: "checkbox", title: "", fixed: "left", align: "center", width: 60 },
                { field: 'id', title: 'ID', hide: 'true' },
                { type: 'numbers', title: '序号', fixed: 'left', align: 'center', width: 60 },
                { field: 'borrowUserName', title: '借阅人', align: 'center' },
                { field: 'borrowUnitName', title: '借阅单位', align: 'center' },
                { field: 'idCard', title: '身份证号码', align: 'center' },
                { field: 'fkAuditorName', title: '审核人', align: 'center' },
                { field: 'fkFileName', title: '题名', align: 'center' },
                { field: 'fkFileNum', title: '档号', align: 'center' },
                { field: 'fkTypeName', title: '档案类型', align: 'center' },
                { field: 'isBox', title: '是否档案盒', align: 'center' },
                { field: 'shouldReturnTime', title: '到期时间', align: 'center' },
                { field: 'realReturnTime', title: '实际归还时间', align: 'center' },
                {
                    field: "state", title: "当前状态", align: "center",
                    fixed: 'right', width: 120, templet: '#state_Tpl'
                },
                { title: '操作', toolbar: '#operation', align: 'center', fixed: 'right', width: 220 }
            ]],
            data: rfidArr
        });

        table.on("tool(borrow-manage-table-content-tool2)", function (obj) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === "return") {
                app.post('archivesmodule/arcTbBorrowRun/batchReturn', { ids: data.id }, function (res) {
                    if (res.state) {
                        table.reload('tab_table_1', {
                            url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPage'
                            , where: {} //设定异步数据接口的额外参数
                            //,height: 300
                        });
                    }
                    layer.msg(res.msg);
                })
            } else if (layEvent === "lend") {
                app.post('archivesmodule/arcTbBorrowRun/bulkLending', { ids: data.id }, function (res) {
                    if (res.state) {
                        table.reload('tab_table_1', {
                            url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPage'
                            , where: {} //设定异步数据接口的额外参数
                            //,height: 300
                        });
                    }
                    layer.msg(res.msg);
                })
            } else if (layEvent === "cancel_borrow") {
                app.post('archivesmodule/arcTbBorrowRun/cancel', { ids: data.id }, function (res) {
                    if (res.state) {
                        table.reload('tab_table_1', {
                            url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPage'
                            , where: {} //设定异步数据接口的额外参数
                            //,height: 300
                        });
                    }
                    layer.msg(res.msg);
                })
            }
        });
    })
}
function RFID(data) {
    $('#borrow_manage_input').val(data);
}
// 下拉框赋值
window.borrow_list_type = {}; // 档案类别
function getSelectData() {
    var state = [
        {
            id: "rfid",
            borrow_state: "档案电子标签"
        },
        {
            id: "idCard",
            borrow_state: "身份证号"
        },
        {
            id: "jobNumber",
            borrow_state: "工号"
        },
        {
            id: "phone",
            borrow_state: "手机号"
        },
        {
            id: "fkFileNum",
            borrow_state: "档号"
        },
        {
            id: "barCode",
            borrow_state: "档案条码"
        },
        {
            id: "fkFileName",
            borrow_state: "档案题名"
        }
    ];
    addSelect("select", state, true, "id", "borrow_state");
}

// select添加选项
function addSelect(id, data, bool, val, text) {
    //bool是否添加“请选择”选项
    val = val || "type";
    text = text || "name";
    var html = "";
    var $id = $("#" + id);
    $id.html("");
    for (var i in data) {
        html += `<option value="${data[i][val]}">${data[i][text]}</option>`;
        // html +=
        //   '<option value="' + data[i][val] + '">' + data[i][text] + "</option>";
    }
    $id.html(html);
    var form = layui.form;
    form.render("select");
}

// 查询
function borrowManageQuery(table) {
    $("#query").on("click", function () {
        $('#tab_table_1').next().css({ display: 'none' })
        var borrow_manage_select = $("#select").next().find('.layui-this').attr('lay-value');
        var borrow_manage_input = $("#borrow_manage_input").val();

        var data = "";
        switch (borrow_manage_select) {
            case "idCard":
                data = "idCard";
                var reg = new RegExp('^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$');
                if (!reg.test(borrow_manage_input)) {
                    layer.msg('输入不合法，请输入正确的身份证号码');
                    return;
                }
                break;
            case "jobNumber":
                data = "jobNumber";
                break;
            case "phone":
                data = "phone";
                var reg = new RegExp('^1(3|4|5|7|8)\\d{9}$');
                if (!reg.test(borrow_manage_input)) {
                    layer.msg('输入不合法，请输入正确的手机号码');
                    return;
                }
                break;
            case "fkFileNum":
                data = "fkFileNum";
                break;
            case "barCode":
                data = "barCode";
                break;
            case "rfid":
                data = "rfid";
                break;
            case "fkFileName":
                data = "fkFileName";
                break;
        }
        if (borrow_manage_select == "请选择") {
            layer.msg("您还没有选择");
            return;
        }
        //  else if (borrow_manage_input == "") {
        //     layer.msg("您还没有输入要查询的内容");
        //     return;
        // }
        // table.reload("borrow_manage_table_content", {
        //     url: baseurl + `archivesmodule/arcTbBorrowRun/selectPage?map[${data}]=${borrow_manage_input}`
        // });

        var pattern = /[`^&% { } | ?]/im;
        if(!borrow_manage_input ||  borrow_manage_input && !pattern.test( borrow_manage_input )) { 
            var url=  `archivesmodule/arcTbBorrowRun/selectPage?map[${data}]=${borrow_manage_input}`;
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }

    });
}

// 批量借出,这一坨代码可以封装到一个类
// 所有的点击事件都可以封装到一个类// 批量借阅
function borrowManageBatchLend(table) {
    $("#batch_lend1").on("click", function () {

        if ($('#borrow_manage_table_content').next().is(':visible')) {
            var value = getCheckedData('borrow_manage_table_content');
            if (value.length > 0) {
                var ids = [];
                for (var i in value) {
                    ids.push(value[i].id);
                }
                var ids_arr = ids.join(',');
                app.post('archivesmodule/arcTbBorrowRun/bulkLending', { ids: ids_arr }, function (res) {
                    if (res.state) {
                        $("#query").click();
                    }
                    layui.layer.msg(res.msg);
                })
            } else {
                layer.msg("请选择档案之后再批量借出！");
            }
        }


        if ($('#tab_table_1').next().is(':visible')) {
            var value = getCheckedData('tab_table_1');
            if (value.length > 0) {
                var ids = [];
                for (var i in value) {
                    ids.push(value[i].id);
                }
                var ids_arr = ids.join(',')
                app.post('archivesmodule/arcTbBorrowRun/bulkLending', { ids: ids_arr }, function (res) {
                    if (res.state) {
                        tableinit(rfidArr);
                        // console.log(res)
                    }
                    layui.layer.msg(res.msg);
                })
            } else {
                layer.msg("请选择档案之后再批量借出！");
            }
        }
    });

    $('#batch_lend2').on('click', function () {
        var value = getCheckedData('tab_table_2');
        var ids = [];
        for (var i in value) {
            ids.push(value[i].id);
        }
        var ids_arr = ids.join(',');
        app.post('archivesmodule/arcTbBorrowRun/bulkLending', { ids: ids_arr }, function (res) {
            if (res.state) {
                layui.table.reload('tab_table_2', {
                    url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectByUserAndFileAndBorrow'
                    , where: {} //设定异步数据接口的额外参数
                    //,height: 300
                });
            }
            layui.layer.msg(res.msg);
        })
    });
}
// 批量归还
function borrowManageBatchReturn() {
    $("#batch_return1").on("click", function () {

        if ($('#borrow_manage_table_content').next().is(':visible')) {
            var value = getCheckedData('borrow_manage_table_content');
            if (value.length > 0) {
                var ids = [];
                for (var i in value) {
                    ids.push(value[i].id);
                }
                var ids_arr = ids.join(',');
                app.post('archivesmodule/arcTbBorrowRun/batchReturn', { ids: ids_arr }, function (res) {
                    if (res.state) {
                        $("#query").click();
                        // layui.table.reload('borrow_manage_table_content', {
                        //     url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectByUserAndFileAndBorrow'
                        //     , where: {} //设定异步数据接口的额外参数
                        //     //,height: 300
                        // });
                    }
                    layui.layer.msg(res.msg);
                })
            } else {
                layer.msg('请选择档案之后再批量归还！');
            }
        }

        if ($('#tab_table_1').next().is(':visible')) {
            var value = getCheckedData('tab_table_1');
            if (value.length > 0) {
                var ids = [];
                for (var i in value) {
                    ids.push(value[i].id);
                }
                var ids_arr = ids.join(',');
                app.post('archivesmodule/arcTbBorrowRun/batchReturn', { ids: ids_arr }, function (res) {
                    if (res.state) {
                        tableinit(rfidArr);
                    }
                    layui.layer.msg(res.msg);
                })
            } else {
                layer.msg('请选择档案之后再批量归还！');
            }
        }

    });
}

// 新增借阅
function borrowManageAddBorrowing() {
    $("#add_borrow").on("click", function () {
        var data = getCheckedData('tab_table_2');
        if (data.length > 0) {

            // data.every(function (item) {
            //    return item.state === '在架';
            // });
            for (var i = 0; i < data.length; i++) {
                if (data[i].state !== '在架') {
                    layui.layer.msg('只能借阅在架档案!');
                    return;
                }
                if (data[i].allowBorrow === "否") {
                    layui.layer.msg('您选择的档案里存在不允许被借阅的档案！')
                    return;
                }
            }
            baseData = data;
            $('.modaljump').trigger('click');
        } else {
            layui.layer.msg('请选择档案之后再批量借阅！');
        }
    });
}
//批量借阅
function piborrow() {
    $("#batch_lend3").on("click", function () {
        var data = getCheckedData('tab_table_3');
        // console.log(data)
        // console.log(data)
        if (data.length > 0) {

            // data.every(function (item) {
            //    return item.state === '在架';
            // });
            for (var i = 0; i < data.length; i++) {
                if (data[i].state !== '在架') {
                    layui.layer.msg('只能借阅在架档案!');
                    return;
                }
                if (data[i].allowBorrow === "否") {
                    layui.layer.msg('您选择的档案里存在不允许被借阅的档案！！')
                    return;
                }
            }
            baseData = data;
            isBorrow = true;
            // console.log(baseData)
            $('.modaljump').trigger('click');

        } else {
            layui.layer.msg('请选择档案之后再批量借阅！！');
        }
    })
}

// 添加到待借阅
function addPending() {
    $('#add_pending').on('click', function () {
        //删除数据表
        /*var db = openDatabase('mydb', '1.0', 'webDB', 2 * 1024 * 1024);
        db.transaction(function (tx) {
            tx.executeSql('drop table transfer');
        });*/
        var data = getCheckedData('tab_table_2');
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].state !== '在架') {
                    layui.layer.msg('只能添加在架档案!');
                    return;
                }
            }
            //   console.log(data)


            //添加数据到websql
            for (var i = 0; i < data.length; i++) {
                webSqlExecute("borrow", 'INSERT INTO borrow (id,fileNum,fileName,fondsId,fkSecretName,fkTypeId,fkTypeName,boxName,createTime,locationName,integrity,state,allowBorrow) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [data[i].id, data[i].fileNum, data[i].fileName, data[i].fondsId, data[i].fkSecretName, data[i].fkTypeId, data[i].fkTypeName, data[i].boxName,data[i].createTime, data[i].locationName, data[i].integrity, data[i].state, data[i].allowBorrow], function (tx, re) {
                    if (tx) {
                        layer.msg("添加成功");
                    } else {
                        layer.msg('添加失败: ' + "不能重复添加");
                    }

                });
            }
        } else {
            layui.layer.msg('请选择档案之后再添加到待借阅！');
        }
    })
}

//批量移除
function removePending() {
    $('#remove').on('click', function () {
        var data = getCheckedData('tab_table_3');
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                webSqlExecute("borrow", "delete from borrow where id= ?", [data[i].id], function (tx, re) {
                    if (tx) {
                        reloadTable();
                        layer.msg("移除成功");

                    } else {
                        layer.msg('移除失败');
                    }

                });
            }
        } else {
            layer.msg('请选择档案之后再批量移除！');
        }

    });
}
function firstRefresh() {
    if (isBorrow) {
        deleteBorrow();

    }
    $(".layui-laypage-skip input").val(1);
    $(".layui-laypage-btn")[0].click();
}
function testRefresh() {

    $(".layui-laypage-btn")[0].click();
}

function deleteBorrow() {

    for (var i = 0; i < baseData.length; i++) {
        webSqlExecute("borrow", "delete from borrow where id= ?", [baseData[i].id], function (tx, re) {
            if (tx) {
                reloadTable();
            } else {
                layer.msg('移除失败');
            }

        });
    }

    isBorrow = false;

}


// websocket专供
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
// 		console.log("接收的信息", e.data, result);
// 		let error = '设备连接失败'
// 		if (error == e.data) {
// 			$("#identify_error").text('设备连接失败')
// 		}
// 		if (result) {
// 			console.log(e.data, '检测RFID')
// 			if (e.data.length > 4) {
// 				let res = e.data.slice(3)
// 				readRFID(res)
// 				console.log('你没执行啊')
// 			} else {
// 				$('.rfid-loading').hide();
// 				$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
// 				// 弹框
// 				$("#identify_error").text('RFID为空')

// 				console.log(!e.data, 'RFID为空？')
// 			}
// 		}
// 		console.log("接收数据", e.data);
// 	};
// 	ws.onclose = e => {
// 		$('.rfid-loading').hide();
// 		$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
// 		$("#identify_error").text('连接关闭')
// 		console.log("连接关闭");
// 	};
// 	ws.onerror = e => {
// 		$('.rfid-loading').hide();
// 		$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
// 		$("#identify_error").text('设备连接失败')
// 		console.log("出错情况");
// 	};
// 	return ws;
// }

function readRFID(rfid) {
	if (rfid) {
		console.log(rfid)
		$('#borrow_manage_input').val(rfid);
		app.get(`archivesmodule/arcTbBorrowRun/selectPage?map[rfid]=${rfid}`, {}, function (res) {
		    if (res.state) {
		        if (res.rows.length != 0) {
		            for (var item of rfidArr) {
		                if (item.id == res.rows[0].id) {
		                    return;
		                }
		            }
		            rfidArr.push(res.rows[0]);
		            rfidArr2.push(res.rows[0].rfid);
		            localStorage.setItem('rfidArr', rfidArr2)
		            tableinit(rfidArr);
		        } else {
					layer.msg('有未借阅档案！')
		            console.log('有未借阅档案！');
		        }
		    }
		})
	} else {
		return
	}


}

function distinguish() {
	$('#distinguish').on('click', function() {
		 $('#borrow_manage_table_content').next().css({ display: 'none' })
		
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

window.onbeforeunload = function() {
	console.log('关闭websocket')
	wsValue.close()
};