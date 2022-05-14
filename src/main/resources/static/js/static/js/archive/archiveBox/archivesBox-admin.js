/**
 * @author guijinsong
 */
// 初始化
// var wsValue = webinit(window.wsUri)
var wsFlag = false // false代表查询  true代表编辑的数据
var btnstart=false;
var locationId = "",archiveId="";
var tableInit = function (mytable, url) {
    var table_name = $("#hidden").val();
    var form = layui.form;
    var table = layui.table;
    var demoTable_height=$(".layui-form").outerHeight(true)+$(".btns").outerHeight(true)+100;
    mytable.init({
        id: "archivesBox_table",
        pageCode: "archivesBox-admin",
        limit: 20,height:"full-"+demoTable_height+"",
        url: url 
    }).then(function (table) {
        //监听工具条
        table.on("tool(archivesBox)", function (obj) {
            var data = obj.data, typeId = $("#hidden").val();
            var fkStoreName = "";
            var fkRegionName = "";
            var colNum = "";
            var laysNum = "";
            var divNum = "";
            var direction = "";
            var number = "";
            archiveId=data.id;
			console.log('你触发了')
            // 编辑相关
            if (obj.event === "edit") {
                mySelected = [];
                arr_state=[];
                app.get("archivesmodule/arcTbFiles/selectByBoxId", {
                    tableName: localStorage.getItem("tableNamesBox"),
                    boxId: data.id
                }, function (msg) {
                    if(msg.state && msg.row){
                        // 获取条码
                        $("#hidden_input").val(msg.row.barCode);
                        $("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row.barCode);
                        // 生成条码
                        $(".beCode").on("click", function () {
                            app.get("archivesmodule/brcode/createCodeNum", {}, function (msg) {
                                if (msg.state) {
                                    $("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row);
                                    $("#hidden_input").val(msg.row);
                                }
                            });
                        });
                        // 打印条码
                        $('.print-code').on('click', function () {
                            $("#pic").jqprint();
                        });
                        //表单初始赋值
                        form.val('formTest', {
                            "fileNum": msg.row.fileNum,
                            "fileName": msg.row.fileName,
                            "author": msg.row.author,
                            "recordOrganize": msg.row.recordOrganize,
                            "rfid": msg.row.rfid
                        });
                        app.get("archivesmodule/arcTbFiles/selectLocationById", { id: msg.row.fkLocationId }, function (msg) {
							console.log('location',msg) //这里是档案的所有数据 为了渲染还要调用下拉框函数
                            locationId = msg.row.id;
							fkStoreId = msg.row.fkStoreId
							fkRegionId = msg.row.fkRegionId
                            fkStoreName = msg.row.fkStoreName;
                            fkRegionName = msg.row.fkRegionName;
                            colNum = msg.row.colNum;
                            laysNum = msg.row.laysNum;
                            divNum = msg.row.divNum;
                            direction = msg.row.direction;
                            // console.log(`数据：${JSON.stringify(msg)}`);
                            $("#dire").val(direction);
                            $(".quhao").val(msg.row.fkRegionNum);
                            $(".shuzi").val(msg.row.number);
							// 最后赋值
                            $("#area").html('<option value="' + msg.row.id + '" selected>' + fkRegionName + '</option>');
                            $("#cols").html('<option value="' + colNum + '" selected>' + colNum + '</option>');
                            $("#lays").html('<option value="' + laysNum + '" selected>' + laysNum + '</option>');
                            $("#divs").html('<option value="' + divNum + '" selected>' + divNum + '</option>');
                            form.val('formTest', {
                                "locationName": msg.row.locationName
                            });
                            form.render("select");
							
							// 获取库房名称、区、列、节、层......
							app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function (msg) {
								console.log('库房相关',msg) // 这里生成了库房
							    if (msg.state) {
							        var str1 = '<option value=""></option>';
							        var str = "";
							        for (var i = 0; i < msg.rows.length; i++) {
							            if (msg.rows[i].storeName == fkStoreName) {
							                str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].storeName + '</option>';
							            } else {
							                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + '</option>';
							            }
							        }
							        $("#store_Room").html(str1 + str);
							        form.render('select');
							        form.on("select(storeroom)", function (data) {
							            app.get("storeroommodule/stoTbRegion/selectByBind", { fkStoreId: data.value }, function (msg) {
							                if (msg.state) {
							                    var str1 = '<option value=""></option>';
							                    var str = "";
							                    var str2 = "";
							                    var str3 = "";
							                    var str4 = "";
							                    for (var i = 0; i < msg.rows.length; i++) {
							                        str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
							                    }
							                    $("#area").html(str1 + str);
							                    form.render('select');
							                    form.on("select(areaName)", function (data) {
							                        app.get("storeroommodule/stoTbRegion/selectByRegionId", { id: data.value }, function (msg) {
							                            if (msg.state) {
							                                $(".quhao").val(msg.row.regionNum);
							                                if(msg.row.gdlType=='左边'){
							                                    for (var i = 0; i < msg.row.cols; i++) {
							                                        str2 += '<option value="' + i + '">' + i + '</option>';
							                                    }
							                                }else{
							                                    for (var i = 1; i <= msg.row.cols; i++) {
							                                        str2 += '<option value="' + i + '">' + i + '</option>';
							                                    }
							                                }
							                                for (var i = 1; i <= msg.row.lays; i++) {
							                                    str3 += '<option value="' + i + '">' + i + '</option>';
							                                }
							                                for (var i = 1; i <= msg.row.divs; i++) {
							                                    str4 += '<option value="' + i + '">' + i + '</option>';
							                                }
							                                $("#cols").html(str1 + str2);
							                                $("#lays").html(str1 + str3);
							                                $("#divs").html(str1 + str4);
							                                form.render('select');
							
							                            }
							                        });
							                    });
							                }
							            });
							        });
							        form.render('select');
							    }
							});
							
							// 根据库房生成 区列节层列表
							app.get("storeroommodule/stoTbRegion/selectByBind", { fkStoreId: fkStoreId }, function (msg) {
								console.log('区的生成','别吧',msg)
							    if (msg.state) {
							        var str1 = '<option value=""></option>';
							        var str = "";
							        var str2 = "";
							        var str3 = "";
							        var str4 = "";
									// 这里是生成区
							        for (var i = 0; i < msg.rows.length; i++) {
							            str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
							        }
							        $("#area").html(str1 + str);
									$("#area").val(fkRegionId)
							        form.render('select');
							        // 这里是根据区生成对应的区列节层
							            app.get("storeroommodule/stoTbRegion/selectByRegionId", { id: fkRegionId }, function (msg) {
							                if (msg.state) {
							                    $(".quhao").val(msg.row.regionNum);
							                    if(msg.row.gdlType=='左边'){
							                        for (var i = 0; i < msg.row.cols; i++) {
							                            str2 += '<option value="' + i + '">' + i + '</option>';
							                        }
							                    }else{
							                        for (var i = 1; i <= msg.row.cols; i++) {
							                            str2 += '<option value="' + i + '">' + i + '</option>';
							                        }
							                    }
							                    for (var i = 1; i <= msg.row.lays; i++) {
							                        str3 += '<option value="' + i + '">' + i + '</option>';
							                    }
							                    for (var i = 1; i <= msg.row.divs; i++) {
							                        str4 += '<option value="' + i + '">' + i + '</option>';
							                    }
							                    $("#cols").html(str1 + str2);
							                    $("#lays").html(str1 + str3);
							                    $("#divs").html(str1 + str4);
												// 赋值
												$("#cols").val(colNum)
												$("#lays").val(laysNum)
												$("#divs").val(divNum)
							                    form.render('select');
														
							                }
							            });
							        
							    }
							});
                        });
                        
                    }else {
                        layer.msg(msg.msg);
                    }
                });
                layer_boxInfo("编辑档案盒", obj);
                // 拆盒
                $(".split-box").on("click", function () {
                    if(btnstart) {return false};
                    btnstart=true;
                    setTimeout(function(){btnstart=false},500)
                    layer.confirm('是否确定拆盒？', { shade: 0 }, function (index) {
                        // 请求接口
                        app.post("archivesmodule/arcTbFiles/openBox", {
                            tableName: table_name,
                            boxId: data.id
                        }, function (msg) {
                            if (msg.state) {
                                layer.msg(msg.msg);
                                table.reload('archivesBox_table', {
                                    url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=' + $("#hidden").val()
                                    , where: {} //设定异步数据接口的额外参数
                                });
                                table.reload('file_info', {
                                    url: baseurl + "archivesmodule/arcTbFiles/selectFilesByBoxId?field=fileNum&sort=asc&tableName=" + table_name + "&boxId=" + boxId
                                    , where: {} //设定异步数据接口的额外参数
                                });
                            } else {
                                layer.msg(msg.msg);
                            }
                        });
                    });
                });
                // 移除档案
                $(".remove-files").on("click", function () {
                    if(btnstart) {return false};
                    btnstart=true;
                    setTimeout(function(){btnstart=false},500)
                    if (mySelected.length === "") {
                        layer.msg("请选择要移除的档案！", { time: 1000 });
                    } else {
                        layer.confirm('是否确定移除档案？', { shade: 0 }, function (index) {
                            // 请求接口
                            app.post("archivesmodule/arcTbFiles/removeInBoxFiles", {
                                tableName: table_name,
                                ids: mySelected
                            }, function (msg) {
                                if (msg.state) {
                                    layer.msg(msg.msg);
                                    table.reload('archivesBox_table', {
                                        url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=' + $("#hidden").val()
                                        , where: {} //设定异步数据接口的额外参数
                                    });
                                    table.reload('file_info', {
                                        url: baseurl + "archivesmodule/arcTbFiles/selectFilesByBoxId?field=fileNum&sort=asc&tableName=" + table_name + "&boxId=" + boxId
                                        , where: {} //设定异步数据接口的额外参数
                                    });
                                } else {
                                    layer.msg(msg.msg);
                                }
                            });
                        });
                    }
                });

                // 添加至档案盒
                $(".add-to-file-box").on("click", function () {
                    if(btnstart) {return false};
                    btnstart=true;
                    setTimeout(function(){btnstart=false},500)
                    if (mySelected.length === "") {
                        layer.msg("请选择档案！");
                    } else {
                        if (arr_state.length>0) {
                            for (var i = 0; i < arr_state.length; i++) {
                                if (arr_state[i] !== "在架") {
                                    layer.msg("请选择在架档案！", { time: 1000 });
                                    return;
                                }
                            }
                        }else {
                            layer.msg("请选择档案！");
                            return;
                        }
                        layer.open({
                            title: ['<i class="" style="display: inline-block; padding-right: 20px"></i>添加至档案盒', "font-size: 18px;text-align: center;"],
                            area: ["780px", "660px"],
                            type: 1,
                            btn: ["确定", "取消"],
                            btnAlign: 'c',
                            shadeClose: false, //点击遮罩关闭
                            shade: 0,
                            content: $('#layer-page-box'),
                            success: function (index, layero) {
                                var form = layui.form;
                                mytable.init({
                                    id: "file_info_box",
                                    pageCode: "archivesBoxs-admin",
                                    url: "archivesmodule/arcTbFiles/selectInsertArcFilesBox?field=fileNum&sort=asc&tableName=" + table_name,
                                    height:450
                                }).then(function (table) {
                                    table.on("radio(archivesBoxInfos)", function (obj) {
                                        boxId = obj.data.id;
                                    });
                                });
                                $(".ser-box").on("click", function () {
                                    var table = layui.table;
                                    var key_words = $(".key-val").val();
                                    var table_name = $("#hidden").val();
                                    table.reload("file_info_box", {
                                        url: baseurl + "archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=" + table_name + "&comprehensive=" + key_words,
                                        where: {} //设定异步数据接口的额外参数
                                    });
                                });
                            },
                            yes: function (index, layero) {
                                app.post("archivesmodule/arcTbFiles/insertArcToBox", {
                                    tableName: table_name,
                                    boxId: boxId,
                                    ids: mySelected
                                },
                                    function (msg) {
                                        if (msg.state) {
                                            layer.closeAll('page');
                                            layer.msg(msg.msg);
                                            table.reload("archives_table", {
                                                url: baseurl + "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + $("#hidden").val(),
                                                where: {} //设定异步数据接口的额外参数
                                            });
                                            table.reload('archivesBox_table', {
                                                url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=' + $("#hidden").val()
                                                , where: {} //设定异步数据接口的额外参数
                                            });
                                        }
                                        layer.msg(msg.msg);
                                        // layer.closeAll('page');
                                    }
                                );
                            }
                        })
                    }
                });
            } else if (obj.event === "delete") {
                layer.confirm('是否确定删除档案盒？', { shade: 0 }, function (index) {
                    // 请求接口
                    app.post("archivesmodule/arcTbFiles/deleteFilesBoxById", {
                        tableName: table_name,
                        boxId: data.id
                    }, function (msg) {
                        if (msg.state) {
                            layer.msg(msg.msg);
                            table.reload('archivesBox_table', {
                                url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=' + $("#hidden").val()
                                , where: {} //设定异步数据接口的额外参数
                            });
                        }
                        else {
                            layer.alert("请先移除档案盒内档案");
                        }
                    });
                });
            } else if (obj.event === "offShelves") {  //下架
                app.post('archivesmodule/arcTbFiles/updateByFilesState', {
                    tableName: typeId,
                    id: data.id,
                    upDownFlag: 0
                }, function (res) {
                    res.msg?layer.msg(res.msg):layer.msg('操作失败')
                    $('.layui-laypage-btn').click();
                });
            } else if (obj.event === "putaway") {  //上架
                app.post('archivesmodule/arcTbFiles/updateByFilesState', {
                    tableName: typeId,
                    id: data.id,
                    upDownFlag: 1
                }, function (res) {
                    res.msg?layer.msg(res.msg):layer.msg('操作失败')
                    $('.layui-laypage-btn').click();
                });
            }else if (obj.event === "exportPDF") {  //导出PDF
                console.log(data);
                document.location.href = baseurl + "archivesmodule/excelConvertPdf/fileBoxExportPdf?fileId="+data.id+"&typeId="+data.fkTypeId;
            }
        });
        //监听允许借阅按钮
        form.on('switch(borrow)', function (obj) {
            var achiveId, typeId;
            typeId = $("#hidden").val();
            achiveId = (obj.othis.prev().attr('id'));
            app.post('archivesmodule/arcTbFiles/updateByFilesAllowborrow', {
                id: achiveId,
                allowBorrow: this.value == '是' ? '否' : '是',
                tableName: typeId
            }, function (msg) {
                $('.layui-laypage-btn').click();
            });
        });
    });
	distinguish()
};

