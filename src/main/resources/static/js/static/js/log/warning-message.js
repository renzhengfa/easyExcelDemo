// 初始化
var baseData={};
var table = function(mytable, url) {
    mytable.init({
            id: "tablle_info",
            pageCode: "warning-message",
            // pageMarker:"111",
            url: url,
            callback:function(){
                // preview();
            }
        }).then(function(table) {
            //console.log(table);
            //监听工具条
            table.on("tool(control)", function(obj) {
                var data = obj.data;
                console.log(data);
                if (obj.event === "ignore") {
                    layer.confirm("是否确定忽略？",{shade: 0},function(index) {
                        app.post("storeroom/alarmHandle/ignoreAlarm",{
                            fkAlarmId: data.id
                        },function(msg) {
                            if (msg.state == true) {
                                layer.msg(msg.msg);
                                table.reload("tablle_info", {
                                    url: baseurl + "storeroom/alarm/selectAlarms",
                                    where: {} //设定异步数据接口的额外参数
                                });
                            }
                        });
                    });
                };
                if (obj.event === "details") {
                    baseData = data;
                    baseData.fileName = '销毁审核附件';
                    baseData.url = 'storeroom/alarm/selectAlarmById';
                    $('#details').trigger('click');
                }
            });
        });
};

function resetForm(){
    $(".reason,.way").val("");
}

function firstRefresh(){
	$(".layui-laypage-skip input").val(1);
	try {
		$(".layui-laypage-btn")[0].click();
	} catch (error) {
		$(".curSelectedNode").click();
	}
}
function testRefresh(){
	$(".layui-laypage-btn")[0].click(); 
}

// 查询所有库房
function getStoreName() {
    app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function(msg) {
        if (msg.state) {
            var str = "";
            var str1 = '<option value="">全部</option>';
            for (var i = 0; i < msg.rows.length; i++) {
                str +=
                    '<option value="' +
                    msg.rows[i].id +
                    '">' +
                    msg.rows[i].storeName +
                    "</option>";
            }
            $("#store_name").html(str1 + str);
            form.render();
        } else {
            layer.msg(msg.msg);
        }
    });
}

// 库房环境报警信息查询
function getWarningMsg() {
    $(".msg-search").on("click", function() {
        var storeName = $("#store_name").find("option:selected").val();
        var areaName = $("#area_name").find("option:selected").val();
        if(areaName == undefined){
            areaName = "";
        }
        var keywords = $(".keywords").val();
        var state = $("#state").find("option:selected").val();

        var pattern = /[`^&% { } | ?]/im;
        if(!keywords||  keywords && !pattern.test(keywords)) { 
            table(mytable,"storeroom/alarm/selectAlarms?map[fkRegionId]=" + areaName + "&map[fkStoreId]=" + storeName + "&map[state]=" + state + "&map[content]=" + keywords);
        }else {
           layer.msg('查询条件不能包含特殊字符');
        }
    });
}

// 导出Excel表
function outputExcel() {
    var form = layui.form;
    form.on('select(output)', function (data) {
        var areaName = $("#area_name").find("option:selected").html();
        var roomName = $("#store_name").find("option:selected").html();
        var state = $("#state").find("option:selected").val();
        var content = $(".keywords").val();
        switch (data.value) {
            case "0":
            document.location.href = baseurl + "storeroom/alarm/exportAlarmExcel?fkRegionName=" + areaName + "&fkStoreName=" + roomName +  "&state=" + state + "&content=" + content;
                break;
            case "1":
            document.location.href = baseurl + "storeroom/alarm/exportCurrentPageAlarm?fkRegionName=" + areaName + "&fkStoreName=" + roomName +  "&state=" + state + "&content=" + content+"&currentPage=" + curr + "&pageSize=" + pagesize;
                break;
        }
    });
}
var form;
$(function(mytable) {
    getMenuBar();//自定义面包屑，引用public-menu.js
    getWarningMsg();
    table(mytable, "storeroom/alarm/selectAlarms");
    // outputExcel();
    layui.use(["form", "table"], function() {
        form = layui.form;
        var tabel = layui.table;
        getStoreName();
        outputExcel();
        form.on("select(store_name)",function(data){
            console.log(data.value);
            app.get("storeroommodule/stoTbRegion/selectByBind",{fkStoreId: data.value},function(msg){
                console.log(msg);
                if(msg.state){
                    var str = "";
                    var str1 = '<option value="">全部</option>';
                    for(var i = 0; i < msg.rows.length; i++){
                        str += '<option value="'+ msg.rows[i].id +'">'+ msg.rows[i].regionName +'</option>';
                    }
                    $("#area_name").html(str1 + str);    
                    form.render();                                       
                }
            })
        });
        form.render();
    });
}(mytable));
