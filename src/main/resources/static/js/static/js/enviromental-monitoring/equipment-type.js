layui.use(['table', 'layer', 'form'], function () {
    var table = layui.table;
    getMenuBar();//自定义面包屑，引用public-menu.js
    initTable();
    //点击查询按钮查询
    $('#search_btn').on('click', function () {
        Search();
    });
    //输入框内按钮enter进行查询
    $('input[name="searchWord"]').bind('keydown', function (event) {
        if (event.keyCode == '13') {
            Search();
        }
    });
});

//查询函数
function Search() {
    var searchWord = $('input[name="searchWord"]').val();
    var pattern = /[`^&% { } | ?]/im;
    if(!searchWord||  searchWord && !pattern.test(searchWord)) { 
        mytable.init({
            id: 'table_content',
            url: 'environment/type/selectTypes',
            pageCode: 'equ-type',
            data: {
                'map[content-like]': searchWord,
                'field': 'create_time'
            }
        })
    }else {
        layer.msg('查询条件不能包含特殊字符');
     }
}
function initTable(){
    mytable.init({
        id: 'table_content',
        url: 'environment/type/selectTypes',
        pageCode: 'equ-type',
        data: {'field': 'create_time'}
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