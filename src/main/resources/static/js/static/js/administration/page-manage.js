/**
 * @author chentong
 * @description 页面管理
 */

// 全局变量保存页面类型和页面分组下拉框数据
window.PageTypes = {}; // 页面类型
window.PageGroupings = {}; // 页面分组
// 初始化table
var form;
$(function(mytable) {
    layui.use(["table", "layer", "form"], function() {
      var table = layui.table;
      form = layui.form; // form表单
        getMenuBar();//自定义面包屑，引用public-menu.js
        getSelectData();
      mytable.init({
          id: "page_manage_table_content",
          url: "authmodule/authTbPage/selectPageAll",
          pageCode: "page",
          data: { field: "id" } //根据id倒序排列
        });
      pageManageQuery(table);
    });
}(mytable));

// select添加选项
function addSelect(id, data, bool, val, text) {
  //bool是否添加“请选择”选项
  val = val || "type";
  text = text || "name";
  var html = "";
  var $id = $("#" + id);
  $id.html("");
  if (bool) {
    html += '<option value="" selected>全部</option>';
  }
  for (var i in data) {
    html +=
      '<option value="' + data[i][val] + '">' + data[i][text] + "</option>";
  }
  $id.html(html);
  form.render();
}
// 下拉框赋值
function getSelectData() {
  var data = {};
  app.get("authmodule/sysTbDictCode/selectPageType", data, function(msg) {
    PageTypes = msg.rows;
    if (msg.state) {
      addSelect("select_page_type", PageTypes, true, "svalue", "svalue");
      addSelect("select_page_type_alert", PageTypes, true, "svalue", "svalue");
    }
  });
  app.get("authmodule/sysTbDictCode/selectPageGroup", data, function(msg) {
    PageGroupings = msg.rows;
    if (msg.state) {
      addSelect(
        "select_page_groupings",
        PageGroupings,
        true,
        "id",
        "svalue"
      );
      addSelect(
        "select_page_groupings_alert",
        PageGroupings,
        true,
        "id",
        "svalue"
      );
    }
  });
}
// 查询
function pageManageQuery(table) {
  $("#page_manage_content_top_button_query").on("click", function() {
    var select_page_groupings = $("#select_page_groupings").val();
    var select_page_type = $("#select_page_type").val();
    table.reload("page_manage_table_content", {
      url:
        baseurl +
        "authmodule/authTbPage/selectPageAll?map[pageType]=" +
        select_page_type +
        "&map[fkParentId]=" +
        select_page_groupings,
        page:{curr:1}
    });
  });
}
function firstRefresh() {
  var data = layui.table.cache['page_manage_table_content'],
  page = $(".layui-laypage-skip").find("input").val(); //当前页码值
if (data && data.length - 1 > 0) {
  $(".layui-laypage-btn")[0].click();
} else if(page){
  layui.table.reload('table_content', {
      page: {
          curr: page - 1
      }
  });
}else if(!data){
    $("#page_manage_content_top_button_query").click();
}
}
function testRefresh() {
  var data = layui.table.cache['page_manage_table_content'],
      page = $(".layui-laypage-skip").find("input").val(); //当前页码值
  if (data && data.length - 1 > 0) {
      $(".layui-laypage-btn")[0].click();
  } else if(page){
      layui.table.reload('table_content', {
          page: {
              curr: page - 1
          }
      });
  }

}

