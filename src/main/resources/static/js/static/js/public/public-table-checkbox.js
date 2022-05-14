var token = window.localStorage.getItem("token");
;(function(app, $, mytable) {
  //.存储当前页数据集
  window.pageData = []
  mytable.checkPar = function(par) {
    if (par.id == null || par.id == '') {
      throw '请传入表格id'
    }
    if (par.pageCode == null || par.pageCode == '') {
      throw '请传入pageCode'
    }
  }
  //初始化表格数据
  mytable.init = function(par) {
    var cols = app.asyncGet('authmodule/authTbPageols/selectCols', {
      pageCode: par.pageCode,
      pageMarker: par.pageMarker
    })
    var reusltCols = []
    //console.log(cols.rows);
    reusltCols.push()
    var rows = []
    if (
      par.pageCode == 'archives-admin' ||
      par.pageCode == 'archivesBox-admin' ||
      par.pageCode == 'filesBox_info'|| par.pageCode == 'door-equipment-manage'
    ) {
      rows[0] = {
        type: 'checkbox',
        title: '',
        width: 60,
        fixed: 'left'
      }
      rows[1] = {
            type: 'numbers',
            title: '序号',
            width: 60,
            fixed: 'left'
        }
      for (var i = 2; i <= cols.rows.length+1; i++) {
        rows[i] = cols.rows[i - 2]
      }
      reusltCols.push(rows)
    } else if (par.pageCode == 'archivesBoxs-admin') {
      rows[0] = {
        type: 'radio',
        title: '',
        width: 60,
        fixed: 'left'
      }
      for (var i = 1; i <= cols.rows.length; i++) {
        rows[i] = cols.rows[i - 1]
      }
      reusltCols.push(rows)
    } else {
      rows[0] = {
        type: 'numbers',
        title: '序号',
        width: 60,
        fixed: 'left'
      }
      for (var i = 1; i <= cols.rows.length; i++) {
        rows[i] = cols.rows[i - 1]
      }
      reusltCols.push(rows)
    }
    // mytable.checkPar(par);
    return new Promise(function(resolve, reject) {
      layui.use(['table'], function() {
        // console.log(par);
        var table = layui.table
        ;(layer = layui.layer), ($ = layui.$), (form = layui.form)
        var mytbl
        //.存储已选择数据集，用普通变量存储也行
        layui.data('checked', null)
        //var index = layer.load(1); //添加laoding,0-2两种方式
        table.render({
          elem: '#' + par.id,
          url: window.baseurl + par.url, //数据接口
         // height: 'full-140',
          page: true, //开启分页
          page: {
            theme: '#3a97ff'
          },
          loading: true,
          cellMinWidth: 60,
          even: true, // 开启隔行背景
          where: par.data,
            headers: {"authorization": token},
          request: {
            pageName: 'currentPage', //页码的参数名称，默认：page
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
          },
          response: {
            statusName: 'code',
            statusCode: 1,
            msgName: 'msg', // 对应 msg
            countName: 'total', // 对应 count
            dataName: 'rows' // 对应 data
          },
          initSort: {
            field: 'id', //排序字段，对应 cols 设定的各字段名
            type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
          },
          cols: reusltCols,
          done: function(res, c, a) {
            //console.log(res);
            window.curr = c;
            window.pagesize = res.pageSize;
            var tbl = $('#' + par.id).next('.layui-table-view');
            console.log(tbl);

            //.记下当前页数据，Ajax 请求的数据集，对应你后端返回的数据字段
            pageData = res.rows;
            var len;
            if(pageData){
                len = pageData.length;
                //.遍历当前页数据，对比已选中项中的 id
                for (var i = 0; i < len; i++) {
                    if (layui.data('checked', pageData[i]['id'])) {
                        //.选中它，目前版本没有任何与数据或表格 id 相关的标识，不太好搞，土办法选择它吧
                        tbl
                            .find('table>tbody>tr')
                            .eq(i)
                            .find('td')
                            .eq(0)
                            .find('input[type=checkbox]')
                            .prop('checked', true)
                    }
                }
            }else{

            }
            //.PS：table 中点击选择后会记录到 table.cache，没暴露出来，也不能 mytbl.renderForm('checkbox');
            //.暂时只能这样渲染表单
            form.render('checkbox')
            //layer.close(index);    //返回数据关闭loading
          }
        })
        resolve(table)
        //监听表格复选框选择
        table.on('checkbox(archivesBox)', function(obj) {
          window.mySelected = []
            window.arr_state = []
          //.全选或单选数据集不一样
          var data = obj.type == 'one' ? [obj.data] : pageData

          //.遍历数据
          $.each(data, function(k, v) {
            //.假设你数据中 id 是唯一关键字
            console.log(v)
            if (obj.checked) {
              //.增加已选中项
              layui.data('checked', {
                key: v.id,
                value: v
              })
            } else {
              //.删除
              layui.data('checked', {
                key: v.id,
                remove: true
              })
            }
          })
          $.each(layui.data('checked'), function(k, v) {
            mySelected.push(v.id)
              arr_state.push(v.state);
          })
          console.log(mySelected)
            console.log(arr_state)
          localStorage.setItem("myselected",mySelected);
          //layer.alert(JSON.stringify(mySelected));
        })
        //其他操作

        //监听排序
        table.on('sort(control)', function(obj) {
          //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
          //尽管我们的 table 自带排序功能，但并没有请求服务端。
          //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
          table.reload(par.id, {
            initSort: obj, //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
            where: {
              //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
              field: obj.field, //排序字段
              order: obj.type //排序方式
            }
          })
        })
      })
    })
  }
})(app, $, (window.mytable = {}))
