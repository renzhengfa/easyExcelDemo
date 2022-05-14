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
        //         "archivesmodule/arcTbTransferHistory/selectPage?map[startTime]=" + data.startTime + "&map[endTime]=" +  data.endTime +
        //         "&map[state]=" +  data.state+ "&map[fkTypeId]=" + data.fkTypeId + "&map[parameter-like]=" + data.parameter
        // });
        var pattern = /[`^&% { } | ?]/im;
        if(!data.parameter ||  data.parameter && !pattern.test( data.parameter)) { 
            var url=  "archivesmodule/arcTbTransferHistory/selectPage?map[startTime]=" + data.startTime + "&map[endTime]=" +  data.endTime +
            "&map[state]=" +  data.state+ "&map[fkTypeId]=" + data.fkTypeId + "&map[parameter-like]=" + data.parameter
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
    });
}

$(function (mytable) {
        layui.use(["table", "layer", "form", "laydate"], function () {
            var table = layui.table;
            var layer=layui.layer;
            var form = layui.form;
            getMenuBar();//自定义面包屑，引用public-menu.js
            // 时间控件初始
            mybtn.date('#date_picker1','#date_picker2');
            //导出
            form.on('select(output)', function (data) {
                // var exportCurrentPage=$(".layui-laypage-em").next().html();
                // var exportPageSize=$(".layui-laypage-limits").find("option:selected").val();
                if(data.value === "1"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbTransferHistory/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                                info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                                info.parameter + '&map[flag]=1';
                }else if(data.value === "0"){
                    window.location.href = window.baseurl + 'archivesmodule/arcTbTransferHistory/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                                info.endTime + '&map[state]=' + info.state + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                                info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
                }
            });
            mytableinit(mytable,"archivesmodule/arcTbTransferHistory/selectPage");
            initTree('select');
            pageManageQuery(table);
            onFocus();
        });
    }(mytable));
// 初始化表格、查询--tangli
function mytableinit(mytable,url){
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "historical_records_content",
        pageCode: "transfer-manage",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url,
        callback: function(){
            preview();
        }
    })
//     mytable.init({
//         id: "historical_records_content",
//         url: "archivesmodule/arcTbTransferHistory/selectPage",
//         pageCode: "transfer-manage",
//         data: {},
//         callback: function(){
//             preview();
//         }
//     }, 'history')
    .then(function (table) {
        // 编辑
        table.on("tool(borrow-historical-records-table-content-tool)",function (obj) {
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的DOM对象
                if (layEvent === "details") {
                    baseData = data;
                    baseData.url = 'archivesmodule/arcTbTransferHistory/selectDetail';
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