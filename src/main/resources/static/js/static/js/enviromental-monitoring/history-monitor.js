/**
 * @description 历史监测
 * @author chentong
 * update---tangli
 */

var info = {
  starttime:'',
  endtime:'',
  warehouse:'',
  monitoring_point:''
};

var myDate = new Date();
// 初始化table
var form;
$(function(mytable) {
    getSelectData();
    layui.use(['table', 'form', 'laydate'], function() {
      var table = layui.table;
      form = layui.form; // form表单
        getMenuBar();//自定义面包屑，引用public-menu.js
      // 时间控件初始化
      mybtn.date('#date_picker1','#date_picker2');
        //导出
        $('#export').on('click', function() {
          if ((!$('#warehouse').val())||(!$('#monitoring_point').val())) {
            layer.msg('请选择库房和监测点');
            return;
          }
         
          info.warehouse = $('#warehouse').val();
          info.monitoring_point = $('#monitoring_point').val();
          //  console.log(info);
            window.location.href= window.baseurl +
            'environmentmodule/wkTbEquAirDataHistory/selectEquDateHistoryExcel?fkStoreId=' +
            info.warehouse +
            '&fkEquNum=' +
            info.monitoring_point +
            '&startTime=' +
            info.starttime +
            '&endTime=' +
            info.endtime +
            '&map[flag]=1';
      });
      getSelectData();
      get_monitoring_point();
      mytableinit('');
      query(table);
      // allExport();
      // pageExport();
    })
  }(mytable));
// 表格初始化
function mytableinit(data){
  mytable.init({
    id: 'history_monitor_content_table',
    url:
      'environmentmodule/wkTbEquAirDataHistory/selectEquDateHistory?fkEquNum=0',
    pageCode: 'equdatehistory',
    data: {}
  })
}
// 下拉框赋值的方法
function addSelect(id, data, bool, val, text) {
  //bool是否添加“请选择”选项
  val = val || 'type';
  text = text || 'name';
  var html = '';
  var $id = $('#' + id);
  $id.html('');
  if (bool) {
    html += '<option value="" selected>全部</option>'
  }
  for (var i in data) {
    html +=
      '<option value="' + data[i][val] + '">' + data[i][text] + '</option>'
  }
  $id.html(html);
  form.render();
}
// 初始化库房下拉框
function getSelectData() {
  var data = {};
  app.get('environmentmodule/wkStoTbStore/selectWkStoTbStore', data, function(msg) {
   var warehouse = msg.rows;
    if (msg.state) {
      addSelect('warehouse', warehouse, true, 'id', 'storeName')
    }
  })
}
   // 初始化监测点下拉框
function get_monitoring_point(){
   form.on('select(warehouse)', function(data) {
    var fkStoreId = $('#warehouse').val();
    if (!fkStoreId) {
      layui.layer.msg('请先选择库房');
    }
    app.get('environment/equipment/selectEquipmentOfCjq?fkStoreId=' + fkStoreId, '', function(msg) {
       var  MonitoringPoint = msg.rows;
       if (msg.state) {
        addSelect('monitoring_point', MonitoringPoint,true,'equNum','equName')
      }else{
        addSelect('monitoring_point',[],false,'equNum','equName')
      }   
      form.render();
    }
  )
})
}

// 条件查询
function query(table) {
  $('#query').on('click', function() {
    if ((!$('#warehouse').val())||(!$('#monitoring_point').val())) {
      layer.msg('请选择库房和监测点');
      mytableinit('');
      return;
    } 
    var data = {};
    data.starttime =  $('#date_picker1').val();
    data.endtime= $('#date_picker2').val();
    data.warehouse = $('#warehouse').val();
    data.monitoring_point = $('#monitoring_point').val();
    info=data;
    table.reload('history_monitor_content_table', {
      url:
        baseurl +
        'environmentmodule/wkTbEquAirDataHistory/selectEquDateHistory?fkStoreId=' +
        data.warehouse +
        '&fkEquNum=' +
        data.monitoring_point +
        '&startTime=' +
        data.starttime +
        '&endTime=' +
        data.endtime +
        '',
        page:{curr:1}
    })
  })
}

// 打印
// function allExport() {
//   $('#exportAll').on('click', function() {
//     if ($('#warehouse').val() == ''||$('#monitoring_point').val() == '') {
//       layer.msg('请选择库房并且选择监测点')
//       return
//     }
//     var currentPage = $('.layui-laypage-skip .layui-input').val()
//     if (!currentPage) {
//       layer.msg('暂无数据，无法打印')
//       return
//     } else {
//       $('#dayin').jqprint()
//     }
//     // $("#printContainer").jqprint({
//     //   debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
//     //   importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
//     //   printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
//     //   operaSupport: true //表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
//     // });
//   })
// }

