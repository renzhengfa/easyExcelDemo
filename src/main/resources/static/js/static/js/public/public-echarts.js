(function (app, $, myecharts) {
    myecharts.bar = function (id, text, datalabels, dataseries) {
        var barid = document.getElementById(id);
        if (barid) {
            var myChart = echarts.init(barid);
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '6%',
                    left: '0',
                    right: '0',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0,
                        color: '#666666'
                        // rotate: -60,
                        // formatter:function(val){
                        //     return val.split("").join("\n");
                        // }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#3a97ff',
                            width: 1
                        }
                    },
                    data: datalabels
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#3a97ff',
                            width: 1
                        }
                    }
                },
                series: dataseries //json数组
            };
            myChart.setOption(option);
            return myChart;
        }
    };
    myecharts.pie = function (id, text, datalabels, dataseries, datalegend) {
        var pieid = document.getElementById(id);
        if (pieid) {
            var myChart = echarts.init(pieid);
            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                    position: [10, 10]
                },
                // visualMap: {
                //   show: false,
                //   min: 80,
                //   max: 600,
                //   inRange: {
                //     colorLightness: [0, 1]
                //   }
                // },
                legend: datalegend,
                series: dataseries
            };
            myChart.setOption(option);
            return myChart;
        }
    };
    myecharts.piegua = function (id, text, datalabels, dataseries) {
        var pieguaid = document.getElementById(id);
        if (pieguaid) {
            var myChart = echarts.init(pieguaid);
            optionRefresh = {
                tooltip: {
                    trigger: 'item',
                    show: false
                },

                series: dataseries
            };
            myChart.setOption(optionRefresh);
            return myChart;
        }
    };
    myecharts.line = function (id, text, datalegend, datalabels, dataseries, xtype) {
        var lineid = document.getElementById(id);
        if (lineid) {
            var myChart;
            if (myChart != null && myChart != "" && myChart != undefined) {
                myChart.dispose();
            }
            myChart = echarts.init(lineid);
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
                legend: {
                    data: datalegend
                },

                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    name: xtype,
                    boundaryGap: false,
                    data: datalabels
                },
                yAxis: {
                    type: 'value',
                    name: text,
                    splitLine: {
                        show: false
                    }
                },
                series: dataseries
            };
            myChart.setOption(option);
            return myChart;
        }
    }
})(app, $, (window.myecharts = {}));
