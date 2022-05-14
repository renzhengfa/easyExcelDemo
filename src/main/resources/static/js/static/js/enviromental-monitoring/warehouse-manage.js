/**
 *  @description 库房管理
 *  @author chentong
 */
// 上传头像
var picUrl = ""; // 头像地址
var warehouses = ""; // 库房集合
getMenuBar();//自定义面包屑，引用public-menu.js
getData();

// 初始化仓库数据
function getData() {
  // 获取接口  查询有哪些库房
  var data = {};
  app.get("environmentmodule/wkStoTbStore/selectWkStoTbStore?deleted=0", data, function (res) {
      if (res.state) {
        warehouses = res.rows;
        // console.log(warehouses);
        for (var i = 0; i < warehouses.length; i++) {
          var id = warehouses[i].id;
          var content =
            '<li class="item" id="li_item' +
            i +
            '"><span class="title"><label class="warehouse-name"><span class="shuxian">|</span><span id="warehouse_name' +
            i +
            '"></span></label><span><a class="layui-btn-xs layui-btn-tablexs modaljump" href="html/environmental-monitoring/form/laer-warehouse.html?id='+id+'"action="environmentmodule/wkStoTbStore/updateStore"data-title="编辑页面" data-ico="static/images/modify.png" width="500px" height="230px" data-type="2" data-btn="保存,取消">编辑</a><a href="javascript:;" class="line"></a><a class="layui-btn-xs layui-btn-tablexs confirm deletedjump"action="environmentmodule/wkStoTbStore/delectWkStoTbStore?id='+id+'">删除</a></span></span><img src="../../static/images/environment/upimg.png" alt="请上传图片" class="img-item layui-upload-img" id="img_item' +
            i +
            '" src=""/><div class="item-btn"><button type="button" id="img_item_up_btn' +
            i +
            '" class="button-up-item">上传图片</button></div></li>'
          // + ' <a class="layui-btn-xs layui-btn-tablexs modaljump"href="html/environmental-monitoring/form/laer-warehouse.html?id=" + 213231321 + action="authmodule/authTbPage/updatePage"data-title="编辑库房" data-ico="static/images/modify.png" width="500px" height="230px" data-type="2" data-btn="保存,取消">编辑</a>';
          $("ul").append(content);

          // <a class="layui-btn-xs layui-btn-tablexs confirm deletedjump"
          // action="WkTbEquAlarmType/deleteByIdAlarmType?id={{d.id}}">删除</a>
          // var str = ''
          // // str = JSON.stringify(warehouses[i].imgAddress);
          // // str = str.substring(2, str.length - 1)
          // // console.log(str)
          // warehouses[i].storeName = warehouses[i].imgAddress.substr(1)
          // warehouses[i].imgAddress = warehouses[i].imgAddress.substr(1); //删除第一个字
          $("#warehouse_name" + i + "").text(warehouses[i].storeName);
          console.log(warehouses[i].imgAddress)
          if(warehouses[i].imgAddress!=null){
            $("#img_item" + i + "").attr("src", imgurl + warehouses[i].imgAddress);
          }
          else {
            console.log('默认图片')
          }
        }

        layui.use(["upload", "layer"], function () {
          if (warehouses) {
            // console.log(warehouses);
            for (var i = 0; i < warehouses.length; i++) {
              var id = warehouses[i].id;
              var name = warehouses[i].storeName;
              uploadImg(i, id, name);
            }
          } else {
            // console.log(warehouses);
            // console.log("出错了~");
            // location.reload();
          }
        });
      } else {
        warehouses = "无数据";
        layer.msg(res.msg + ",请添加");
      }
    }
  );
}
// 上传图片
function uploadImg(i, id, name) {
  var upload = layui.upload;
  //普通图片上传
  var uploadInst = upload.render({
    elem: "#img_item_up_btn" + i,
    url: imgurl + "filemodule/file/uploadStorePhoto", //"environmentmodule/WkStoTbStore/uploadStorePhoto",
    // data: {
    //   id: id
    // },
    before: function (obj) {
      //预读本地文件示例，不支持ie8
      // obj.preview(function (index, file, result) {
      //     $('#img_item').attr('src', result); //图片链接（base64）
      // });
    },
    done: function (res) {
      // console.log(id);
      // console.log(res);
      if (res.state) {
        $("#store_img").val(res.row);
        layer.tips(res.msg, "#uploadfile");

        var data = {
          id: id,
          storeName: name,
          imgAddress: res.row
        };
        app.post("environmentmodule/wkStoTbStore/updateStore", data, function (msg) {
          if (msg.state) {
            $("#img_item" + i).attr("src", imgurl + res.row).show(1000);
            layer.msg("上传成功");
            // layer.closeAll();
          }
        });
      } else {
        layer.msg(res.msg);
        // console.log(res.msg);
      }
    },
    error: function (res) {
      //演示失败状态，并实现重传
      var demoText = $("#demoText");
      demoText.html(
        '<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>'
      );
      demoText.find(".demo-reload").on("click", function () {
        uploadInst.upload();
      });
    }
  });
}
// 添加
function addWarehouse() {
  // 弹出框
  $("#title_icon").attr("src", "../../static/images/add.png");
  $("#warehouse_manage_layer_title").text("添加库房");
  layerInfo("添加库房", "");
  $("#warehouse_name").val("");
}
// 删除
function deleteWarehouse(i, id) {
  layer.confirm("确定删除吗？", {
      btnAlign: "c",
      anim: 5,
      title: "提示",
      shade: [0.1, "#fff"]
    }, function () {
      var data = {
        id: id
      };
      app.post("environmentmodule/wkStoTbStore/delectWkStoTbStore", data, function (msg) {
          if (msg.state) {
            // 更新视图
            layer.msg("删除成功");
            $("#li_item" + i + "").remove();
            layer.closeAll(); //关闭提示框
          } else {
            layer.msg(msg.msg);
          }
        }
      );
    }
  );
}
// 编辑
function editWarehouse(i, id) {
  $("#warehouse_manage_layer_title").text("编辑库房");
  $("#title_icon").attr("src", "../../static/images/modify.png");
  $("#warehouse_name").val($("#warehouse_name" + i + "").text());
  layerInfo("编辑库房", i, id);
}
// 弹出层
function layerInfo(title, i, id) {
  layer.open({
    type: 1,
    title: false,
    area: ["500px", "230px"],
    btnAlign: "c",
    closeBtn: 0,
    resize: false,
    shade: [0.1, "#fff"],
    shadeClose: false, // 点击遮罩(弹层外区域)关闭
    offset: ["300px", "520px"],
    content: $("#warehouse_manage_layer"),
    success: function (layero, index) {
      if ($("#warehouse_name").val()) {
        $(".err-text").css("display", "none");  //设置p元素的样式颜色为红色
      }
      // closeAlert(index, title)
      closeAlert(index, title);
      clickYes(index, title, i, id);
      clickCancel(index, title);
      // clickCancel(index, title)
      $(document).on("keydown", function (e) {
        //document为当前元素，限制范围，如果不限制的话会一直有事件
        if (e.keyCode == 13) {
          clickYes(index, title, i, id);
        }
      });
    }
  });
}
// 右上角关闭
function closeAlert(index, title) {
  $("#close_icon").on("click", function () {
    closeAndCancel(index, title);
  });
}
// 点击Cancel
function clickCancel(index, title) {
  $("#warehouse_manage_alert_button_no").on("click", function () {
    closeAndCancel(index, title);
  });
}
// 点击Yes
function clickYes(index, title, i, id) {
  $("#warehouse_manage_alert_button_yes").on("click", function () {
    if (title == "添加库房") {
      var warehouseName = $("#warehouse_name").val();

      if (warehouseName != "") {
        var data = {
          storeName: warehouseName,
          imgAddress: 'storeImg/defalut.jpg'
        };
        app.post("environmentmodule/wkStoTbStore/addWkStoTbStore", data, function (msg) {
            if (msg.state) {
              // 更新视图
              layer.msg("添加成功");
              layer.closeAll();
              location.reload();
            }
          }
        );
      } else {
        layer.msg("请输入需要添加的库房名称");
      }
    } else {
      var warehouse = $("#warehouse_name").val();
      $(".err-text").css("display", "none");  //设置p元素的样式颜色为红色
      if (warehouse != "") {
        var data = {
          id: id,
          storeName: warehouse
        };
        app.post("environmentmodule/wkStoTbStore/updateStore", data, function (msg) {
          if (msg.state) {
            layer.msg("修改成功");
            // 更新视图
            $("#warehouse_name" + i + "").text(warehouse);
            layer.closeAll();
          }
        });
      } else {
        $(".err-text").css("display", "block");  //设置p元素的样式颜色为红色
        $('.err-text').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库房名称输入不能为空');
        // layer.msg("请输入修改后的库房名称");
      }
    }
  });
}
// 点击关闭和取消按钮的时候调用的方法
function closeAndCancel(index, title) {
  layer.closeAll(); //关闭提示框
}
function firstRefresh() {
  $(".layui-laypage-skip input").val(1);
  //$(".layui-laypage-btn")[0].click();
  location.reload();
}


function testRefresh() {
  //$(".layui-laypage-btn")[0].click();
  location.reload();
}
