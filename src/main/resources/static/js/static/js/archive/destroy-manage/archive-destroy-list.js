/**
 * @author chentong
 * @description 借阅中心-借阅列表
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
function initTree(value) {
    var treeNodes = [];
    app.get("archivesmodule/arcTbArcType/selectAll", '', function (msg) {
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
                    treeNodes[numkey]['name'] = data[key].typeName;
                    treeNodes[numkey]['pId'] = data[key].fkParentId;
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
        var pattern = /[`^&% { } | ?]/im;
        if(!data.parameter ||  data.parameter && !pattern.test( data.parameter)) { 
            var url= 'archivesmodule/arcTbDestroyRun/selectPage?map[startTime]=' + data.startTime + '&map[endTime]=' +
            data.endTime + '&map[state]=' + data.state + '&map[fkTypeId]=' + data.fkTypeId + '&map[parameter-like]=' + data.parameter;
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
        // table.reload("list_table_content", {
        //     url: baseurl + 
        //     'archivesmodule/arcTbDestroyRun/selectPage?map[startTime]=' + data.startTime + '&map[endTime]=' +
        //         data.endTime + '&map[state]=' + data.state + '&map[fkTypeId]=' + data.fkTypeId + '&map[parameter-like]=' + data.parameter
        // });
    });
}
function getIds() {
    var checkStatus = layui.table.checkStatus('list_table_content'),
        data = checkStatus.data,
        arr = [];
    for(var i in data){
        arr.push(data[i].id);
    }
    return arr.join();
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
                app.post('archivesmodule/arcTbDestroyRun/runMoveHistory', {ids: ids}, function (res) {
                    if(res.state){
                        layui.table.reload('list_table_content', {
                            url: window.baseurl + 'archivesmodule/arcTbDestroyRun/selectPage'
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
            layui.layer.msg('请选择数据！！！');
        }
    })
}
$(function (mytable) {
        layui.use(["table", "layer", "form", "laydate"], function () {
            var table = layui.table;
            var form = layui.form;
            var laydate = layui.laydate;
            getMenuBar();//自定义面包屑，引用public-menu.js
            //日期范围
            var start = laydate.render({
                elem: '#date_picker1',
                theme: 'blue'
            });
            //导出
            form.on('select(output)', function (data) {
                if(data.value === "1"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbDestroyRun/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                        info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                        info.parameter + '&map[flag]=1'
                }else if(data.value === "0"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbDestroyRun/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                        info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                        info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
                }
            });
            // var datatest = {
            //     'map[startTime]': '',
            //     'map[endTime]': '',
            //     'map[state]': '',
            //     'map[fkTypeId]': '',
            //     'map[parameter-like]': '',
            //     'currentPage': 1,
            //     'pageSize': 20,
            // };
            // 初始化表格
            mytableinit(mytable,'archivesmodule/arcTbDestroyRun/selectPage');
            initTree('select');
            pageManageQuery(table);
            runMoveHistory();
            onFocus();
        });
}(mytable));
/*表格初始化、查询-liuyuru*/
var mytableinit=function(mytable,url) {
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "list_table_content",
        pageCode: "destroy-manage",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url ,
        callback: function(){ 
            preview();
        }
    })
    // mytable.init({
    //     id: 'list_table_content', 
    //     url: 'archivesmodule/arcTbDestroyRun/selectPage', pageCode: 'destroy-manage', data:data,
    //     callback: function(){ 
    //         preview();
    //     }
    // }, 'list')
    .then(function (table) {
        // 编辑
        table.on("tool(list-table-content-tool)", function (obj) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的DOM对象
            if (layEvent === "details") {
                baseData = data;
                baseData.url = 'archivesmodule/arcTbDestroyRun/selectDetail';
                baseData.fileName = '销毁审核文件';
                $('#details').trigger('click');
            }else if(layEvent === 'history'){
                window.parent.layer.confirm('确认移至历史？', {
                    btnAlign: 'c',
                    anim: 5,
                    title: '提示',
                    shade: [0.01, '#fff']
                }, function (index, layero) {
                    app.post('archivesmodule/arcTbDestroyRun/runMoveHistory', {ids: data.id}, function (res) {
                        if(res.state){
                            layui.table.reload('list_table_content', {
                                url: window.baseurl + 'archivesmodule/arcTbDestroyRun/selectPage'
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
function preview() {
    $('.preview-file').on('click', function () {
        var id = this.dataset.flag,
            typeId = this.dataset.type;
        baseData.id = id;
        baseData.typeId = typeId;
        parent.layui.layer.open({
            type: 2,
            content: 'html/archive/archive-manage/preview-archive.html',
            area: ['100%', '100%']
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