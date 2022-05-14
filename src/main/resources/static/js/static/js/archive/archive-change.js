var tName = localStorage.getItem("tableN");
var archiveId = localStorage.getItem("archiveId");
var fileId=archiveId;
// var fileInfo;
// var wsValue = webinit(window.wsUri)
var textareaId = 0;
var isBoxId=false; 
$().ready(function () {
    formvalidate();
});
// 查询档案详情
function getDetail() {
    var form = layui.form;
    app.get("archivesmodule/arcTbFiles/selectFilesById", {
            tableName: tName,
            id: archiveId
        }, function (msg) {
			console.log(msg,'档案详情')
            if (msg.state) {
                var fileInfo = msg.row.detail;
                if(msg.row.boxId !== 0){
                    isBoxId=true;
                    $(".box-id").attr("disabled", "disabled");
                }
                var isdisabled=false;
                if (msg.row.state != "在架" && msg.row.state != "未上架") {
                    $(".container input,.container textarea").attr("readonly", "readonly");
                    $(".container select,.beCode,.printCode").attr("disabled", "disabled");
                    $(".container").find("input:radio").attr("disabled", "disabled");
                    $("#uploadfile").attr("disabled", "disabled");
                    $("button.save,span.close").css("display", "none");
                    $("button.quxiao").html("返回");
                    $(".downloadFile").unbind("click");
                    $("#card-name").html("详情");
                    isdisabled=true;
                }
                if(msg.row.barCode){
                    $("#hidden").val(msg.row.barCode);
                    $("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row.barCode);
                }
                // 生成条码
                $(".beCode").on("click", function () {
                    app.get("archivesmodule/brcode/createCodeNum", {}, function (msg) {
                        if (msg.state) {
                            $("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row);
                            $("#hidden").val(msg.row);
                        }
                    });
                });
                //打印条码
                $('.printCode').on('click', function () {
                    $("#pic").jqprint();
                });
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
                $("input[name=allowBorrows][value='0']").attr("checked", msg.row.allowBorrow == 0 ? true : false);
                $("input[name=allowBorrows][value='1']").attr("checked", msg.row.allowBorrow == 1 ? true : false);
                $("#direction").val(msg.row.direction);
                $("#regionNum").val(msg.row.fkRegionNum);
				// 渲染库房
                renderStoreRegion(msg.row);
                //加载档案信息
                var archiveInfo = showModule(msg);
                $("#archiveInfo").append(archiveInfo);
                form.val("formInfo", msg.row);
                form.val('formInfo', fileInfo);
				// 根据这里做判断吗 判个JB
                if(isdisabled || isdisabledpre){
                    $('input').attr("disabled",true);
                    $('select').attr("disabled",true);
                    $('radio').attr("disabled",true);
                    $('checkbox').attr("disabled",true);
                    $('button').attr("disabled",true);
                    $('a').attr("disabled",true);
                    $('textarea').attr("disabled",true);
                    $('.quxiao').attr("disabled",false);
                    $('.addArchiveCancel').attr("disabled",false);
                    form.render();
                }
            }else {
                layer.msg(msg.msg);
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

// 上传附件
var fileListArr=[];
function upAndDownload() {
    var arr = [];
    app.post("archivesmodule/arcTbFiles/addFilesAttachment", {
        filesId: archiveId,
        tableName: tName,
        list:fileListArr
    }, function (res) {
        if(!res.state){
            layer.msg(res.msg);
        }
    });
}

// 附件查询
function getFujian() {
    app.get("archivesmodule/arcTbFiles/selectFilesAttachment", {
        id: archiveId,
        tableName: tName
    }, function (msg) {
        $('#fileList').html('');
        var arr = [];
        if(msg.state && msg.rows){
            for (var i = 0; i < msg.rows.length; i++) {
                arr.push(msg.rows[i].id);
                var str = $(['<tr id="upload-' + i + '">'
                    , '<td>' + msg.rows[i].fileOldName + "." + msg.rows[i].fileSuffix + '</td>'
                    , '<td>' + msg.rows[i].fileSize + 'kb</td>'
                    , '<td>已上传</td>'
                    , '<td>'
                    , '<button type="button" class="layui-btn layui-btn-xs demo-delete">删除</button>'
                    , '<button type="button" class="layui-btn layui-btn-xs download-file">下载</button>'
                    , '<button type="button" class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                    , '</td>'
                    , '<td style="display: none;">' + JSON.stringify(msg.rows[i]) + '</td>'
                    , '</tr>'].join(''));
                $('#fileList').append(str);
                // str += '<a href="javascript:;" class="downloadFile">' + msg.rows[i].fileOldName + "." + msg.rows[i].fileSuffix + '</a><span class="layui-icon layui-icon-close close" style="display: inline-block; margin-left: 60px; vertical-align:middle; cursor: pointer"></span><br>';
            }
        }
        $('.demo-delete').each(function (index, ele) {
            $(this).on("click", function () {
                layer.confirm('是否确定删除？', {shade: 0}, function () {
                    app.post('archivesmodule/arcTbFiles/deleteFilesAttachment', {attachmentId: arr[index]}, function (res) {
                        if (res.state) {
                            layer.msg(res.msg);
                            getFujian();
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                });
            });
        });
        $(".download-file").each(function (index, ele) {
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
        var form = layui.form;
        table.render({
            elem: '#change_table'
            , data: datas
            , loading: false
            // , page: true //开启分页
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
            $("button").attr("disabled", "disabled");
            $("button.save,span.close").css("display", "none");
            $("button.quxiao").html("返回");
            $("button.quxiao").attr("disabled", false);
            $(".downloadFile").unbind("click");
            var data = obj.data;
            form.val("formInfo", data);
            form.val('formInfo', data.detail);
            selectLocations(data.fkLocationId);
            app.get("archivesmodule/arcTbAttachment/selecteAttachmentById",
                {fkAttachmentIds: data.fkAttachmentIds}, function (msg) {
                    $('#fileList').html('');
                    var arr = [];
                    if(msg.state && msg.rows){
                        for (var i = 0; i < msg.rows.length; i++) {
                            arr.push(msg.rows[i].id);
                            var str = $(['<tr id="upload-' + i + '">'
                                , '<td>' + msg.rows[i].fileOldName + "." + msg.rows[i].fileSuffix + '</td>'
                                , '<td>' + msg.rows[i].fileSize + 'kb</td>'
                                , '<td>已上传</td>'
                                , '<td>'
                                , '<button type="button" class="layui-btn layui-btn-xs demo-delete">删除</button>'
                                , '<button type="button" class="layui-btn layui-btn-xs download-file">下载</button>'
                                , '<button type="button" class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                                , '</td>'
                                , '<td style="display: none;">' + JSON.stringify(msg.rows[i]) + '</td>'
                                , '</tr>'].join(''));
                            $('#fileList').append(str);
                        }
                    }
                    $(".download-file").each(function (index, ele) {
                        $(this).on("click", function () {
                            document.location.href = imgurl + "filemodule/file/download?fileUrl=" + msg.rows[index].fileStoragePath + "&fileName=" + msg.rows[index].fileOldName;

                        });
                    });
                });
        });
    });

}
// 离开页面关闭服务
window.onbeforeunload = function () {
	app.bindingget("rfid/end", {}, function (msg) {
		if ((msg.code = 200)) {
			console.log("关闭");
		} else {
			console.log(msg.msg);
		}
	});
};
$(function () {
    // 进入页面开启读取RFID服务
    app.bindingget("rfid/start", {}, function (msg) {
        if ((msg.code = 200)) {
            console.log("开始读取");
        } else {
            console.log(msg.msg);
        }
    });
    var token = window.localStorage.getItem('token');
    $("#token").val(token);
    getFujian();
    $("#fkTypeId").val(archiveId);
    $("#tableName").val(tName);
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
        if(!isdisabledpre){
            changeRecord();
        }
        getDetail();
        //多文件列表示例
        var fileListView = $('#file_list');
        var uploadListIns = upload.render({
            elem: '#upload_files'
            , url: window.imgurl + 'filemodule/file/addOneFilesAttachments'
            , accept: 'file'
            , multiple: true
            , auto: false
            , size: 0
            , bindAction: '#reupload'
            , choose: function (obj) {
                var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                //读取本地文件
                obj.preview(function (index, file, result) {
                    var tr = $(['<tr style="text-align: center" id="upload-' + index + '">'
                        , '<td>' + file.name + '</td>'
                        , '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
                        , '<td>等待上传</td>'
                        , '<td>'
                        , '<a class="demo-reload layui-hide" style="color: #3a97ff">重传<span style="color:#3a97ff" >&nbsp;&nbsp;|&nbsp;</span></a>'
                        , '<a class="demo-delete" style="color: #3a97ff">删除</a>'
                        , '</td>'
                        , '</tr>'].join(''));
                    //单个重传
                    tr.find('.demo-reload').on('click', function () {
                        obj.upload(index, file);
                    });
                    //删除
                    tr.find('.demo-delete').on('click', function () {
                        delete files[index]; //删除对应的文件
                        tr.remove();
                        uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                    });
                    fileListView.append(tr);
                });
            }
            , done: function (res, index, upload) {
                if (res.code == 1) { //上传成功
                    var tr = fileListView.find('tr#upload-' + index)
                        , tds = tr.children();
                    tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                    tds.eq(3).html(''); //清空操作
                    fileListArr.push(res.row); // 存储上传文件后的返回信息
                    return delete this.files[index]; //删除文件队列已经上传成功的文件
                }
                this.error(index, upload);
            }
            , error: function (index, upload) {
                var tr = fileListView.find('tr#upload-' + index)
                    , tds = tr.children();
                tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
            }
        });
        distinguish();
        //密级监听
        var fkSecretName;
        form.on('select(secrete)', function (data) {
            $("#fkSecretId").val(data.value);
            fkSecretName = data.elem[data.elem.selectedIndex].text;
        });
        form.on('radio(radio_borrow_div)', function (data) {
            $('#borrow_div input').removeAttr('checked');
            $(data.elem).attr('checked','checked');
        });
        //保存
        var lock = false;//锁定
        form.on('submit(save)', function (data) {
            if (formvalidate().one.form() && formvalidate().two.form()) {
                var formData = data.field, obj = {},
                    other = ['allowBorrows', 'fkSecretId', 'fkSecretName', 'id', 'recordOrganizeId', 'tableName', 'file', 'fkSourceId','author','colNum','direction','divNum','fkRegionName','regionNum','fkStoreName','laysNum','number','recordOrganize','rfid'],
                    baseInfo = $('.del'), views = $('.view');
                if(fkSecretName){
                    formData.fkSecretName=fkSecretName;
                }
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
                for (var k = 0; k < views.length; k++) {
                    var element = views.eq(k);
                    var name = element.find('.layui-form-item').find('.hide').attr('name');
                    var flag = element.attr('data-flag');
                    if (flag === 'checkbox') {
                        var details = [];
                        var title = element.find('.layui-input-block').next().attr('name');
                        var checked = element.find('.layui-input-block').find('.layui-form-checked');
                        for (var h = 0; h < checked.length; h++) {
                            var value = checked.eq(h).find('span').text();
                            details.push(value);
                        }
                        // titleList.push(title);
                        formData[title] = details.join();
                    }else if(flag === 'select'){
                        formData[name] = element.find('.layui-input-block').find('.layui-select-title').find('input').val();
                    }else if(flag === 'radio') {
                        var radio = element.find('.layui-input-block').find('.layui-form-radioed').find('div').text();
                        formData[name] = radio;
                    }else {
                        formData[name] = element.find('.layui-input-block').children().val();
                    }
                }
                // data['title'] = titleList.join();
                obj.detail = formData;
                var fileName = $('input[name="fileName"]').val();
                var allowBorrows="是";
                if($('#borrow_div input[checked]').val()==0){
                    allowBorrows="否";
                }
                obj['allowBorrows'] = allowBorrows;
                if(isBoxId){
                    delete obj["fkRegionName"];
                    delete obj["regionNum"];
                    delete obj["fkStoreName"];
                    delete obj["colNum"];
                    delete obj["divNum"];
                    delete obj["laysNum"];
                    delete obj["direction"];
                    delete obj["number"];
                }else {
                    obj['fkStoreId'] = $("#store_Room1").find("option:selected").val();
                    obj['fkStoreName'] = $("#store_Room1").find("option:selected").html();
                    obj['fkRegionId'] = $("#area1").find("option:selected").val();
                    obj['fkRegionName'] = $("#area1").find("option:selected").html();
                    obj['fkRegionNum'] = $('input[name="regionNum"]').val();
                }
                obj['fkSecretId'] = $('input[name="fkSecretId"]').val();
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
                            if (data.state) {
                                if(fileListArr.length>0){
                                    upAndDownload();
                                }
                                layer.msg(data.msg); 
                                setTimeout(function () {
                                    if(location.search.split('=')[2]==1){
                                        window.location.href = "archives-admin.html";
                                    }else{
                                        window.location.href = "comprehensive-search.html";
                                    } 
                                }, 1500);
                            }
                            else {
                                lock = false;//锁定
                                layer.msg(data.msg);
                            }
                        }
                    });
                }
                //return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            }
        });
        form.render();
    });
});
//rfid识别搜索
/*
function distinguish() {
    $('#identify_tag').on('click',function () {
            var data={ wsUri: window.wsUri, cmd: 'readMany'};
            $('.rfid-loading').show();
            $('#identify_tag').attr('disabled',true).css('backgroundColor','#58b7f7');
            mycmd.rfid(data,function(res){
                if(res){
                    $('.rfid-loading').hide();
                    $('#identify_tag').attr('disabled',false).css('backgroundColor','#3a97ff');
                }   
                var res=JSON.parse(res);   
                if(res.state && res.row){   
                    if(res.row.EPC){
                        $('#rfid').val(res.row.EPC);
                        app.get('archivesmodule/arcTbFile/validateRfidIfExist', {"id": archiveId, "rfid": res.row.EPC}, function (res) {
                            if (!res.state) {
                                $("#identify_error").empty();
                                $("#rfid").after('<label id="identify_error" class="error" for="fondsId">'+res.msg+'</label>');
                            }else {
                                layer.msg("电子标签正确！");
                            }
                        });  
                    }
                
                }else{ 
                    // layer.msg('识别失败：请检查识别服务是否开启');
                    return;
                }
            });
    })
}*/
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
                if(flagEle[i].className==="icon" || flagEle[i].className==="form-value"){

                }else {
                    flagEle.eq(i).remove();
                }
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
//rfid
function  RFID(data) {
    $('#rfid').val(data);
}

// function webinit(url) {
// 	var ws = new WebSocket(url);
// 	let that = this;
// 	ws.onopen = e => {
// 		ws.send("connect");
// 		console.log("连接成功");
// 	};
// 	ws.onmessage = e => {
// 		let result = /^EPC/.test(e.data);
// 		//let result = 'EPCE22200174010016614808282'
// 		let notice = /error/.test(e.data);
// 		let reconnect = /reconnect/.test(e.data);
// 		console.log("接收的信息", e.data,result);
// 		let error = '设备连接失败'
// 		if(error== e.data){
// 			$("#identify_error").text('设备连接失败')
// 		}
// 		if(result){
// 			console.log(e.data,'检测RFID')
// 			if(e.data.length>4){
// 				let res = e.data.slice(3)
// 				readRFID(res)
// 				console.log('你没执行啊')
// 			}else{
// 				$('.rfid-loading').hide();
// 				$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
// 				// 弹框
// 				$("#identify_error").text('RFID为空')
				               
// 				console.log(!e.data,'RFID为空？')
// 			}
// 		}
// 		console.log("接收数据", e.data);
// 	};
// 	ws.onclose = e => {
// 		$('.rfid-loading').hide();
// 		$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
// 		$("#identify_error").text('连接关闭')
// 		console.log("连接关闭");
// 	};
// 	ws.onerror = e => {
// 		$('.rfid-loading').hide();
// 		$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
// 		$("#identify_error").text('设备连接失败')
// 		console.log("出错情况");
// 	};
// 	return ws;
// }
function readRFID(rfid){
	if(rfid){
		$('.rfid-loading').hide();
		$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
		// 发送请求
		$('#rfid').val(rfid);
		app.get('archivesmodule/arcTbFile/validateRfidIfExist', {
			"id": "",
			"rfid": rfid
		}, function(res) {
			if (!res.state) {
				$("#identify_error").empty();
				$("#identify_error").text(res.msg)
				//$("#rfid").after('<label id="identify_error" class="error" for="fondsId">' + res.msg + '</label>');
			} else {
				layer.msg("电子标签正确！");
				$("#identify_error").text('')
			}
		});
	}else{
		return
	}
	  

}

function distinguish(){
	$('#identify_tag').on('click', function() {
		$('#rfid').val('');
		$('.rfid-loading').show();
		$('#identify_tag').attr('disabled', true).css('backgroundColor', '#58b7f7');
        // wsValue.send('start')
        app.bindingget("rfid/getMessage", {}, function (msg) {
            if (msg.data) {
				if (msg.data.length > 1) {
                    layer.msg("请保证RFID识别区附近有且仅有一张电子标签");
				}
				else if (msg.data[0].code == 0) {
                    readRFID(msg.data[0].rfid);
				} else {
                    layer.msg(msg.data[0].msg);
				}
			} else {
                layer.msg("当前未识别到有效的电子标签");
            }
            $(".rfid-loading").hide();
            $("#identify_tag").attr("disabled", false).css("backgroundColor", "#3a97ff");
        });
		})
}