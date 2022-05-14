/**
 * @author yuqi
 * @description 报警类型
 */

// 初始化table
$(function (mytable) {
        layui.use(["table", "layer", "form"], function () {
            var table = layui.table;
            var form = layui.form; // form表单
            form.render();
            getMenuBar();//自定义面包屑，引用public-menu.js
            initTable();
            query(table);
        });
    }(mytable));

function initTable() {
    mytable.init({
        id: "table_content",
        url: "environmentmodule/wkTbEquAlarmType/selectAlarmType",
        pageCode: "alarm_type",
        data: {'field': 'id'}  //根据id倒序排列
    }).then(function(table){
        console.log(table);
    });
}

function query(table) {
    $("#search_alarm_type").on("click", function () {
        var warning_input = $("#warning_input").val();
        // console.log(warning_input);
        // if (warning_input == "") {
        //     layer.msg("您还没有输入关键字!");
        //     return;
        // }
        var pattern = /[`^&% { } | ?]/im;
        if(!warning_input||  warning_input && !pattern.test(warning_input)) { 
            mytable.init({
                id: "table_content",
                url: "environmentmodule/wkTbEquAlarmType/selectAlarmType",
                pageCode: "alarm_type",
                data: {
                    // 'field': 'create_time',
                    'map[alarmTypeCode-like]': $('input[name="searchWord"]').val()
                }
            }).then(function (table) { 
                // console.log(table);
            });
        }else {
            layer.msg('查询条件不能包含特殊字符');
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