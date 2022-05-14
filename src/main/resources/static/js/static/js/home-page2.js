

$(function () {
    //今日借出量
    initTotalCount();
    setInterval(initTotalCount, 30000);

    // 现存档案
    initNowHasArchive();
    archivesajax();
    setInterval(archivesajax, 30000);

    // 历史监测
    monitorPointer();
    initHisMonitor();

    // 借阅数
    initBorrowCount();
    archiveborrowCount();
    setInterval(archiveborrowCount, 30000);

    // 各类档案排行    
    initArchiveOrder();
    archiveOrderajax();
    setInterval(archiveOrderajax, 30000);

})

layui.use(['element', 'progress'], function () {
    var element = layui.element;
    element.render(progress);
});
// 获取今日借出数量
function initTotalCount() {
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
                    var nummath = msg.rows[i].count / totoal * 10000;
                    if (isNaN(parseInt(nummath))) {
                        nummath = 10000;
                    }
                    var percentcount = Math.round(nummath) / 100.00 + "%";
                    tabletotlecount += "<td><div style='width:95%;' class='layui-progress layui-progress-big' lay-filter='demo" + i + "'lay-showpercent='true'>" +
                        "<div  class='layui-progress-bar layui-progress-right layui-bg" + i + "' lay-percent='" + percentcount + "'><span class='layui-progress-text'>" + percentcount + "</span></div></div></td>" +
                        "<td style='width:70px'>" + msg.rows[i].cname + "<br/>" + msg.rows[i].count + "</td></tr>";
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
                        var nummath = msg.rows[i].count / totoal * 10000;
                        if (isNaN(parseInt(nummath))) {
                            nummath = 10000;
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

//现存档案
//饼图
function archivesajax() {
    arichdataArr = [];
    app.get('countmodule/arcTbFileMapper/selectLendNotesRfCount', '', function (msg) {
        for (var i = 0; i < msg.row.length; i++) {
            var name;
            if (msg.row[i].state == "lend") {
                name = '已借出档案';
            } else if (msg.row[i].state == "nots") {
                name = '未上架档案';
            } else if (msg.row[i].state == "rf") {
                name = '在架档案';
            }
            arichdataArr[i] = { value: msg.row[i].count, name: name };
        }
        myChart2.setOption({
            series: [{
                data: arichdataArr
            }]
        });
    })
}
var myChart2;
function initNowHasArchive() {
    arichdataArr = [];
    myChart2 = echarts.init(document.getElementById('nowArchive'));
    var option = {
        title: {
            x: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            // trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            data: []
        },
        series: [
            {
                name: '现存档案',
                type: 'pie',
                center: ['50%', '50%'],
                radius: '70%',
                roseType: 'area',
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{b}{d}%',
                            textStyle: { color: '#53b0ff', fontSize: "18" }
                        },//文字颜色
                        labelLine: {
                            show: true,
                            lineStyle: { color: '#53b0ff', width: 1 }
                        }//线条颜色
                    }
                },
                data: arichdataArr,
                color: ['#0072ff', '#46cdff', '#ff9d46'],//各个区域颜色, '#ff4646'
            }
        ]
    };
    myChart2.setOption(option);
}

//历史检测
// 获取所以检测点
function monitorPointer() {
    app.get('environment/equipment/selectEquipmentOfCjq', '', function (msg) {
        var strPointer = ``;
        if (msg.state) {
            for (var i = 0; i < msg.rows.length; i++) {
                strPointer += `<option value="${msg.rows[i].equNum}">${msg.rows[i].equName}</option>`;
            }
            //默认显示第一个
            equNum = msg.rows[0].equNum;
            if(msg.rows.length>0){
                setInterval(getHisData, 3000);
            }
            // console.log(equNum);
            $('.form_select').html(strPointer);
            $('.form_select').on("change", function () {
                time = [];
                sdata = [];
                wdata = [];
                equNum = this.value;
                setInterval(getHisData, 3000);
            })
        } else {
            console.log(msg.msg);
        }
    })
}
var wdata = [],
    sdata = [],
    time = [];
function getHisData() {
    app.get('environment/equipment/selectHistoryCjq', { equNum: equNum }, function (msg) {
        if (msg.row.data.wd == 0 || msg.row.data.sd == 0) {
            $('.noww').html(msg.row.data.wd);
            $('.nows').html(msg.row.data.sd);
            // return;
        }else{
            if (wdata.length < 300) {
                $('.noww').html(msg.row.data.wd);
                $('.nows').html(msg.row.data.sd);
                wdata.push(msg.row.data.wd);
                sdata.push(msg.row.data.sd);
                time.push(msg.msg);
            } else {
                wdata.shift();
                wdata.push(msg.row.data.wd);
                sdata.push(msg.row.data.sd);
                sdata.shift();
                time.shift();
                time.push(msg.msg);
            }
        }

        myChart3.setOption({
            xAxis: [{
                data: time
            }],
            series: [{
                data: wdata
            }, {
                data: sdata
            }]
        });
    })
}
var myChart3;
function initHisMonitor() {
    myChart3 = echarts.init(document.getElementById("history-monitor"));
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        legend: {
            data: ['温度', '湿度'],
            // orient:'vertical',
            y: 'top',
            right: 40,
            top: 80,
            textStyle: {
                color: '#53b0ff'
            }
        },
        grid: {
            x: '15%',
            y: 140,
            x2: 40,
            y2: 20,
            borderWidth: 1
        },
        xAxis: [{
            type: 'category',
            name: '时间',
            boundaryGap: false,
            data: time,
            splitLine: { show: false },//去除网格线
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#53b0ff',//左边线的颜色
                    width: '1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#53b0ff',//坐标值得具体的颜色

                }
            }

        }],
        yAxis: [{
            type: 'value',
            splitLine: { show: false },//去除网格线
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#53b0ff',//左边线的颜色
                    width: '1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#53b0ff',//坐标值得具体的颜色

                }
            }
        }],
        series: [{
            type: 'line',
            name: '湿度',
            symbol: 'circle',
            symbolSize: '6',
            data: wdata,
            itemStyle: {
                normal: {
                    color: 'red',
                    lineStyle: {
                        color: 'red'
                    }
                }
            }
        }, {
            type: 'line',
            name: '温度',
            symbol: 'circle',
            symbolSize: '6',
            data: sdata,
            itemStyle: {
                normal: {
                    color: '#3bb8ff',
                    lineStyle: {
                        color: '#3bb8ff'
                    }
                }
            }
        }]
    };

    myChart3.setOption(option);
}

