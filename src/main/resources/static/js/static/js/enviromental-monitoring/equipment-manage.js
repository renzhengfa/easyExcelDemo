/**
 * @author yuqi
 * @description 设备管理
 */
renderSelect();
layui.use(["form", "table", "layer"], function () {
	var form = layui.form,
		table = layui.table,
		layer = layui.layer;
	getMenuBar(); //自定义面包屑，引用public-menu.js
	//请求数据表格
	initTable();
	//多条件查询设备
	form.on("submit(conditionSearch)", function (res) {
		var formData = res.field;
		// console.log({
		//     'map[fkStoreId]': formData.storeRoom,
		//     'map[fkTypeId]': formData.equipmentType,
		//     'map[state]': formData.state,
		//     'map[content-like]': formData.searchWord,
		//     'field': 'create_time'
		// })
		var keywords = formData.searchWord;
		var pattern = /[`^&% { } | ?]/im;
		if (!keywords || (keywords && !pattern.test(keywords))) {
			mytable.init({
				id: "table_content",
				url: "environment/equipment/selectEquipments",
				pageCode: "equipment-manage",
				data: {
					"map[fkStoreId]": formData.storeRoom,
					"map[fkTypeId]": formData.equipmentType,
					"map[state]": formData.state,
					"map[content-like]": formData.searchWord,
					field: "create_time",
				},
			});
		} else {
			layer.msg("查询条件不能包含特殊字符");
		}
	});
	//回车键触发查询按钮
	$('input[name="searchWord"]').on("keydown", function (event) {
		if (event.keyCode == "13") {
			$(".demoTable").find("[lay-submit]").click();
		}
	});
	//指令数组
	var cmdParArray = [];
	//数据表格操作栏
	table.on("tool(control)", function (obj) {
		var data = obj.data,
			selectId = data.fkTypeId; //被选中行的id
		console.log(data);
		if (obj.event == "moreAction") {
			var that = this;
			//查询操作
			app.get(
				"environment/cmd/selectCmds",
				{ typeId: selectId },
				function (msg) {
					// console.log(msg);
					var actionList = msg.rows,
						ulElem = $("ul").empty();
					console.log(actionList);
					if (msg.state) {
						if (msg.rows) {
							// 防止重复 append li标签
							if (ulElem.children().length == 0) {
								var liElem,
									count = 0; //指令数组的下标
								for (var key in actionList) {
									if (actionList[key].cmdMark == "enable") {
										liElem =
											'<li class="modaljump" href="html/environmental-monitoring/form/layer-equicmd-forbidden.html?equNum=' +
											data.equNum +
											'"' +
											'action="environmentmodule/cmd/sendMsg" data-title="启用/禁用" data-type="2"' +
											'width="320px" height="280px" data-btn="保存,取消"><span style="color: #393D49">' +
											actionList[key].cmdName +
											"</span></li>";
									} else if (
										actionList[key].cmdMark == "equsto"
									) {
										liElem =
											'<li class="modaljump" href="html/environmental-monitoring/form/layer-equicmd-storagestate.html?equNum=' +
											data.equNum +
											'"' +
											'action="close-layer" data-title="存储状态" data-type="2"' +
											'width="820px" height="530px" data-btn="关闭"><span style="color: #393D49">' +
											actionList[key].cmdName +
											"</span></li>";
									} else if (
										actionList[key].cmdMark == "allatt"
									) {
										liElem =
											'<li class="modaljump" href="html/environmental-monitoring/form/layer-equicmd-getfile.html?equNum=' +
											data.equNum +
											'"' +
											'action="environmentmodule/cmd/sendMsg" data-title="考勤记录" data-type="2"' +
											'width="520px" height="460px" data-btn="保存,取消"><span style="color: #393D49">' +
											actionList[key].cmdName +
											"</span></li>";
									} else if (
										actionList[key].cmdMark == "alluser"
									) {
										liElem =
											'<li class="modaljump" href="html/environmental-monitoring/form/layer-equicmd-userdata.html?equNum=' +
											data.equNum +
											'"' +
											'action="close-layer" data-title="用户数据" data-type="2"' +
											'width="520px" height="460px" data-btn="关闭"><span style="color: #393D49">' +
											actionList[key].cmdName +
											"</span></li>";
									} else if (
										actionList[key].cmdMark == "setip"
									) {
										// liElem = '<li class="modaljump" href="html/environmental-monitoring/form/layer-equicmd-setip.html?id='+data.id+'"'+
										// 'action="environmentmodule/cmd/sendMsg" data-title="设置IP" data-type="2"'+
										// 'width="320px" height="260px" data-btn="保存,取消"><span>' + actionList[key].cmdName + '</span></li>';
										liElem = "";
									} else if (
										actionList[key].cmdMark == "clearatt"
									) {
										liElem =
											'<li class="confirm deletedjump" action="environmentmodule/cmd/sendMsg?equNum=' +
											data.equNum +
											'" data-title="确定清空考勤记录？"><span style="color: #393D49">' +
											actionList[key].cmdName +
											"</span></li>";
									} else {
										//将指令存入指令数组
										cmdParArray.push(
											actionList[key].cmdPar
										);
										//将数组下标（count）存入li标签，点击li标签后，根据下标取指令
										liElem =
											'<li class="li-normal" value="' +
											actionList[key].cmdMark +
											'" data-cmdpar = "' +
											count +
											'"=><span style="color: #393D49">' +
											actionList[key].cmdName +
											"</span></li>";
										//下标加1
										count++;
									}
									ulElem.append(liElem);
								}
							}
							var con = $("#more_action").html();
							layer.open({
								type: 4,
								shade: 0,
								tips: [3, "#ffffff"],
								closeBtn: 0,
								area: ["auto", "auto"],
								content: [con, $(that)], //数组第二项即吸附元素选择器或者DOM
							});
							window.event.stopPropagation();
						}
					} else {
						layer.msg(msg.msg);
						return false;
					}
					//更多操作的ul中li标签的点击事件（li标签的点击事件会累积，要先解绑再绑定）
					$("li.li-normal").on("click", function (event) {
						var cmd = $(this).attr("value");
						//根据数组下标来获取对应的cmdPar
						var cmdPar = $(this).attr("data-cmdpar");
						var info;
						if (cmd == "open") {
							info = {
								equNum: 9000,
								cmd: cmd,
							};
							app.post(
								"environmentmodule/cmd/sendMsg",
								info,
								function (msg) {
									if (msg.state) {
										var data = msg.row.data;
										if (data.state) {
											layer.msg("远程开门成功！");
										} else {
											layer.msg("远程开门失败！");
										}
									} else {
										layer.msg(msg.msg);
									}
								}
							);
						} else {
							info = {
								equNum: data.equNum,
								cmd: cmd,
								data: cmdParArray[cmdPar],
							};
							// console.log(info);
							app.post(
								"environmentmodule/cmd/sendMsg",
								info,
								function (msg) {
									console.log(msg);
									layer.msg(msg.msg);
								}
							);
						}
						//每次执行完清空指令数组
						cmdParArray = [];
					});
				}
			);
		}
	});
});
// 点击页面其他地方，更多操作的ul隐藏
$(document).on("click", function (event) {
	layer.closeAll();
});

//初始化表格
function initTable() {
	mytable
		.init({
			id: "table_content",
			url: "environment/equipment/selectEquipments",
			pageCode: "equipment-manage",
			data: { field: "create_time" },
		})
		.then(function (res, curr, count) {
			// console.log(res);
		});
}
function renderSelect() {
	layui.use("form", function () {
		var form = layui.form;
		//动态渲染设备类型select
		app.get("environment/type/selectAllTypes", {}, function (res) {
			// console.log(res);
			var optionList = res.rows,
				option,
				equipmentType = $('select[name="equipmentType"]');
			for (var key in optionList) {
				option =
					'<option value="' +
					optionList[key].id +
					'">' +
					optionList[key].typeName +
					"</option>";
				equipmentType.append(option);
				form.render();
			}
		});
		//库房
		app.get(
			"environmentmodule/wkStoTbStore/selectWkStoTbStore",
			{},
			function (res) {
				// console.log(res);
				var optionList = res.rows,
					option,
					storeRoom = $('select[name="storeRoom"]');
				for (var key in optionList) {
					option =
						'<option value="' +
						optionList[key].id +
						'">' +
						optionList[key].storeName +
						"</option>";
					storeRoom.append(option);
					form.render();
				}
			}
		);
	});
}
function firstRefresh() {
	var data = layui.table.cache["table_content"],
		page = $(".layui-laypage-skip").find("input").val(); //当前页码值
	if (data && data.length - 1 > 0) {
		$(".layui-laypage-btn")[0].click();
	} else if (page) {
		layui.table.reload("table_content", {
			page: {
				curr: page - 1,
			},
		});
	} else if (!data) {
		$("#search_btn").click();
	}
}

function testRefresh() {
	var data = layui.table.cache["table_content"],
		page = $(".layui-laypage-skip").find("input").val(); //当前页码值
	if (data && data.length - 1 > 0) {
		$(".layui-laypage-btn")[0].click();
	} else if (page) {
		layui.table.reload("table_content", {
			page: {
				curr: page - 1,
			},
		});
	}
}
