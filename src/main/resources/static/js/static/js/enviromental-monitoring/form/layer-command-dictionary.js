/**
 * @author chentong
 * @description 命令字典弹框
 */
var form = "";

layui.use("form", function () {
  form = layui.form;
  $().ready(function () {
    formvalidate();
  });
});
$.validator.addMethod("english", function (value, element, params) {
  var pattern = /^[-a-zA-Z]{2,128}$/;
  var res = pattern.test(value);
  if (res) {
    return true
  }

}, "必须是2位字母");
function getFlag() {
  return $('input[name="id"]').attr('data-flag');
}
// 信息校验
function formvalidate() {
  return $("#edit_command").validate({
    onfocusout: function (element) {
      $(element).valid();
    },
    invalidHandler:function(){
      return $('input[name="id"]').attr('data-flag',true);},

    rules: {
      cmdResultCode: {
        required: true,
        minlength: 2,
        remote: {
          url: baseurl + "environmentmodule/wkTbCmdResult/checkCmdResult",
          type: "get",
          data: {
            cmdResultCode: function () {
              return $("#cmdResultCode").val();
            }, id: function () {
              return getRequest(window.location.href).id==undefined?'':getRequest(window.location.href).id;
            }
          }
        },
        english: ""
      },
      cmdResultMsg: {
        required: true,
        minlength: 2
      }

    },
    messages: {
      cmdResultCode: {
        required: "请输入关键字",
        minlength: "关键字长度不能少于2位字母",
        remote:"命令关键字已存在"
      },
      cmdResultMsg: {
        required: "请输入结果",
        minlength: "结果长度不能少于2位",
        maxlength: "结果长度不能超过128位"
      }
    },
  });
}
function formVoluation(selectId) {

  // console.log(selectId);
  app.get(
    "environmentmodule/wkTbCmdResult/selectByIdCmdResult",
    selectId,
    function (msg) {
      // console.log(msg);
      layerVoluation(msg.row); //传参并赋值
    }
  );
}
//获取弹出层表单的数据
function getSaveData() {
  // console.log('执行了getSaveData')
  //序列化数据
  if (formvalidate().form()) {
    //序列化数据
    var data = $("#edit_command").serializeJson();
    return {
      data: data
    }
  } else {
    //校验不通过，什么都不用做，校验信息已经正常显示在表单上
  }
  // var data = $("#edit_command").serializeJson();
  // console.log("执行了getSaveData");
  // console.log(data);
  // if (data.pageCode) {
  // }
  // if (data.pageUri) {
  // }
  // if (data)
  //   return {
  //     data: data
  //   };
}
