/**
 * 暂时是上传函数的相同代码封装
 * @param el 预览图标的与元素ID
 * @param textEl 上传失败，重试按钮的元素ID
 * @returns {{before: before, done: done, error: error}} 返回值对应layui上传图片的处理函数
 * @constructor Function
 * @author yangsheng 2018/10/25
 */
let SameCode = function(el, textEl) {
  let ownProto = {
    before: function(obj) {
      //预读本地文件示例，不支持ie8
      obj.preview(function(index, file, result) {
        $(el).attr('src', result) //图片链接（base64）
      })
    },
    done: function(res) {
      //如果上传失败
      if (res.code > 0) {
        return layer.msg('上传失败')
      }
      //上传成功
    },
    error: function(uploadInst) {
      //演示失败状态，并实现重传
      let demoText = $(textEl)
      demoText.html(
        '<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>'
      )
      demoText.find('.demo-reload').on('click', function() {
        //演示失败状态，并实现重传
        demoText.html(
          '<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>'
        )
        demoText.find('.demo-reload').on('click', function() {
          uploadInst.upload()
        })
      })
    }
  }
  return ownProto
}
