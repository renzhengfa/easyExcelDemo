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
window.start_time = getNowFormatDate(); //应还时间
var myDate = new Date();

function createDownLoad(url) {
	// 防止反复添加
	/*
	if (document.getElementById('videoDownLoad')) {
		document.body.removeChild(document.getElementById('videoDownLoad'));
	}*/
	var a = document.createElement('a');
	var href = url
	a.setAttribute('href', href);
	a.setAttribute("download", '视频插件')
	a.setAttribute('id', 'videoDownLoad');
	
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(document.getElementById('videoDownLoad'));
}



// 查询
function pageManageQuery(table) {
    $('#borrow_list_query').on('click', function () {
        var data = {};
        data.createTime = $('#date_picker1').val() || "";
        data.state = $('#borrow_list_state').next().find('.layui-anim').find('.layui-this').attr('lay-value') || "";
        data.fkTypeId = $('#department_id').val() || "";
        data.parameter = $('#borrow_list_query_content').val() || "";
        info = data;
        // table.reload("list_table_content", {
        //     url: baseurl + 'archivesmodule/arcTbRegressRun/selectPage?map[startTime]=' + data.createTime +'&map[endTime]='+ data.createTime +
        //         '&map[state]=' + data.state + '&map[fkTypeId]=' + data.fkTypeId + '&map[parameter-like]=' + data.parameter
        // });
        var pattern = /[`^&% { } | ?]/im;
        if(!data.parameter ||  data.parameter && !pattern.test( data.parameter)) { 
            var url= 'archivesmodule/arcTbRegressRun/selectPage?map[startTime]=' + data.createTime +'&map[endTime]='+ data.createTime +
            '&map[state]=' + data.state + '&map[fkTypeId]=' + data.fkTypeId + '&map[parameter-like]=' + data.parameter;
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
    });
}

function getIds() {
    var checkStatus = layui.table.checkStatus('list_table_content'),
        data = checkStatus.data,
        arr = [];
    for(var i in data){
        arr.push(data[i].id);
    }
    // console.log(typeof checkStatus.data);
    return arr.join();
}

// 移至历史
function runMoveHistory() {
    $('#history').on('click', function () {
        var ids = getIds();
        if(ids !== ''){
            window.parent.layer.confirm('确认移至历史吗？', {
                btnAlign: 'c',
                anim: 5,
                title: '提示',
                shade: [0.01, '#fff']
            }, function (index, layero) {
                app.post('archivesmodule/arcTbRegressRun/runMoveHistory', {ids: ids}, function (res) {
                    if(res.state){
                        layui.table.reload('list_table_content', {
                            url: window.baseurl + 'archivesmodule/arcTbRegressRun/selectPage'
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
            var layer=layui.layer;
            getMenuBar();//自定义面包屑，引用public-menu.js
            mybtn.date("#date_picker1");
              //导出
              form.on('select(output)', function (data) {
                if(data.value === "1"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbRegressRun/export?map[createTime]=' + info.createTime +
            '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
            info.parameter + '&map[flag]=1';
                }else if(data.value === "0"){

                    window.location.href = window.baseurl + 'archivesmodule/arcTbRegressRun/export?map[startTime]=' + info.createTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                                info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
								
                }
				console.log('这里的数据',info,curr,pagesize)
				
            });
            mytableinit(mytable, "archivesmodule/arcTbRegressRun/selectPage");
            initTree('select');
            pageManageQuery(table);
            runMoveHistory();
            // allExport();
            // pageExport();
            onFocus();
        });
}(mytable));
// 初始化表格
function mytableinit(mytable,url){
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "list_table_content",
        pageCode: "archive-manage",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url,
        callback: function(){
            preview();
        }
    })
    // var demoTable_height=$(".demoTable").outerHeight(true)+100;
    // mytable.init({
    //     id: "list_table_content",
    //     url: "archivesmodule/arcTbRegressRun/selectPage",
    //     pageCode: "archive-manage",
    //     // limit:"20",height:"full-"+demoTable_height+"",
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
                baseData.fileName = '归档审核文件';
                baseData.url = 'archivesmodule/arcTbRegressRun/selectDetail';
                $('#details').trigger('click');
            }else if(layEvent === 'history'){
                window.parent.layer.confirm('确认移至历史吗？', {
                    btnAlign: 'c',
                    anim: 5,
                    title: '提示',
                    shade: [0.01, '#fff']
                }, function (index, layero) {
                    app.post('archivesmodule/arcTbRegressRun/runMoveHistory', {ids: data.id}, function (res) {
                        if(res.state){
                            layui.table.reload('list_table_content', {
                                url: window.baseurl + 'archivesmodule/arcTbRegressRun/selectPage'
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
// 获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var mydate = date.getDate();
    if (date.getDate() < 10) {
        mydate = "0" + date.getDate(); //补齐
    }
    var d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + mydate;
    return d;
}

// 初始化时间控件
function getDate() {
    var laydateStartTime = layui.laydate;
    laydateStartTime.render({
        elem: "#borrow_list_start_time", //指定元素,
        type: "date",
        min: '1971-1-1',
        max: '2199-1-1',
        showBottom: true,
        theme: "blue",
        trigger: "click", //采用click弹出
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
            area: ['100%', '100%'],
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

