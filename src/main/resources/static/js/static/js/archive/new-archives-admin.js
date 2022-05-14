/**
 * @author tangli
 * @description 档案中心-档案管理
 * 
 */
var info = {
    startTime: '',
    endTime: '',
    state: '',
    fkTypeId: '',
    keywords: '',
    miji: '',
    table_name: ''
};
localStorage.setItem('tableN',42);
var baseData={};
// 档案查询
function pageManageQuery(table) {
    // var table=layui.table;
    $("#borrow_historical_btn_query").on("click", function () {
        var miji = $(".miji").find("option:selected").html();
        if (miji == "全部") {
            miji = "";
        }
        var data = {};
        data.miji = miji;
        data.table_name = $("#hidden").val();
        data.condition = $(".condition").find("option:selected").val();


        var start_time=$("#date_picker1").val();
        var end_time=$("#date_picker2").val();
        if(start_time!='' || end_time!=''){
             data.start_time = $("#date_picker1").val() + ' 00:00:00';
             data.end_time = $("#date_picker2").val() + ' 23:59:59'; 
        }

        if(start_time==''){
            data.start_time='';
        }
        if(end_time==''){
            data.end_time='';
        }

        // data.start_time = $("#date_picker1").val()+' 00:00:00';
        // data.end_time = $("#date_picker2").val()+' 23:59:59';
        data.keywords = $(".search-tips").val() || '';
        info = data;
        table.reload('historical_records_content', {
            url: baseurl + 'archivesmodule/arcTbFiles/selectArcFiles?tableName=' +
                data.table_name + "&fkSecretName=" +
                data.miji + "&state=" +
                data.condition + "&createTime=" +
                data.start_time + "&endTime=" +
                data.end_time + "&comprehensive=" +
                data.keywords

        });
    }
    );
}
$(function (mytable) {
        // mySelected=[];
        layui.use(["table", "layer", "form", "laydate"], function () {
            var table = layui.table;
            var form = layui.form;
            var layer = layui.layer;
            getMenuBar();//自定义面包屑，引用public-menu.js
            // 搜索
            mybtn.date('#date_picker1', '#date_picker2');
            getAchievesType();
            fileSearch();
            mytableinit(table);
            getSec();
            getState();
            destroy();
            addtoBox();
            addToFile();
            openFile();
            distinguish();
            pageManageQuery(table);

             //导出
             form.on('select(output)', function (data) {
                if(data.value === "1"){
                    window.location.href = window.baseurl + "archivesmodule/arcTbFiles/exportFilesPageExcel?tableName=" + $('#hidden').val();
                }else if(data.value === "0"){
                    window.location.href = window.baseurl + "archivesmodule/arcTbFiles/exportFilesPageExcel?tableName=" + 
                     $('#hidden').val()+ "&currentPage=" +
                     curr + "&pageSize=" + pagesize;
                }
            });
        });
    }(mytable));

// 表格初始化
function mytableinit(table) {
    var url = "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + localStorage.getItem("archivesTableNamesId");
    mytable.init({
        id: "historical_records_content",
        pageCode: "archives-admin",
        url: url
    }).then(function (table) {
        //监听工具条
        table.on("tool(archivesBox)", function (obj) {
            var data = obj.data, typeId = $("#hidden").val();
            if (obj.event === "edit") {
                var archiveid = localStorage.getItem("archiveId");
                var tName = $("#hidden").val();
                localStorage.setItem("archiveId", data.id);
                localStorage.setItem("tableN", tName);
                window.location.href = "archive-change.html?id=" + data.id;
            } else if (obj.event == "offShelves") {  //下架
                app.post('archivesmodule/arcTbFiles/updateByFilesState', {
                    tableName: typeId,
                    id: data.id,
                    upDownFlag: 0
                }, function (res) {
                    layer.msg(res.msg);
                    $('.layui-laypage-btn').click();
                });
            } else if (obj.event == "putaway") {  //上架
                app.post('archivesmodule/arcTbFiles/updateByFilesState', {
                    tableName: typeId,
                    id: data.id,
                    upDownFlag: 1
                }, function (res) {
                    layer.msg(res.msg);
                    $('.layui-laypage-btn').click();
                });
            }else if(obj.event === "detail") {
                var archiveid = localStorage.getItem("archiveId");
                var tName = $("#hidden").val();
                localStorage.setItem("archiveId", data.id);
                localStorage.setItem("tableN", tName);
                window.location.href = "new-archive-preview.html?id=" + data.id;
            }
            else if (obj.event == "showinfo") {
                var archiveid = localStorage.getItem("archiveId");
                var tName = $("#hidden").val();
                localStorage.setItem("archiveId", data.id);
                localStorage.setItem("tableN", tName);
                window.location.href = "new-archive-preview.html?id=" + data.id;
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
                tableName: typeId,
            }, function (msg) {
                $('.layui-laypage-btn').click();
            });
        });
    });
};

