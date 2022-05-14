/**
 * @author yuqi
 * @description 权限管理
 */
layui.use(['table', 'layer', 'form'], function () {
    var table = layui.table,
        formLayer = $('#change_interface_form'),
        form = layui.form;
    getMenuBar();
    //渲染表格上方条件select
    app.get('authmodule/sysTbDictCode/selectTypeCode', '', function (data) {
        var data = data.rows
        // console.log(data)
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].fkTypeCode == 'api_type') {
                $('.interfaceType').append('<option value=' + data[i].code + '>' + data[i].svalue + '</option>');
            } else if (data[i].fkTypeCode == 'api_group') {
                $('.interfaceGroup').append('<option value=' + data[i].id + '>' + data[i].svalue + '</option>');
            } else {
                console.log('出错啦！');
            }
        }
        //表单渲染
        form.render();
    });

    //数据表格渲染
    initTable();
    var selectValue, searchWord;
    //搜索框按下回车键触发
    $('#search_word').bind('keydown', function (event) {
        if (event.keyCode == '13') {
            Search()
        }
    });

    //查询按钮点击事件
    $('#search_btn').on('click', function () {
        Search()
    });


    //点击查询时或者按下回车键时触发的事件
    function Search() {
        searchWord = $('#search_word').val()
            selectValue = $('.demoTable').find('select')
            var pattern = /[`^&% { } | ?]/im;
            if(!searchWord||  searchWord && !pattern.test(searchWord)) { 
                mytable.init({
                    id: 'table_content',
                    url: 'authmodule/authTbUri/selectUriAll',
                    pageCode: 'uri',
                    data: {
                        'map[uriName-like]': searchWord,
                        'map[fkGroupId]': selectValue.eq(0).val(),
                        'map[fkTypeCode]': selectValue.eq(1).val()
                    }
                })
        }else {
            layer.msg('查询条件不能包含特殊字符');
        }
        }
});
function firstRefresh(){
    $(".layui-laypage-skip input").val(1);
    $(".layui-laypage-btn")[0].click();
}
function testRefresh(){
    $(".layui-laypage-btn")[0].click();
}
function initTable() {
    mytable.init({
            id: 'table_content',
            url: 'authmodule/authTbUri/selectUriAll',
            pageCode: 'uri',
            data: {}
        }).then(function (table) {
            layer.closeAll('loading')
        })
}
