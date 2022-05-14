//获取点击菜单的menuName，自定义面包屑
function getMenuBar() {
    var menuName= window.sessionStorage.getItem("menuName") ? window.sessionStorage.getItem("menuName").split(',') : '';
    if(menuName.length === 1){
        $(".layui-breadcrumb").html("<a>"+menuName[0]+"</a>");
    }
    if(menuName.length>1){
        $(".layui-breadcrumb").html("<a>"+menuName[0]+"</a> <span lay-separator=''>&gt;</span>\n" +
            "      <a> <cite>"+menuName[1]+"</cite> </a>");
    }
}