// 文件查询 节点查询
function fileSearch() {
    $("#search").keyup(function () {
        var txtObj = $("#search").val();
        if (txtObj.length > 0) {
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            var nodeList = zTree.getNodesByParamFuzzy("typeName", txtObj);
            //console.log(nodeList);
            $.fn.zTree.init($("#treeDemo"), setting, nodeList);
        } else {
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        }
    });
}
// 获取选中数据
function getCheckedData() {
    var getChecked = layui.table.checkStatus('historical_records_content');
    return getChecked.data;
}
// 销毁
function destroy() {
    $('#destroy').on('click', function () {
        var data = getCheckedData();
        if (data.length > 0) {
            for(var i = 0; i < data.length; i++){
                if(data[i].state !== '在架') {
                    layui.layer.msg('只有在架才能销毁!!');
                    return;
                }
            }
            $('#details').trigger('click');
            
        } else {
            layui.layer.msg('请选择档案！');
        }
    })
}
// 添加至档案盒
function addtoBox() {
    $('#add-to-box').on('click', function () {
        var data =getCheckedData();
        // localStorage.setItem('selectedArchive',JSON.stringify( getCheckedData())); 
        if (data.length > 0) {
            for(var i = 0; i < data.length; i++){
                if(data[i].state !== '在架') {
                    layui.layer.msg('只有在架才能添加至档案盒!!');
                    return;
                }
            }
            $('#addtoBox').trigger('click'); 
            // table.reload("historical_records_content", {
        //     url: baseurl + "archivesmodule/arcTbFiles/selectArcFiles?tableName=" 
        //     + $("#hidden").val()
        // });
        } else {
            layui.layer.msg('请选择档案！');
            return;
        }
       
    })
}

// 添加至临时文件夹
function addToFile() {
    $("#add-to-file").on("click", function () {
        var mySelected=localStorage.getItem('myselected');
        var table = layui.table;
        var table_name = $("#hidden").val();
        if (getCheckedData().length == 0) {
            layer.msg("请选择档案！", {time: 1000});
        } else {
            app.get("archivesmodule/arcTbFiles/selectFilesByIds", {
                tableName: table_name,
                fileIds: mySelected.toString()
            }, function (msg) {
                if (msg.state) {
                    layer.msg("添加至临时文件夹成功！");
                    localStorage.setItem("archives", JSON.stringify(msg.rows));
                    table.reload("historical_records_content", {
                        url: baseurl + "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + $("#hidden").val(),
                        where: {} //设定异步数据接口的额外参数
                    });
                }
            });
        }
    });
}

// 打开临时文件夹
function openFile(){
    $('.open').on('click',()=>{
        var files = localStorage.getItem("archives");
        if (files) {
            $('#openfile').trigger('click');
            // $('.layui-layer-btn .layui-layer-btn-c').hide();
        }else{
            layer.msg('临时文件夹没有数据！',{time:1000})
        }
    })
}
   //rfid识别搜索
   function distinguish() {
       $('#identify_tag').on('click',function () {
        var data={ wsUri: window.wsUri, cmd: 'readMany'};
        mycmd.rfid(data,function(res){
            var res=JSON.parse(res);
            if(res.state){
                if(res.row){
                    // layer.msg(res.msg);
                    $('#rfid').val(res.row.EPC);
                }
            }else{
                // layer.msg(res.msg);
                return;
            }
        });
       })
   }
// 节点点击
function zTreeOnClick(event, treeId, treeNode) {
    var table=layui.table;
    $('#hidden').val(treeNode.id);
    console.log(treeNode.id)
    localStorage.setItem('tableN',treeNode.id)
    // tableFile(mytable, "archivesmodule/arcTbFiles/selectArcFiles?tableName=" + treeNode.id);
    table.reload('historical_records_content', {
        url: baseurl + 'archivesmodule/arcTbFiles/selectArcFiles?tableName=' + treeNode.id
    });
}
// 初始化文件树
function getAchievesType() {
    myztree.archiveSearch("archivesmodule/arcTbArcType/selectAll", {}, function (msg) {
        if (msg.state) {
            $("#hidden").val(msg.rows[0].id);
            // 表格默认渲染节点1
            localStorage.setItem("archivesTableNamesId", msg.rows[0].id);
            zNodes = msg.rows;
            $(document).ready(function () {   //点击节点渲染当前id表格
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            })
        }
    })
}


// 初始密级下拉框
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


// 初始查询档案和档案盒的状态
function getState() {
    app.get("authmodule/sysTbDictCode/selectByArchivalStatus", {}, function (msg) {
        if (msg.state) {
            var str = "";
            var str1 = '<option value="">全部</option>';
            for (var i = 0; i < msg.rows.length; i++) {
                str += '<option value="' + msg.rows[i].code + '">' + msg.rows[i].svalue + "</option>";
            }
            $(".condition").html(str1 + str);
            form.render();
        }
    });
}

function firstRefresh() {
    $(".layui-laypage-skip input").val(1);
    $(".layui-laypage-btn")[0].click();
}

function testRefresh() {
    $(".layui-laypage-btn")[0].click();
}
function fomrReset(){
    document.getElementById("revisePos").reset();
}

