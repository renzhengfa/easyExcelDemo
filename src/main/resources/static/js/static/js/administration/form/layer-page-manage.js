/**
 * 获取表单数据（修改时）
 * data参数json
 * liuyuru
 */

var form = "";
layui.use("form", function () {
  form = layui.form;
  $().ready(function () {
    formvalidate();
  });
  app.get("authmodule/sysTbDictCode/selectPageType", {}, function (data) {
    var data = data.rows;
    // console.log(data)
    for (var i = 0, len = data.length; i < len; i++) {
      $(".interfaceType").append(
        "<option value=" + data[i].svalue + ">" + data[i].svalue + "</option>"
      );
      form.render("select");
    }
  }); 

  app.get("authmodule/sysTbDictCode/selectPageGroup", {}, function (data) {
    var data = data.rows;
    console.log(data) 
     fkParentIdArr=[];
     fkParentConArr=[];
    for (let i = 0, len = data.length; i < len; i++) {
      $(".interfaceGroup").append(
        "<option value=" + data[i].svalue + ">" + data[i].svalue + "</option>"
      );
      fkParentConArr.push(data[i].svalue);
      fkParentIdArr.push(data[i].id);
      form.render("select");
    }
        if(!$('.fkParentId').val()){
            $('.fkParentId').val(fkParentIdArr[0]);
        }
  });
  form.on('select(fkGroupName)', function (data) {
        $('.fkParentId').val(fkParentIdArr[fkParentConArr.indexOf(data.value)]);
        form.render('select');
  })
});


function getFlag() {
  return $('input[name="id"]').attr('data-flag');
}
// 信息校验
function formvalidate() {
  return $("#edit_page_type").validate({
    onfocusout: function (element) {
      $(element).valid();
    },
    invalidHandler:function(){
      return $('input[name="id"]').attr('data-flag',true);
  },
    rules: {
      pageName: {
        required: true,
        minlength: 4
      },
      pageCode: {
        required: true,
        minlength: 4,
        maxlength: 24,
        remote: {
          url: baseurl + "authmodule/authTbPage/checkPageCode",
          type: "get",
          data: {
            pageCode: function () {
              return $("#pageCode").val();

            }, id: function () {
              return getRequest(window.location.href).id==undefined?'':getRequest(window.location.href).id;
            }
          }
        }

      },
      pageUri: {
        required: true,
        minlength: 4,
        maxlength: 128,
        remote: {
          url: baseurl + "authmodule/authTbPage/checkPageUri",
          type: "get",
          data: {
            pageUri: function () {
              return $("#pageUri").val();
            }
            , id: function () {
              return getRequest(window.location.href).id==undefined?'':getRequest(window.location.href).id;
            }
          }
        }
      }
    },
    messages: {
      pageName: {
        required: "请输入页面名称",
        minlength: "页面名称长度不能少于4位"
      },
      pageCode: {
        required: "请输入页面编码",
        minlength: "页面编码长度不能少于4位",
        maxlength: "页面编码长度不能超过128位",
        remote: "页面编码已存在"
      },
      pageUri: {
        required: "请输入页面地址",
        minlength: "页面地址长度不能少于4位",
        maxlength: "页面地址长度不能超过128位",
        remote: "页面地址已存在"
      },
    },
  });
}
function formVoluation(selectId) {
  // console.log(selectId);
  app.get("authmodule/authTbPage/selectByIdPage", selectId, function (msg) {
    // console.log(msg);
    PAGECODE = msg.row.pageCode;
    PAGEURL = msg.row.pageUri;  
    layerVoluation(msg.row); //传参并赋值
    $('select[name="fkGroupId"]').val(msg.row.pageType);
    $('select[name="fkTypeCode"]').val(msg.row.fkGroupName);
 
    form.render("select");
  });
}
//获取弹出层表单的数据
function getSaveData() {
  if (formvalidate().form()) {
    $('.layui-layer-btn0').removeAttr("disabled");
    $('.layui-layer-btn1').removeAttr("disabled");
    //序列化数据
    var data = $("#edit_page_type").serializeJson();
    return {
      data: data
    }
  } else {
    $('.layui-layer-btn0').removeAttr("disabled");
    $('.layui-layer-btn1').removeAttr("disabled");
    //校验不通过，什么都不用做，校验信息已经正常显示在表单上
  }
}