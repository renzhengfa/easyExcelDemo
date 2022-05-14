var element;
var xtype="月";
$(function (myecharts) {
    layui.use(['element', 'form'], function () {
        var $ = layui.jquery;
        element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
        var form = layui.form;
    });
    archivesajax();
    arcorderajax();
    noticeajax();
    totlecountajax();
    buttonactive();
    initTree1("select");
}(myecharts));
// 现存档案和在架档案比
function archivesajax() {
    var dataArr = [];
    app.get("countmodule/homePage/getExistingArchivesRecord", "", function (msg) {
        if (msg.state) {
            for (var i = 0; i < msg.rows.length - 1; i++) {
                var name;
                if (msg.rows[i].name == "existArc") {
                    name = '现存档案';
                } else if (msg.rows[i].name == "existBox") {
                    name = '现存档案盒';
                } else if (msg.rows[i].name == "rfArc") {
                    name = '在架档案';
                } else if (msg.rows[i].name == "rfBox") {
                    name = '在架档案盒';
                }
                dataArr[i] = { value: msg.rows[i].count, name: name };
            }
            archivesratio(dataArr);
        } else {
            layer.msg(msg.msg);
        }
    })
}
function archivesratio(dataArr) {
    var mylables = new Array("现存档案", "现存档案盒", "在架档案", "在架档案盒");
    var datalegend = {
        orient: 'vertical',
        y: 'bottom',
        right: 10,
        data: [{ name: '现存档案', icon: 'circle', }, { name: '现存档案盒', icon: 'circle', }, { name: '在架档案', icon: 'circle', }, { name: '在架档案盒', icon: 'circle', }]
    };
    var dataseries = [
        {
            name: '档案',
            type: 'pie',
            color: ['#195ef0', '#fb8039', '#fcd436', '#35cbcc'],
            radius: ['35%', '50%'],
            label: {
                normal: {
                    formatter: '{d}%'
                }
            },
            data: dataArr
        }
    ];
    archivepie=myecharts.pie("archivepie", "", mylables, dataseries, datalegend);
}
// 公告
function noticeajax() {
    app.get("countmodule/homePage/getNotice", "", function (msg) {
        if (msg.state) {
            var tabletr = "";
            var data=msg.rows;
            // tabletr = "<tr><th>排名</th><th>人事档案</th><th>数量</th><th>百分比</th></tr>";
            for (var i = 0; i < data.length; i++) {
                tabletr += "<tr style='color: "+data[i].titleColor+"'><td><a class='modaljump' href='html/layer-homepage-notice.html?id=" + data[i].id + "' "+
                "action='close-layer' data-title='查看公告'  width='600px' height='360px' data-type='2' data-btn='关闭'  style='color: "+data[i].titleColor+"'>" + data[i].noticeTitle + "</a></td><td style='width:100px'>" + data[i].createTime.substring(0,10) + "</td></tr>";
                
            }
            $("#Notice").html(tabletr);
        } else {
            console.log(msg.msg);
        }
    })
}
// 获取档案数量排行
function arcorderajax() {
    app.get("countmodule/homePage/getArcOrder", "", function (msg) {
        if (msg.state) {
            var tabletr = "";
            tabletr = "<tr><th>排名</th><th>档案类别</th><th>数量</th><th>百分比</th></tr>";
            var length = msg.rows.length;
            var totoal = msg.rows[length - 1].count;
            for (var i = 0; i < length - 1; i++) {
                var num = i + 1;
                var nummath=msg.rows[i].count/ totoal * 10000;
                if(isNaN(parseInt(nummath))){
                    nummath=10000;
                }
                var percentcount = Math.round(nummath) / 100.00 + "%";
                // var percentcount = Math.round(msg.rows[i].count / totoal * 10000) / 100.00 + "%";
                tabletr += "<tr><td>" + num + "</td><td>" + msg.rows[i].name + "</td><td>" + msg.rows[i].count + "</td>" +
                    "<td><div class='layui-progress'  lay-filter='demoArcOrder" + i + "' lay-showpercent='true'><div class='layui-progress-bar' lay-percent=" + percentcount + "><span class='layui-progress-text'>" + percentcount + "</span></div></div></td></tr>";
            }
            $("#ArcOrder").html(tabletr);
            layui.use(['element'], function () {
                var element = layui.element;
                for (var i = 0; i < length - 1; i++) {
                    var nummath=msg.rows[i].count/ totoal * 10000;
                    if(isNaN(parseInt(nummath))){
                        nummath=10000;
                    }
                    var percentcount = Math.round(nummath) / 100.00 + "%";
                    // var percentcount = Math.round(msg.rows[i].count / totoal * 10000) / 100.00 + "%";
                    element.progress("demoArcOrder" + i, percentcount);
                }
            });
        } else {
            layer.msg(msg.msg);
        }
    })
}

