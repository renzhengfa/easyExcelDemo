$(function (mytable) {
    layui.use(["form", "element", "layer", "table", "laydate"], function () {
        var element = layui.element,
            layer = layui.layer,
            form = layui.form,
            laydate = layui.laydate,
            table = layui.table;
        // 初始为当年
        selTime = { code: 0, time: new Date().getFullYear() + "" };
        getMenuBar();//自定义面包屑      
        laydate.render({
            elem: '#timeByyear',
            type: 'year',
            theme: 'blue',
            max: 0,
            value: new Date().getFullYear(),
            done: function (value, date, endDate) {
                selTime = { code: 0, time: value };
                getSatisticData(selTime);
            }
        })
      var start,end;
      start = laydate.render({
            elem: '#timeBymonth1',
            type: 'month',
            format: 'yyyy-MM',
            theme: 'blue',
            max: 0,
            // value: (new Date()).toLocaleDateString().split('/').join('-'),
            done: function (value, date, endDate) { 
                end.config.min = {
                    year: date.year,
                    month: date.month - 1, //关键 
                }
                selTime = { code: 1, time: value,lastTime:$('#timeBymonth2').val()};
                getSatisticData(selTime);
            }
        })
        end = laydate.render({
            elem: '#timeBymonth2',
            type: 'month',
            format: 'yyyy-MM',
            theme: 'blue',
            max: 0,
            // value: (new Date()).toLocaleDateString().split('/').join('-'),
            done: function (value, date, endDate) {
                if (value === '' || value === null) {
                    var nowDate = new Date();
                    start.config.max = {
                        year: nowDate.getFullYear(),
                        month: nowDate.getMonth()
                    };
                    return
                }
                start.config.max = {
                    year: date.year,
                    month: date.month - 1, //关键 
                }

                selTime = { code: 1, time: $('#timeBymonth1').val(), lastTime:value };
                getSatisticData(selTime);
            }
        })

        form.on('select(time_type)', function (data) {
            if (data.value == 'year') {
                $('#type_month').hide();
                $('#type_year').show();
                selTime = { code: 0, time: $('#timeByyear').val() };
                getSatisticData(selTime);
            } else {
                $('#type_year').hide();
                $('#type_month').show();
                selTime = { code: 1, time: $('#timeBymonth1').val(),lastTime:$('#timeBymonth2').val() };
                getSatisticData(selTime);
            }
        })
        // 获取初始值值 
        getSatisticData(selTime);

        // // 数值增长
        // var items = document.getElementsByClassName('countRunning');
        // for (var i = 0; i < items.length; i++) {
        //     (function (arg) {
        //         var timer = null;
        //         const targetDomCount = items[arg].getAttribute('data-target')
        //         let nowCount = parseInt(items[arg].innerHTML);
        //         timer = setInterval(() => {
        //             if (nowCount < targetDomCount) {
        //                 nowCount++;
        //             } else {
        //                 clearInterval(timer);
        //                 timer = null;
        //             }
        //             items[arg].innerHTML = nowCount;
        //         }, 20)
        //     })(i);
        // }
        $('#get_Excel').click(()=>{
			// 先检测数据再提交啊
			console.log(selTime.code,selTime,'无数据的格式判断')
			var downloadUrl = "countmodule/arcTbFileMapper/importFileCountExcel?code="
			if(selTime.code==1){
				if(selTime.time){
					document.location.href = baseurl + downloadUrl +selTime.code+"&time="+selTime.time+"&lastTime="+selTime.lastTime;
				}else{
					layui.use('layer', function(){
					  var layer = layui.layer;
					  
					  layer.msg('请先选择具体时间再进行导出操作');
					}); 
				}
			}else{
				document.location.href = baseurl + downloadUrl + selTime.code+"&time="+selTime.time+"&lastTime="+selTime.lastTime;
			}
            
       })

    });
}(mytable));
function getSatisticData(time) {
    getArchivePercent(time);
    // 借阅前10排行
    initTable(time);

    // 档案状态数量统计
    initarchiveStatusCount();
    archiveStatusCountajax();
}

