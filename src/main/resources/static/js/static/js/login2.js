$(function(app) {
    var progress = new Progress()
    $('#login_btn').on('click', function() {
      var that = this
      $(this).attr('disabled', true)
      var data = getData()
      if (data.username == '') {
        $('.identify-error')
          .text('请输入登录账号!')
          .removeClass('hidden')
        $(this).attr('disabled', false)
        return false
      }
      if (data.password == '') {
        $('.password-error')
          .text('请输入登录密码!')
          .removeClass('hidden')
        $(this).attr('disabled', false)
        return false
      }
      progress.startProgress()
      setTimeout(() => {
        app.post(
          'auth/user/userLogin',
          {
            account: data.username,
            password: data.password,
            identifyingCode: data.verification
          },
          function(msg) {
            if (msg.state) {
              window.localStorage.setItem('username', data.username)
              window.localStorage.setItem('token', msg.row)
              setTimeout(function() {
                window.location.href = 'index.html'
              }, 1000)
            } else {
              if (msg.row >= 3) {
                $('#verification_box').show()
              }
              $('.identify-error')
                .text(msg.msg)
                .removeClass('hidden')
              progress.closeProgress()
              $(that).attr('disabled', false)
            }
          },
          function(err) {
            $('.identify-error')
              .text('网络连接异常')
              .removeClass('hidden')
            $(that).attr('disabled', false)
            progress.closeProgress()
          }
        )
      }, 1000)
    })
    $('#identify').on('input propertychange', function() {
      setTimeout(() => {
        var data = getData()
        if (data.username != '') {
          $('.identify-error').addClass('hidden')
        }
      }, 200)
    })
    $('#password').on('input propertychange', function() {
      setTimeout(() => {
        var data = getData()
        if (data.username != '') {
          $('.password-error').addClass('hidden')
        }
      }, 200)
    })

    function getData() {
      var data = {}
      data.username = $('#identify').val()
      data.password = $('#password').val()
      data.verification = $('#verification').val()
      return data
    }
}(app));

function Progress(timer) {
  var progress = new Object()
  var i = 0
  var timer
  progress.startProgress = function() {
    $('.progress-box .progress').width('0%')
    //  clearInterval(timer);
    timer = setInterval(() => {
      $('.progress-box .progress').width(i + '%')

      if (i < 95) {
        i = i + 0.2
      }
    }, 1)
  }
  progress.closeProgress = function() {
    $('.progress-box .progress').width('0%')
    i = 0
    clearInterval(timer)
  }
  return progress
}