// 获取今日借出数量
function totlecountajax() {
    app.get("countmodule/homePage/getTotleCount", "", function (msg) {
        if (msg.state) {
            var tabletotlecount = "";
            for (var i = 0; i < msg.rows.length; i++) {
                var names = msg.rows[i].name;
                var numi = (i % 2 == 0) ? "2" : "1";
                if (numi == "2") {
                    var totoal = msg.rows[i].count;
                    tabletotlecount += "<tr><td style='width:80px'>" + msg.rows[i].cname + "<br/>" + msg.rows[i].count + "</td>";
                } else {
                    // var nummath=msg.rows[i].count/ totoal * 10000;
                    if (msg.rows[i].name == "nowreturn") {
                        var nummath = msg.rows[i].count / (msg.rows[i].count + totoal) * 10000;
                    } else {
                        var nummath = msg.rows[i].count / totoal * 10000;
                    }
                    if(isNaN(parseInt(nummath))){
                        nummath=10000;
                    }
                    var percentcount = Math.round(nummath) / 100.00 + "%";
                    tabletotlecount += "<td style='padding: 0 30px'><div class='layui-progress layui-progress-big' lay-filter='demo" + i + "'lay-showpercent='true'>" +
                        "<div class='layui-progress-bar layui-progress-right layui-bg"+i+"' lay-percent='" + percentcount + "'><span class='layui-progress-text'>" + percentcount + "</span></div></div></td>" +
                        "<td style='width:80px'>" + msg.rows[i].cname + "<br/>" + msg.rows[i].count + "</td></tr>";
                }
            }
            $("#TotleCount").html(tabletotlecount);
            layui.use(['element'], function () {
                var element = layui.element;
                for (var i = 0; i < msg.rows.length; i++) {
                    var numi = (i % 2 == 0) ? "2" : "1";
                    if (numi == "2") {
                        var totoal = msg.rows[i].count;
                    } else {
                        // var nummath=msg.rows[i].count / totoal * 10000;
                        if (msg.rows[i].name == "nowreturn") {
                            var nummath = msg.rows[i].count / (msg.rows[i].count + totoal) * 10000;
                        } else {
                            var nummath = msg.rows[i].count / totoal * 10000;
                        }
                    if(isNaN(parseInt(nummath))){
                        nummath=10000;
                    }
                    var percentcount = Math.round(nummath) / 100.00 + "%";
                        // var percentcount = Math.round(msg.rows[i].count / totoal * 10000) / 100.00 + "%";
                        element.progress("demo" + i, percentcount);
                    }
                }
            });
        } else {
            layer.msg(msg.msg);
        }
    })
}
var timeType,borratelabels;
function buttonactive() {
    $('#btnmonth').on('click', function () {
        $("#btnyear").removeClass("wsdButton");
        $("#btnmonth").addClass("wsdButton");
        var aDate = new Date();
        var aYear = aDate.getFullYear();
        var aMonth = aDate.getMonth() + 1;
        var day = new Date(aYear, aMonth, 0);
        var daycount = day.getDate();
        borratelabels = [];
        for (var i = 0; i < daycount; i++) {
            borratelabels[i] = i + 1;
        }
        timeType=1;
        xtype="号";
        borrowrate(borratelabels,timeType);
    });
    $('#btnyear').on('click', function () {
        $("#btnyear").addClass("wsdButton");
        $("#btnmonth").removeClass("wsdButton");
        borratelabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        timeType=2;
        xtype="月";
        borrowrate(borratelabels,timeType);
    });
}

function borrowrate(borratelabels,timeType) {
    var archivevalue = $("#department_id").val();
    var datajson={
        fkTypeId: archivevalue,
        timeType: timeType
    }
    var data=[];
    app.get("countmodule/homePage/getBorrowCountByTime", datajson, function (msg) {
        if (msg.state) {
            for(var i=0;i<msg.rows.length;i++){
                data[i]=msg.rows[i].count;
            }
            var datalegend = [archivevalue];
            var dataseries = [
                {
                    name: '借阅数',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#439bff'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#439bff'
                            }, {
                                offset: 1,
                                color: '#b9d1f8'
                            }])
                        }
                    },
                    data: data
                }
            ];
            myecharts.line("archiveline", "数量", datalegend, borratelabels, dataseries, xtype);
        } else {
            console.log(msg.msg);
        }
    })
}
