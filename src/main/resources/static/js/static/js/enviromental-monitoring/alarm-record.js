/**
 * @author yuqi
 * @description 报警记录
 */
layui.use(['table', 'layer', 'form', 'laydate'], function () {
    var table = layui.table,
        laydate = layui.laydate,
        form = layui.form;
    getMenuBar();//自定义面包屑，引用public-menu.js
    //库房
    app.get('environmentmodule/wkStoTbStore/selectWkStoTbStore', {}, function (res) {
        console.log(res);
        var optionList = res.rows, option, store = $('select[name="map[fkStoreId]"]');
        for (var key in optionList) {
            option = '<option value="' + optionList[key].id + '">' + optionList[key].storeName + '</option>';
            store.append(option);
            // console.log(optionList[key].id);
        }
        form.render('select');
    });
    //报警类型
    app.get('environmentmodule/wkTbEquAlarmType/selectAlarmTypeAll', {}, function (res) {
        console.log(res);
        var optionList = res.rows, option, alarm = $('select[name="map[fkAlarmTypeId]"]');
        for (var key in optionList) {
            option = '<option value="' + optionList[key].id + '">' + optionList[key].alarmTypeName + '</option>';
            alarm.append(option);
        }
        form.render('select');
    });
    var start = laydate.render({
        elem: '#date_picker1',
        trigger: 'click',
        theme: 'blue',
        max: 0 ,
        ready: function (date) {
            console.log(date); //得到初始的日期时间对象：{year: 2018, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
        },
        done: function (value, date) {
            end.config.min = {
                year: date.year,
                month: date.month - 1,//关键
                date: date.date
            };
        }
    });

    var end = laydate.render({
        elem: '#date_picker2',
        trigger: 'click',
        theme: 'blue',
        max: 0 ,
        done: function (value, date) {
            if (value == '' || value == null) {
                return;
            }
            start.config.max = {
                year: date.year,
                month: date.month - 1,//关键
                date: date.date
            };
        }
    });
    initTable();
});

$('#search_alarm_record').on('click', function () {
    var formInfo = $('#search_condition_area').serializeJson();
    formInfo.field = 'create_time';
    var endtime = new Date(formInfo['map[endtime]']);
    // console.log(endtime)
    endtime.setDate(endtime.getDate() + 1);
    formInfo['map[endtime]'] = endtime.toLocaleString();
    // console.log(formInfo);
    mytable.init({
        id: "table_content",
        url: 'environment/alarm/selectAlarms',
        pageCode: "alarm-message",
        data: formInfo
    });
});
function initTable(){
    mytable.init({
        id: "table_content",
        url: 'environment/alarm/selectAlarms',
        pageCode: "alarm-message",
        data: {
            // 'field': 'create_time'
        }
    });
}


function firstRefresh() {
    var data = layui.table.cache['table_content'],
        page = $(".layui-laypage-skip").find("input").val(); //当前页码值
    if (data.length - 1 > 0) {
        $(".layui-laypage-btn")[0].click();
    } else {
        layui.table.reload('table_content', {
            page: {
                curr: page - 1
            }
        });
    }
}

function testRefresh() {
    var data = layui.table.cache['table_content'],
        page = $(".layui-laypage-skip").find("input").val(); //当前页码值
    if (data.length - 1 > 0) {
        $(".layui-laypage-btn")[0].click();
    } else {
        layui.table.reload('table_content', {
            page: {
                curr: page - 1
            }
        });
    }

}