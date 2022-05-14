/**
 * @description 监测统计
 * @author tangli
 */

// 初始化table
var form,
    data_type=0; 
$(function () {
    layui.use(['form', 'laydate' ], function () {
        form = layui.form; // form表单 
        getMenuBar(); //自定义面包屑，引用public-menu.js
        // 时间控件初始化
        mybtn.date('#date_picker1', '#date_picker2'); 
        getSelectData(); 
        // 折现图、柱状图
        initHisMonitorLine();    
        window.onresize = function () {
            myChart.resize();
        }
        $('#query').on('click', function () {     
            $('.time_type_year').addClass('active_btn').siblings().removeClass('active_btn');   
            if($('#warehouse').val()){
                query();
            }else{
                layer.msg('请选择库房');
                return;
            } 
        })    
        // 数据查询切换
        form.on('select(data_type)', function (data) { 
            $('.time_type_year').addClass('active_btn').siblings().removeClass('active_btn');
            data_type=data.value;
            query();  
        })
        // 年月日切换
        $('.time_type').on('click', function () {  
            var type=$(this).data('type'); 
            $(this).addClass('active_btn').siblings().removeClass('active_btn'); 
            query(type); 
        })   
        form.render();
    })
}());

// 下拉框赋值的方法  bool是否添加“请选择”选项
function addSelect(id, data, bool, val, text) {

    val = val || 'type';
    text = text || 'name';
    var html = '';
    var $id = $('#' + id);
    $id.html(''); 
    for (var i in data) {
        html += '<option value="' + data[i][val] + '">' + data[i][text] + '</option>';
    }
    $id.html(html);
    form.render();
}
// 初始化库房下拉框
function getSelectData() { 
    app.get('environmentmodule/wkStoTbStore/selectWkStoTbStore', null, function (msg) {
        var warehouse = msg.rows;
        if (msg.state) {
            addSelect('warehouse', warehouse, true, 'id', 'storeName');  
            query(); 
        }
    })
} 
  var myChart,
      wdata=[],
      sdata = [],
      tvocdata = [],
      timedata = [], 
      cjqArr=[],
      ser=[]; // 采集器