function getArchivePercent(selTime) {
    var dataArr = [];
    app.get("countmodule/arcTbFileMapper/getArchivesCount", selTime, function (msg) {
        if (msg.state) {
            // console.log(msg);
            var data = msg.row;
            
            // 新增、销毁
            // var addPer = ((data.newArchives * 100) / (data.allArchives)).toFixed(2) + "%";
            // var desPer = ((data.destoryArchives * 100) / (data.allArchives)).toFixed(2) + "%";
            // 上架、下架
            var rfPer = ((data.rfArchives * 100) / (data.rfTotalCount)).toFixed(2) + "%";
            var notsPer = ((data.notsArchives * 100) / (data.notsTotalCount)).toFixed(2) + "%";

            var lendPer = ((data.lendArchives * 100) / (data.lendArchivesCount)).toFixed(2) + "%";
            var returnPer = ((data.returnArchives * 100) / (data.returnArchives + data.notReturnArchives)).toFixed(2) + "%";
            // 新增、销毁
            // addPer = data.allArchives == 0 ? 0.00 : addPer;
            // desPer = data.allArchives == 0 ? 0.00 : desPer;
             // 上架、下架
            rfPer = data.rfTotalCount == 0 ? 0.00 : rfPer;
            notsPer = data.notsTotalCount == 0 ? 0.00 : notsPer;

            lendPer = data.lendArchivesCount == 0 ? 0.00 : lendPer;
            returnPer = (data.returnArchives + data.notReturnArchives) == 0 ? 0.00 : returnPer;

            // dataArr = [{ data: data.newArchives, dataPer: addPer, count: data.allArchives, img: '../../static/images/statistics/update.png', title: '新增档案', titleCount: '档案总数', color: '#3A97FF' },
            // { data: data.destoryArchives, dataPer: desPer, count: data.allArchives, img: '../../static/images/statistics/destory.png', title: '销毁档案', titleCount: '档案总数', color: '#FFAE3A' },
            // { data: data.lendArchives, dataPer: lendPer, count: data.lendArchivesCount, img: '../../static/images/statistics/borrow.png', title: '已借出档案', titleCount: '已借出档案总数', color: '#00E390' },
            // { data: data.returnArchives, dataPer: returnPer, count: data.returnArchives + data.notReturnArchives, img: '../../static/images/statistics/return.png', title: '归还档案', titleCount: '未归还档案总数', color: '#E3D600' }];
           
            dataArr = [{ data: data.rfArchives, dataPer: rfPer, count: data.rfTotalCount, img: '../../static/images/statistics/rf.png', title: '上架档案', titleCount: '上架档案总数', color: '#3A97FF' },
            { data: data.notsArchives, dataPer: notsPer, count: data.notsTotalCount, img: '../../static/images/statistics/nots.png', title: '下架档案', titleCount: '下架档案总数', color: '#FFAE3A' },
            { data: data.lendArchives, dataPer: lendPer, count: data.lendArchivesCount, img: '../../static/images/statistics/borrow.png', title: '已借出档案', titleCount: '已借出档案总数', color: '#00E390' },
            { data: data.returnArchives, dataPer: returnPer, count: data.returnArchives + data.notReturnArchives, img: '../../static/images/statistics/return.png', title: '归还档案', titleCount: '未归还档案总数', color: '#E3D600' }];
           
            var html = '';
            var i = 0;
            for (var item of dataArr) {
                i++;
                html += ` <div class="layui-col-xs3 layui-col-lg3 ">
                    <section class="box-item">
                        <div class="layui-row">
                            <div class="layui-col-xs5" style="padding: 30px 20px;">
                                <div class="logo">
                                    <img src="${item.img}" alt="">
                                </div>
                                <span class="left-title" style="color: ${item.color}; ">${item.title}</span>
                            </div>
                            <div class="layui-col-xs7" style="padding: 20px; ">
                                <p class="right-today-count countRunning" style="color: ${item.color}" data-target='${item.data}'>${item.data}</p>
                                <p class="right-today-percent ">${item.dataPer}</p>
                                <div class="layui-progress layui-progress-big" lay-filter="demo${i}">
                                    <div class="layui-progress-bar layui-bg${i}" lay-percent="${item.dataPer}"></div>
                                </div>
                                <div class="right-all-count" style="background: ${item.color};">${item.titleCount}  ${item.count}</div>
                            </div>
                        </div>
                    </section>
                </div>`
            }
            $('.top-content').html(html);
            layui.use(['element'], function () {
                var element = layui.element;
                var i = 0;
                for (let item of dataArr) {
                    i++;
                    element.progress("demo" + i, item.dataPer);
                }
            });
        }
    })
};

