var baseData = {},baseDatas=[];
var info = {
    startTime: '',
    endTime: '',
    state: '',
    fkTypeId: '',
    parameter: ''
};
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
        //     url: baseurl + 'activity/destroy/selectByUserIdPage?map[startTime]=' + value.startTime +
        //         '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter
        // })

        var pattern = /[`^&% { } | ?]/im;
        if(!value.parameter ||  value.parameter && !pattern.test( value.parameter)) { 
            var url= 'activity/destroy/selectByUserIdPage?map[startTime]=' + value.startTime +
            '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
    });
    form.on('select(output)', function (data) {
        if(data.value === "1"){
            //导出所有
            window.location.href = window.baseurl + 'activity/destroy/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                info.parameter + '&map[flag]=1'
        }else if(data.value === "0"){
            //导出当前
            window.location.href = window.baseurl + 'activity/destroy/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
        }
    });
    mytableinit(mytable,'activity/destroy/selectByUserIdPage');
    batchPass();
    batchReject();
    onFocus();
});
function mytableinit(mytable,url){
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "table_content",
        pageCode: "destroy-manage",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url ,
        callback: function(){
            preview(".preview-file");
        }
    })
    // mytable.init({
    //     id: 'table_content',
    //     url: 'activity/destroy/selectByUserIdPage?map[parameter-like]=',
    //     pageCode: 'destroy-manage',
    //     data: '',
    //     callback: function(){
    //         preview(".preview-file");
    //     }
    // })
    .then(function (table) {
        // $('.layui-table-body').removeAttr('style');
        // form.render('checkbox');
        table.on('tool(table-review)', function (obj) {
            var data = obj.data,
                selectId = data.id; //被选中行的id
            var btn = $('.modaljump');

            switch (obj.event) {
                case 'details':
                    // baseDatas = getCheckedData();
                    // baseDatas.url = 'archivesmodule/arcTbDestroyRun/selecttransferDetailsById';
                    baseData = data;
                    baseData.url = 'activity/destroy/selectDestroyDetailsById'
                    // baseData.url = 'archivesmodule/arcTbDestroyRun/selecttransferDetailsById';
                    btn.attr('href', 'html/administration/form/layer-destroyReview-details.html');
                    baseData.action = 'activity/destroy/destroyAuditBatchAgree';
                    btn.attr('action','activity/destroy/destroyAuditBatchAgree');
                    baseData.cancelUrl = 'activity/destroy/destroyAuditBatchRefuse';
                    btn.attr('data-cancel-url', 'activity/destroy/destroyAuditBatchRefuse');
                    btn.attr('data-btn', '同意,驳回');
                    btn.attr('width', '800px');
                    btn.attr('height', '600px');
                    btn.trigger('click');
                    break;
                case 'review':
                    baseDatas = [data];
                    baseData.action = 'activity/destroy/destroyAuditBatchAgree';
                    btn.attr('href', 'html/administration/form/layer-review.html');
                    btn.attr('data-btn', '同意');
                    btn.attr('width', '450px');
                    btn.attr('height', '350px');
                    btn.attr('action','activity/destroy/destroyAuditBatchAgree');
                    btn.trigger('click');
                    break;
                case 'reject':
                    baseDatas = [data];
                    baseData.action = 'activity/destroy/destroyAuditBatchRefuse';
                    btn.attr('href', 'html/administration/form/layer-review.html');
                    btn.attr('data-btn','驳回');
                    btn.attr('width', '450px');
                    btn.attr('height', '350px');
                    btn.attr('action','activity/destroy/destroyAuditBatchRefuse');
                    btn.trigger('click');
                    break;
                default:
                    break
            }
        })
    });
}
function getCheckedData() {
    var checkStatus = layui.table.checkStatus('table_content');
    return checkStatus.data;
}
// 批量通过
function batchPass() {
    $('#batchPass').on('click', function () {
        var btn = $('.modaljump');
        baseDatas = getCheckedData();
        if(baseDatas.length > 0){
            baseData.action = 'activity/destroy/destroyAuditBatchAgree';
            btn.attr('href', 'html/administration/form/layer-review.html');
            btn.attr('data-btn', '同意');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action','activity/destroy/destroyAuditBatchAgree');
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
            baseData.action = 'activity/destroy/destroyAuditBatchRefuse';
            btn.attr('href', 'html/administration/form/layer-review.html');
            btn.attr('data-btn','驳回');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action','activity/destroy/destroyAuditBatchRefuse');
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