// 条件查询 
function query(time_type) {  
    let startTime = $('#date_picker1').val();
    let endTime = $('#date_picker2').val();
    let fkStoreId = $('#warehouse').val(); 
    startTime=startTime?startTime:endTime;
    endTime=endTime?endTime:startTime;
    if(!startTime && !endTime){
        startTime=endTime=new Date().toLocaleDateString().replace(/\//g, '-');
    } 
    let timeType=time_type?time_type:0;
    var info = {
        startTime,
        endTime,
        fkStoreId, 
        timeType,
    };
    getHisData(info);
} 
function getHisData(info) { 
    wdata=[],
    sdata = [],
    tvocdata = [],
    timedata = [], 
    cjqArr=[], // 采集器
    ser=[];
    var option=myChart.getOption();   
    app.get('environmentmodule/wkTbEquAirDataHistory/selectEquDateReport', info , function (msg) {  
        if(msg.state && msg.row && msg.rows){
            timedata=msg.rows;
            for(let item in msg.row){
                cjqArr.push(item); 
            }  
           var i=0,
               res=msg.row;
            for(var key in res){ 
                i++;
                var wdArr=[],sdArr=[],tvocArr=[];
                for(let k in res[key]){
                    var data=res[key][k];  
                    if(data){
                        if(data.wd){
                            wdArr.push(data.wd.toFixed(2));  
                        }else{
                            wdArr.push(0);  
                        }

                        if(data.sd){
                            sdArr.push(data.sd.toFixed(2));  
                        }else{
                            sdArr.push(0);  
                        }

                        if(data.tvoc){
                            tvocArr.push(data.tvoc.toFixed(2));  
                        }else{
                            tvocArr.push(0);  
                        }   
                    }else{
                        wdArr.push(0); 
                        sdArr.push(0); 
                        tvocArr.push(0); 
                    }
                    wdata[i-1]=wdArr;
                    sdata[i-1]=sdArr;
                    tvocdata[i-1]=tvocArr; 
                }            
            } 
            var ser=[],
                symboltype=['pin','circle','diamond'],
                itemcolor=['#3a97ff','#ffe63a','#d247ff']; 
            for(var i in cjqArr){
                var len=itemcolor.length;
                var k=i%len,
                    data_type_arr=[]; 
                    if(data_type==0){
                        data_type_arr=wdata[i];
                    }
                    if(data_type==1){
                        data_type_arr=sdata[i];
                    }
                    if(data_type==2){
                        data_type_arr=tvocdata[i];
                    }  
                var obj={
                    name:cjqArr[i],
                    type:'line',
                    symbol:symboltype[k],
                    symbolSize:10,
                    data:data_type_arr,
                    itemStyle: {
                    normal: {
                        color: itemcolor[k], //自定义折线点颜色
                        lineStyle: {
                            color: itemcolor[k]
                        }
                    }
                   }, 
                };
                ser.push(obj); 
            } 
        }
        if(!msg.state){
           layer.msg(msg.msg); 
        } 
        option.legend={
            data:cjqArr,
            orient: 'vertical',
            width: 100,
            x:'94%',
            y:'center',
            right:20, 
        };  
        option.xAxis={
            data:timedata,
            axisLabel: { 
                textStyle: {
                    color: '#53b0ff',//坐标值得具体的颜色 
                },
                formatter: function(value, index) {
                    if(value.indexOf(' ')!=-1){
                       value=value+':00'; 
                        return value.replace(' ', '\n') 
                    }else{
                        return value;
                    }  
                }
            },
        }; 
        option.series=ser;  
        myChart.setOption(option,true);  
    })
}
 
function initHisMonitorLine() {  
    myChart = echarts.init(document.getElementById("monitor_statistics_line"));
    var option = {
        animation: true, //控制当前的点击滑动时节点是否放大
        title: {
            text: '环境监测数据图', 
            x: 'center',
            y:50,
            align: 'right', 
            textStyle: {
                fontSize: 18,
                fontWeight: 400,
                color:'#000'
            }
        },  
        toolbox: {
            show: true,
            x:'90%',
            y:'top',
            feature: {
                 dataZoom: {
                     yAxisIndex: 'none' //区域缩放，区域缩放还原
                 },  
                 magicType: {
                     type: ['line', 'bar'] //切换为折线图，切换为柱状图
                 },  
                 restore: {},  //还原
                 saveAsImage: {}   //保存为图片
            },
            iconStyle:{
                normal:{
                  color:'#ccc',//设置颜色
                }
            }
        }, 
        legend: {},
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            }
        },
        grid: {
            top: '14%',
            left: '8%', //设置Y轴name距离左边容器的位置,类似于margin-left
            right: '8%',
            bottom: '2%',
            containLabel: true
        }, 
        dataZoom: [{ //Y轴固定,让内容滚动
                type: 'slider',
                show: false,
                xAxisIndex: [0],
                start: 1,
                end: 100, //设置X轴刻度之间的间隔
                zoomLock: true, //锁定区域禁止缩放
            },
            {
                type: 'inside',
                xAxisIndex: [0],
                start: 1,
                end: 30,
                zoomLock: true, //锁定区域禁止缩放
            },

        ],
        xAxis: [{
            data: {}, //X轴数据(该数组的第一个数据为'' 可以让原点数据为0)
            boundaryGap: false, //两边是否留白 
            axisTick: {
                inside: true,
                lignWithLabel: true //这两行代码可以让刻度正对刻度名
            }, 
            splitLine: {
                show: false
            }, //去掉网格线 
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#ccc',//左边线的颜色
                    width: '1'//坐标线的宽度
                }
            },
            axisPointer: {
                lineStyle: {
                    width: 0 //隐藏指示线的线条
                },
                show: true,
                snap: true,
                status: 'show'
            },  
        }],
        yAxis: {
            name: '', //Y轴名字
            nameGap: 20, //刻度与Y轴线名字之间的距离
            nameTextStyle: { //Y轴名字的样式
                color: '#000',
                fontSize: 14
            }, 
            splitLine: {
                show: true
            }, //去掉网格线 
            axisTick: {  
                show: false,
                inside: false //改变刻度的朝向
            },
            axisLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#53b0ff',//左边线的颜色
                    width: '0'//坐标线的宽度
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#53b0ff',//坐标值得具体的颜色 
                }
            }
        },
        series: []
    }
    myChart.setOption(option);
}
 