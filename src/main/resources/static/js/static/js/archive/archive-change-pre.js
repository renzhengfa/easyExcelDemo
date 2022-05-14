var tName = localStorage.getItem("tableN");
var archiveId = localStorage.getItem("archiveId");
var fileInfo;
var textareaId = 0;
// 查询档案详情
function getDetail() {
    var form = layui.form;
    app.get("archivesmodule/arcTbFiles/selectFilesById", {
            tableName: tName,
            id: archiveId
        }, function (msg) {
            console.log(msg);
            if (msg.state) {
                fileInfo = msg.row.detail;
                if (msg.row.state != "在架" && msg.row.state != "未上架") {
                    $(".container input,.container textarea").attr("readonly", "readonly");
                    $(".container select,.beCode,.printCode").attr("disabled", "disabled");
                    $(".container").find("input:radio").attr("disabled", "disabled");
                    $("#uploadfile").attr("disabled", "disabled");
                    $("button.save,span.close").css("display", "none");
                    // $("button.quxiao").html("返回");
                    $(".downloadFile").unbind("click");
                }
                $("#hidden").val(msg.row.barCode);
                $("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row.barCode);
                // // 生成条码
                // $(".beCode").on("click", function () {
                //     app.get("archivesmodule/brcode/createCodeNum", {}, function (msg) {
                //         console.log(msg);
                //         if (msg.state) {
                //             $("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row);
                //             $("#hidden").val(msg.row);
                //         }
                //     });
                // });
                // //打印条码
                // $('.printCode').on('click', function () {
                //     $("#pic").jqprint();
                // });
                // var miji = msg.row.fkSecretName;
                // var origin = msg.row.source;
                // app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=ofthem", {}, function (msg) {
                //     if (msg.state) {
                //         var str = "";
                //         for (var i = 0; i < msg.rows.length; i++) {
                //             var str1 = '<option value=""></option>';
                //             if (msg.rows[i].svalue == miji) {
                //                 str += '<option selected value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                //             } else {
                //                 str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                //             }
                //         }
                //         $("#miji").html(str1 + str);
                //         form.render("select");
                //     }
                // });
                // app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=arc_source", {}, function (msg) {
                //     if (msg.state) {
                //         var str = "";
                //         for (var i = 0; i < msg.rows.length; i++) {
                //             var str1 = '<option value=""></option>';
                //             if (msg.rows[i].svalue == origin) {
                //                 str += '<option selected value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                //             } else {
                //                 str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                //             }
                //         }
                //         $("#origin").html(str1 + str);
                //         form.render("select");
                //     }
                // });
                // var allowB = "";
                // msg.row.allowBorrow == "0" ? (allowB = "否") : (allowB = "是");
                form.val("formInfo", {
                    fileName: msg.row.fileName,
                    fileNum: msg.row.fileNum,
                    fondsId: msg.row.fondsId,
                    fkSourceId: msg.row.fkSourceId,
                    author: msg.row.author,
                    recordOrganize: msg.row.recordOrganize,
                    pageNum: msg.row.pageNum,
                    integrity: msg.row.integrity,
                    type: msg.row.fkTypeName,
                    summary: msg.row.summary,
                    allowBorrows: msg.row.allowBorrow,
                    rfid: msg.row.rfid,
                    recordOrganizeId: msg.row.recordOrganizeId,
                    fkSecretName: msg.row.fkSecretName,
                    fkSecretId: msg.row.fkSecretId,
                    fkAttachmentIds: msg.row.fkAttachmentIds,
                    fkTypeName: msg.row.fkTypeName,
                    number: msg.row.number
                });
                $("input[name=allowBorrow][value='0']").attr("checked", msg.row.allowBorrow == 0 ? true : false);
                $("input[name=allowBorrow][value='1']").attr("checked", msg.row.allowBorrow == 1 ? true : false);
                $("#direction").val(msg.row.direction);
                var fkStoreName = msg.row.fkStoreName;
                var fkStoreId = msg.row.fkStoreId;
                var fkRegionName = msg.row.fkRegionName;
                var fkRegionId = msg.row.fkRegionId;
                var colNum = msg.row.colNum;
                var divNum = msg.row.divNum;
                var laysNum = msg.row.laysNum;
                // 库房初始渲染
                app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function (msg) {
                    if (msg.state) {
                        var str1 = '<option value=""></option>';
                        var str = "";
                        for (var i = 0; i < msg.rows.length; i++) {
                            if (msg.rows[i].storeName == fkStoreName) {
                                str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].storeName + "</option>";
                            } else {
                                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + "</option>";
                            }
                        }
                        $("#store_Room1").html(str1 + str);
                        form.render();
                    }
                });
                if(fkStoreId){
                    // 区初始渲染
                    app.get("storeroommodule/stoTbRegion/selectByBind", {fkStoreId: fkStoreId}, function (msg) {
                        var area = $("#area1");
                        if (msg.state) {
                            var str1 = '<option value=""></option>';
                            var str = "";
                            for (var i = 0; i < msg.rows.length; i++) {
                                if (msg.rows[i].regionName == fkRegionName) {
                                    str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].regionName + "</option>";
                                } else {
                                    str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
                                }
                            }
                            area.html(str1 + str);
                            form.render();
                        }
                    });
                }
                if(fkRegionId){
                    // 列节层初始渲染
                    app.get("storeroommodule/stoTbRegion/selectByRegionId", {id: fkRegionId}, function (msg) {
                        if (msg.state && msg.row) {
                            var cols = $("#cols1"),
                                lays = $("#lays1"),
                                divs = $("#divs1");
                            var str1 = '<option value=""></option>';
                            var str2 = "";
                            var str3 = "";
                            var str4 = "";
                            if(msg.row.gdlType=='左边'){
                                for (var i = 0; i < msg.row.cols; i++) {
                                    if (i == colNum) {
                                        str2 += '<option value="' + i + '" selected>' + i + '</option>';
                                    } else {
                                        str2 += '<option value="' + i + '">' + i + '</option>';
                                    }
                                }
                            }else{
                                for (var i = 1; i <= msg.row.cols; i++) {
                                    if (i == colNum) {
                                        str2 += '<option value="' + i + '" selected>' + i + '</option>';
                                    } else {
                                        str2 += '<option value="' + i + '">' + i + '</option>';
                                    }
                                }
                            }
                            for (var i = 1; i <= msg.row.divs; i++) {
                                if (i == divNum) {
                                    str3 += '<option value="' + i + '" selected>' + i + '</option>';
                                } else {
                                    str3 += '<option value="' + i + '">' + i + '</option>';
                                }
                            }
                            for (var i = 1; i <= msg.row.lays; i++) {
                                if (i == laysNum) {
                                    str4 += '<option value="' + i + '" selected>' + i + '</option>';
                                } else {
                                    str4 += '<option value="' + i + '">' + i + '</option>';
                                }
                            }
                            cols.html(str1 + str2);
                            lays.html(str1 + str3);
                            divs.html(str1 + str4);
                            form.render();
                        }
                    });
                }
                //加载档案信息
                var archiveInfo = showModule(msg);
                // console.log(msg);
                $("#archiveInfo").append(archiveInfo);
                // console.log(fileInfo);
                form.val('formInfo', fileInfo);
                $('input').attr("disabled",true);
                $('select').attr("disabled",true);
                $('radio').attr("disabled",true);
                $('checkbox').attr("disabled",true);
                $('button').attr("disabled",true);
                $('textarea').attr("disabled",true);
                // $(".layui-form-select").addClass("layui-select-disabled");
                $('.addArchiveCancel').attr("disabled",false);
                form.render();
            }else {
                layer.msg(msg.msg);
            }
        }
    );
}


