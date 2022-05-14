$(function (mytable) {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        var form = layui.form;
        getMenuBar();//自定义面包屑，引用public-menu.js
        //日期范围
        mybtn.date('#date_picker1','#date_picker2');
        app.get("authmodule/sysTbDictCode/selectNoticeCode", "", function (msg) {
            if (msg.state) {
                var str = '';
                for (var i = 0; i < msg.rows.length; i++) {
                    str += '<option value=' + msg.rows[i].id + '>' + msg.rows[i].svalue + '</option>';
                }
                $("#level").append(str);
                form.render();
            }
        });
        mytableinit();
    });
    /*查询公告-liuyuru*/
    $('#notice_query').on('click', function () {
        var data = {
            'map[level]': $('#level').val(),
            'map[starttime]': $('#date_picker1').val(),
            'map[endtime]': $('#date_picker2').val(),
            'map[noticeTitle-like]': $("#noticeTitle").val(),
        };
        var val=$("#noticeTitle").val();
        // mytableinit(data);
        var pattern = /[`^&% { } | ?]/im;
        if(!val ||  val && !pattern.test(val)) { 
            mytableinit(data);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
    })
}(mytable));
function firstRefresh(){
    $(".layui-laypage-skip input").val(1);
    try {
        $(".layui-laypage-btn")[0].click();
    } catch (error) {
        mytableinit();
    }
}
function testRefresh(){
	$(".layui-laypage-btn")[0].click(); 
}
/*表格初始化、公告的查询-liuyuru*/
function mytableinit(datajson) {
    mytable.init({
        id: 'table-notice', url: 'noticemodule/notTbNotice/selectNotTbNotice', pageCode: 'notice',data:datajson
    }).then(function (table) { });
}