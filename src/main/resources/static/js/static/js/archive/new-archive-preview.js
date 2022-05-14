var tName = localStorage.getItem("tableN");
var archiveId = localStorage.getItem("archiveId");
var fileInfo;
var textareaId = 0;
/**/
// 查询档案详情
function getDetail() {
    var form = layui.form;
    app.get("archivesmodule/arcTbFiles/selectFilesById", {
            tableName: tName,
            id: archiveId
        }, function (msg) {
            fileInfo = msg.row.detail;
            if (msg.row.state != "在架" && msg.row.state != "未上架") {
                $(".container input,.container textarea").attr("readonly", "readonly");
                $(".container select,.beCode,.printCode").attr("disabled", "disabled");
                $(".container").find("input:radio").attr("disabled", "disabled");
                $("button.save,span.close").css("display", "none");
                $("button.quxiao").html("返回");
                $(".downloadFile").unbind("click");
            }

            if (msg.state) {
                $("#hidden").val(msg.row.barCode);
                $("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row.barCode);
                var miji = msg.row.fkSecretName;
                var origin = msg.row.source;
                app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=ofthem", {}, function (msg) {
                    if (msg.state) {
                        var str = "";
                        for (var i = 0; i < msg.rows.length; i++) {
                            if (msg.rows[i].svalue == miji) {
                                str += '<option selected value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                            } else {
                                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                            }
                        }
                        $("#miji").html(str);
                        form.render("select");
                    }
                });
                app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=arc_source", {}, function (msg) {
                    if (msg.state) {
                        var str = "";
                        for (var i = 0; i < msg.rows.length; i++) {
                            if (msg.rows[i].svalue == origin) {
                                str += '<option selected value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                            } else {
                                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                            }
                        }
                        $("#origin").html(str);
                        form.render("select");
                    }
                });
                var allowB = "";
                msg.row.allowBorrow == "0" ? (allowB = "否") : (allowB = "是");
                var isfkSecretId=msg.row.fkSecretId;
                if(isfkSecretId === 0){
                    app.getAsync("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=ofthem", {}, function (ismsg) {
                        //console.log(msg);
                        if (ismsg.state) {
                            for (var i = 0; i < ismsg.rows.length; i++) {
                                if(ismsg.rows[i].svalue===msg.row.fkSecretName){
                                    isfkSecretId=ismsg.rows[i].id;
                                    return false;
                                }
                            }
                        }
                        else{
                            console.log(ismsg);
                        }
                    });
                }
                form.val("formInfo", {
                    fileName: msg.row.fileName,
                    fileNum: msg.row.fileNum,
                    fondsId: msg.row.fondsId,
                    fkSourceId: msg.row.source,
                    author: msg.row.author,
                    recordOrganize: msg.row.recordOrganize,
                    pageNum: msg.row.pageNum,
                    integrity: msg.row.integrity,
                    type: msg.row.fkTypeName,
                    summary: msg.row.summary,
                    allowBorrows: allowB,
                    rfid: msg.row.rfid,
                    recordOrganizeId: msg.row.recordOrganizeId,
                    fkSecretName: msg.row.fkSecretName,
                    fkSecretId: isfkSecretId,
                    fkAttachmentIds: msg.row.fkAttachmentIds,
                    fkTypeName: msg.row.fkTypeName,
                    detail:msg.row.detail.checkbox
                });
                form.val('formInfo', fileInfo);
            }
        }
    );
}
// 获取来源、密级
function getSelectInfo(typename, idname) {
    app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=" + typename, {}, function (msg) {
        if (msg.state) {
            var str = "";
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
            }
            $("#" + idname).html(str);
        }
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
        for (var i = 0; i < msg.rows.length; i++) {
            arr.push(msg.rows[i].id);
            str += '<a href="javascript:;" class="downloadFile">' + msg.rows[i].fileOldName + "." + msg.rows[i].fileSuffix + '</a><span class="layui-icon layui-icon-close close" style="display: inline-block; margin-left: 60px; vertical-align:middle; cursor: pointer"></span><br>';
        }
        //console.log(arr);
        $("#filename").html(str).show();
        $(".downloadFile").each(function (index, ele) {
            $(this).on("click", function () {
                document.location.href = imgurl + "filemodule/file/download?fileUrl=" + msg.rows[index].fileStoragePath + "&fileName=" + msg.rows[index].fileOldName;
            });
        });
     
    });
}

// 变更记录
function changeRecord() {
    app.get("archivesmodule/ArcTbFileChangeRecord/selectChangeRecordfilesInId", {fkFileId: archiveId}, function (msg) {
        var datas = msg.rows;
        var table = layui.table;
        var table = layui.table;
        var form = layui.form;
        table.render({
            elem: '#change_table'
            , data: datas
            , loading: false
            , cols: [[ //表头
                {field: 'updateTime', title: '更新时间', align: "center"}
                , {field: 'fileUserName', title: '操作人', align: "center"}
            ]]
        });
        //监听行单击事件（单击事件为：rowDouble）
        table.on('row(changeTable)', function (obj) {
            $(".container input,.container textarea").attr("readonly", "readonly");
            $(".container select,.beCode,.printCode").attr("disabled", "disabled");
            $(".container").find("input:radio").attr("disabled", "disabled");
            $("#uploadfile").attr("disabled", "disabled");
            $("button.save,span.close").css("display", "none");
            $("button.quxiao").html("返回");
            $(".downloadFile").unbind("click");
            var data = obj.data;
            app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=ofthem", {}, function (msg) {
                if (msg.state) {
                    var str = "";
                    for (var i = 0; i < msg.rows.length; i++) {
                        var str1 = '<option value=""></option>';
                        if (msg.rows[i].svalue == data.fkSecretName) {
                            str += '<option selected value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                        } else {
                            str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                        }
                    }
                    $("#miji").html(str1 + str);
                    form.render("select");
                }
            });
            app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=arc_source", {}, function (msg) {
                if (msg.state) {
                    var str = "";
                    for (var i = 0; i < msg.rows.length; i++) {
                        var str1 = '<option value=""></option>';
                        if (msg.rows[i].id == data.fkSourceId) {
                            str += '<option selected value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                        } else {
                            str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
                        }
                    }
                    $("#origin").html(str1 + str);
                    form.render("select");
                }
            });
            var allowB = "";
            data.allowBorrow == "0" ? (allowB = "否") : (allowB = "是");
            form.val("formInfo", {
                fileName: data.fileName,
                fileNum: data.fileNum,
                fondsId: data.fondsId,
                fkSourceId: data.source,
                author: data.author,
                recordOrganize: data.recordOrganize,
                pageNum: data.pageNum,
                integrity: data.integrity,
                type: data.fkTypeName,
                summary: data.summary,
                allowBorrows: allowB,
                rfid: data.rfid,
                recordOrganizeId: data.recordOrganizeId,
                fkSecretName: data.fkSecretName,
                fkSecretId: data.fkSecretId,
                fkAttachmentIds: data.fkAttachmentIds,
                fkTypeName: data.fkTypeName,
                detail:data.detail.checkbox
            });
            //加载档案信息
            var archiveInfo = showModule(msg);
            $("#archiveInfo").append(archiveInfo);
            form.val('formInfo', fileInfo);
        });
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

    layui.use(["form", "element", "layer", "table", "laydate"], function () {
        var element = layui.element;
        var layer = layui.layer;
        var form = layui.form;
        var table = layui.table;
        changeRecord();
        getDetail();
        form.render();
    });
});
