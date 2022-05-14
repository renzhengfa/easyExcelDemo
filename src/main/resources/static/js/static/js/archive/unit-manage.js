/**
 * @author yuqi
 * @description 权限管理
 */
layui.use(['table', 'layer', 'form'], function () {
    var table = layui.table,
        form = layui.form;
    getMenuBar();//自定义面包屑，引用public-menu.js
    //数据表格渲染
    mytableinit();
    //搜索框按下回车键触发
    $('#search_word').bind('keydown', function (event) {
        if (event.keyCode == '13') {
            Search();
        }
    });
    //查询按钮点击事件
    $('#search_btn').on('click', function () {
        Search();
    });
    //点击查询时或者按下回车键时触发的事件
    function Search() {
        var val= $('#search_word').val();
        var pattern = /[`^&% { } | ?]/im;
        if(!val ||  val && !pattern.test(val)) { 
            mytableinit({'map[content]':val});
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
    }
});
/*表格初始化和查询-liuyuru*/
function mytableinit(data) {
    mytable.init({
        id: 'table_content', url: 'unitmodele/organization/getOrganizationByConditon', pageCode: 'unitmodele-organization', data:data
    }).then(function (table) { });
}
function firstRefresh(){
    $(".layui-laypage-skip input").val(1);
    try {
        $(".layui-laypage-btn")[0].click();
    } catch (error) {
        mytableinit();
    }
}
function testRefresh(){
    if($(".layui-laypage-count").html()=="共 1 条"){
        mytableinit();
    }else{
        $(".layui-laypage-btn")[0].click();
    }
}
