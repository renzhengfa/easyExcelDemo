var form, postId;
$(function (myztree, myupload) {
  layui.use(['layer', 'form'], function () {
    var layer = layui.layer;
    form = layui.form;
      getMenuBar();//自定义面包屑，引用public-menu.js
    try {
      // var htmlico1="<img class='layui-upload-img myupload-img menuico1' width='100%' height='100%'> <p>静态图标</p>";
      // myupload.upload("menuico1",htmlico1,"iconDefault");
      // var htmlico2="<img class='layui-upload-img myupload-img menuico2' width='100%' height='100%'> <p>悬浮图标</p>";
      // myupload.upload("menuico2",htmlico2,"iconSelected");
      // var htmlico3="<img class='layui-upload-img myupload-img menuico3' width='100%' height='100%'> <p>点击图标</p>";
      // myupload.upload("menuico3",htmlico3,"iconShrink");
      var otherjson1 = {
        id: "menuico1",
        htmlico1: "<img class='layui-upload-img myupload-img menuico1' width='100%' height='100%'> <p>默认图标</p>",
        nameid: "iconDefault",
        attrid:".menuico1"
      }
      myupload.publicupload("#menuico1", "filemodule/file/uploadMenuIcon", "", "", "", true, "", "", 10240, "", "", "choose_menu", "done_menu", "", otherjson1);
      // var otherjson2 = {
      //   id: "menuico2",
      //   htmlico1: "<img class='layui-upload-img myupload-img menuico2' width='100%' height='100%'> <p>悬浮图标</p>",
      //   nameid: "iconSelected",
      //   attrid:".menuico2"
      // }
      // myupload.publicupload("#menuico2", "filemodule/file/uploadMenuIcon", "", "", "", true, "", "", 10240, "", "", "choose_menu", "done_menu", "", otherjson2);
      // var otherjson3 = {
      //   id: "menuico3",
      //   htmlico1: "<img class='layui-upload-img myupload-img menuico3' width='100%' height='100%'> <p>点击图标</p>",
      //   nameid: "iconShrink",
      //   attrid:".menuico3"
      // }
      // myupload.publicupload("#menuico3", "filemodule/file/uploadMenuIcon", "", "", "", true, "", "", 10240, "", "", "choose_menu", "done_menu", "", otherjson3);
    } catch (error) {
      console.log(error)
    }
    //监听提交
    form.on('submit(formDemo)', function (data) {
      var fieldjson = data.field;
      console.log(fieldjson);
      var fromjson = {
        id: postId,
        menuName: fieldjson.name,
        herf: fieldjson.URL,
        disabled: fieldjson.disabled,
        iconDefault: fieldjson.iconDefault,
        iconSelected: '',
        iconShrink: '',
        pageDescription: fieldjson.description
      }
      app.post('authmodule/AuthTbMenu/update', fromjson, function (data) {
        if (data.state == true) {
          ztreeRefresh();
        }
        layer.msg(data.msg);
      })
      return false;
    })
    ztreeRefresh();
  })
}(myztree, myupload));