// 获取来源、密级
function getSelectInfo(typename, idname) {
    app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=" + typename, {}, function (msg) {
        //console.log(msg);
        if (msg.state) {
            var str = "";
            for (var i = 0; i < msg.rows.length; i++) {
                var str1 = '<option value=""></option>';
                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
            }
            $("#" + idname).html(str1 + str);
        }
    });
}

// 上传附件
function upAndDownload() {
    var arId = localStorage.getItem("archiveId");
    var tn = localStorage.getItem("tableN");
    var arr = [];
    app.post("archivesmodule/arcTbFiles/addFilesAttachment", {
        filesId: arId,
        tableName: tn,
        fileOldName: fileOldName,
        fileFullName: fileFullName,
        fileSuffix: fileSuffix,
        filePrefix: filePrefix,
        fileStoragePath: fileStoragePath,
        fileSize: fileSize
    }, function (msg) {
        // console.log(msg);
        var str = "";
        for (var i = 0; i < msg.rows.length; i++) {
            arr.push(msg.rows[i].id);
            str += '<a href="javascript:;" class="downloadFile">' + msg.rows[i].fileOldName + "." + msg.rows[i].fileSuffix + '</a><span class="layui-icon layui-icon-close close" style="display: inline-block; margin-left: 40px; vertical-align:middle; cursor: pointer"></span><br>';
        }
        //console.log(arr);
        $("#filename").html(str).show();
        $(".downloadFile").each(function (index, ele) {
            $(this).on("click", function () {
                document.location.href = imgurl + "filemodule/file/download?fileUrl=" + msg.rows[index].fileStoragePath + "&fileName=" + msg.rows[index].fileOldName;
            });
        });
        $(".close").each(function (index, ele) {
            $(this).on("click", function () {
                layer.confirm('是否确定删除？', {shade: 0}, function () {
                    // 请求接口
                    app.post("archivesmodule/arcTbFiles/deleteFilesAttachment", {
                        attachmentId: arr[index]
                    }, function (msg) {
                        if (msg.state) {
                            layer.msg(msg.msg);
                            getFujian();
                        }
                    });
                });
            });
        });
    });
}

