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
        var pattern = /[`^&% { } | ?]/im;
        if(!value.parameter ||  value.parameter && !pattern.test( value.parameter)) { 
            var url= 'activity/transfer/selectByUserIdPage?map[startTime]=' + value.startTime +
            '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter;
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }

        // table.reload('table_content', {
        //     url: baseurl + 'activity/transfer/selectByUserIdPage?map[startTime]=' + value.startTime +
        //         '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter
        // })
    });
    form.on('select(output)', function (data) {
        if(data.value === "1"){
            //导出所有
            window.location.href = window.baseurl + 'activity/transfer/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                info.parameter + '&map[flag]=1'
        }else if(data.value === "0"){
            //导出当前
            window.location.href = window.baseurl + 'activity/transfer/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
                info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
        }
    });

    mytableinit(mytable,'activity/transfer/selectByUserIdPage');
    batchPass();
    batchReject();
    onFocus();
});
// 初始化table
function mytableinit(mytable,url){
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "table_content",
        pageCode: "transfer-manage",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url,
        callback: function(){
            preview(".preview-file");
        }
    })
    // mytable.init({
    //     id: 'table_content',
    //     url: 'activity/transfer/selectByUserIdPage?map[parameter-like]=',
    //     pageCode: 'transfer-manage',
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
            console.log(obj.event);
            var btn = $('.modaljump');

            switch (obj.event) {
                case 'details':
                    // baseDatas = getCheckedData();
                    // baseDatas.url = 'activity/transfer/selecttransferDetailsById';
                    baseData = data;
                    baseData.url = 'activity/transfer/selectTransferDetailsById';
                    btn.attr('href', 'html/administration/form/layer-transferReview-details.html');
                    baseData.action = 'activity/transfer/transferAuditBatchAgree';
                    btn.attr('action','activity/transfer/transferAuditBatchAgree');
                    baseData.cancelUrl = 'activity/transfer/transferAuditBatchRefuse';
                    btn.attr('data-cancel-url', 'activity/transfer/transferAuditBatchRefuse');
                    btn.attr('data-btn', '同意,驳回');
                    btn.attr('width', '800px');
                    btn.attr('height', '600px');
                    btn.trigger('click');
                    break;
                case 'review':
                    baseDatas = [data];
                    baseData.action = 'activity/transfer/transferAuditBatchAgree';
                    btn.attr('href', 'html/administration/form/layer-review.html');
                    btn.attr('data-btn', '同意');
                    btn.attr('width', '450px');
                    btn.attr('height', '350px');
                    btn.attr('action','activity/transfer/transferAuditBatchAgree');
                    btn.trigger('click');
                    break;
                case 'reject':
                    baseDatas = [data];
                    baseData.action = 'activity/transfer/transferAuditBatchRefuse';
                    btn.attr('href', 'html/administration/form/layer-review.html');
                    btn.attr('data-btn','驳回');
                    btn.attr('width', '450px');
                    btn.attr('height', '350px');
                    btn.attr('action','activity/transfer/transferAuditBatchRefuse');
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
            baseData.action = 'activity/transfer/transferAuditBatchAgree';
            btn.attr('href', 'html/administration/form/layer-review.html');
            btn.attr('data-btn', '同意');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action','activity/transfer/transferAuditBatchAgree');
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
            baseData.action = 'activity/transfer/transferAuditBatchRefuse';
            btn.attr('href', 'html/administration/form/layer-review.html');
            btn.attr('data-btn','驳回');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action','activity/transfer/transferAuditBatchRefuse');
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