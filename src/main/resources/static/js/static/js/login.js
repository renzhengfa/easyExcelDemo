//登录
$(function(app) {
    // var lock=false;//默认未锁定
    $("#btn_login").on("click", function() {
        // if(!lock) {
        //     lock = true;//锁定
            var username = $(".username").val();
            var psd = $(".psd").val();
            var identify = $(".identify").val();
            if (username && psd) {
                app.postAsync("auth/user/userLogin", {
                        account: username,
                        password: psd,
                        identifyingCode: identify
                    }, function (msg) {
                        if (msg.state) {
                            layer.msg(msg.msg);
                            window.localStorage.setItem("token", msg.row);
                            setTimeout(function () {
                                window.location.href = "index.html";
                            }, 2000);
                            testOriginpwd();
                        } else {
                            // lock = false;
                            layer.msg(msg.msg);
                            $(".username")[0].focus();
                            if (msg.row >= 3) {
                                $(".identify-code").fadeIn();
                                $(".img").attr(
                                    "src",
                                    baseurl + "auth/user/imgVerification"
                                );
                                $(".change").on("click", function () {
                                    $(".img").attr(
                                        "src",
                                        baseurl +
                                        "auth/user/imgVerification?" +
                                        Math.random()
                                    );
                                });
                            }
                        }
                    }
                );
            } else if (username == "") {
                // lock = false;
                layer.msg("请输入用户名！！！");
                $(".username")[0].focus();
                return false;
            } else if (psd == "") {
                lock = false;
                layer.msg("请输入密码！！！");
                $(".psd")[0].focus();
                return false;
            } else {
                // lock = false;
                layer.msg("输入不能为空！！！");
                return false;
            }
        // }
    });

       // 验证是否为初始密码 
      function testOriginpwd() {
        app.get('authmodule/authTbUser/selectCurrent', '', function (data) {
            if (data.state) {
               layer.msg('密码为初始值，请修改');
            }  
        })
      }

    // 回车键操作登录
    $("body").keydown(function(event) {
        if (event.keyCode == "13") {
            //keyCode=13是回车键
            $("#btn_login").click();
        }
    });
    $(".forgetPsd").on("click", function() {
        layer.alert("请联系管理员！");
    });
}(app));
