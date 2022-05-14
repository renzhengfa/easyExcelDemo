/**
 * @author chentong
 * @description 借阅中心-借阅历史记录
 * update ----tangli
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
        data.endTime = $('#date_picker2').val();
        data.state = $('#borrow_list_state').next().find('.layui-anim').find('.layui-this').attr('lay-value') || "";
        data.fkTypeId = $('#department_id').val() || "";
        data.parameter = $('#historical_query_content').val() || "";
        info = data;
        // table.reload("historical_records_content", {
        //     url:
        //         baseurl +
        //         "archivesmodule/arcTbBorrowHistory/selectPageList?map[startTime]=" + data.startTime +"&map[endTime]=" +data.endTime +
        //         "&map[state]=" +data.state+"&map[fkTypeId]=" +data.fkTypeId +"&map[parameter-like]=" +data.parameter
        // });

        var pattern = /[`^&% { } | ?]/im;
        if(!data.parameter ||  data.parameter && !pattern.test( data.parameter)) { 
            var url = "archivesmodule/arcTbBorrowHistory/selectPageList?map[startTime]=" + data.startTime +"&map[endTime]=" +data.endTime +
            "&map[state]=" +data.state+"&map[fkTypeId]=" +data.fkTypeId +"&map[parameter-like]=" +data.parameter;
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
    });
}

$(function (mytable) {
        layui.use(["table", "layer", "form", "laydate"], function () {
            var table = layui.table;
            var form = layui.form;
            var layer=layui.layer;
            getMenuBar();//自定义面包屑，引用public-menu.js
            // form.render();
            //初始化时间控件
            mybtn.date('#date_picker1','#date_picker2');

             //导出
             form.on('select(output)', function (data) {
                if(data.value === "1"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbBorrowHistory/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                                info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                                info.parameter + '&map[flag]=1'
                }else if(data.value === "0"){
                       window.location.href = window.baseurl + 'archivesmodule/arcTbBorrowHistory/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
            info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
            info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
                }
            });

            // form.render();
            mytableinit(mytable,"archivesmodule/arcTbBorrowHistory/selectPageList");
            pageManageQuery(table);
            initTree('select');
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
        id: "historical_records_content",
        pageCode: "borrow-run",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url,
        callback: function(){
            preview();
        }
    })
    // mytable.init({
    //     id: "historical_records_content",
    //     url: "archivesmodule/arcTbBorrowHistory/selectPageList",
    //     pageCode: "borrow-run",
    //     data: {},
    //     callback: function(){
    //         preview();
    //     }
    // }, 'history')
    .then(function (table) {
        console.log(table);
        // 编辑
        table.on(
            "tool(borrow-historical-records-table-content-tool)",
            function (obj) {
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的DOM对象
                if (layEvent === "details") {
                    baseData = data;
                    baseData.url = 'archivesmodule/arcTbBorrowHistory/selectDetail';
                    $('#details').trigger('click');
                }
            }
        );
    });
}
// 初始化时间控件
// function getDate() {
//     var laydateStartTime = layui.laydate;
//     laydateStartTime.render({
//         elem: "#historical_start_time", //指定元素,
//         type: "date",
//         min: "1900-1-1",
//         max: "2099-12-31",
//         showBottom: true,
//         theme: "blue",
//         trigger: "click"
//     });
//     laydateStartTime.render({
//         elem: "#historical_stop_time", //指定元素,
//         type: "date",
//         min: "1900-1-1",
//         max: "2099-12-31",
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