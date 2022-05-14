var baseData = {},baseDatas=[];
var info = {
    startTime: '',
    endTime: '',
    state: '',
    fkTypeId: '',
    parameter: ''
};

layui.use(['table', 'layer', 'form', 'laydate'], function () {
    var table = layui.table,
        laydate = layui.laydate,
        formLayer = $('#change_interface_form'),
        form = layui.form;
    form.render();

    laydate.render({
        elem: '#date_picker1',
        eventElem: '#date_picker1-1',
        trigger: 'click',
        theme: 'blue'
    })
    laydate.render({
        elem: '#date_picker2',
        eventElem: '#date_picker2-1',
        trigger: 'click',
        theme: 'blue'
    })
    form.on('submit(search)', function (data) {
        var value = data.field;
        info = value;
        table.reload('table_content', {
            url: baseurl + 'activity/regress/selectByUserIdPage?map[startTime]=' + value.startTime +
                '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter
        })
    })

    mytable.init({
            id: 'table_content',
            url: 'activity/regress/selectByUserIdPage?map[parameter-like]=',
            pageCode: 'archive-manage',
            data: '',
            callback: function(){
                preview();
            }
        })
        .then(function (table) {
            form.render('checkbox');
            table.on('tool(table-review)', function (obj) {
                var data = obj.data,
                    selectId = data.id; //被选中行的id
                console.log(data);
                var btn = $('.modaljump');

                switch (obj.event) {
                    case 'details':
                        // baseDatas = getCheckedData();
                        // baseDatas.url = 'activity/regress/selectregressDetailsById';
                        baseData = data;
                        baseData.url = 'activity/regress/selectRegressDetailsById'; // 弹出层查询详情接口
                        btn.attr('href', 'html/administration/form/layer-archiveReview-details.html');
                        btn.attr('action','activity/regress/regressAuditBatchAgree');
                        baseData.action = 'activity/regress/regressAuditBatchAgree';
                        btn.attr('data-cancel-url', 'activity/regress/regressAuditBatchRefuse');
                        baseData.cancelUrl = 'activity/regress/regressAuditBatchRefuse';
                        btn.attr('data-btn', '同意,驳回');
                        btn.attr('width', '800px');
                        btn.attr('height', '600px');
                        btn.trigger('click');
                        break;
                    case 'review':
                        baseDatas = [data];
                        baseData.action = 'activity/regress/regressAuditBatchAgree';
                        btn.attr('href', 'html/administration/form/layer-review.html');
                        btn.attr('data-btn', '同意');
                        btn.attr('width', '450px');
                        btn.attr('height', '350px');
                        btn.attr('action','activity/regress/regressAuditBatchAgree');
                        btn.trigger('click');
                        break;
                    case 'reject':
                        baseDatas = [data];
                        baseData.action = 'activity/regress/regressAuditBatchRefuse';
                        btn.attr('href', 'html/administration/form/layer-review.html');
                        btn.attr('data-btn','驳回');
                        btn.attr('width', '450px');
                        btn.attr('height', '350px');
                        btn.attr('action','activity/regress/regressAuditBatchRefuse');
                        btn.trigger('click');
                        break;
                    default:
                        break
                }
            })
        })

    // alert(window.location.search);
    batchPass();
    batchReject();
    allExport();
    pageExport();
    // getSelectData();
    initTree('select');
});

function getCheckedData() {
    var checkStatus = layui.table.checkStatus('table_content');
    return checkStatus.data;
}

function initTree(value) {
    var treeNodes = [];
    app.get("archivesmodule/arcTbArcType/selectAll", '', function (msg) {
        if (msg.state) {
            var data = msg.rows;
            if (value) {
                $("#department_name").val(data[0].typeName);
                $("#department_id").val(data[0].id);
                // $('#btnyear').click();
            } else {
                /*ztree树状图的数据结构-liuyuru*/
                for (var key in data) {
                    treeNodes[key] = {};
                    treeNodes[key]['id'] = data[key].id;
                    treeNodes[key]['name'] = data[key].typeName;
                    treeNodes[key]['pId'] = data[key].fkParentId;
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

// 批量通过
function batchPass() {
    $('#batchPass').on('click', function () {
        var btn = $('.modaljump');
        baseDatas = getCheckedData();
        if(baseDatas.length > 0){
            baseData.action = 'activity/regress/regressAuditBatchAgree';
            btn.attr('href', 'html/administration/form/layer-review.html');
            btn.attr('data-btn', '同意');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action','activity/regress/regressAuditBatchAgree');
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
            baseData.action = 'activity/regress/regressAuditBatchRefuse';
            btn.attr('href', 'html/administration/form/layer-review.html');
            btn.attr('data-btn','驳回');
            btn.attr('width', '450px');
            btn.attr('height', '350px');
            btn.attr('action','activity/regress/regressAuditBatchRefuse');
            btn.trigger('click');
        }else {
            layui.layer.msg('请选择数据！！！');
        }

    })
}

// 全部导出
function allExport() {
    $('#exportAll').on('click', function () {
        console.log(info);
        window.location.href = window.baseurl + 'activity/regress/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
            info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
            info.parameter + '&map[flag]=1'
    })
}

// 导出当前
function pageExport() {
    $('#export').on('click', function () {
        window.location.href = window.baseurl + 'activity/regress/export?map[startTime]=' + info.startTime + '&map[endTime]=' +
            info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
            info.parameter + '&map[flag]=0'
    })
}

function preview() {
    $('.preview-file').on('click', function () {
        var id = this.dataset.flag;
        baseData.id = id;
        parent.layui.layer.open({
            type: 2,
            content: 'html/archive/archive-manage/preview-archive.html',
            area: ['100%', '100%'],
            // maxmin: true
        });
    })
}

function firstRefresh(){
    layui.table.reload('table_content', {page:{curr: 1}});
}
function testRefresh(){
    layui.table.reload('table_content', {});
}