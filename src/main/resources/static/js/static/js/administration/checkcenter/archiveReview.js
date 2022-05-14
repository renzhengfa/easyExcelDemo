var baseData = {},baseDatas=[];
var config = {
    tableUrl: 'activity/regress/selectByUserIdPage',
    detailUrl: 'activity/regress/selectRegressDetailsById',
    reviewHref: 'html/administration/form/layer-review.html',
    reviewDetailHref: 'html/administration/form/layer-archiveReview-details.html',
    agreeUrl: 'activity/regress/regressAuditBatchAgree',
    refuseUrl: 'activity/regress/regressAuditBatchRefuse',
    pageCode: 'archive-manage',
    export: 'activity/regress/export'

};
var info = {
    startTime: '',
    endTime: '',
    fkTypeId: '',
    parameter: ''
};
$(function (mytable) {
    layui.use(["table", "layer", "form"],function () {
        var table = layui.table;
        var form = layui.form;
        getMenuBar();
        //导出
        form.on('select(output)', function (data) {
            if(data.value === "1"){
                window.location.href = window.baseurl + config.export + '?map[startTime]=' + info.startTime + '&map[endTime]=' +
                    info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                    info.parameter + '&map[flag]=1'
            }else if(data.value === "0"){
                window.location.href = window.baseurl + config.export + '?map[startTime]=' + info.startTime + '&map[endTime]=' +
                    info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
                    info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
            }
        });
        mybtn.date("#date_picker1","#date_picker2");         //日期范围
        initTree('select');          //档案类别下拉框
        mytableinit(mytable,'activity/regress/selectByUserIdPage');   //初始化表格
        batchPass();
        batchReject();
        onFocus();
    });
  
    $('#query-record').on('click', function () {
        var start_time = $('#date_picker1').val();
        var end_time = $('#date_picker2').val();
        if (start_time != "") {
            start_time = start_time + " 00:00:00";
        }
        if (end_time != "") {
            end_time = end_time + " 23:59:59";
        }
        var data = {
            startTime: start_time,
            endTime: end_time,
            fkTypeId: $("#department_id").val(),
            parameter: $("#parameter").val()
        };
        info = data;
        var pattern = /[`^&% { } | ?]/im;
        if(!data.parameter ||  data.parameter && !pattern.test( data.parameter)) { 
            var url= 'activity/regress/selectByUserIdPage?map[startTime]=' + data.startTime + '&map[endTime]=' +
            data.endTime + '&map[fkTypeId]=' + data.fkTypeId + '&map[parameter-like]=' + data.parameter;
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
        // mytableinit(data);
    }) 
}(mytable));
/*表格初始化和查询-liuyuru*/
function mytableinit(mytable,url) {
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "table_content",
        pageCode: "archive-manage",
        limit: 20,
        height:"full-"+demoTable_height+"",
        url: url ,
        callback: function () {
            preview(".preview-file");
        }
    })
    // mytable.init({
    //     id: 'table_content', url: 'activity/regress/selectByUserIdPage', pageCode: 'archive-manage',data:datajson
    //     ,callback: function () {
    //         preview(".preview-file");
    //     }
    // })
    .then(function (table) {
        layui.form.render('checkbox');
        table.on('tool(table-review)', function (obj) {
            var data = obj.data,
                selectId = data.id; //被选中行的id
            var btn = $('.modaljump');

            switch (obj.event) {
                case 'details':
                    baseData = data;
                    baseData.url = config.detailUrl; // 弹出层查询详情接口
                    btn.attr('href', config.reviewDetailHref);
                    btn.attr('action',config.agreeUrl);
                    baseData.action = config.agreeUrl;
                    btn.attr('data-cancel-url', config.refuseUrl);
                    baseData.cancelUrl = config.refuseUrl;
                    btn.attr('data-btn', '同意,驳回');
                    btn.attr('width', '800px');
                    btn.attr('height', '600px');
                    btn.trigger('click');
                    break;
                case 'review':
                    baseDatas = [data];
                    baseData.action = config.agreeUrl;
                    btn.attr('href', config.reviewHref);
                    btn.attr('data-btn', '同意');
                    btn.attr('width', '450px');
                    btn.attr('height', '350px');
                    btn.attr('action',config.agreeUrl);
                    btn.trigger('click');
                    break;
                case 'reject':
                    baseDatas = [data];
                    baseData.action = config.refuseUrl;
                    btn.attr('href', config.reviewHref);
                    btn.attr('data-btn','驳回');
                    btn.attr('width', '450px');
                    btn.attr('height', '350px');
                    btn.attr('action',config.refuseUrl);
                    btn.trigger('click');
                    break;
                default:
                    break
            }
        })
    });
}
//批量通过
function batchPass() {
    $('#batchPass').on('click', function () {
        var btn = $('.modaljump');
        baseDatas = getCheckedData();
        if(baseDatas.length > 0){
            baseData.action = config.agreeUrl;
            btn.attr('href', config.reviewHref);
            btn.attr('data-btn', '同意');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action',config.agreeUrl);
            btn.trigger('click');
        }else {
            layui.layer.msg('请选择数据！！');
        }
    })
}
// 批量驳回
function batchReject() {
    $('#batchRejection').on('click', function () {
        var btn = $('.modaljump');
        baseDatas = getCheckedData();
        if(baseDatas.length > 0){
            baseData.action = config.refuseUrl;
            btn.attr('href', config.reviewHref);
            btn.attr('data-btn','驳回');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action', config.refuseUrl);
            btn.trigger('click');
        }else {
            layui.layer.msg('请选择数据！！！');
        }

    })
}
function getCheckedData() {
    var checkStatus = layui.table.checkStatus('table_content');
    return checkStatus.data;
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
// var ArchiveReview = new Review();

// ArchiveReview.checkReview(config);
