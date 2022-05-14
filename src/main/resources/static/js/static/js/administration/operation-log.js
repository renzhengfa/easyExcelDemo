var form;
$(function(mytable){
    layui.use(["form", "element", "layer","laydate"], function() {
        var element = layui.element;
        var layer = layui.layer;
        form = layui.form;
        getMenuBar();//自定义面包屑，引用public-menu.js
        // mybtn.date('#test1','#test2');
        var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
        var laydate = layui.laydate;
        var start = laydate.render({
            elem: '#test1'
            , theme: 'blue'
            ,type: 'datetime'
            ,  max: time2
            , done: function (value, date, endDate) {
                end.config.min = {
                    year: date.year,
                    month: date.month - 1,
                    date: date.date,
                    hours:date.hours,
                    minutes:date.minutes,
                    seconds:date.seconds
                }
            }
        });
        var end = laydate.render({
            elem: '#test2'
            , theme: 'blue'
            ,type: 'datetime'
            ,  max: time2
            , done: function (value, date, endDate) {
                if (value === '' || value === null) {
                    var nowDate = new Date();
                    start.config.max = {
                        year: nowDate.getFullYear(),
                        month: nowDate.getMonth(),
                        date: nowDate.getDate(),
                        hours:nowDate.getHours(),
                        minutes:nowDate.getMinutes(),
                        seconds:nowDate.getSeconds()
                    };
                    return
                }
                start.config.max = {
                    year: date.year,
                    month: date.month - 1,
                    date: date.date,
                    hours:date.hours,
                    minutes:date.minutes,
                    seconds:date.seconds
                }
            }
        });
        mytableinit();
        search();
        getUsers();
    });
}(mytable));
//获取的日期格式化的方法
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
// 获取操作人
function getUsers(){
    var str = "";
    app.get("authmodule/authTbUser/selectAllUsers", {}, function(msg) {
        if (msg.state) {
            var str1 = '<option value="">全部</option>';
            console.log(msg.rows);
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].account + "</option>";
            }
            $("#opa_user").html(str1 + str);
            form.render();
        } else {
            console.log(msg);
        }
    });
}
// 查询
function search(){
    $(".btn-search").on("click",function(){
        var opa_user = $("#opa_user").find("option:selected").val();
        var operation_type = $(".operation-type ").find("option:selected").val();
        var data = {
            'map[fkuserid]': opa_user,
            'map[operation]': $(".opt-name").val(),
            'map[createtime]': $("#test1").val(),
            'map[endtime]': $("#test2").val(),
            'map[operationtype]': operation_type
        };
        var pattern = /[`^&% { } | ?]/im;
        var keywords=$(".opt-name").val();
        if(!keywords||  keywords && !pattern.test(keywords)) { 
            mytableinit(data);
        }else {
            layer.msg('查询条件不能包含特殊字符');
        }   
    });
}
/*表格初始化-liuyuru*/
function mytableinit(datajson) {
    mytable.init({
        id: 'tablle_info', url: 'globalmodule/sysTbLogController/selectManyConditions', pageCode: 'operation-records',data:datajson
    }).then(function (table) { });
}

