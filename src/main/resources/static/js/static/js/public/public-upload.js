/**
 * myupload上传图标
 * liuyuru
 */
(function (app, $, myupload) {
    layui.use(['layer', 'upload'], function () {
        var layer = layui.layer;
        var upload = layui.upload;
        // myupload.upload = function (elemid, htmlimg, nameid) {
        //     //执行实例
        //     var uploadInst = upload.render({
        //         elem: '#' + elemid //绑定元素
        //         , url: imgurl + "filemodule/file/uploadMenuIcon"//上传接口
        //         , size: 10240
        //         , choose: function (obj) {
        //             //将每次选择的文件追加到文件队列
        //             var files = obj.pushFile();
        //             $('#' + elemid).html(htmlimg);
        //             //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
        //             obj.preview(function (index, file, result) {
        //                 $('.' + elemid).attr('src', result);
        //             });
        //         }
        //         , done: function (res) {
        //             if (res.state === true) {
        //                 var uploadimg = res.row;
        //                 $("#" + nameid).val(uploadimg);
        //             }
        //             layer.msg(res.msg)
        //         }
        //         , error: function () {
        //             //   layer.msg(res.msg);
        //         }
        //     });
        // }
        /**
         * myupload.publicupload layui公用上传
         * elemid: '#id' 指向容器选择器
         * uploadurl:上传接口
         * data:上传接口的额外参数
         * accept:指定允许上传时校验的文件类型,可选值有：images（图片）、file（所有文件）、video（视频）、audio（音频）
         * acceptMime:规定打开文件选择框时，筛选出的文件类型
         * auto:是否选完文件后自动上传,auto不能为空（true/false）
         * bindAction:指向一个按钮触发上传，一般配合 auto: false 来使用
         * exts:允许上传的文件后缀。一般结合 accept 参数类设定
         * size:文件大小,单位 KB
         * multiple:是否允许多文件上传。设置 true即可开启
         * beforefunction:文件提交上传前的回调
         * choosefunction:选择文件后的回调函数
         * donefunction:执行上传请求后的回调
         * errorfunction:执行上传请求出现异常的回调
         * otherjson:其他的参数json
         * author--liuyuru
         */
        myupload.publicupload = function (elemid, uploadurl, data, accept, acceptMime, auto, bindAction, exts, size, multiple, beforefunction, choosefunction, donefunction, errorfunction, otherjson) {
            var myupload_url;
            if(imgurl){
                myupload_url=imgurl;
            }else{
                myupload_url=parent.window.imgurl;
            }
            var uploadIns = upload.render({
                elem: elemid,
                url: myupload_url + uploadurl,
                data: data,
                accept: accept,
                acceptMime: acceptMime,
                auto: auto,
                bindAction: bindAction,
                exts: exts,
                size: size,
                multiple: multiple,
                before: function (obj) {
                    if (beforefunction) {
                        beforefunction(obj);
                    }
                },
                choose: function (obj) {
                    if (choosefunction) {
                        if (choosefunction == "choose_menu") {
                            //将每次选择的文件追加到文件队列
                            var files = obj.pushFile();
                            $('#' + otherjson.id).html(otherjson.htmlico1);
                            //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                            obj.preview(function (index, file, result) {
                                $(otherjson.attrid).attr('src', result);
                            });
                        } else {
                            choosefunction(obj);
                        }
                    } else {
                        parent.state = true;
                        obj.preview(function (index, file, result) {
                            $('.preview').empty();
                            var format = file.name.split('.')[1].toLowerCase();
                            if (format == 'doc' || format == 'docx') {
                                $('.preview').append(`<img src="../../../static/images/archive/WORD.png" title="${file.name}"/>`);
                            } else if (format == 'mp4' || format == 'flv' || format == 'avi' || format == 'mov') {
                                $('.preview').append(`<img src="../../../static/images/archive/VIDEO.png" title="${file.name}"/>`);
                            } else if (format == 'pdf') {
                                $('.preview').append(`<img src="../../../static/images/archive/PDF.png" title="${file.name}"/>`);
                            } else if (format == 'xls' || format == 'xlsx') {
                                $('.preview').append(`<img src="../../../static/images/archive/EXCEL.png" title="${file.name}"/>`);
                            } else if (format == 'ppt' || format == 'pptx') {
                                $('.preview').append(`<img src="../../../static/images/archive/PPT.png" title="${file.name}"/>`);
                            } else if (format == 'jpg' || format == 'jpeg' || format == 'png') {
                                $('.preview').append(`<img src="${result}" title="${file.name}"/>`);
                            } else {
                                $('.preview').append(`<img src="../../../static/images/archive/other.png" title="${file.name}"/>`);
                            }
                        })
                    }
                },
                done: function (res) {
                    if (donefunction) {
                        if(donefunction=="done_menu"){
                            if (res.state === true) {
                                var uploadimg = res.row;
                                $("#" + otherjson.nameid).val(uploadimg);
                            }
                            layer.msg(res.msg)
                        }else{
                            donefunction(res);
                        }
                    } else {
                        // fileUrl = res.row;
                        //序列化数据
                        if (res.state) {
                            var data = {};
                            var baseData = parent.$("#menuframe")[0].contentWindow.baseData;
                            data.auditorContent = $('textarea[name="auditorContent"]').val();
                            data.ids = baseData.id;
                            data.auditorAttachment = res.row;
                            if (parent.cancel) {
                                parent.app.post(cancelUrl, data, function (msg) {
                                    if (msg.state) {
                                        window.parent.frames["menuframe"].testRefresh();
                                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                                        parent.layer.close(index); //再执行关闭
                                        parent.cancel = null;
                                    }
                                    parent.layer.msg(msg.msg);
                                    //这里执行回传,并提示
                                    // window.frames["menuframe"].tableRefresh({ id: saveData.data.parentId, currentPage: pagevalue });
                                })
                            } else {
                                parent.app.post(action, data, function (res) {
                                    if (res.state) {
                                        window.parent.frames["menuframe"].testRefresh();
                                        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                                        parent.layer.close(index); //再执行关闭
                                        parent.cancel = null;
                                    }
                                    parent.layer.msg(res.msg);
                                    //这里执行回传,并提示
                                    // window.frames["menuframe"].tableRefresh({ id: saveData.data.parentId, currentPage: pagevalue });
                                })
                            }
                        }
                    }
                }
                , error: function (index, upload) {
                    if (errorfunction) {
                        errorfunction(index, upload);
                    } else {
                        console.log(upload);
                    }
                    //当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
                }
            })
        }
    });
}(app, $, window.myupload = {}))