function ztreeRefresh() {
  /*查询菜单-liuyuru*/
  app.get("authmodule/AuthTbMenu/selectAll", "", function (msg) {
    if (msg.state == true) {
      // layer.closeAll('loading');
      $('.bodyheader').css('display', 'block');
      $('.layui-layout-admin').css('display', 'block');
      var data = msg.rows;
      var treeNodes = [];
      for (var key in data) {
        treeNodes[key] = {};
        treeNodes[key]['id'] = data[key].id;
        treeNodes[key]['name'] = data[key].menuName;
        treeNodes[key]['pId'] = data[key].fkParentId;
      }
      myztree.show(data, treeNodes, "", true);
    } else {
      layer.msg(msg.msg);
    }
  });
}
function menuform(postId, treeNode) {
  var superiormenu, level;
  try {
    var pNode = treeNode.getParentNode();
    level = treeNode.level;
    if (pNode) {
      superiormenu = pNode.name;
    } else {
      superiormenu = "无";
    }
  } catch (e) {
    level = 0;
    superiormenu = "无";
  }
  app.post('authmodule/AuthTbMenu/selectById', {
    id: postId
  }, function (data) {
    if (data.state == true) {
      console.log(data);
      var menudata = data.row;
      form.val("menuform", {
        "name": menudata.menuName,
        "level": level + 1 + "级菜单",
        "superiormenu": superiormenu,
        "URL": menudata.herf,
        "disabled": (String)(menudata.disabled),
        "description": menudata.pageDescription,
        "iconDefault": menudata.iconDefault,
        "iconSelected": '',
        "iconShrink": ''
      })
      if (menudata.iconDefault != "" && menudata.iconDefault != null) {
        $('#menuico1').html("<img class='layui-upload-img myupload-img' src='" + imgurl + "" + menudata.iconDefault + "'><p>默认图标</p>");
      } else {
        $('#menuico1').html("<img class='layui-upload-img myupload-img' src='../../static/images/upload.png'><p>默认图标</p>");
      }
      // if (menudata.iconSelected != "" && menudata.iconDefault != null) {
      //   $('#menuico2').html("<img class='layui-upload-img myupload-img' src='" + imgurl + "" + menudata.iconSelected + "'><p>悬浮图标</p>");
      // } else {
      //   $('#menuico2').html("<img class='layui-upload-img myupload-img' src='../../static/images/upload.png'><p>悬浮图标</p>");
      // }
      // if (menudata.iconShrink != "" && menudata.iconDefault != null) {
      //   $('#menuico3').html("<img class='layui-upload-img myupload-img' src='" + imgurl + "" + menudata.iconShrink + "'><p>点击图标</p>");
      // } else {
      //   $('#menuico3').html("<img class='layui-upload-img myupload-img' src='../../static/images/upload.png'><p>点击图标</p>");
      // }
      form.render('radio');
    } else {
      layer.msg(data.msg);
    }

  });
}
/*ztree右键事件新增节点-liuyuru*/
function zTreeRightClick(event, treeId, treeNode) {
  //将新节点添加到数据库中
  var parentvalue;
  if (treeNode) {
    parentvalue = treeNode.id;
  } else {
    parentvalue = 0;
  }
  var fromjson = {
    fkParentId: parentvalue,
    menuName: 'NewNode'
  }
  myztree.RightClick(treeNode, "authmodule/AuthTbMenu/add", fromjson);
}
/*ztree新增节点图标绑定事件-liuyuru*/
function myztreebind(btn, treeNode) {
  if (btn) btn.bind("click", function () {
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    //将新节点添加到数据库中
    var fromjson = {
      fkParentId: treeNode.id,
      menuName: 'NewNode'
    }
    myztree.RightClick(treeNode, "authmodule/AuthTbMenu/add", fromjson, "bind");
  });
}

/*确认修改菜单-liuyuru*/
function onRename(e, treeId, treeNode, isCancel) {
  var fromjson = {
    id: treeNode.id,
    menuName: treeNode.name
  }
  app.post('authmodule/AuthTbMenu/update', fromjson, function (data) {
    if (data.state == true) {
      postId = treeNode.id;
      menuform(postId, treeNode);
    }
    layer.msg(data.msg);
  });
}

/*删除菜单-liuyuru*/
function beforeRemove(treeId, treeNode) {
  var flag = false; //此处必须定义一个变量，不然还没确定就把节点从树上删除
  myztree.Remove("treeDemo", treeNode, 'authmodule/AuthTbMenu/deleteId', function (data) {
    if (data.state == true) {
      flag = true;
      treeObj.removeNode(treeNode); //删除当前节点
      var menureset = document.getElementById("menuform-reset");
      if (menureset) {
        menureset.reset();
      }
      layui.form.render();
    }
    layer.msg(data.msg);
  });
  return flag;
}