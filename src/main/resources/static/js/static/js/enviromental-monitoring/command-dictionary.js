/**
 * @description 命令字典
 * @author chentong
 */

// 初始化table
$(function(mytable) {
    layui.use(["table", "layer", "form"], function() {
      var table = layui.table;
      var form = layui.form; // form表单
      form.render();
        getMenuBar();//自定义面包屑，引用public-menu.js
      mytable.init({
          id: "table_content",
          url: "environmentmodule/wkTbCmdResult/selectCmdResult",
          pageCode: "cmd-result",
          data: { field: "id" } //根据id倒序排列
        }).then(function(table) {
          // console.log(table);
        });
      query(table);
    });
  }(mytable));

function query(table) {
  $("#command_dictionary_btn_query").on("click", function() {
    var command_input = $("#command_input").val();
    // console.log(command_input);
    // if (command_input == "") {
    //   layer.msg("您还没有输入关键字!");
    //   return;
    // }
    var pattern = /[`^&% { } | ?]/im;
    if(!command_input||  command_input && !pattern.test(command_input)) { 
    mytable.init({
        id: "table_content",
        url: "environmentmodule/wkTbCmdResult/selectCmdResult",
        pageCode: "cmd-result",
        data: {
          // 'field': 'create_time',
          "map[cmdResultCode-like]": $('input[name="searchWord"]').val()
        }
      })
      .then(function(table) {
        // console.log(table);
      });
    }else {
      layer.msg('查询条件不能包含特殊字符');
  }
  });
}
function firstRefresh() {
  var data = layui.table.cache['table_content'],
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
    $("#command_dictionary_btn_query").click();
}
  
}

function testRefresh() {
  var data = layui.table.cache['table_content'],
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
