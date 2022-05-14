/**
 * @author chentong
 * @description 仓库管理弹出框
 */
var form = "";
// console.log("asdsdasad")
layui.use("form", function () {
  form = layui.form;
  $().ready(function () {
    formvalidate();
  });
});
function getFlag() {
  return $('input[name="id"]').attr('data-flag');
}

// 信息校验
function formvalidate() {
  return $("#edit_warehouse").validate({
    onfocusout: function (element) {
      $(element).valid();
    },
    invalidHandler:function(){
      return $('input[name="id"]').attr('data-flag',true);
  },
    rules: {

      storeName: {
        required: true,
        minlength: 2,
      }

    },
    messages: {
      storeName: {
        required: "请输入库房名称",
        minlength: "库房名称长度不能少于2位"
      }
    },
  });
}
function formVoluation(selectId) {
  // console.log(selectId);
  app.get(
    "environmentmodule/wkStoTbStore/selectByIdStore",
    selectId,
    function (msg) {
      console.log(msg);
      layerVoluation(msg.row); //传参并赋值
    }
  );
}
//获取弹出层表单的数据
function getSaveData() {
  //序列化数据
  if (formvalidate().form()) {
    //序列化数据
    var data = $("#edit_warehouse").serializeJson();
    return {
      data: data
    }
  } else {
    //校验不通过，什么都不用做，校验信息已经正常显示在表单上
  }
}
