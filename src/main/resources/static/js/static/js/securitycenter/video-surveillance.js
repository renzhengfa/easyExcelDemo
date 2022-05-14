/**
 * @description 命令字典
 * @author chentong
 */

// 初始化table
$(
    (function (mytable) {
        layui.use(["table", "layer", "form"], function () {
            var table = layui.table;
            var form = layui.form; // form表单
            form.render();
            mytable
                .init({
                    id: "table_content",
                    url: "safemodule/SafeTbMonitor/selectSafeMonitorAll",
                    pageCode: "webcam",
                    data: { field: "id" } //根据id倒序排列
                })
                .then(function (table) {
                    console.log(table);
                });
            query(table);
        });
    })(mytable)
);

function query(table) {
    $("#command_dictionary_btn_query").on("click", function () {
        var command_input = $("#command_input").val();
        console.log(command_input);
        if (command_input == "") {
            layer.msg("您还没有输入关键字!");
            return;
        }
        mytable
            .init({
                id: "table_content",
                url: "safemodule/SafeTbMonitor/selectSafeMonitorAll",
                pageCode: "webcam",
                data: {
                    // 'field': 'create_time',
                    "map[equName-like]": $('input[name="searchWord"]').val()
                }
            })
            .then(function (table) {
                console.log(table);
            });
    });
}
function firstRefresh() {
    $(".layui-laypage-skip input").val(1);
    $(".layui-laypage-btn")[0].click();
}

function testRefresh() {
    $(".layui-laypage-btn")[0].click();
}
