/**
 * mylayer弹出框
 * parm a标签传送的值
 * a标签class="modaljump",弹出mylayer.openModal--添加、修改操作
 * a标签class="deletedjump"，执行删除操作；class中confirm是否存在的情况判断是否弹出询问框
 * action(ajax接口名称)添加修改删除的必填项，href(弹出框内容)添加修改的必填项，
 * data-title(标题)，data-type(类型2)，width(宽)，height(高)，data-btn(按钮)
 * liuyuru
 */
(function (mylayer, $) {
    //监听模态，得到弹出框参数
    $(document).on("click", "a.modaljump", function () {
        if (localStorage.getItem("myselected").length == 0) {
            layer.msg("请选择档案！", {time: 1000});
            return false;           
        } else{
            var parm = {};
            parm.that = this;
            var dataico = $(this).attr("data-ico");
            var datatitle = $(this).attr("data-title");
            parm.state = this.dataset.cancel;
            parm.cancelUrl = this.dataset.cancelUrl;
    
            if (!datatitle || datatitle == "") {
                datatitle = $(this).text();
            }
    
            if (!dataico || dataico == '') {
                parm.title = "<img style='margin-right: 8px;'/><span>" + datatitle + "</span>";
            } else {
                parm.title = "<img src=" + dataico + " style='margin-right: 8px;'/><span>" + datatitle + "</span>";
            }
            parm.action = $(this).attr("action");
            parm.url = $(this).attr("href");
            parm.type = parseInt($(this).attr("data-type"));
            if (!parm.type || parm.type == "") {
                parm.type = 2;
            }
            parm.width = $(this).attr("width");
            if (!parm.width) {
                parm.width = "1024px";
            }
            parm.height = $(this).attr("height");
            if (!parm.height) {
                parm.height = "640px";
            }
            var btnName = $(this).attr("data-btn");
            if (!btnName) {
                btnName = "保存,取消";
            }
            var btnNames = btnName.split(",");
            parm.btns = btnNames;
            try {
                window.parent.mylayer.openModal(parm);
            } catch (e) {
                mylayer.openModal(parm);
            }
            return false;
        }
        
    })
    //监听模态，得到参数实现table删除功能
    $(document).on("click", "a.deletedjump", function () {
        var parm = {};
        var action = $(this).attr("action")
        parm.action = action.split("?")[0];
        var data = getRequest(action);
        if (data.id) { } else {
            if (data.ids == "") {
                try {
                    if(mySelected.length>0){
                        data.ids = mySelected;
                    }else{
                        layer.msg("请选择数据！");
                        return false;
                    }
                } catch{
                    layer.msg("请选择数据！");
                    return false;
                }
            } else {
                data.ids = [data.ids];
            }
        }
        var title=$(this).attr("data-title");
        if(!title){
            var title="确定删除吗？";
        }

        var that = this;
        var parentId;
        try {
            if (window.parent.frames["menuframe"].postId) {
                parentId = window.parent.frames["menuframe"].postId;
                console.log(parentId)
            }
        } catch {

        }
        var pagevalue = $(that).parent().parent().parent().parent().parent().parent().parent().parent().find(".layui-laypage-curr em").eq(1).html();
        if ($(this).hasClass("confirm") == true) {
            window.parent.layer.confirm(title, {
                btnAlign: 'c',
                anim: 5,
                title: '提示',
                shade: [0.01, '#fff']
            }, function (index, layero) {
                //				$(that).parent().parent().parent().remove();
                app.post(parm.action, data, function (msg) {
                    if (msg.state == true) {
                        //这里执行回传,并提示
                        parent.layer.close(index);
                        window.parent.frames["menuframe"].testRefresh();
                        // window.parent.frames["menuframe"].tableRefresh({ id: parentId, currentPage: pagevalue });
                    }
                    layer.msg(msg.msg);
                })
            });
        } else {
            app.post(parm.action, data, function (msg) {
                //这里执行回传,并提示
                if (msg.state == true) {
                    window.parent.frames["menuframe"].testRefresh();
                    // window.parent.frames["menuframe"].tableRefresh({ id: parentId, currentPage: pagevalue });
                }
                layer.msg(msg.msg);
            });
        }
        return false;
    })

    /**
     * 弹出框打开，执行添加修改操作
     * voluation修改时执行查询数据
     * liuyuru
     */
    mylayer.openModal = function (par) {
        console.log(par);
        layer.open({
            type: par.type,
            title: par.title,
            btn: par.btns,
            area: [par.width, par.height],
            btnAlign: 'c',
            anim: 5,
            content: par.url,
            shade: [0.01, '#fff'],
            success: function (layero, index) {
                if (par.url.indexOf('?') > 0) {
                    var data = getRequest(par.url); //获取参数
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    var voluation = iframeWin.formVoluation(data); //传递参数查询该参数下的所有数据
                }else{
                    try {
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        iframeWin.formData(par.that);
                    } catch (error) {
                        
                    }
                }

                this.enterEsc = function (event) {
                    if (event.keyCode === 13) {
                        $(".layui-layer-btn0").click();
                        return false; //阻止系统默认回车事件
                    }
                };
                $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
            },
            end: function () {
                $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
            },
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                var yes = $('.layui-layer-iframe', parent.document).find('.layui-layer-btn').find('.layui-layer-btn0'); // 获取确定按钮
                var cancel = $('.layui-layer-iframe', parent.document).find('.layui-layer-btn').find('.layui-layer-btn1');  // 第二个按钮
                yes.attr('disabled', true);
                yes.addClass('layui-disabled');
                cancel.attr('disabled', true);
                cancel.addClass('layui-disabled');
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var saveData = iframeWin.getSaveData(); //获取数据
                if (saveData == undefined) {
                    return false;
                }
                if (par.action == undefined || par.action == "") {
                    throw "保存地址不能为空";
                    return false;
                }
                if(par.action == "close-layer"){
                    parent.layer.close(index);
                    return false;
                }
                var nowpage;
                if (saveData.data.id == "") {
                    delete saveData.data["id"];
                    nowpage = "1";
                    // var pagevalue = $(par.that).parent().parent().parent().parent().parent().parent().parent().parent().find(".layui-laypage-curr em").eq(1).html();
                    // var nowpage=pagevalue;
                }
                try {
                    if (window.frames["menuframe"].postId) {
                        saveData.data.parentId = window.frames["menuframe"].postId;
                    }
                } catch {

                }
                if(par.state){  // 判断取消按钮是否也会执行事件
                    if(parent.state){   // 判断是否有文件上传
                        iframeWin.upload();
                        return false;
                    }
                    var saveData = iframeWin.getSaveData(); //获取数据
                    app.send(par.action, 'post', saveData.data, false, function (msg) {
                        layui.layer.msg(msg.msg);
                        //这里执行回传,并提示
                        if (nowpage == 1) {
                            window.parent.frames["menuframe"].firstRefresh();
                        } else {
                            window.parent.frames["menuframe"].testRefresh();
                        }
                        // window.frames["menuframe"].tableRefresh({ id: saveData.data.parentId, currentPage: pagevalue });
                        parent.layer.close(index);
                    });
                    return false;
                }
                app.post(par.action, saveData.data, function (msg) {
                    layui.layer.msg(msg.msg);
                    //这里执行回传,并提示
                    if (nowpage == 1) {
                        window.parent.frames["menuframe"].firstRefresh();
                    } else {
                        //window.parent.frames["menuframe"].testRefresh();
                        window.close();
                        layui.table.reload("archives_table", {
                            url:
                                baseurl +
                                "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + localStorage.getItem("tableNames"),
                            where: {} //设定异步数据接口的额外参数
                        });
                    }
                    // window.frames["menuframe"].tableRefresh({ id: saveData.data.parentId, currentPage: pagevalue });
                    parent.layer.close(index);
                })
            },
            btn2: function (index, layero) {
                var yes = $('.layui-layer-iframe', parent.document).find('.layui-layer-btn').find('.layui-layer-btn0');
                var cancel = $('.layui-layer-iframe', parent.document).find('.layui-layer-btn').find('.layui-layer-btn1');
                yes.attr('disabled', true);
                yes.addClass('layui-disabled');
                cancel.attr('disabled', true);
                cancel.addClass('layui-disabled');
                if (par.state) {
                    parent.cancel = true;
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    if (parent.state) {
                        iframeWin.upload();    // 上传数据
                        return false;
                    }
                    var saveData = iframeWin.getSaveData(); //获取数据
                    var nowpage;
                    //     var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    //     var saveData = iframeWin.getSaveData(); //获取数据
                    if (saveData.data.id == "") {
                        delete saveData.data["id"];
                        nowpage = "1";
                        // var pagevalue = $(par.that).parent().parent().parent().parent().parent().parent().parent().parent().find(".layui-laypage-curr em").eq(1).html();
                        // var nowpage=pagevalue;
                    }
                    try {
                        if (window.frames["menuframe"].postId) {
                            saveData.data.parentId = window.frames["menuframe"].postId;
                        }
                    } catch {

                    }
                    app.post(par.cancelUrl, saveData.data, function (msg) {
                        console.log(msg);
                        if (msg.state) {
                            parent.layer.close(index);
                            if (nowpage == 1) {
                                window.parent.frames["menuframe"].firstRefresh();
                            } else {
                                window.parent.frames["menuframe"].testRefresh();
                            }
                        }
                        layui.layer.msg(msg.msg);
                        // window.frames["menuframe"].tableRefresh({ id: saveData.data.parentId, currentPage: pagevalue });

                    });
                    return false;
                // }
                }
            }
        });
        return false;
    };

    /**
     * 获取url？后面的参数 json格式
     * @return {{}}
     * liuyuru
     */
    function getRequest(url) {
        url = "?" + url.split("?")[1];
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
}(window.mylayer = {}, $))