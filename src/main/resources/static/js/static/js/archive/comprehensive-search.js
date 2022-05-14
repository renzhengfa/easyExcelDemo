/**
 * @author guijinsong
 * update---tangli
 */

 window.boxId = "";

 var baseData;
 // 初始化
 var tableFile = function (mytable, url) {
	 var table = layui.table,
		 layer = layui.layer,
		 $ = layui.$,
		 form = layui.form;
	 var mytbl;
	 //.存储当前页数据集
	 //.存储已选择数据集，用普通变量存储也行
	 layui.data("checked", null);
	 mytable
		 .init({
			 id: "archives_table",
			 pageCode: "archives-admin",
			 url: url,
			 ischeckbox: 1,
		 })
		 .then(function (table) {
			 //监听工具条
			 table.on("tool(archivesBox)", function (obj) {
				 var data = obj.data,
					 typeId = data.fkTypeId;
				 if (obj.event === "edit") {
					 var archiveid = localStorage.getItem("archiveId");
					 localStorage.setItem("archiveId", data.id);
					 localStorage.setItem("tableN", typeId);
					 window.location.href =
						 "archive-change.html?id=" + data.id + "&type=0";
				 } else if (obj.event === "check") {
					 window.parent.layer.confirm(
						 "是否确定删除？",
						 { shade: 0 },
						 function (index) {
							 app.post(
								 "archivesmodule/arcTbFiles/deleteFilesById",
								 {
									 tableName: typeId,
									 id: data.id,
								 },
								 function (msg) {
									 if (msg.state) {
										 window.parent.layer.msg(msg.msg);
										 table.reload("archives_table", {
											 url:
												 baseurl +
												 "archivesmodule/arcTbFiles/selectArcFiles?tableName=" +
												 table_name,
											 where: {}, //设定异步数据接口的额外参数
										 });
									 }
								 }
							 );
						 }
					 );
				 } else if (obj.event == "offShelves") {
					 //下架
					 app.post(
						 "archivesmodule/arcTbFiles/updateByFilesState",
						 {
							 tableName: typeId,
							 id: data.id,
							 upDownFlag: 0,
						 },
						 function (res) {
							 if (res.state) {
								 table.reload("archives_table");
							 }
							 layer.msg(res.msg);
						 }
					 );
				 } else if (obj.event == "putaway") {
					 //上架
					 app.post(
						 "archivesmodule/arcTbFiles/updateByFilesState",
						 {
							 tableName: typeId,
							 id: data.id,
							 upDownFlag: 1,
						 },
						 function (res) {
							 layer.msg(res.msg);
							 if (res.state) {
								 table.reload("archives_table");
								 // $('.layui-laypage-btn').click();
							 }
						 }
					 );
				 } else if (obj.event == "showinfo") {
					 var archiveid = localStorage.getItem("archiveId");
					 // var tName = $("#hidden").val();
					 var tName = typeId;
					 localStorage.setItem("archiveId", data.id);
					 localStorage.setItem("tableN", tName);
					 window.location.href =
						 "archive-change-preview.html?id=" + data.id;
					 // console.log(data.id)
				 } else if (obj.event == "openShelves") {
					 var jsonobj = obj.data;
					 let number=parseInt(jsonobj.locationName.split('第')[1]);
				 
					 layer.msg("打开架体中...");
					 // app.get('storeroommodule/stoTbRegion/selectByLocalId', { localId: jsonobj.fkLocationId }, function (res) {
					 app.get(
						 "storeroommodule/stoTbRegion/selectOpenMJJById",
						 { localId: jsonobj.fkLocationId,number },
						 function (res) {
							 if (res.state && res.row != null) {
								 var locate = res.row.location;
								 var resjson = res.row.region;
 
								 var cols = locate.colNum;
								 var gdlType;
								 if (resjson.gdlType === "left") {
									 gdlType = "左";
								 } else if (resjson.gdlType === "right") {
									 gdlType = "右";
								 }
								 var direction;
								 if (locate.direction === "左") {
									 direction = "left";
								 } else if (locate.direction === "右") {
									 direction = "right";
								 }
								 app.post(
									 `denseShelves/configIp?ip=${resjson.reqestIp}`,
									 {},
									 (res) => {
										 if (res.state) {
											 app.post(
												 `denseShelves/openframe?column=${cols}&section=${locate.divNum}&layer=${locate.laysNum}&direction=${direction}&number=${number}`,
												 {},
												 (res) => {
													 if (res.state) {
														 layer.msg("打开成功！");
													 } else {
														 layer.msg(res.msg);
													 }
												 }
											 );
										 } else {
											 layer.msg(res.msg);
										 }
									 }
								 );
							 } else {
								 layer.msg("无数据,请检查！");
							 }
						 }
					 );
				 }
			 });
			 //监听允许借阅按钮
			 form.on("switch(borrow)", function (obj) {
				 var typeId = $("#hidden").val();
				 var achiveId = obj.othis.prev().attr("id");
				 app.post(
					 "archivesmodule/arcTbFiles/updateByFilesAllowborrow",
					 {
						 id: achiveId,
						 allowBorrow: this.value == "是" ? "否" : "是",
						 tableName: typeId,
					 },
					 function (msg) {
						 $(".layui-laypage-btn").click();
					 }
				 );
			 });
		 });
 };
 // 导出
 // function exportAll() {
 //     $('#exportAll').on('click', function () {
 //         var value = $('input[name="fileRetrieval"]').val(),
 //             url = `archivesmodule/arcTbBorrowRun/exportRetrieval?fileName=${value}&fkSecretName=${value}&fkTypeName=${value}&createUserName=${value}`;
 //         window.location.href = window.baseurl + url + '&flag=1'
 //     })
 // }
 
 function exportPage() {
	 $("#export").on("click", function () {
		 var value = $('input[name="fileRetrieval"]').val(),
			 url = `archivesmodule/arcTbBorrowRun/exportRetrieval?fileName=${value}&fileNum=${value}&fkSecretName=${value}&fkTypeName=${value}&createUserName=${value}&search=match`;
		 window.location.href = window.baseurl + url;
	 });
 }
 
 // 获取选中数据
 function getCheckedData() {
	 var getChecked = layui.table.checkStatus("archives_table");
	 return getChecked.data;
 }
 
 function search(mytable) {
	 // 检索
	 $("#fileRetrieval").on("click", function () {
		 var value = $('input[name="fileRetrieval"]').val(),
			 url = `archivesmodule/arcTbBorrowRun/fileRetrieval?fileName=${value}&rfid=${value}&fileNum=${value}&fkSecretName=${value}&fkTypeName=${value}&createUserName=${value}&search=match`;
		 var pattern = /[`^&% { } | ?]/im;
		 if (!value || (value && !pattern.test(value))) {
			 tableFile(mytable, url);
		 } else {
			 layer.msg("查询条件不能包含特殊字符");
		 }
	 });
 }
 
 $(
	 (function (mytable) {
		 mySelected = [];
		 // getAchievesType();
		 layui.use(
			 ["form", "element", "layer", "table", "laydate", "upload"],
			 function () {
				 var element = layui.element;
				 var layer = layui.layer;
				 var form = layui.form;
				 var table = layui.table;
				 var laydate = layui.laydate;
				 var upload = layui.upload;
				 var uploadInst = upload.render({
					 elem: "#up_file", //绑定元素
					 url: "", //上传接口
					 done: function (res) {
						 //上传完毕回调
					 },
					 error: function () {
						 //请求异常回调
					 },
				 });
				 getMenuBar(); //自定义面包屑，引用public-menu.js
				 tableFile(
					 mytable,
					 "archivesmodule/arcTbBorrowRun/fileRetrieval"
				 );
				 search(mytable);
				 // exportAll();
				 exportPage();
				 mybtn.date("#test1", "#test2");
				 form.render();
			 }
		 );
	 })(mytable)
 );
 
 function firstRefresh() {
	 $(".layui-laypage-skip input").val(1);
	 $(".layui-laypage-btn")[0].click();
 }
 
 function testRefresh() {
	 $(".layui-laypage-btn")[0].click();
 }
 