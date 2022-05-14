var baseData, oprate, demoTable_height;
var isTransfer = false;
// var wsValue = webinit(window.wsUri);
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
$(
	(function (mytable) {
        // 进入页面开启读取RFID服务
        app.bindingget("rfid/start", {}, function (msg) {
			if ((msg.code = 200)) {
				console.log("开始读取");
			} else {
				console.log(msg.msg);
			}
		});
		layui.use(["table", "layer", "form", "element"], function () {
			var table = layui.table;
			var form = layui.form;
			var layer = layui.layer;
			var element = layui.element;
			oprate = $("#operate");
			getMenuBar(); //自定义面包屑，引用public-menu.js
			demoTable_height = $(".demoTable").outerHeight(true) + 140;
			element.on("tab(docDemoTabBrief)", function (data) {
				if (data.index == 1) {
					var tool1 = `<a class="layui-btn-xs layui-btn-tablexs" lay-event="delete">移除</a> <a href="javascript:;" class="line"></a>
    <a class="layui-btn-xs layui-btn-tablexs" lay-event="transfer">移交</a>`;
					oprate.empty();
					oprate.append(tool1);
					var data = [];
					var cols = app.asyncGet(
						"authmodule/authTbPageols/selectCols",
						{
							pageCode: "archives-admin",
						}
					);
					var rows = [];
					rows[0] = {
						type: "checkbox",
						title: "type",
						width: 100,
						fixed: "left",
					};
					for (var i = 1; i <= cols.rows.length; i++) {
						rows[i] = cols.rows[i - 1];
					}
					data.push(rows);
					var values = [];
					//连接websql数据库
					webSqlExecute(
						"transfer",
						"SELECT * FROM transfer",
						[],
						function (tx, results) {
							if (tx) {
								for (var i = 0; i < results.rows.length; i++) {
									console.log(results.rows);
									values.push(results.rows[i]);
								}
								table.render({
									elem: "#tab_table_2",
									cols: data,
									page: {
										theme: "#3a97ff",
									},
									limit: 20,
									height: "full-" + demoTable_height + "",
									loading: true,
									cellMinWidth: 60,
									even: true, // 开启隔行背景
									data: values,
								});
							} else {
								layer.msg("查询失败");
							}
						}
					);
					table.on("tool(tab_table_2_tool)", function (obj) {
						var value = obj.data; //获得当前行数据
						var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

						if (layEvent === "delete") {
							//连接websql数据库
							webSqlExecute(
								"transfer",
								"delete from transfer where id= ?",
								[value.id],
								function (tx, re) {
									if (tx) {
										reloadTable();
										layer.msg("移除成功");
									} else {
										layer.msg("移除失败");
									}
								}
							);
						} else if (layEvent === "transfer") {
							if (value.state === "在架") {
								baseData = [value];
								isTransfer = true;
								$(".modaljump").trigger("click");
							} else {
								layer.msg("只能移交在架档案");
							}
						}
					});
				} else {
					var tool2 = `<a class="layui-btn-xs layui-btn-tablexs" lay-event="transfer">移交</a> <a href="javascript:;" class="line"></a>
    <a class="layui-btn-xs layui-btn-tablexs" lay-event="waitingTransfer">添加到待移交</a>`;

					oprate.empty();
					oprate.append(tool2);
				}
			});
			form.render();
			fileRetrieval(
				mytable,
				"archivesmodule/arcTbBorrowRun/fileRetrieval"
			);
			// borrowDistinguish();
			borrowManageBatchLend();
			borrowManageAddBorrowing();
			addPending();
			removePending();
			distinguish();
			// onFocus();

			// 检索
			$("#fileRetrieval").on("click", function () {
				var value = $('input[name="fileRetrieval"]').val();
				var pattern = /[`^&% { } | ?]/im;
				if (!value || (value && !pattern.test(value))) {
					var url = `archivesmodule/arcTbBorrowRun/fileRetrieval?fileName=${value}&rfid=${value}&fileNum=${value}&fkSecretName=${value}&fkTypeName=${value}&createUserName=${value}&search=term`;
					fileRetrieval(mytable, url);
				} else {
					layer.msg("查询条件不能包含特殊字符");
				}
			});
		});
	})(mytable)
);

function fileRetrieval(mytable, url) {
	mytable
		.init({
			id: "tab_table_1",
			url: url,
			pageCode: "archives-admin",
			limit: "20",
			height: "full-" + demoTable_height + "",
			data: {},
		})
		.then(function (table) {
			var tool2 = `<a class="layui-btn-xs layui-btn-tablexs" lay-event="transfer">移交</a> <a href="javascript:;" class="line"></a>
    <a class="layui-btn-xs layui-btn-tablexs" lay-event="waitingTransfer">添加到待移交</a>`;

			oprate.empty();
			oprate.append(tool2);

			// 编辑
			table.on("tool(tab_table_1_tool)", function (obj) {
				var data = obj.data; //获得当前行数据
				var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
				var tr = obj.tr; //获得当前行 tr 的DOM对象
				if (layEvent === "transfer") {
					if (data.state === "在架") {
						baseData = [data];
						$(".modaljump").trigger("click");
					} else {
						layer.msg("只能移交在架档案");
					}
				} else if (layEvent === "waitingTransfer") {
					if (data.state === "在架") {
						//连接websql数据库
						webSqlExecute(
							"transfer",
							"INSERT INTO transfer (id,fileNum,fileName,fondsId,fkSecretName,fkTypeId,fkTypeName,boxName,createTime,locationName,integrity,state,allowBorrow) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
							[
								data.id,
								data.fileNum,
								data.fileName,
								data.fondsId,
								data.fkSecretName,
								data.fkTypeId,
								data.fkTypeName,
								data.boxName,
								data.createTime,
								data.locationName,
								data.integrity,
								data.state,
								data.allowBorrow,
							],
							function (tx, re) {
								if (tx) {
									layer.msg("添加数据成功");
								} else {
									layer.msg(
										"添加数据失败: " + "不能重复添加"
									);
								}
							}
						);
					} else {
						layer.msg("只能添加在架档案!!");
					}
				}
			});
		});
}
//rfid识别搜索
function distinguish() {
	$("#ReExp").on("click", function () {
		$("#tab_table_1").next().css({ display: "none" });
        // wsValue.send("start");
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
		// var data = { wsUri: window.wsUri, cmd: "readMany" };
		// mycmd.rfid(data, function (res) {
		//     var res = JSON.parse(res);
		//     if (res.state) {
		//         if (res.row) {
		//             // layer.msg(res.msg);
		//             $("#RFID").val(res.row.EPC);
		//             var value = $('input[name="fileRetrieval"]').val();
		//             var url = `archivesmodule/arcTbBorrowRun/fileRetrieval?fileName=${value}&rfid=${value}&fileNum=${value}&fkSecretName=${value}&fkTypeName=${value}&createUserName=${value}&search=term`;
		//             fileRetrieval(mytable, url);
		//         }
		//     } else {
		//         // layer.msg(res.msg);
		//         return;
		//     }
		// });
	});
}

// 批量移交
function borrowManageBatchLend() {
	$("#batch_transfer2").on("click", function () {
		var value = getCheckedData("tab_table_2");
		if (value.length > 0) {
			// data.every(function (item) {
			//    return item.state === '在架';
			// });
			for (var i = 0; i < value.length; i++) {
				if (value[i].state !== "在架") {
					layui.layer.msg("只能移交在架档案!");
					return;
				}
			}
			baseData = value;
			isTransfer = true;
			$(".modaljump").trigger("click");
		} else {
			layui.layer.msg("请选择档案！");
		}
	});
}

// 新增移交
function borrowManageAddBorrowing() {
	$("#add_transfer").on("click", function () {
		var data = getCheckedData("tab_table_1");
		if (data.length > 0) {
			// data.every(function (item) {
			//    return item.state === '在架';
			// });
			for (var i = 0; i < data.length; i++) {
				if (data[i].state !== "在架") {
					layui.layer.msg("只能移交在架档案!!");
					return;
				}
			}
			baseData = data;
			$(".modaljump").trigger("click");
		} else {
			layui.layer.msg("请选择档案之后再批量移交！");
		}
	});
}

// 添加到待借阅
function addPending() {
	$("#waiting_transfer").on("click", function () {
		var data = getCheckedData("tab_table_1");
		if (data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].state !== "在架") {
					layui.layer.msg("只能添加在架档案!!");
					return;
				}
			}
			//添加数据到websql
			var loading = layui.layer.load(2);
			for (var i = 0; i < data.length; i++) {
				//连接websql数据库
				webSqlExecute(
					"transfer",
					"INSERT INTO transfer (id,fileNum,fileName,fondsId,fkSecretName,fkTypeId,fkTypeName,boxName,createTime,locationName,integrity,state,allowBorrow) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
					[
						data[i].id,
						data[i].fileNum,
						data[i].fileName,
						data[i].fondsId,
						data[i].fkSecretName,
						data[i].fkTypeId,
						data[i].fkTypeName,
						data[i].boxName,
						data[i].createTime,
						data[i].locationName,
						data[i].integrity,
						data[i].state,
						data[i].allowBorrow,
					],
					function (tx, re) {
						layui.layer.close(loading);
						if (tx) {
							layer.msg("添加数据成功");
						} else {
							layer.msg("添加数据失败: " + "不能重复添加");
						}
					}
				);
			}
		} else {
			layer.msg("请选择档案之后再添加到待移交！！");
		}
	});
}

function reloadTable() {
	var data = [];
	var cols = app.asyncGet("authmodule/authTbPageols/selectCols", {
		pageCode: "archives-admin",
	});
	var rows = [];
	rows[0] = {
		type: "checkbox",
		title: "type",
		width: 100,
		fixed: "left",
	};
	for (var i = 1; i <= cols.rows.length; i++) {
		rows[i] = cols.rows[i - 1];
	}
	data.push(rows);
	var values = [];

	//连接websql数据库
	webSqlExecute("transfer", "SELECT * FROM transfer", [], function (
		tx,
		results
	) {
		if (tx) {
			for (var i = 0; i < results.rows.length; i++) {
				values.push(results.rows[i]);
			}
			layui.table.render({
				elem: "#tab_table_2",
				cols: data,
				page: {
					theme: "#3a97ff",
				},
				limit: 10,
				height: "full-" + demoTable_height + "",
				loading: true,
				cellMinWidth: 60,
				even: true, // 开启隔行背景
				data: values,
			});
		} else {
			alert("查询失败");
		}
	});
}

// 批量移除待移交
function removePending() {
	$("#remove").on("click", function () {
		var value = getCheckedData("tab_table_2");
		if (value.length > 0) {
			layer.confirm(
				"是否移除档案？",
				{
					btnAlign: "c",
					anim: 5,
					title: "提示",
					shade: [0.01, "#fff"],
				},
				function (index, layero) {
					layer.close(index);
					var loading = layer.load(2);
					//连接websql数据库
					var data = [];
					var cols = app.asyncGet(
						"authmodule/authTbPageols/selectCols",
						{
							pageCode: "archives-admin",
						}
					);
					var rows = [];
					rows[0] = {
						type: "checkbox",
						title: "type",
						width: 100,
						fixed: "left",
					};
					for (var i = 1; i <= cols.rows.length; i++) {
						rows[i] = cols.rows[i - 1];
					}
					data.push(rows);
					var value = getCheckedData("tab_table_2");
					for (var i = 0; i < value.length; i++) {
						webSqlExecute(
							"transfer",
							"delete from transfer where id= ?",
							[value[i].id],
							function (tx, re) {
								layer.close(loading);
								if (tx) {
									reloadTable();
									layer.msg("移除成功");
								} else {
									layer.msg("移除失败");
								}
							}
						);
					}
				}
			);
		} else {
			layui.layer.msg("请选择档案！");
		}
	});
}

function firstRefresh() {
	if (isTransfer) {
		deleteTransfer();
	}
	$(".layui-laypage-skip input").val(1);
	$(".layui-laypage-btn")[0].click();
}
function testRefresh() {
	$(".layui-laypage-btn")[0].click();
}

// function onFocus() {
//     $("#ReExp").click(function () {
//         readRFID();
//     });
// }

//rfid
function RFID(data) {
	$("#RFID").val(data);
}
function deleteTransfer() {
	for (var i = 0; i < baseData.length; i++) {
		webSqlExecute(
			"transfer",
			"delete from transfer where id= ?",
			[baseData[i].id],
			function (tx, re) {
				if (tx) {
					reloadTable();
				} else {
					layer.msg("移除失败");
				}
			}
		);
	}
	isTransfer = false;
}

// websocket专供
// function webinit(url) {
// 	var ws = new WebSocket(url);
// 	let that = this;
// 	ws.onopen = (e) => {
// 		ws.send("connect");
// 		console.log("连接成功");
// 	};
// 	ws.onmessage = (e) => {
// 		let result = /^EPC/.test(e.data);
// 		//let result = 'EPCE22200174010016614808282'
// 		let notice = /error/.test(e.data);
// 		let reconnect = /reconnect/.test(e.data);
// 		console.log("接收的信息", e.data, result);
// 		let error = "设备连接失败";
// 		if (error == e.data) {
// 			$("#identify_error").text("设备连接失败");
// 		}
// 		if (result) {
// 			console.log(e.data, "检测RFID");
// 			if (e.data.length > 4) {
// 				let res = e.data.slice(3);
// 				readRFID(res);
// 				console.log("你没执行啊");
// 			} else {
// 				$(".rfid-loading").hide();
// 				$("#identify_tag")
// 					.attr("disabled", false)
// 					.css("backgroundColor", "#3a97ff");
// 				// 弹框
// 				$("#identify_error").text("RFID为空");

// 				console.log(!e.data, "RFID为空？");
// 			}
// 		}
// 		console.log("接收数据", e.data);
// 	};
// 	ws.onclose = (e) => {
// 		$(".rfid-loading").hide();
// 		$("#identify_tag")
// 			.attr("disabled", false)
// 			.css("backgroundColor", "#3a97ff");
// 		$("#identify_error").text("连接关闭");
// 		console.log("连接关闭");
// 	};
// 	ws.onerror = (e) => {
// 		$(".rfid-loading").hide();
// 		$("#identify_tag")
// 			.attr("disabled", false)
// 			.css("backgroundColor", "#3a97ff");
// 		$("#identify_error").text("设备连接失败");
// 		console.log("出错情况");
// 	};
// 	return ws;
// }

function readRFID(rfid) {
	if (rfid) {
		console.log(rfid);
		$("#RFID").val(rfid);
		var value = $('input[name="fileRetrieval"]').val();
		var url = `archivesmodule/arcTbBorrowRun/fileRetrieval?fileName=${value}&rfid=${value}&fileNum=${value}&fkSecretName=${value}&fkTypeName=${value}&createUserName=${value}&search=term`;
		fileRetrieval(mytable, url);
	} else {
		return;
	}
}