//rfid识别搜索
$('.identify_tag1').on('click', function () {
	console.log('111')
    distinguish2();
})
/*
function distinguish(obj) {
    var data = { wsUri: window.wsUri, cmd: 'readMany' };
    $('.rfid-loading').show();
    $('#identify_tag1').attr('disabled',true).css('backgroundColor','#58b7f7');
    mycmd.rfid(data, function(res){
        if(res){
            $('.rfid-loading').hide();
            $('#identify_tag1').attr('disabled',false).css('backgroundColor','#3a97ff');
        } 
        var res = JSON.parse(res);
        if (res.state && res.row) {
            if(res.row.EPC){
                obj.val(res.row.EPC);
                app.get('archivesmodule/arcTbFile/validateRfidIfExist', {"id": archiveId, "rfid": res.row.EPC}, function (res) {
                    if (!res.state) {
                        $("#identify_error").empty();
                        obj.after('<label id="identify_error" class="error" for="fondsId">'+res.msg+'</label>');
                    }else {
                        layer.msg("电子标签正确！");
                    }
                });
            }


        } else {
            // layer.msg('识别失败：请检查识别服务是否开启');
            return;
        }
    });
}
*/
function distinguish2(){
    wsFlag = true
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
    });
	
}
function distinguish(){
		$('#identify_tag').on('click', function() {
            console.log('发送')
            wsFlag = false
			$('#rfid').val('');
			
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
            });
			})
    }
