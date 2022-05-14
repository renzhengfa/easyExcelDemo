/**
 * @author chentong
 * @description 借阅中心-借阅列表
 * update--tangli
 */
// select添加选项
var info = {
    startTime: '',
    endTime: '',
    state: '',
    fkTypeId: '',
    parameter: ''
};

var baseData = {};  // 传给iframe的对象

function addSelect(id, data, bool, val, text) {
    //bool是否添加“请选择”选项
    val = val || "type";
    text = text || "name";
    var html = "";
    var $id = $("#" + id);
    $id.html("");
    if (bool) {
        html += '<option value="">请选择</option>';
    }
    for (var i in data) {
        if(data[i].svalue !== '同意'){
            html +=
                '<option value="' + data[i][val] + '">' + data[i][text] + "</option>";
        }
    }
    $id.html(html);
    var form = layui.form;
    form.render("select");
}

window.borrow_list_type = {}; // 档案类别
function getSelectData() {
    app.get("authmodule/sysTbDictCode/selectFlowAndBorrowStatus", '', function (res) {
        console.log(res);
        if (res.state) {
            addSelect("borrow_list_state", res.rows, true, 'code', "svalue");
            console.log( res.rows);
        }
    });
}

// 查询
function pageManageQuery(table) {
    $('#borrow_list_query').on('click', function () {
        var data = {};
        data.startTime = $('#date_picker1').val() || "";
        data.endTime = '';
        data.state = $('#borrow_list_state').next().find('.layui-anim').find('.layui-this').attr('lay-value') || "";
        data.fkTypeId = $('#department_id').val() || "";
        data.parameter = $('#borrow_list_query_content').val() || "";
        info = data;
        // table.reload("borrow_list_table_content", {
        //     url: baseurl + 'archivesmodule/arcTbBorrowRun/selectPageList?map[startTime]=' + data.startTime + '&map[endTime]=' +
        //         data.endTime + '&map[state]=' + data.state + '&map[fkTypeId]=' + data.fkTypeId + '&map[parameter-like]=' + data.parameter
        // });
        var pattern = /[`^&% { } | ?]/im;
        if(!data.parameter ||  data.parameter && !pattern.test( data.parameter)) { 
            var url= 'archivesmodule/arcTbBorrowRun/selectPageList?map[startTime]=' + data.startTime + '&map[endTime]=' +
            data.endTime + '&map[state]=' + data.state + '&map[fkTypeId]=' + data.fkTypeId + '&map[parameter-like]=' + data.parameter;
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
    });
}

function getIds() {
    var checkStatus = layui.table.checkStatus('borrow_list_table_content'),
        data = checkStatus.data,
        arr = [];
    for(var i in data){
        arr.push(data[i].id);
    }
    // console.log(typeof checkStatus.data);
    return arr.join();
}

// 批量借出
function borrowManageBatchLend(){
    $('#bulk_lending').on('click', function () {
        var ids = getIds();
        if(ids !== ''){
            window.parent.layer.confirm('确认借出？', {
                btnAlign: 'c',
                anim: 5,
                title: '提示',
                shade: [0.01, '#fff']
            }, function (index, layero) {
                app.post('archivesmodule/arcTbBorrowRun/bulkLending', {ids: ids}, function (res) {
                    if(res.state){
                        layui.table.reload('borrow_list_table_content', {
                            url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPageList'
                            , where: info //设定异步数据接口的额外参数
                            //,height: 300
                        });
                        parent.layer.close(index);
                    }
                    parent.layer.msg(res.msg);
                })
            }, function (index) {
                parent.layer.close(index);
            });
        }else {
            layui.layer.msg('请选择数据！！！');
        }
    });
}

// 批量归还
function borrowManageBulkReturn(){
    $('#bulk_return').on('click', function () {
        var ids = getIds();
        if(ids !== ''){
            window.parent.layer.confirm('确认归还？', {
                btnAlign: 'c',
                anim: 5,
                title: '提示',
                shade: [0.01, '#fff']
            }, function (index, layero) {
                app.post('archivesmodule/arcTbBorrowRun/batchReturn', {ids: ids}, function (res) {
                    if(res.state){
                        layui.table.reload('borrow_list_table_content', {
                            url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPageList'
                            , where: info //设定异步数据接口的额外参数
                            //,height: 300
                        });
                        parent.layer.close(index);
                    }
                    parent.layer.msg(res.msg);
                })
            }, function (index) {
                parent.layer.close(index);
            });
        }else {
            layui.layer.msg('请选择数据！！！');
        }
    });
}

// 移至历史
function runMoveHistory() {
    $('#history').on('click', function () {
        var ids = getIds();
        if(ids !== ''){
            window.parent.layer.confirm('确认移至历史？', {
                btnAlign: 'c',
                anim: 5,
                title: '提示',
                shade: [0.01, '#fff']
            }, function (index, layero) {
                app.post('archivesmodule/arcTbBorrowRun/runMoveHistory', {ids: ids}, function (res) {
                    if(res.state){
                        layui.table.reload('borrow_list_table_content', {
                            url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPageList'
                            , where: info //设定异步数据接口的额外参数
                            //,height: 300
                        });
                        parent.layer.close(index);
                    }
                    parent.layer.msg(res.msg);
                })
            }, function (index) {
                parent.layer.close(index);
            });
        }else {
            layui.layer.msg('请选择数据！！！');
        }
    })
}

$(function (mytable) {
        layui.use(["table", "layer", "form", "laydate"], function () {
            var table = layui.table;
            var form = layui.form;
            var layer=layui.layer;
            getSelectData();
            getMenuBar();//自定义面包屑，引用public-menu.js
            mybtn.date('#date_picker1');
            //导出
            form.on('select(output)', function (data) {
                if(data.value === "1"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbBorrowRun/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                                info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                                info.parameter + '&map[flag]=1'
                }else if(data.value === "0"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbBorrowRun/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                                info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                                info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
                }
            });

            // form.render();
            mytableinit(mytable,"archivesmodule/arcTbBorrowRun/selectPageList");
            initTree('select');
            pageManageQuery(table);
            borrowManageBulkReturn();
            borrowManageBatchLend();
            runMoveHistory();
            // allExport();
            // pageExport();
            onFocus();
        });
    }(mytable));

// 表单初始
function mytableinit(mytable,url) {
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "borrow_list_table_content",
        pageCode: "borrow-run",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url,
        callback: function(){
            preview();
        }
    })
    // mytable.init({
    //     id: "borrow_list_table_content",
    //     url: "archivesmodule/arcTbBorrowRun/selectPageList",
    //     pageCode: "borrow-run",
    //     callback: function(){
    //         preview();
    //     }
    // })
    .then(function (table) {
        console.log(table);
        // 编辑
        table.on("tool(borrow-list-table-content-tool)", function (obj) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === "details") {
                baseData = data;
                baseData.url = 'archivesmodule/arcTbBorrowRun/selectDetail';
                $('#details').trigger('click');
            } else if (layEvent === "return") {
                window.parent.layer.confirm('确认归还？', {
                    btnAlign: 'c',
                    anim: 5,
                    title: '提示',
                    shade: [0.01, '#fff']
                }, function (index, layero) {
                    app.post('archivesmodule/arcTbBorrowRun/batchReturn', {ids: data.id}, function (res) {
                        if(res.state){
                            layui.table.reload('borrow_list_table_content', {
                                url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPageList'
                                , where: info //设定异步数据接口的额外参数
                                //,height: 300
                            });
                            parent.layer.close(index);
                        }
                        parent.layer.msg(res.msg);
                    })
                }, function (index) {
                    parent.layer.close(index);
                });
            } else if (layEvent === "lend") {
                window.parent.layer.confirm('确认借出？', {
                    btnAlign: 'c',
                    anim: 5,
                    title: '提示',
                    shade: [0.01, '#fff']
                }, function (index, layero) {
                    app.post('archivesmodule/arcTbBorrowRun/bulkLending', {ids: data.id}, function (res) {
                        if(res.state){
                            layui.table.reload('borrow_list_table_content', {
                                url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPageList'
                                , where: info //设定异步数据接口的额外参数
                                //,height: 300
                            });
                            parent.layer.close(index);
                        }
                        parent.layer.msg(res.msg);
                    })
                }, function (index) {
                    parent.layer.close(index);
                });
            } else if (layEvent === "recharge") {
                console.log(data);
                if(data.state=='已借出' ||data.state=='超时' ){
                    window.parent.layer.confirm('确认催还？', {
                        btnAlign: 'c',
                        anim: 5,
                        title: '提示',
                        shade: [0.01, '#fff']
                    }, function (index, layero) {
                        app.get('archivesmodule/arcTbBorrowRun/reminder', {id: data.id}, function (res) {
                            if(res.state){
                                layui.table.reload('borrow_list_table_content', {
                                    url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPageList'
                                    , where: info //设定异步数据接口的额外参数
                                    //,height: 300
                                });
                                parent.layer.close(index);
                            }
                            parent.layer.msg(res.msg);
                        })
                    }, function (index) {
                        parent.layer.close(index);
                    });
                }else{
                    layer.msg('只能催还已借出和超时档案!!');
                }

            } else if (layEvent === "cancel") {
                window.parent.layer.confirm('确认取消借阅？', {
                    btnAlign: 'c',
                    anim: 5,
                    title: '提示',
                    shade: [0.01, '#fff']
                }, function (index, layero) {
                    app.post('archivesmodule/arcTbBorrowRun/cancel', {ids: data.id}, function (res) {
                        if(res.state){
                            layui.table.reload('borrow_list_table_content', {
                                url: window.baseurl + 'archivesmodule/arcTbBorrowRun/selectPageList'
                                , where: info //设定异步数据接口的额外参数
                                //,height: 300
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
    });
}
// 初始化时间控件
// function getDate() {
//     var laydateStartTime = layui.laydate;
//     laydateStartTime.render({
//         elem: "#borrow_list_start_time", //指定元素,
//         type: "date",
//         min: '1971-1-1',
//         max: '2199-1-1',
//         showBottom: true,
//         theme: "blue",
//         trigger: "click"
//     });
// }

function preview() {
    $('.preview-file').on('click', function () {
        var id = this.dataset.flag,
            typeId = this.dataset.type;
        baseData.id = id;
        baseData.typeId = typeId;
        parent.layui.layer.open({
            type: 2,
            content: 'html/archive/archive-manage/preview-archive.html',
            area: ['100%', '100%'],
            // btn: ['关闭'],
            // maxmin: true
        });
    })
}

function onFocus() {
    $('#borrow_list_query_content').focus(function () {
        readRFID();
    })
}

//rfid
function  RFID(data) {
    $('#borrow_list_query_content').val(data);
}