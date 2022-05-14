/**
 * @author chentong
 * @description 仓库信息历史记录
 * @mender liuyuru
 */
var form;
var info={
  select_warehouse:'',
  select_area:'',
  startTime:'',
  endTime:''
};
$(function (mytable) {
    let data = {};
    app.get("environmentmodule/wkStoTbStore/selectWkStoTbStore", data, function (msg) {
      selDate.area = msg.rows;
    });
    layui.use(["form", "table", "laydate"], function () {
      var table = layui.table;
      var laydate = layui.laydate;
      form = layui.form;
      var $ = layui.jquery;
        getMenuBar();//自定义面包屑，引用public-menu.js
      mytable.init({
        id: "environment-historical-records-table-content",
        url: "storeroommodule/stoTbEnvHistory/selectStoTbEnvHistory",
        pageCode: "history",
        data: {}
      });

      queryHistoricalRecords(table);
      // exportHistoricalRecords();

      //导出
      form.on('select(output)', function (data) {
        if(data.value === "1"){
            document.location.href =
      baseurl +
      "storeroommodule/stoTbEnvHistory/selectHistory?map[fkStoreId]=" +
      info.select_warehouse +
      "&map[fkRegionId]=" +
      info.select_area +
      "&map[starttime]=" +
      info.startTime +
      "&map[endtime]=" +
      info.endTime +
      '&map[flag]=1';
        }else if(data.value === "0"){
          document.location.href =
          baseurl +
          "storeroommodule/stoTbEnvHistory/selectHistory?map[fkStoreId]=" +
          info.select_warehouse +
          "&map[fkRegionId]=" +
          info.select_area +
          "&map[starttime]=" +
          info.startTime +
          "&map[endtime]=" +
          info.endTime +
          '&map[flag]=0&currentPage=' + curr + '&pageSize=' + pagesize;
        }
      });


      // 一级联动事件触发
      form.on("select(test)", function (data) {
        var value = data.value;
        areaState.area.fn(value);
      });
      var areaState = {
        area: {
          state: false,
          data: [],
          fn: function (value) {
            // value 表示的是区域代码，及传到后台的数据
            this.state = true;

            var data = {
              fkStoreId: value
            };
            app.get("storeroommodule/stoTbRegion/selectByBind", data, function (msg) {
              areaState.area.data = msg.rows;
              if (value !== "") {
                addSelect(
                  "select_area",
                  areaState.area.data,
                  true,
                  "id",
                  "regionName"
                );
              } else {
                $("#select_area").html("");
                form.render("select");
              }
            });
          }
        }
      };
        getStoreName();
        mybtn.date('#date_picker1','#date_picker2');
    });
  }(mytable));
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
            $("#select_warehouse").html(str1 + str);
            form.render();
        } else {
            layer.msg(msg.msg);
        }
    });
}
// 获取当前时间
function getNowFormatDate() {
  var date = new Date();
  var mydate = date.getDate();
  if (date.getDate() < 10) {
    mydate = "0" + date.getDate(); //补齐
  }
  var d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + mydate;
  return d;
}
window.start_time = "";
window.stop_time = "";
// var myDate = new Date();
// 初始化时间控件
function getDate() {
  let [form, laydate] = ["", ""];
  var now = new Date();
  var start = now.getTime(); // 将当前时间转换为时间戳
  layui.use(["form", "laydate"], function () {
    form = layui.form;
    laydate = layui.laydate;
    laydate.render({
      elem: "#start_time",
      theme: "blue",
      // value: start_time,
      type: "date", // 可选择年、月、日、时、分、秒
      // min: start, // 规定最小日期
      done: function (value) {
        // value为第一个日期选择框选择的日期
        const start2 = new Date(value).getTime();
        const end = start2 + 24 * 60 * 60 * 1000 * 30;
        const elemId = "endTime" + new Date().getTime();
        // 当第一个日期选择框选择完日期后，将类选择器endTime里的内容清空，给它重新添加内容，且新添加元素的id是动态改变的，这样第二个日期框在第一个日期框每次选择完后会重新渲染
        $(".endTime")
          .empty()
          .append(
            `<input placeholder="请选择结束时间"  readonly="readonly" type="text" class="layui-input myinput" id="${elemId}">`
          );
        laydate.render({
          elem: `#${elemId}`,
          type: "date",
          theme: "blue",
          value: value,
          min: start2, // 最小日期不得小于第一个日期选择框的值
          // max: end, // 最大日期在24小时内
          done: function (value) {
            stop_time = value;
          }
        });
      }
    });
    laydate.render({
      elem: "#stop_time",
      type: "date",
      theme: "blue"
      // value: stop_time
    });
  });
}
// 两级联动
let selDate = {
  area: [],
  street: []
};
window.select_warehouse = "";
window.select_area = "";
// 判断查询条件是否为空
function judgeDataNull(params) {
  for (var key in params) {
    x;
    if (params[key] != "0" && !params[key]) {
      layer.msg("您还有未选择的选项，请检查后重试!");
      return false; // 终止程序
    }
  }
  return true;
}
// 查询
function queryHistoricalRecords(table) {
  $("#historical_records_query").on("click", function () {
    var st = $('input[name="starttime"]').val();
    var endtime = $('input[name="endtime"]').val();

    var data = {};
    data.startTime = $("#date_picker1").val() || "";
    data.endTime = $("#date_picker2").val() || "";
    data.select_warehouse = $("#select_warehouse").val();
    data.select_area = $("#select_area").val();
    info=data;
    if (data.select_warehouse == '') {
      data.select_area = ""
    }
    info = data;
    table.reload("environment-historical-records-table-content", {
      url:
        baseurl +
        "storeroommodule/stoTbEnvHistory/selectStoTbEnvHistory?map[fkStoreId]=" +
        data.select_warehouse +
        "&map[fkRegionId]=" +
        data.select_area +
        "&map[starttime]=" +
        st +
        "&map[endtime]=" +
        endtime +
        "",
        page:{curr:1}
    });
  });
}
// 导出
// function exportHistoricalRecords() {
//   $("#historical_records_export").on("click", function () {
//     var st = $('input[name="starttime"]').val();
//     var endtime = $('input[name="endtime"]').val();
//     var data = {};
//     data.startTime = $("#start_time").val() || "";
//     data.endTime = stop_time;
//     data.select_warehouse = $("#select_warehouse").val();
//     data.select_area = $("#select_area").val();
//     if (data.select_warehouse == '') {
//       data.select_area = ""
//     }
//     document.location.href =
//       baseurl +
//       "storeroommodule/stoTbEnvHistory/selectHistory?map[fkStoreId]=" +
//       data.select_warehouse +
//       "&map[fkRegionId]=" +
//       data.select_area +
//       "&map[starttime]=" +
//       st +
//       "&map[endtime]=" +
//       endtime +
//       ""
//   });
// }
// select添加选项
function addSelect(id, data, bool, val, text) {
  //bool是否添加“请选择”选项
  val = val || "type";
  text = text || "name";
  var html = "";
  var $id = $("#" + id);
  $id.html("");
  if (bool) {
    html += '<option value="">全部</option>';
  }
  for (var i in data) {
    html +=
      '<option value="' + data[i][val] + '">' + data[i][text] + "</option>";
  }
  $id.html(html);
  form.render("select");
}
