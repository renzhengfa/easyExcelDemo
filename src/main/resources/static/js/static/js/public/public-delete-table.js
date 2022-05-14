/**
 * @author chentong
 * @description 全局删除Table一行数据
 */

function deleteTable(href, id, tourPlayerId, obj) {
  console.log(href);
  console.log(id);
  console.log(tourPlayerId);
  console.log(obj);
  layer.confirm(
    "确认删除吗",
    {
      shade: [0.1, "#fff"]
    },
    function(index) {
      app.post(
        href,
        {
          id: id
        },
        function(msg) {
          // 物理删除 0 是显示  1是删除
          console.log(msg);
          if (msg.state == true) {
            obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
            layer.msg("删除成功");
            // $(".layui-table-body tr")
            //   .eq(tourPlayerId - 1)
            //   .remove();
            layer.close(index);
            layer.msg(msg.msg);
          } else {
            layer.msg(msg.msg);
          }
        }
      );
      layer.closeAll();
    },
    function() {
      // layer.msg('取消了删除！')
    }
  );
}
