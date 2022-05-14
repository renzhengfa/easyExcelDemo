$(function (mytable) {
  var layer;
  layui.use(['layer', 'form'], function () {
    layer = layui.layer;
  });
    getMenuBar();//自定义面包屑，引用public-menu.js
    selectFlowType();
    var typeId = '';
    mytableinit(typeId);
  // 获取流程类型下拉框信息
  function selectFlowType() {
    app.get('activitymodule/actReModel/selectFlowType', {}, function (msg) {
      if (msg.state) {
        var str = '';
        for (var i = 0; i < msg.rows.length; i++) {
          str +='<option value=' + msg.rows[i].id +'>' +msg.rows[i].typeName +'</option>';
        }
        $('.flow-types').append(str);
      }
        var form = layui.form;
        form.render("select");
    })
  }
  /*表格初始化、流程的查询-liuyuru*/
  function mytableinit(typeId) {
    mytable.init({id: 'depart-process',url: 'activitymodule/actReModel/selectFlowModel', pageCode: 'process-query.html',
        data: { 'map[typeId]': typeId }}) .then(function (table) {
        //监听工具条
        table.on('tool(control)', function (obj) {
          //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
          var data = obj.data; //获得当前行数据
          var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
          var tr = obj.tr; //获得当前行 tr 的DOM对象

          if (layEvent === 'detail') {
            //查看
            //do somehing
          }  else if (layEvent === 'edit') {
            //编辑
            window.open(baseurl+'modeler.html?modelId=' + data.id);
            //部署流程
          } else if (layEvent === 'deploy') {
              window.parent.layer.confirm('确认要部署吗？', {
                btnAlign: 'c',
                anim: 5,
                title: '提示',
                shade: [0.01, '#fff']
            }, function (index, layero) {
                app.post('/deploy', {id:data.id}, function (res) {
                    if(res.state){
                        parent.layer.close(index);
                        testRefresh();
                    }
                    parent.layer.msg(res.msg);
                })
            }, function (index) {
                parent.layer.close(index);
            });
            // 删除未部署流程
          }else if (layEvent === 'delete') {
            window.parent.layer.confirm('确认要删除吗？', {
              btnAlign: 'c',
              anim: 5,
              title: '提示',
              shade: [0.01, '#fff']
          }, function (index, layero) {
              app.post('/activitymodule/actReModel/deleteProcess', {id:[data.id]}, function (res) {
                  if(res.state){
                      parent.layer.close(index);
                      testRefresh();
                  }
                  parent.layer.msg(res.msg);
              })
          }, function (index) {
              parent.layer.close(index);
          });
        }
        })
      })
  }

  /*查询流程-liuyuru*/
  $('.js-queryprocess').on('click', function () {
    typeId = $('.flow-types').val();
    mytableinit(typeId);
  });

  /*新增流程-liuyuru*/
  $('.js-addprocess').on('click', function () {
    var id = $('.flow-types').val();
    // console.log(id)
    if (id != '' && id != null && id != undefined) {
      window.open(baseurl+'create?scene=' + id + '&updated=1')
    } else {
      layer.tips('请选择流程类型！', '.layui-select-title',{
        tips: [3, '#3a97ff'],
        time: 4000
      });
    }
  })
}(mytable));
function testRefresh(){
    $(".layui-laypage-btn")[0].click();
}