// 档案盒查询
function searchArchivesBox() {
    $(".btn-find").on("click", function () {
        var miji = $(".miji").find("option:selected").html();
        if (miji === "全部") {
            miji = "";
        }
        var table_name = $("#hidden").val();
        // console.log(table_name);
        var condition = $(".condition").find("option:selected").val();
        var start_time = $(".start-time").val();
        var end_time = $(".end-time").val();
        if (start_time !== "") {
            start_time = $(".start-time").val() + " 00:00:00";
        }
        if (end_time !== "") {
            end_time = $(".end-time").val() + " 23:59:59";
        }
        if (start_time !== "" && end_time !== "") {
            start_time = $(".start-time").val() + " 00:00:00";
            end_time = $(".end-time").val() + " 23:59:59";
        }
        var key_words = $(".search-tips").val();
        var pattern = /[`^&% { } | ?]/im;
        if(!key_words || key_words && !pattern.test(key_words)) { 
            tableInit(mytable, "archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=" + table_name + "&fkSecretName=" + miji + "&state=" + condition + "&createTime=" + start_time + "&endTime=" + end_time + "&comprehensive=" + key_words);
        }else {
           layer.msg('查询条件不能包含特殊字符');
          }
       
    });
}

window.boxId = "";

// 档案盒弹出框
function layer_boxInfo(title, obj) {
    var table_name = $("#hidden").val();
    var layer = layui.layer;
    layer.open({
        title: ['<i class="" style="display: inline-block; padding-right: 10px"><img src="../../../static/images/role/modify.png" width="17" height="18"></i>' + title, "font-size: 18px;text-align: center;"],
        area: ["1130px", "835px"],
        type: 1,
        btn: ["确定", "取消"],
        btnAlign: 'c',
        shadeClose: false, //点击遮罩关闭
        shade: 0,
        content: $('#layer-page'),
        success: function (index, layero) {
            var form = layui.form;
            boxId = obj.data.id;
            mytable.init({
                id: "file_info",
                height:475,
                pageCode: "filesBox_info",
                url: "archivesmodule/arcTbFiles/selectArcFilesInBox?field=fileNum&sort=asc&tableName=" + table_name + "&boxId=" + boxId
            }).then(function (table) {

            });
        },
        yes: function (index, layero) {
            var table = layui.table;
            var danghao = $(".danghao").val();
            var timing = $(".timing").val();
            var zhuluren = $(".zhuluren").val();
            var fkStoreName = $("#store_Room").find("option:selected").html();
            var fkStoreID = $("#store_Room").find("option:selected").val();
            var fkRegionName = $("#area").find("option:selected").html();
            var fkRegionID = $("#area").find("option:selected").val();
            var cols = $("#cols").find("option:selected").val();
            var lays = $("#lays").find("option:selected").val();
            var divs = $("#divs").find("option:selected").val();
            var direction = $("#dire").find("option:selected").val();
            var quhao = $(".quhao").val();
            var number = $(".shuzi").val();
            var t2 = $('#layer_revise_files').serializeArray();
            var data = {};
            $.each(t2, function () {
                data[this.name] = this.value;
                data["boxId"] = boxId;
                data["tableName"] = table_name;
                // data["id"] = locationId;
                data["fkStoreName"] = fkStoreName;
                data["fkRegionName"] = fkRegionName;
                data["fkStoreId"] = fkStoreID;
                data["fkRegionId"] = fkRegionID;
                data["colNum"] = cols;
                data["laysNum"] = lays;
                data["divNum"] = divs;
                data["direction"] = direction;
                data["number"] = number;
                data["fkRegionNum"] = quhao;
            });
            if (danghao !== "" && timing !== "" && zhuluren && fkStoreName !== "" && fkRegionName !== "" && cols !== "" && lays !== "" && divs !== "" && direction !== "" && number !== "") {
                app.post("archivesmodule/arcTbFiles/updateBoxAndLocation", data, function (msg) {
                    if (msg.state) {
                        layer.msg(msg.msg);
                        layer.close(index);
                        table.reload('archivesBox_table', {
                            url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=' + $("#hidden").val()
                            , where: {} //设定异步数据接口的额外参数
                        });
                    } else {
                        layer.msg(msg.msg)
                    }
                });
            }
            else {
                layer.msg("位置信息不完整！");
            }
        }
    })
}

// 获取档案类型
var zNodes = {};
var setting = {};
function getAchievesType() {
    app.get("archivesmodule/arcTbArcType/selectAll", {}, function (msg) {
        if (msg.state) {
            $("#hidden").val(msg.rows[0].id);
            var postId = msg.rows[0].id;
            localStorage.setItem("tableNamesBox", msg.rows[0].id);
            localStorage.setItem("tableNamesBoxId", msg.rows[0].id);
            zNodes = msg.rows;
            setting = {
                view: { selectedMulti: false, showLine: false, showIcon: true },
                check: { enable: false },
                data: {
                    simpleData: { enable: true, idKey: "id", pIdKey: "fkParentId", rootPId: null },
                    key: { name: "typeName" }
                },
                callback: { onClick: zTreeOnClick }
            };

            function zTreeOnClick(event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                // zTree.expandNode(treeNode);
                $("#hidden").val(treeNode.id);
                localStorage.setItem("tableNamesBox", treeNode.id);
                tableInit(mytable, "archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=" + treeNode.id);
            }
            $(document).ready(function () {
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                //默认第一个节点选中
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");//获取ztree对象
                var node = zTree.getNodeByParam('id', postId);//获取id为1的点
                zTree.selectNode(node);//选择点
                zTree.setting.callback.onClick(null, zTree.setting.treeId, node);//调用事件

                // 节点查询
                $("#search").keyup(function () {
                    //alert(11);
                    var txtObj = $("#search").val();
                    if (txtObj.length > 0) {
                        InitialZtree();
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                        var nodeList = zTree.getNodesByParamFuzzy("typeName", txtObj);
                        $.fn.zTree.init($("#treeDemo"), setting, nodeList);
                    } else {
                        InitialZtree();
                    }
                });
            });
        }
    });
}

function InitialZtree() {
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
}

// 查询档案和档案盒的状态
function getState() {
    app.get("authmodule/sysTbDictCode/selectByArchivalStatus", {}, function (msg) {
        if (msg.state) {
            var str = '';
            var str1 = '<option value="">全部</option>';
            for (var i = 0; i < msg.rows.length; i++) {
                if(msg.rows[i].code!='tba'&&msg.rows[i].code!='ita'){
                    str += '<option value="' + msg.rows[i].code + '">' + msg.rows[i].svalue + '</option>';
                }
            }
            $(".condition").html(str1 + str);
            form.render();
        }
    });
}

// 添加至临时文件夹
function addToFileBox() {
    $('.add-to-file').on("click", function () {
        var table = layui.table;
        var table_name = $("#hidden").val();
        if (mySelected.length === 0) {
            layer.msg("请选择档案盒！", { time: 1000 });
        } else {
            app.get("archivesmodule/arcTbFiles/selectFilesByIds", {
                tableName: table_name,
                fileIds: mySelected.toString()
            }, function (msg) {
                if (msg.state) {
                    let arr=JSON.parse(localStorage.getItem("archivesBox")) || [];
                    arr = [...arr, ...msg.rows]
                    let obj = {};
                    arr= arr.reduce(function(item, next) {
                        obj[next.id] ? " " : (obj[next.id] = true && item.push(next));
                        return item;
                    }, []);
                    layer.msg("添加至临时文件夹成功！");
                    localStorage.setItem("archivesBox", JSON.stringify(arr));
                    table.reload('archivesBox_table', {
                        url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=' + $("#hidden").val()
                        , where: {} //设定异步数据接口的额外参数
                    });
                }
            });
        }
    });
}

// 密级
function getSec() {
    app.get("authmodule/sysTbDictCode/selectSysTbDictCodeByfkType?type=ofthem", {}, function (msg) {
        if (msg.state) {
            var str1 = '<option value="">全部</option>';
            var str = "";
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].svalue + "</option>";
            }
            $(".miji").html(str1 + str);
            form.render();
        }
    });
}

// 导出
function select_exports() {
    var form = layui.form;
    form.on('select(output)', function (data) {
        var miji = $(".miji").find("option:selected").html();
        if (miji === "全部") {
            miji = "";
        }
        var tname = $("#hidden").val();
        var condition = $(".condition").find("option:selected").val();
        var start_time = $(".start-time").val();
        var end_time = $(".end-time").val();
        if (start_time !== "" && end_time !== "") {
            start_time = $(".start-time").val() + " 00:00:00";
            end_time = $(".end-time").val() + " 23:59:59";
        }
        var keywords = $(".search-tips").val();
        console.log(data.value); //得到被选中的值
        switch (data.value) {
            case "0":
                document.location.href = baseurl + "archivesmodule/arcTbFiles/exportFilesBoxExcel?field=fileNum&sort=asc&pageSize=" + pagesize+"&tableName=" + tname;
                break;
            case "1":
                if (miji || condition || start_time || end_time || keywords) {
                    document.location.href = baseurl + "archivesmodule/arcTbFiles/exportFilesBoxExcel?field=fileNum&sort=asc&pageSize=" + pagesize+"&tableName=" + tname + "&fkSecretName=" + miji + "&state=" + condition + "&createTime=" + start_time + "&endTime=" + end_time + "&comprehensive=" + keywords;

                } else {
                    layer.msg("请先搜索再导出！");
                }
                break;
            case "2":
                document.location.href = baseurl + "archivesmodule/arcTbFiles/exportFilesBoxExcel?field=fileNum&sort=asc&tableName=" + tname + "&currentPage=" + curr + "&pageSize=" + pagesize;
                break;
        }
    });
    form.on('select(batch)', function (data) {
        var batchData = getCheckedData();
        if (batchData.length > 0) {
            switch (data.value) {
                case "0":
                    var tableData=[];
                    for(var i = 0; i < batchData.length; i++){
                        if(batchData[i].state !== '未上架') {
                            layui.layer.msg('只有未上架档案盒才能上架!');
                            return;
                        }
                        tableData.push(batchData[i].id);
                    }
                    app.post("archivesmodule/arcTbFiles/batchRack", {ls:1, ids:tableData}, function (msg) {
                        console.log(msg);
                        if (msg.state) {
                            layer.msg(msg.msg);
                            $('.layui-laypage-btn').click();
                        }
                    });
                    break;
                case "1":
                    var tableData=[];
                    for(var i = 0; i < batchData.length; i++){
                        if(batchData[i].state !== '在架') {
                            layui.layer.msg('只有在架档案盒才能下架!');
                            return;
                        }
                        tableData.push(batchData[i].id);
                    }
                    app.post("archivesmodule/arcTbFiles/batchRack", {ls:2, ids:tableData}, function (msg) {
                        if (msg.state) {
                            layer.msg(msg.msg);
                            $('.layui-laypage-btn').click();
                        }
                    });
                    break;
            }
        } else {
            layui.layer.msg('请选择数据！！！');
        }
    });
}

// 新增档案盒
function addArchiveBox() {
    $(".add-archiveBox").on("click", function () {
        window.location.href = 'add-archiveBox.html';
    });
}
function fileTable(filesBox) {
    mySelectedId = []
    layui.table.render({
        elem: "#file_info_layer",
        data: filesBox, //数据接口
        page: true, //开启分页
        cols: [[
            { type: "checkbox", title: "", fixed: "left", align: "center" },
            { title: "序号", align: "center" ,width: 60,templet:'<div>{{d.LAY_TABLE_INDEX+1}}</div>'},
            { field: "fileNum", title: "档号", align: "center" },
            { field: "fileName", title: "题名", align: "center" },
            { field: "fondsId", title: "全宗号", align: "center" },
            { field: "fkSecretName", title: "密级", align: "center" },
            { field: "fkTypeName", title: "类型", align: "center" },
            { field: "locationName", title: "所在位置", align: "center" },
            { field: "state", title: "当前状态", align: "center" }
        ]]
    });
}
// 打开临时文件夹
var mySelectedId = [],filesBox;
function openAddedFileBox(title) {
    $(".open").on("click", function () {
        filesBox = localStorage.getItem("archivesBox");
        if (filesBox) {
            filesBox = JSON.parse(filesBox);
            filesBox.sort(function (a, b) {
                return SortByProps(a, b, { "fileNum": "ascending" });
            });
            layer.open({
                title: [title, "font-size: 18px;text-align: center;"],
                area: ["1200px", "680px"],
                type: 1,
                btn: ["关闭"],
                shadeClose: false, //点击遮罩关闭
                shade: 0,
                content: $("#open_temp_file"),
                success: function (index, layero) {
                    var table = layui.table;
                    fileTable(filesBox);
                    table.on('checkbox(filebox_info_layer)', function (obj) {
                        var data = obj.type == 'one' ? [obj.data] : filesBox;
                        //.遍历数据
                        $.each(data, function (k, v) {
                            if (obj.checked) {
                                layui.data('filebox_info_layer', {
                                    key: v.id,
                                    value: v
                                });
                                mySelectedId.push(v.id)
                            } else {
                                //.删除
                                layui.data('filebox_info_layer', {
                                    key: v.id,
                                    remove: true
                                });
                                mySelectedId.splice(mySelectedId.indexOf(v.id), 1);
                            }
                        });
                        // $.each(layui.data('checked'), function (k, v) {
                        //     SelectedId.push(v.id)
                        // });
                    });
                },
                yes: function (index, layero) {
                    mySelectedId = [];
                    layer.close(index);
                },
                end: function (index) {
                    mySelectedId = [];
                    layer.close(index);
                },
                cancel: function(index, layero){
                    mySelectedId = [];
                    layer.close(index);
                }
                // btn2: function (index, layero) {
                //     mySelectedId.length = 0;
                //     layer.close(index);
                // }
            });
        } else {
            layer.msg("请先添加档案盒至临时文件夹！", { time: 1000 });
        }

    });
}
function openAddedFileBoxClick() {
    // 导出
    $(".file-exports1").on("click", function (obj) {
        var leixing = $("#hidden").val();
        if (mySelectedId.length === 0) {
            layer.msg("请选择档案盒！", {
                time: 1000
            });
        } else {
            document.location.href = baseurl + "archivesmodule/arcTbFiles/exportTemporaryFilesBoxExecl?tableName=" + leixing + "&fileIds=" + mySelectedId.toString();
        }
    });
    // 批量修改位置
    $(".revise-position1").on("click", function () {
        if (mySelectedId.length === 0) {
            layer.msg("请选择档案盒！", {
                time: 1000
            });
        } else {
            layer.open({
                title: ['<i class="" style="display: inline-block; padding-right: 20px"></i>批量修改位置', "font-size: 18px;text-align: center;"],
                area: ["800px", "300px"],
                type: 1,
                btn: ["确定", "取消"],
                btnAlign: 'c',
                shadeClose: false, //点击遮罩关闭
                shade: 0,
                content: $("#all_position_revise"),
                success: function (index, layero) {
                    // 获取库房名称、区、列、节、层......
                    app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function (msg) {
                        if (msg.state) {
                            var str1 = '<option value=""></option>';
                            var str = "";
                            for (var i = 0; i < msg.rows.length; i++) {
                                str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + '</option>';
                            }
                            $("#store_Room1").html(str1 + str);
                            form.on("select(storeroom1)", function (data) {
                                // console.log(data.value);
                                app.get("storeroommodule/stoTbRegion/selectByBind", { fkStoreId: data.value }, function (msg) {
                                    if (msg.state) {
                                        var str1 = '<option value=""></option>';
                                        var str = "";
                                        var str2 = "";
                                        var str3 = "";
                                        var str4 = "";
                                        for (var i = 0; i < msg.rows.length; i++) {
                                            str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
                                        }
                                        $("#area1").html(str1 + str);
                                        form.render('select');
                                        form.on("select(areaName1)", function (data) {
                                            app.get("storeroommodule/stoTbRegion/selectByRegionId", { id: data.value }, function (msg) {
                                                if (msg.state) {
                                                    console.log(msg.row.cols);
                                                    $("#regionNum").val(msg.row.regionNum);
                                                    // for (var i = 1; i <= msg.row.cols; i++) {
                                                    //     str2 += '<option value="' + i + '">' + i + '</option>';
                                                    // }
                                                    if(msg.row.gdlType=='左边'){
                                                        for (var i = 0; i < msg.row.cols; i++) {
                                                            str2 += '<option value="' + i + '">' + i + '</option>';
                                                        }
                                                    }else{
                                                        for (var i = 1; i <= msg.row.cols; i++) {
                                                            str2 += '<option value="' + i + '">' + i + '</option>';
                                                        }
                                                    }
                                                    for (var i = 1; i <= msg.row.divs; i++) {
                                                        str3 += '<option value="' + i + '">' + i + '</option>';
                                                    }
                                                    for (var i = 1; i <= msg.row.lays; i++) {
                                                        str4 += '<option value="' + i + '">' + i + '</option>';
                                                    }
                                                    $("#cols1").html(str1 + str2);
                                                    $("#lays1").html(str1 + str4);
                                                    $("#divs1").html(str1 + str3);
                                                    form.render('select');
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                            form.render('select');
                        }
                    });
                    form.render();
                },
                yes: function (index, layero) {
                    var TNAME = $("#hidden").val();
                    var fkStoreName = $("#store_Room1").find("option:selected").html();
                    var fkStoreID = $("#store_Room1").find("option:selected").val();
                    var fkRegionName = $("#area1").find("option:selected").html();
                    var fkRegionID = $("#area1").find("option:selected").val();
                    var posInfo = $('#fileBox_revisePos').serializeArray();
                    // console.log(posInfo);
                    var fileData = {};
                    $.each(posInfo, function () {
                        fileData[this.name] = this.value;
                        fileData["tableName"] = TNAME;
                        fileData["fkStoreName"] = fkStoreName;
                        fileData["fkRegionName"] = fkRegionName;
                        fileData["fkStoreId"] = fkStoreID;
                        fileData["fkRegionId"] = fkRegionID;
                        fileData["fileIds"] = mySelectedId.toString();
                    });
                    if (fileData["fkStoreName"] === "" || fileData["fkRegionName"] === "" || fileData["colNum"] === "" || fileData["divNum"] === "" || fileData["laysNum"] === "" || fileData["direction"] === "" || fileData["number"] === "") {
                        layer.msg("位置为必填项");
                        return false;
                    } else {
                        app.post("archivesmodule/arcTbFiles/updateLocation", fileData, function (msg) {
                            if (msg.state) {
                                mySelectedId=[];
                                layer.msg(msg.msg);
                                fomrReset();
                                layer.close(index);
                                layer.closeAll('page'); //关闭所有页面层
                                layui.table.reload('archivesBox_table', {
                                    url: baseurl + 'archivesmodule/arcTbFiles/selectArcFilesBox?field=fileNum&sort=asc&tableName=' + $("#hidden").val()
                                    , where: {} //设定异步数据接口的额外参数
                                });
                            } else {
                                layer.msg(msg.msg);
                            }
                        });
                    }

                },
                end: function (index) {
                    layer.close(index);
                }
            });
        }
    });
    // 批量清除
    $(".batch-clean").on("click", function () {
        if (mySelectedId.length === 0) {
            layer.msg("请选择档案！", {
                time: 1000
            });
        } else {
            for(var fileId of mySelectedId){
                var newArr = filesBox.filter(function(obj){
                    return fileId !== obj.id;
                });
                filesBox=newArr;
            }
            localStorage.setItem("archivesBox", JSON.stringify(filesBox));
            fileTable(filesBox)
        }

    });
    // 添加至档案盒
}
// 获取选中数据
function getCheckedData() {
    var getChecked = layui.table.checkStatus('archivesBox_table');
    return getChecked.data;
}

// 销毁
function destroy() {
    $('#destroy').on('click', function () {
        var data = getCheckedData();
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].state !== '在架') {
                    layui.layer.msg('只有在架才能销毁!!');
                    return;
                }
            }
            $('.modaljump').trigger('click');
        } else {
            layui.layer.msg('请选择数据！！！');
        }
    })
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
var form;
$(function (mytable) {
    // 进入页面开启读取RFID服务
    app.bindingget("rfid/start", {}, function (msg) {
        if ((msg.code = 200)) {
            console.log("开始读取");
        } else {
            console.log(msg.msg);
        }
    });
    mySelected = [];
    arr_state=[];
    layui.use(['form', 'element', 'layer', 'table', 'laydate'], function () {
        var element = layui.element;
        var layer = layui.layer;
        form = layui.form;
        var table = layui.table;
        var laydate = layui.laydate;
        getMenuBar();//自定义面包屑，引用public-menu.js
        // tableInit(mytable, "archivesmodule/arcTbFiles/selectArcFilesBox?tableName="+localStorage.getItem("tableNamesBoxId"));
        addToFileBox();
        openAddedFileBox("临时文件夹");
        openAddedFileBoxClick();
        select_exports();

        getAchievesType();
        searchArchivesBox();
        getState();
        getSec();
        destroy();
        addArchiveBox();
        // onFocus();
        mybtn.date('#test1','#test2');
        form.render();
    });
}(mytable));


function firstRefresh() {
    $(".layui-laypage-skip input").val(1);
    $(".layui-laypage-btn")[0].click();
}

function testRefresh() {
    $(".layui-laypage-btn")[0].click();
}
function fomrReset(){
    document.getElementById("fileBox_revisePos").reset();
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
//                 let res = e.data.slice(3)
//                 if(wsFlag){
//                     readRFID2(res)
//                     console.log('现在执行的是编辑')
//                 }else{
//                     readRFID(res)
//                     console.log('现在执行的是查找')
//                 }
				
// 				console.log('你没执行啊')
// 			}else{
// 				// 弹框
// 				$("#identify_error").text('RFID为空')
				               
// 				console.log(!e.data,'RFID为空？')
// 			}
// 		}
// 		console.log("接收数据", e.data);
// 	};
// 	ws.onclose = e => {
// 		$('.rfid-loading').hide();
		
// 		$("#identify_error").text('连接关闭')
// 		console.log("连接关闭");
// 	};
// 	ws.onerror = e => {
// 		$('.rfid-loading').hide();
		
// 		$("#identify_error").text('设备连接失败')
// 		console.log("出错情况");
// 	};
// 	return ws;
// }


function readRFID(rfid){
	if(rfid){
		$('.rfid-loading').hide();
		console.log('rfid赋值',rfid)
        // 发送请求
        if(wsFlag){
            $('#rfid2').val(rfid);
        }
        else{
            $('#rfid').val(rfid);
        }
        /*
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
        */
	}else{
        layer.msg('RFID为空')
		return
	}
	  

}

function readRFID2(rfid){
    $('.rfid-loading').hide();
		console.log('rfid赋值',rfid)
		// 发送请求
        $('#rfid2').val(rfid);
        
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
        
}