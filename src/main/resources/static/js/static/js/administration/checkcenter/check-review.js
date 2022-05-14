var baseData = {},baseDatas=[];
var info = {
    startTime: '',
    endTime: '',
    state: '',
    fkTypeId: '',
    parameter: ''
};
$(function (mytable) {
    layui.use(['table', 'layer', 'form'], function () {
        var table = layui.table,
            form = layui.form;
        getMenuBar();
        mybtn.date("#date_picker1","#date_picker2");         //日期范围
        initTree('select');          //档案类别下拉框
        form.on('submit(search)', function (data) {
            var value = data.field;
            info = value;
            // table.reload('table_content', {
            //     url: baseurl + 'activity/borrow/selectByUserIdPage?map[startTime]=' + value.startTime +
            //     '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter
            // })
            var pattern = /[`^&% { } | ?]/im;
            if(!value.parameter ||  value.parameter && !pattern.test( value.parameter)) { 
                var url= 'activity/borrow/selectByUserIdPage?map[startTime]=' + value.startTime +
                '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter;
                mytableinit(mytable,url);
            }else {
               layer.msg('查询条件不能包含特殊字符');
              }
        });
        //导出
        form.on('select(output)', function (data) {
            if(data.value === "1"){
                window.location.href = window.baseurl + 'activity/borrow/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                    info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                    info.parameter + '&map[flag]=1'
            }else if(data.value === "0"){
                window.location.href = window.baseurl + 'activity/borrow/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                    info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                    info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
            }
        });

         // 初始化表格
        mytableinit(mytable,'activity/borrow/selectByUserIdPage');
        batchPass();
        batchReject();
        preview();
        onFocus();
    });
}(mytable));
function getCheckedData() {
    var checkStatus = layui.table.checkStatus('table_content');
    return checkStatus.data;
}

// 表格初始化、查询
var mytableinit=function(mytable,url) {
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "table_content",
        pageCode: "borrow-run",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url ,
        callback: function(){
            preview(".preview-file");
        }
    })
    // mytable.init({
    //     id: 'table_content',
    //     url: 'activity/borrow/selectByUserIdPage?map[parameter-like]=',
    //     pageCode: 'borrow-run',
    //     data: '',
    //     callback: function(){
    //         preview(".preview-file");
    //     }
    // })
    .then(function (table) {
        form.render('checkbox');
        table.on('tool(table-review)', function (obj) {
            var data = obj.data,
                selectId = data.id; //被选中行的id
            var btn = $('.modaljump');
            switch (obj.event) {
                case 'details':
                    // baseDatas = getCheckedData();
                    // baseDatas.url = 'activity/borrow/selectBorrowDetailsById';
                    baseData = data;
                    baseData.url = 'activity/borrow/selectBorrowDetailsById';
                    btn.attr('href', 'html/administration/form/layer-borrowReview-details.html');
                    btn.attr('action','activity/borrow/borrowAuditBatchAgree');
                    baseData.action = 'activity/borrow/borrowAuditBatchAgree';
                    btn.attr('data-cancel-url', 'activity/borrow/borrowAuditBatchRefuse');
                    baseData.cancelUrl = 'activity/borrow/borrowAuditBatchRefuse';
                    btn.attr('data-btn', '同意,驳回');
                    btn.attr('width', '800px');
                    btn.attr('height', '600px');
                    btn.trigger('click');
                    break;
                case 'review':
                    baseDatas = [data];
                    baseData.action = 'activity/borrow/borrowAuditBatchAgree';
                    btn.attr('href', 'html/administration/form/layer-review.html');
                    btn.attr('data-btn', '同意');
                    btn.attr('width', '450px');
                    btn.attr('height', '350px');
                    btn.attr('action','activity/borrow/borrowAuditBatchAgree');
                    btn.trigger('click');
                    break;
                case 'reject':
                    baseDatas = [data];
                    baseData.action = 'activity/borrow/borrowAuditBatchRefuse';
                    btn.attr('href', 'html/administration/form/layer-review.html');
                    btn.attr('data-btn','驳回');
                    btn.attr('width', '450px');
                    btn.attr('height', '350px');
                    btn.attr('action','activity/borrow/borrowAuditBatchRefuse');
                    btn.trigger('click');
                    break;
                default:
                    break
            }
        })
    });
}
// 批量通过
function batchPass() {
    $('#batchPass').on('click', function () {
        var btn = $('.modaljump');
        baseDatas = getCheckedData();
        if(baseDatas.length > 0){
            baseData.action = 'activity/borrow/borrowAuditBatchAgree';
            btn.attr('href', 'html/administration/form/layer-review.html');
            btn.attr('data-btn', '同意');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action','activity/borrow/borrowAuditBatchAgree');
            btn.trigger('click');
        }else {
            layui.layer.msg('请选择数据！！！');
        }

    })
}
// 批量驳回
function batchReject() {
    $('#batchRejection').on('click', function () {
        var btn = $('.modaljump');
        baseDatas = getCheckedData();
        if(baseDatas.length > 0){
            baseData.action = 'activity/borrow/borrowAuditBatchRefuse';
            btn.attr('href', 'html/administration/form/layer-review.html');
            btn.attr('data-btn','驳回');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action','activity/borrow/borrowAuditBatchRefuse');
            btn.trigger('click');
        }else {
            layui.layer.msg('请选择数据！！！');
        }
    })
}
function firstRefresh(){
    layui.table.reload('table_content', {page:{curr: 1}});
}
function testRefresh(){
    layui.table.reload('table_content', {});
}

function onFocus() {
    $('input[name="parameter"]').focus(function () {
        readRFID();
    })
}

//rfid
function  RFID(data) {
    $('input[name="parameter"]').val(data);
}