/**
 * @author yuqi
 * @description 库房环境
 */
//调用画折现图的函数，循环判断画多少个
var currtime = new Date()
currtime = currtime
  .toLocaleString('chinese', {
    hour12: false
  })
  .substring(10, 20)
// 异步加载数据
layui.use('layer', function() {
  var layer = layui.layer
  var index = layer.load(1, {
    shade: [0.1, '#fff'] //0.1透明度的白色背景
  })
})
app.get('storeroommodule/StoTbStore/selectOneDay', '', function(res) {
  console.log(res)
  var temperatureArray = [],
    humidityArray = [],
    data = res.rows,
    container = $('#environmental_information_chart')
  for (var i in data) {
    var historyList = data[i].historyList
    console.log(data[i].storeName)
    for (var j in historyList) {
      temperatureArray.push(historyList[j].wd)
      humidityArray.push(historyList[j].sd)
    }
    container.append('<div class="storageroom" id="' + data[i].id + '"></div>')
    DrawChart(data[i].id, temperatureArray, humidityArray, data[i].storeName)

    humidityArray.length === 0
    temperatureArray.length === 0
  }
})

// 绘制折线图
function DrawChart(id, temperatureArray, humidityArray, storeName) {
  // console.log(id);
  var myChart = echarts.init(document.getElementById(id))
  // 指定图表的配置项和数据
  var option = {
    title: {
      x: 'left',
      text: storeName,
      textStyle: {
        color: '#333333',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 16
      },
      subtext: currtime,
      subtextStyle: {
        color: '#999999',
        fontStyle: 'normal',
        fontSize: 12
      },
      // itemGap:-15,
      padding: [15, 15]
    },
    // animation: false,   //控制动画
    tooltip: {
      //放到圆点上显示名字和数据
      trigger: 'axis'
    },
    legend: {
      //图例组件
      data: ['温度（℃）', '湿度（%rh）'],
      x: 'right', //图例靠右
      padding: [15, 15]
    },
    grid: {
      //设置折线图距离容器的距离
      left: '10%',
      right: '10%',
      bottom: '10%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false, //不从0开始
      axisLabel: {
        //坐标轴下方文字的颜色
        show: true,
        textStyle: {
          color: '#999999',
          fontSize: '12'
        }
      },
      axisLine: {
        //坐标轴线的颜色
        lineStyle: {
          color: '#999999'
        }
      },
      axisTick: {
        //去掉刻度
        show: false
      },
      data: [
        '00:00',
        '03:00',
        '06:00',
        '09:00',
        '12:00',
        '15:00',
        '18:00',
        '21:00',
        '24:00'
      ]
    },
    yAxis: {
      type: 'value',
      // scale:true,
      splitLine: {
        //去掉y轴上的分割线
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#999999',
          fontSize: '12'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#999999'
        }
      },
      axisTick: {
        show: false
      },
      data: ['20', '40', '60', '80', '100']
    },
    series: [
      {
        name: '温度（℃）',
        type: 'line',
        data: temperatureArray,
        color: '#ffba00',
        smooth: true, //光滑的曲线
        symbol: 'circle', //线上的圆为实心
        symbolSize: 7 //线上圆的大小
      },
      {
        name: '湿度（%rh）',
        type: 'line',
        data: humidityArray,
        color: '#3a97ff',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7
      }
    ]
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
  // myChart.setOption({
  //     series: [{
  //         // 根据名字对应到相应的系列
  //         name: '温度（℃）',
  //         data: temperatureArray
  //     },{
  //         // 根据名字对应到相应的系列
  //         name: '湿度（%rh）',
  //         data: humidityArray
  //     }]
  // });
}

//获取当前时间
function getLocalTime() {
  var nowTime = new Date()
  nowTime = nowTime
    .toLocaleString('chinese', {
      hour12: false
    })
    .substring(10, 20)
  return nowTime
}