// 附件查询
function getFujian() {
    var arId = localStorage.getItem("archiveId");
    var tn = localStorage.getItem("tableN");
    app.get("archivesmodule/arcTbFiles/selectFilesAttachment", {
        id: arId,
        tableName: tn,
    }, function (msg) {
        console.log(msg);
        var str = "";
        var arr = [];
        if(msg.state && msg.rows!== null){
            for (var i = 0; i < msg.rows.length; i++) {
                arr.push(msg.rows[i].id);
                str += '<a href="javascript:;" class="downloadFile disabled">' + msg.rows[i].fileOldName + "." + msg.rows[i].fileSuffix + '</a><span class="layui-icon layui-icon-close close disabled" style="display: inline-block; margin-left: 60px; vertical-align:middle; cursor: pointer"></span><br>';
            }
            $("#filename").html(str).show();
            $(".downloadFile").each(function (index, ele) {
                $(this).on("click", function () {
                    document.location.href = imgurl + "filemodule/file/download?fileUrl=" + msg.rows[index].fileStoragePath + "&fileName=" + msg.rows[index].fileOldName;
                });
            });
            $(".close").each(function (index, ele) {
                $(this).on("click", function () {
                    layer.confirm('是否确定删除？', {shade: 0}, function () {
                        // 请求接口
                        app.post("archivesmodule/arcTbFiles/deleteFilesAttachment", {
                            attachmentId: arr[index]
                        }, function (msg) {
                            if (msg.state) {
                                layer.msg(msg.msg);
                                //layer.close(layer.index);
                                getFujian();
                            }
                        });
                    });
                });
            });
        }
    });
}
var fileOldName = "", fileFullName = "", fileSuffix = "", filePrefix = "", fileStoragePath = "", fileSize = "";
$(function () {
    var token = window.localStorage.getItem('token');
    $("#token").val(token);
    getFujian();
    var arId = localStorage.getItem("archiveId");
    var tn = localStorage.getItem("tableN");
    $("#fkTypeId").val(localStorage.getItem("archiveId"));
    $("#tableName").val(localStorage.getItem("tableN"));
    getSelectInfo("ofthem", "miji");
    getSelectInfo("arc_source", "origin");

    function setHeader(xhr) {
        xhr.setRequestHeader("authorization", localStorage.getItem("token"));
    }

    layui.use(["form", "element", "layer", "table", "laydate", "upload"], function () {
        var element = layui.element;
        var layer = layui.layer;
        var form = layui.form;
        var table = layui.table;
        var upload = layui.upload;
        getDetail();
        upload.render({
            elem: '#uploadfile'
            , url: imgurl + 'filemodule/file/addOneFilesAttachments'
            , multiple: true
            , accept: 'file'
            , done: function (res, index, upload) { //上传后的回调
                // console.log(res);
                //$("#fkAttachmentIds").val(res.row);
                layer.msg(res.msg);
                fileOldName = res.row.fileOldName;
                fileFullName = res.row.fileFullName;
                fileSuffix = res.row.fileSuffix;
                filePrefix = res.row.filePrefix;
                fileStoragePath = res.row.fileStoragePath;
                fileSize = res.row.fileSize;
                upAndDownload();
            }
        });
        //保存
        var lock = false;
        form.on('submit(save)', function (data) {
            // console.log(data.field); //当前容器的全部表单字段，名值对形式：{name: value}
            var formData = data.field, obj = {},
                other = ['allowBorrows', 'fkSecretId', 'fkSecretName', 'id', 'recordOrganizeId', 'tableName', 'file', 'fkSourceId'],
                baseInfo = $('.del');
            for (var i = 0; i < baseInfo.length; i++) {
                var item = baseInfo.eq(i).attr('name');
                obj[item] = formData[item];
                delete formData[item];
            }
            for (var j = 0; j < other.length; j++) {
                var item = other[j];
                obj[item] = formData[item];
                delete formData[item];
            }
            obj.detail = formData;
            var fileName = $('input[name="fileName"]').val();
            obj.fileName = fileName;

            if(!lock) {
                lock = true;//锁定
                $.ajax({
                    type: "post",
                    url: baseurl + "archivesmodule/arcTbFiles/updateFilesInId",
                    data: JSON.stringify(obj),
                    beforeSend: setHeader,
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        // console.log(data);
                        if (data.state) {
                            layer.msg(data.msg);
                            setTimeout(function () {
                                window.location.href = "archives-admin.html";
                            }, 1500);
                        }
                        else {
                            layer.msg(data.msg);
                        }
                    }
                });
            }
            //return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。

        });
        form.render();
    });
});

