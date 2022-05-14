/**
 * @author chentong
 * @description 借阅中心-借阅历史记录
 */

var baseData = {};
var info = {
    startTime: '',
    endTime: '',
    state: '',
    fkTypeId: '',
    parameter: ''
};
// 查询
function pageManageQuery(table) {
    $("#borrow_historical_btn_query").on("click", function () {
        var data = {};
        data.startTime = $('#date_picker1').val();
        data.endTime = '';
        data.fkTypeId = $('#department_id').val() || "";
        data.parameter = $('#historical_query_content').val() || "";
        data.state = $('#borrow_list_state').next().find('.layui-anim').find('.layui-this').attr('lay-value') || "";
        info = data;
        var pattern = /[`^&% { } | ?]/im;
        if(!data.parameter ||  data.parameter && !pattern.test( data.parameter)) { 
            var url=  "archivesmodule/arcTbDestroyHistory/selectPage?map[startTime]=" +  data.startTime + "&map[endTime]=" + data.endTime +
            "&map[state]=" + data.state + "&map[fkTypeId]=" + data.fkTypeId + "&map[parameter-like]=" + data.parameter;
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
           // table.reload("historical_records_content", {
        //     url:
        //         baseurl +
        //         "archivesmodule/arcTbDestroyHistory/selectPage?map[startTime]=" +  data.startTime + "&map[endTime]=" + data.endTime +
        //         "&map[state]=" + data.state + "&map[fkTypeId]=" + data.fkTypeId + "&map[parameter-like]=" + data.parameter
        // });
    });
}
$(function (mytable) {
        layui.use(["table", "layer", "form"], function () {
            var table = layui.table;
            var layer = layui.layer;
            var form = layui.form;
            mybtn.date("#date_picker1");
            getMenuBar();
            //导出
            form.on('select(output)', function (data) {
                if(data.value === "1"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbDestroyHistory/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                        info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                        info.parameter + '&map[flag]=1'
                }else if(data.value === "0"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbDestroyHistory/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                        info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                        info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
                }
            });
            mytableinit(mytable,'archivesmodule/arcTbDestroyHistory/selectPage');
            initTree('select');
            pageManageQuery(table);
            onFocus();
        });
    }(mytable));
/*表格初始化、查询-liuyuru*/
var mytableinit=function(data,url) {
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "historical_records_content",
        pageCode: "destroy-manage",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url ,
        callback: function(){
            preview();
        }
    })
    // mytable.init({
    //     id: 'historical_records_content', url: 'archivesmodule/arcTbDestroyHistory/selectPage', pageCode: 'destroy-manage', data:data,
    //     callback: function(){
    //         preview();
    //     }
    // }, 'history')
    .then(function (table) {
        // 编辑
        table.on("tool(historical-records-table-content-tool)",function (obj) {
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的DOM对象
                if (layEvent === "details") {
                    baseData = data;
                    baseData.fileName = '销毁审核附件';
                    baseData.url = 'archivesmodule/arcTbDestroyHistory/selectDetail';
                    $('#details').trigger('click');
                }
            }
        );
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
    $('#historical_query_content').focus(function () {
        readRFID();
    })
}

//rfid
function  RFID(data) {
    $('#historical_query_content').val(data);
}
function testRefresh () {
    $(".layui-laypage-btn")[0].click();
}