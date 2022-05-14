var baseData = {},baseDatas=[];
var info = {
    startTime: '',
    endTime: '',
    state: '',
    fkTypeId: '',
    parameter: ''
};
var Review = function () {

};

Review.prototype.checkReview = function (config) {
    this.tableInit(config);
    this.dateRender();
    this.searchInfo(config);
    this.batchPass(config);
    this.batchReject(config);
    this.allExport(config);
    this.pageExport(config);
    initTree('select');
    this.onFocus();
};

Review.prototype.tableInit = function (config) {
    mytable.init({
        id: 'table_content',
        url: config.tableUrl + '?map[parameter-like]=',
        pageCode: config.pageCode,
        data: '',
        callback: function () {
            fileView();
        }
    }).then(function (table) {
            layui.form.render('checkbox');
            table.on('tool(table-review)', function (obj) {
                var data = obj.data,
                    selectId = data.id; //被选中行的id
                var btn = $('.modaljump');

                switch (obj.event) {
                    case 'details':
                        // baseDatas = getCheckedData();
                        // baseDatas.url = 'activity/regress/selectregressDetailsById';
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
        })
};

Review.prototype.dateRender = function () {
    mybtn.date("#date_picker1","#date_picker2");
};

Review.prototype.searchInfo = function (config) {
    layui.form.on('submit(search)', function (data) {
        var value = data.field;
        info = value;
        layui.table.reload('table_content', {
            url: baseurl + config.tableUrl + '?map[startTime]=' + value.startTime +
                '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter
        })

        var pattern = /[`^&% { } | ?]/im;
        if(!value.parameter ||  value.parameter && !pattern.test( value.parameter)) { 
            var url= config.tableUrl + '?map[startTime]=' + value.startTime +
            '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter;
            mytableinit(mytable,url);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
    })
};

Review.prototype.batchPass = function (config) {
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
};

Review.prototype.batchReject = function (config) {
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
};

Review.prototype.allExport = function (config) {
    $('#exportAll').on('click', function () {
        window.location.href = window.baseurl + config.export + '?map[startTime]=' + info.startTime + '&map[endTime]=' +
            info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
            info.parameter + '&map[flag]=1'
    })
};

Review.prototype.pageExport = function () {
    $('#exportAll').on('click', function () {
        window.location.href = window.baseurl + config.export + '?map[startTime]=' + info.startTime + '&map[endTime]=' +
            info.endTime + '&map[fkTypeId]=' + info.fkTypeId + '&map[parameter-like]=' +
            info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
    })
};

Review.prototype.onFocus = function () {
    $('input[name="parameter"]').focus(function () {
        readRFID();
    })
};
function fileView() {
    $('.preview-file').on('click', function () {
        var id = this.dataset.flag,
            typeId = this.dataset.type;
        baseData.id = id;
        baseData.typeId = typeId;
        parent.layui.layer.open({
            type: 2,
            content: 'html/archive/archive-manage/preview-archive.html',
            area: ['100%', '100%'],
            maxmin: true
        });
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

//rfid
function  RFID(data) {
    $('input[name="parameter"]').val(data);
}