//根据档案类别显示档案信息模板
function showModule(data) {
    layui.use('form', function () {
        var form = layui.form;
        var contanier = $('#archiveInfo');
        contanier.empty();
        var module = downloadLayoutSrc(data);
        contanier.append(module);
        for (var z = 0; z < textareaId; z++) {
            var editor = new Simditor({
                textarea: $(`#editor${z}`),
                //optional options
                toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color',
                    'ol', 'ul', 'blockquote', 'code',           //# code block
                    'table', 'link', 'image', 'hr',            // # horizontal ruler
                    'indent', 'outdent', 'alignment',]
            });
        }
        form.render();
        var moudleInfo = data.row.detail;
        if (moudleInfo) {
            console.log(moudleInfo);
            $('.simditor-placeholder').empty();
            form.val('archiveInfo', moudleInfo);
            var list = $('textarea');
            for (var i = 0; i < list.length; i++) {
                if ($(list[i]).attr('id') !== undefined) {
                    var textareaName = $(list[i]).attr('name');
                    $(list[i]).prev().empty().append(moudleInfo[textareaName]);
                }
            }
        }
    });
}

//得到模板的html代码
function downloadLayoutSrc(res) {
    if (res.row !== null && res.row.htmlTpl !== null) {
        let code = res.row.htmlTpl;
        var code_arr=[];
        for(var code_i=0;code_i<$(code).length;code_i++){
            //转换为dom对象
            let codemode = $(code).get(code_i);
            // console.log(code);
            let flagEle = $(codemode).find('span'), flagDiv = $(codemode).find('div'), oInput = $(codemode).find('input');
            for (var i in flagEle) {
                flagEle.eq(i).remove();
            }
            for (var j in flagDiv) {
                var Odiv = flagDiv.eq(j);
                if (Odiv.hasClass('preview')) {
                    Odiv.remove();
                }
                if (Odiv.hasClass('layui-form-select')) {
                    Odiv.remove();
                }
                if (Odiv.hasClass('simditor')) {
                    var parentEle = Odiv.parent();
                    var textarea = `<textarea id="editor${textareaId}" class="hide"></textarea>`;
                    parentEle.append(textarea);
                    Odiv.remove();
                    textareaId++;
                }
            }
            for (var k in oInput) {
                if (oInput.eq(k).hasClass('hide')) {
                    var nameAttr = $(oInput.eq(k)).attr('name');
                    var elem = $(oInput.eq(k));
                    //给除了富文本之外的元素添加属性
                    if ($(elem).parent().hasClass('layui-form-item')) {
                        var childElem = $(elem).prev().children(),
                            flag = $(elem).closest('.view').attr('data-flag');
                        //给除了富文本和checkbox之外的元素添加name属性
                        if (flag !== 'checkbox') {
                            $(childElem).attr('name', nameAttr);
                        }
                        //如果是input和textarea还需添加maxlength,minlength
                        if (flag == 'input' || flag == 'textarea') {
                            var max = $(oInput.eq(k)).attr('maxlength'),
                                min = $(oInput.eq(k)).attr('minlength'),
                                tip = $(oInput.eq(k)).attr('placeholder');
                            $(childElem).attr({
                                'maxlength': max,
                                'minlength': min,
                                'placeholder': tip
                            });
                        }
                    } else if ($(elem).parent().attr('data-flag')) {
                        //给富文本设置属性
                        var richTextName = $(elem).attr('name'),
                            max = $(elem).attr('maxlength'),
                            min = $(elem).attr('minlength'),
                            tip = $(elem).attr('placeholder');
                        $(elem).next().attr({
                            'name': richTextName,
                            'minlength': min,
                            'maxlength': max,
                            'placeholder': tip
                        });
                    }
                    //将传递属性的input删除
                    // $(elem).remove();
                }
            }
            code_arr[code_i]=codemode;
        }
        return code_arr;
    }
}
