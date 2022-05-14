;(function(app, $, mytable) {
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
    reusltCols.push(cols.rows)
    // mytable.checkPar(par);
    return new Promise(function(resolve, reject) {
      layui.use(['table'], function() {
        console.log(par)
        var table = layui.table
        table.render({
          elem: '#' + par.id,
          url: window.baseurl + par.url, //数据接口
          page: true, //开启分页
          loading: true,
          where: par.data,
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
            type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
          },
          cols: reusltCols,
          done: function(res, curr, count) {
            //如果是异步请求数据方式，res即为你接口返回的信息。
            //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
            //console.log(res);
            for (var i = 0; i < res.rows.length; i++) {
              var start = res.rows[i].idCard.substring(6, 14)
              res.rows[i].idCard = res.rows[i].idCard.replace(start, '****')
              //console.log(res.rows[i].idCard);
              $('td[data-field="idCard"]')
                .find('div')
                .eq(res.rows.length - 1 - i)
                .html(res.rows[i].idCard)
            }
          }
        })
        resolve(table)
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
