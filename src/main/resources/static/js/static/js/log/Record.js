var baseData = {},baseDatas=[];
var info = {
    startTime: '',
    endTime: '',
    department_id: '',
    parameter: ''
};
getMenuBar();
var Record = function () {

};

Record.prototype.checkRecord = function (config) {
    this.tableInit(config);
    this.searchInfo(config);
    this.allExport(config);
    mybtn.date("#date_picker1","#date_picker2");         //日期范围
    initTree('select');          //档案类别下拉框
    this.onFocus();
};

Record.prototype.tableInit = function (config) {
    mytable.init({
        id: 'table_content',
        url: config.tableUrl,
        pageCode: config.pageCode,
        data: '',
        callback: function () {
            preview(".preview-file");
        }
    }, 'record')
        .then(function (table) {
            table.on(
                "tool(table-review)",
                function (obj) {
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的DOM对象
                    if (layEvent === "details") {
                        baseData = data;
                        baseData.url = config.detailsUrl;
                        $('#details').trigger('click');
                    }
                }
            );
        })
};
 
Record.prototype.searchInfo = function (config) { 
    const tableUrl=config.tableUrl;
    layui.form.on('submit(search)', (data)=> { 
        var value = data.field;
        info = value;
        var pattern = /[`^&% { } | ?]/im;
        if(!value.parameter ||  value.parameter && !pattern.test( value.parameter)) { 
            // layui.table.reload('table_content', {
            //     url: baseurl + config.tableUrl + '?map[startTime]=' + value.startTime +
            //         '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter
            // })
            config.tableUrl = tableUrl + '?map[startTime]=' + value.startTime +
            '&map[endTime]=' + value.endTime + '&map[fkTypeId]=' + value.department_id + '&map[parameter-like]=' + value.parameter;
            this.tableInit(config);
            //   console.log(config.tableUrl);  
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }


    })
};

Record.prototype.allExport = function (config) {
        layui.form.on('select(output)', function (data) {
            if(data.value === "1"){
                //导出所有
                window.location.href = window.baseurl + config.export + '?map[startTime]=' + info.startTime + '&map[endTime]=' +
                    info.endTime + '&map[fkTypeId]=' + info.department_id + '&map[parameter-like]=' +
                    info.parameter + '&map[flag]=1'
            }else if(data.value === "0"){
                //导出当前
                window.location.href = window.baseurl + config.export + '?map[startTime]=' + info.startTime + '&map[endTime]=' +
                    info.endTime + '&map[fkTypeId]=' + info.department_id + '&map[parameter-like]=' +
                    info.parameter + '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
            }
        });
};

Record.prototype.onFocus = function () {
    $('input[name="parameter"]').focus(function () {
        readRFID();
    })
};

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