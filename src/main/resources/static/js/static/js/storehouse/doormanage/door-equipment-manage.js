$(function (mytable) {
    getMenuBar();//自定义面包屑，引用public-menu.js
    mymore.selectroom("#door-room","#door-equi"); //库房下拉框
    mytableinit('');
    /*查询设备-liuyuru*/
    $('#queryequipment').on('click', function () {
        var data={
            'map[fkStoreId]':$('#door-room').val(),
            'map[entranceGuardName]': $('#entranceGuardName').val()
        };
        // mytableinit(data);

        var keywords=$('#entranceGuardName').val();
        var pattern = /[`^&% { } | ?]/im;
        if(!keywords||  keywords && !pattern.test(keywords)) { 
            mytableinit(data);
        }else {
           layer.msg('查询条件不能包含特殊字符');
        }
    })
}(mytable));
/*表格初始化、设备的查询-liuyuru*/
function mytableinit(data) {
    mytable.init({
        id: 'door-equipment', url: 'storeroom/entranceGuard/getEntranceGuardByCondition', pageCode: 'door-equipment-manage',data: data
    }).then(function (table) {
    })
}
function firstRefresh(){
	$(".layui-laypage-skip input").val(1);
	try{
        $(".layui-laypage-btn")[0].click();
    }catch(e){
        mytableinit('');
    }
}
function testRefresh(){
    try{
        console.log($(".layui-table-page"));
        var page =$(".layui-table-page")[0].children[0].children[0].children[5].innerText;
        if(page == "共 1 条"){
            mytableinit('');
        }else{
            $(".layui-laypage-btn")[0].click();
        }
    }catch(e){
        $(".layui-laypage-btn")[0].click();
    }

}