function initTable(selTime) {
    app.get("countmodule/countBorrowMonth/borrowRank", selTime, function (msg) {
        if (msg.state) {
            $('#borrowOrder10').empty();
            var html = `<tr>
            <th>名次</th>
            <th>档案名字</th>
            <th>档案所属类型</th>
            <th>档案热度值</th>
            </tr> `;
            if (msg.row.length > 0) {
                console.log(msg.row)
                var i = 0;
                for (var item of msg.row) {
                    item.hot = item.count - item.lastCount;
                    i++;
                    item.indexColor = i <= 3 ? '#FF3600' : '';
                    html += `  <tr>
                    <td style="width: 160px;color:${item.indexColor}">${i}</td>
                    <td>${item.fkFileName}</td>
                    <td>${item.typeName}</td>
                    <td>`;
                    if (item.hot > 0) {
                        html += `<img src="../../static/images/statistics/up.png" alt="">
                        <span>${item.hot}</span>
                    </td>
                </tr>`;
                    } else {
                        var hot = Math.abs(item.hot);
                        html += `<img src="../../static/images/statistics/down.png" alt="">
                            <span>${hot}</span>
                        </td>
                    </tr>`;
                    }
                }
            } else {
                html = `<div style="line-height: 320px;text-align:center;" >暂无数据！</div>`;
            }
            $('#borrowOrder10').append(html);
        }
    })
};
var myChart2;
function archiveStatusCountajax() {
    statusArr = ['在架', '未在架', '待取', '借出', '移交', '销毁', '遗失', '待归档', '归档中',
        '移交中', '销毁中'];
    arichdataArr = [];
    var statuscode = ['rf', 'nots', 'tbt', 'lend', 'trans', 'dest', 'loss', 'tba', 'ita',
        'hand', 'destr'];
    var stateCountArr = [];
    for (var item of statuscode) {
        var obj = { state: item, count: 0 };
        stateCountArr.push(obj);
    }
    app.get("countmodule/arcTbFileMapper/selectCountByState", selTime, function (msg) {
        if (msg.state) {
            for (var item of stateCountArr) {
                for (var itemR of msg.row) {
                    if (item.state == itemR.state) {
                        item.count = itemR.count;
                    }
                }
                arichdataArr.push(item.count);
            }
        } else {
            for (var item of stateCountArr) {
                arichdataArr.push(0);
            }
        }
        console.log(arichdataArr);
        myChart2.setOption({
            xAxis: [{
                data: statusArr
            }],
            series: [{
                data: arichdataArr
            }]
        });
    })

};
function initarchiveStatusCount() {
    statusArr = [];
    arichdataArr = [];
    myChart2 = echarts.init(document.getElementById('archiveStatusCount'));
    option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow' 
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            top: '3%',
            bottom: '12%',
            containLabel: true
        },

        xAxis: [
            {
                type: 'category',
                data: statusArr,
                axisTick: {
                    show: false
                },
                splitLine: { show: false },//去除网格线

                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#cfcfcf',//左边线的颜色
                        width: '0'//坐标线的宽度
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#cfcfcf',//坐标值得具体的颜色

                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单位：件',
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: ['#002165'],
                        width: 1,
                        type: 'solid'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#cfcfcf',//左边线的颜色
                        width: '0'//坐标线的宽度
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#cfcfcf',//坐标值得具体的颜色

                    }
                }
            }
        ],
        series: [
            {
                name: '档案数量',
                type: 'bar',
                barWidth: '40%',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = ['#3A97FF', '#A1CDFF',
                                '#3A97FF', '#A1CDFF',
                                '#3A97FF', '#A1CDFF',
                                '#3A97FF', '#A1CDFF',
                                '#3A97FF', '#A1CDFF'];
                            return colorList[params.dataIndex]
                        },
                        label: {
                            show: true,		//开启显示
                            position: 'top',	//在上方显示
                            textStyle: {	    //数值样式
                                color: '#cfcfcf',
                                fontSize: 12
                            }
                        },
                        barBorderRadius: [40, 40, 0, 0] //柱状角成椭圆形
                    },
                },
                data: arichdataArr
            }
        ]
    };
    myChart2.setOption(option);
};
window.onresize = function () {
    myChart2.resize();
}