//档案借阅数量
// 折线图  
function archiveborrowCount() {
    var timeArr = [], countArr = [];
    app.get('countmodule/countBorrowMonth/selectBorrowMonthCount', '', function (msg) {
        var msg = msg.row;
        var date = new Date();
        date = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        $('.time').html(date);
        for (var i = 0; i < msg.length; i++) {
            timeArr.push(msg[i].time);
            countArr.push(msg[i].count);
        }
        myChart4.setOption({
            xAxis: [{
                data: timeArr
            }],
            series: [{
                data: countArr
            }]
        });
    })
}
var myChart4;
function initBorrowCount() {
    var timeArr = [], countArr = [];
    myChart4 = echarts.init(document.getElementById('archive-borrow-count'));
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        //设置表格位置
        grid: {
            x: '12%',
            y: 130,
            x2: '10%',
            y2:30,
            borderWidth: 1
        },
        xAxis: {
            type: 'category',
            name: '日期',   
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#53b0ff',//左边线的颜色
                    width: '1'//坐标线的宽度
                }
            },
            axisLabel: {
                // rotate:16,
                interval:0,
                textStyle: {
                    color: '#53b0ff',//坐标值得具体的颜色

                }
            },
            data: timeArr
        },
        yAxis: {
            type: 'value',
            name: '数量',
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#53b0ff',//左边线的颜色
                    width: '1'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#53b0ff',//坐标值得具体的颜色

                }
            },
            splitLine: {
                show: false
            },
        },
        series: {
            smooth: true,
            // symbol: "none",
            type: 'line',
            itemStyle: {
                normal: {
                    color: '#439bff',
                    label: { show: true }
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
            data: countArr
        }
    }
    myChart4.setOption(option);

}

//各类型档案排行
//柱状图
function archiveOrderajax() {
    var typeArr = [], countArr = [];
    app.get('countmodule/arcTbFileMapper/selectFileName', '', function (msg) {
        var msg = msg.rows;
        for (var i = 0; i < msg.length; i++) {
            typeArr.push(msg[i].typeName);
            countArr.push(msg[i].num);
        }
        myChart5.setOption({
            xAxis: [{
                data: typeArr
            }],
            series: [{
                data: countArr
            }]
        });
        //更新数据
        // var option = myChart5.getOption();
        // option.series[0].data = countArr;
        // option.xAxis[0].data = typeArr;
        // myChart5.setOption(option);
    })
}
var myChart5;
function initArchiveOrder() {
    var typeArr = [], countArr = [];
    myChart5 = echarts.init(document.getElementById('archive-count-order'));
    option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            x: '18%',
            y: 140,
            x2: '7%',
            y2: 40,
            borderWidth: 1
        },
        xAxis: [
            {
                type: 'category',
                name:'类型',
                data: typeArr,
                axisTick: {
                    alignWithLabel: true
                },
                splitLine: { show: false },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#53b0ff',
                        width: '1'
                    }
                },
                axisLabel: {
                    // rotate:16,
                    interval:0,
                    textStyle: {
                        color: '#53b0ff',

                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'数量',
                splitLine: { show: false },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#53b0ff',
                        width: '1'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#53b0ff',

                    }
                }
            }
        ],
        series: [
            {
                name: '档案数量',
                type: 'bar',
                barWidth: '60%',
                data: countArr,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                ['#1fa2ff', '#00eaff'],
                                ['#ff9d46', '#ffc446'],
                                ['#008aff', '#00d2ff'],
                                ['#ff4646', '#ffa646'],
                                ['#1fa2ff', '#00eaff'],
                                ['#ff9d46', '#ffc446'],
                                ['#008aff', '#00d2ff']
                            ];

                            var index = params.dataIndex;
                            if (params.dataIndex >= colorList.length) {
                                index = params.dataIndex - colorList.length;
                            }

                            return new echarts.graphic.LinearGradient(0, 0, 0, 1,
                                [
                                    { offset: 0, color: colorList[index][0] },
                                    { offset: 1, color: colorList[index][1] }
                                ]);
                        },
                        label: { show: true },
                        barBorderRadius: [30, 30, 0, 0] //柱状角成椭圆形
                    },
                }
            }
        ]
    };
    myChart5.setOption(option);
}
window.onresize = function(){
    myChart2.resize();
    myChart3.resize();
    myChart4.resize();
    myChart5.resize();
}