var form,
	time = [],
	wd = [],
	sd = [],
	tvoc = [],
	lineInterval,
	chcheEqu = [],
	add_tabletr,
	fkStoreId,
	mapstoreName = "",
	submenu = "",
	total = [0, 0, 0];
$(
	(function () {
		layui.use(["form", "element", "layer", "table"], () => {
			form = layui.form;
			getRoom();
			// 库房选择
			form.on("select(door-room)", (data) => {
				var img = $("#door-room")
					.find("option:selected")
					.attr("imgAddress");
				try {
					$("#content").css(
						"background",
						"url(" + imgurl + "" + img + ")no-repeat"
					);
					$("#content").css("background-size", "100% 100%");
				} catch (error) {}
				fkStoreId = data.value;
				getQuipment();
				alarminfo(data.value);
				initEchartDat();
			});
			// 选择采集器
			form.on("select(room-area)", (data) => {
				initEchartDat();
				getLineData(data.value);
				lineInterval = setInterval(() => {
					getLineData(data.value);
				}, 5000);
			});
		});
	})()
);

// 获取库房
function getRoom() {
	app.getAsync(
		"environmentmodule/wkStoTbStore/selectWkStoTbStore",
		"",
		(msg) => {
			if (msg.state) {
				var str = "";
				for (var i = 0; i < msg.rows.length; i++) {
					str +=
						"<option value=" +
						msg.rows[i].id +
						" imgAddress=" +
						msg.rows[i].imgAddress +
						">" +
						msg.rows[i].storeName +
						"</option>";
				}
				$("#door-room").append(str);
				if (msg.rows.length > 0) {
					$("#content").css(
						"background",
						"url(" +
							imgurl +
							"" +
							msg.rows[0].imgAddress +
							")no-repeat"
					);
					$("#content").css("background-size", "100% 100%");
					fkStoreId = msg.rows[0].id;
					getQuipment();
					alarminfo(msg.rows[0].id);
				}
				form.render();
			}
		}
	);
}

// 获取设备
function getQuipment() {
	app.get(
		"environment/equipment/selectEquipments?pageSize=50&&map[fkStoreId]=" +
			fkStoreId,
		"",
		(msg) => {
			var onnum = 0,
				offnum = 0,
				offlinenum = 0,
				strarea = "";
			$("#content").html("");
			$("#room-area").html("");
			var cjqArr = [];
			if (msg.state) {
				var cjqnum = 0;
				for (let i = 0; i < msg.rows.length; i++) {
					var state = msg.rows[i].state; // 状态
					switch (state) {
						case "on":
							state = "运行";
							onnum++;
							break;
						case "off":
							state = "关闭";
							offnum++;
							break;
						case "offline":
							state = "离线";
							offlinenum++;
							break;
						case "down":
							state = "降温";
							onnum++;
							break;
						case "up":
							state = "升温";
							onnum++;
							break;
						case "no_connect":
							state = "未连接上";
							offlinenum++;
							break;
					}
					if (msg.rows[i].fkTypeCode != "afmj") {
						var mode = msg.rows[i].mode;
						if (mode == "hand") {
							mode = "手动模式";
						} else {
							mode = "自动模式";
						}
						initQuipment(msg.rows[i], state, mode);
						Divmouse("#drag_box" + msg.rows[i].id + "");
						//将设备信息与前端ID绑定
						chcheEqu.push({
							id: msg.rows[i].id,
							drag: "drag_box" + msg.rows[i].id + "",
						});
						drag(msg.rows[i].id);
						queryequicmd(
							msg.rows[i].id,
							msg.rows[i].fkTypeId,
							msg.rows[i].equNum
						);
					}
					if (msg.rows[i].fkTypeCode == "cjq" && state == "运行") {
						strarea +=
							"<option value=" +
							msg.rows[i].equNum +
							">" +
							msg.rows[i].equName +
							"</option>";
						cjqArr[cjqnum] = msg.rows[i];
						cjqnum++;
					}
					total = [onnum, offnum, offlinenum];
				}
				initArchivesratio();
				archivesratio(cjqArr);
				$("#room-area").append(strarea);
				getLineData(cjqArr[0].equNum);
				lineInterval = setInterval(() => {
					getLineData(cjqArr[0].equNum);
				}, 5000);
				form.render();
			} else {
				total = [0, 0, 0];
				initArchivesratio();
				archivesratio(cjqArr);
				$("#room-area").append(strarea);
				form.render();
			}
		}
	);
}

// 设备监控
function archivesratio(cjqArr) {
	if (cjqArr.length > 0) {
		for (var i = 0; i < cjqArr.length; i++) {
			app.get(
				"environment/equipment/selectHistoryCjq",
				{ equNum: cjqArr[i].equNum },
				(res) => {
					if (res.state) {
						let datas = res.row;
						var state = datas.state;
						if (
							state === "on" ||
							state === "up" ||
							state === "down"
						) {
							state = "运行";
						} else if (state === "off") {
							state = "关闭";
						} else if (state === "offline") {
							state = "离线";
						} else if (state === "no_connect") {
							state = "未连接上";
						}
						var values = {
							name: datas.fkEquName,
							equNum: datas.fkEquNum,
							state,
							datas,
						};
						initTwo(values);
					}
				}
			);
		}
	}
}

// 获取环境数据
function getLineData(equNum) {
	app.get(
		"environment/equipment/selectHistoryCjq",
		{
			equNum: equNum,
		},
		(res) => {
			if (res.state) {
				if (time.length > 6) {
					time.shift();
					wd.shift();
					sd.shift();
					tvoc.shift();
				}
				time.push(res.msg);
				wd.push(res.row.wd);
				sd.push(res.row.sd);
				tvoc.push(res.row.tvoc);
				getLine();
				let html =
					"<tr><th>" +
					res.row.wd +
					"<span class='minfont'>℃</span></th><th>" +
					res.row.sd +
					"<span class='minfont'>%RH</span></th><th>" +
					res.row.tvoc +
					"<span class='minfont'>mg/m³</span></th></tr>";
				$(`#cjqmenu${equNum}`).html(html);
			}
		}
	);
}

// 环境实时曲线图
var myChart = echarts.init(document.getElementById("line-area"));
function getLine() {
	var option = {
		tooltip: {
			trigger: "axis",
		},
		color: ["#3a97ff", "#ffe63a", "#d247ff"],
		legend: {
			data: [
				{ name: "温度(℃)", borderColor: "yellow" },
				{ name: "湿度(%RH)" },
				{ name: "TVOC(mg/m³)" },
			],
		},
		grid: {
			// left: "3%",
			// right: "4%",
			bottom: "3%",
			containLabel: true,
		},
		toolbox: {
			feature: {
				saveAsImage: {
					show: false,
				},
			},
		},
		xAxis: {
			type: "category",
			boundaryGap: false,
			data: time,
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				name: "温度(℃)",
				type: "line",
				itemStyle: {
					normal: {
						lineStyle: {
							color: "#3a97ff",
						},
					},
				},
				data: wd,
			},
			{
				name: "湿度(%RH)",
				type: "line",
				itemStyle: {
					normal: {
						lineStyle: {
							color: "#ffe63a",
						},
					},
				},
				data: sd,
			},
			{
				name: "TVOC(mg/m³)",
				type: "line",
				itemStyle: {
					normal: {
						lineStyle: {
							color: "#d247ff",
						},
					},
				},
				data: tvoc,
			},
		],
	};
	myChart.setOption(option);
	window.onresize = myChart.resize;
}

//报警信息
function alarminfo(fkStoreId) {
	app.get(
		"environment/alarm/selectAlarms",
		{ "map[fkStoreId]": fkStoreId },
		function (msg) {
			$("#alarm-info").html("");
			if (msg.state) {
				var tabletr = "",
					tablethead = "";
				var data = msg.rows;
				tablethead =
					" <thead><tr><th>报警信息</th><th>报警值</th><th>报警时间</th></tr></thead><tbody>";

				for (var i = 0; i < data.length; i++) {
					tabletr +=
						"<tr><td>" +
						data[i].alarmMsg +
						"</td><td>" +
						data[i].alarmValue +
						"</td><td>" +
						data[i].createTime +
						"</td></tr>";
				}
				add_tabletr = tabletr;
				$("#alarm-info").html(tablethead + tabletr + "</tbody>");
			} else {
				$("#alarm-info").html("暂无报警信息！");
			}
		}
	);
}

// 初始化设备监控
function initArchivesratio() {
	mapstoreName = $("#door-room").find("option:selected").text();
	var tag =
		'   <table class="wsdtitle">\n' +
		"                            </table><li>\n" +
		'                        <div class="link">' +
		mapstoreName +
		"\n" +
		'                        <table class="wsdtable">\n' +
		"                        <tr>\n" +
		"                        <th id='stateon'>" +
		total[0] +
		"</th>\n" +
		"                        <th id='stateoff'>" +
		total[1] +
		"</th>\n" +
		"                        <th id='stateoffline'>" +
		total[2] +
		"</th>\n" +
		"                        </tr>\n" +
		"                            <tr>\n" +
		"                            <td>运行数量</td>\n" +
		"                            <td>关闭数量</td>\n" +
		"                            <td>离线数量</td>\n" +
		"                            </tr>\n" +
		"                        </table>\n" +
		'                        </div><ul class="submenu" id="submenu">' +
		"</ul></li>";
	$(".con_menu").html(tag);
}

// 初始化采集器显示
function initTwo(e) {
	if (e.name) {
		submenu +=
			"<li><a>" +
			e.name +
			"<span id='stateli" +
			e.equNum +
			"'>（" +
			e.state +
			"）</span><table id='cjqmenu" +
			e.equNum +
			'\' class="wsdtable"><tr><th>' +
			e.datas.wd +
			"<span class='minfont'>℃</span></th><th>" +
			e.datas.sd +
			"<span class='minfont'>%RH</span></th><th>" +
			e.datas.tvoc +
			"<span class='minfont'>mg/m³</span></th></tr></table></a></li>";
	}
	$("#submenu").html(submenu);
}

// 初始化设备
function initQuipment(data, state, mode) {
	if (data.fkTypeCode == "cjq") {
		str =
			"<div class='public all part" +
			data.equNum +
			" layui-rows -off jzq" +
			data.equCenterNum +
			"' id='drag_box" +
			data.id +
			"'>" +
			"<div class='layui-col-md2 layui-col-xs2 layui-col-sm2 img" +
			data.equNum +
			"'><img src='../../static/images/environment/" +
			data.fkTypeCode +
			"-off.png' alt='' srcset=''></div>" +
			"<div class='layui-col-md7 layui-col-xs7 layui-col-sm7' style='left:3px'>" +
			"<dl id='data" +
			data.equNum +
			"'><dd class='wsd'>" +
			data.equName +
			"&nbsp;&nbsp;</dd><dd class='state'>当前状态：<span class='" +
			data.state +
			"'></span>&nbsp;&nbsp;" +
			state +
			"</dd><dd class='mode'>当前模式：" +
			mode +
			"</dd></dl></div>" +
			"<div class='layui-col-md3 layui-col-xs3 layui-col-sm3 cmdclick' id=" +
			data.id +
			"><div style='margin-top: 17px;'><lable  class='morecmd' id=" +
			data.id +
			" onclick='moreclick(this)'>更多操作</lable></div></div>" +
			"</div>";
	} else {
		str =
			"<div class='public all part" +
			data.equNum +
			" layui-rows -off jzq" +
			data.equCenterNum +
			"' id='drag_box" +
			data.id +
			"'>" +
			"<div class='layui-col-md2 layui-col-xs2 layui-col-sm2 img" +
			data.equNum +
			"'><img src='../../static/images/environment/" +
			data.fkTypeCode +
			"-off.png' alt='' srcset=''></div>" +
			"<div class='layui-col-md7 layui-col-xs7 layui-col-sm7' style='left:3px'>" +
			"<dl id='data" +
			data.equNum +
			"'><dd class='wsd'>" +
			data.equName +
			"</dd><dd class='state'>当前状态：<span class='" +
			data.state +
			"'></span>&nbsp;&nbsp;" +
			state +
			"</dd><dd class='mode'>当前模式：" +
			mode +
			"</dd></dl></div>" +
			"<div class='layui-col-md3 layui-col-xs3 layui-col-sm3 cmdclick' id=" +
			data.id +
			"><div style='margin-top: 17px;'><lable  class='morecmd' id=" +
			data.id +
			" onclick='moreclick(this)'>更多操作</lable></div></div>" +
			"</div>";
	}
	$("#content").append(str);
}

//更多操作点击事件
function moreclick(value) {
	$(".layui-dropdown-menu" + value.id + "").toggleClass("main");
}

//查询操作
function queryequicmd(equiId, fkTypeId, equNum) {
	app.get("environment/cmd/selectCmds", { typeId: fkTypeId }, (msg) => {
		if (msg.state) {
			var str = "";
			$("#" + equiId).append(
				"<div class='dropdown-menu'><ul class='layui-dropdown-menu" +
					equiId +
					"'></ul></div>"
			);
			for (var i = 0; i < msg.rows.length; i++) {
				var cmdPar = JSON.stringify(msg.rows[i].cmdPar);
				str +=
					"<li><a title=" +
					msg.rows[i].cmdMark +
					" id=" +
					equNum +
					" onclick='moreclickul(this)' data-cmdpar='" +
					cmdPar +
					"'>" +
					msg.rows[i].cmdName +
					"</a></li>";
			}
			$(".layui-dropdown-menu" + equiId + "").append(str);
		}
	});
}

// 操作点击事件
function moreclickul(value) {
	layui.use(["layer"], function () {
		var layer = layui.layer;
		layer.msg("执行中！");
		setTimeout(() => {
			$(".layui-dropdown-menu" + value.offsetParent.id + "").toggleClass(
				"main"
			);
			var cmdPar = $(value).attr("data-cmdpar");
			if (cmdPar) {
				cmdPar = JSON.parse(cmdPar);
			}
			var info = {
				equNum: value.id,
				cmd: value.title,
				data: cmdPar,
			};
			app.postAsync("environmentmodule/cmd/sendMsg", info, (msg) => {
				if (msg.state) {
					switch (msg.msg) {
						case "NotHandMode":
							layer.msg("当前不处于手动模式，请开启！");
							break;
						case "OffLine":
							layer.msg("设备不在线，请检查设备状态！");
							break;
						case "NoAddr":
							layer.msg("未知的设备地址！");
							break;
						case "NoneCmd":
							layer.msg("没有找到命令！");
							break;
						case "NoDataItem":
							layer.msg("数据字段为空！");
							break;
						case "OtherErr":
							layer.msg("其他错误！");
							break;
						default:
							layer.msg(msg.msg);
							break;
					}
				} else {
					getQuipment();
					layer.msg(msg.msg);
				}
			});
		}, 1000);
	});
}

// 拖动
function drag(obj) {
	getPosition("drag_box" + obj);
	var obox = document.getElementById("content");
	var odrag = document.getElementById("drag_box" + obj);
	odrag.onmousedown = function (ev) {
		var oevent = ev || event;
		var distanceX = oevent.clientX - odrag.offsetLeft;
		var distanceY = oevent.clientY - odrag.offsetTop;
		var old_x = oevent.clientX;
		var old_y = oevent.clientY;
		document.onmousemove = function (ev) {
			var oevent = ev || event;
			var _x, _y;
			_x = oevent.clientX - distanceX;
			_y = oevent.clientY - distanceY;
			if (_x < 0) _x = 0;
			if (_y < 0) _y = 0;
			// 处理边界问题
			if (_x > obox.offsetWidth - 240) _x = obox.offsetWidth - 240;
			if (_y > obox.offsetHeight - odrag.offsetHeight)
				_y = obox.offsetHeight - odrag.offsetHeight;

			odrag.style.left = _x + "px";
			odrag.style.top = _y + "px";
		};
		document.onmouseup = function (ev) {
			var oevent = ev || event;
			var _x = oevent.clientX - distanceX;

			var _y = oevent.clientY - distanceY;
			var equid = null;
			for (var i = 0; i < chcheEqu.length; i++) {
				if (chcheEqu[i].drag === "drag_box" + obj) {
					equid = chcheEqu[i].id;
					break;
				}
			}
			var leftindex = (_x / $("#content").width()).toFixed(2);
			var topindex = (_y / $("#content").height()).toFixed(2);

			if (old_x !== oevent.clientX || old_y !== oevent.clientY) {
				app.post(
					"environmentmodule/equTbEquLocation/addOrUpdata",
					{ fkEquId: obj, leftIndex: leftindex, topIndex: topindex },
					function success(msg) {
						layui.layer.msg(msg.msg);
					}
				);
			}
			localStorage.setItem("posXdrag_box" + obj, leftindex);
			localStorage.setItem("posYdrag_box" + obj, topindex);
			document.onmousemove = null;
			document.onmouseup = null;
		};
	};
}

// 获取初始位置
function getPosition(obj) {
	var dragObj = document.getElementById(obj);
	var equid = null;
	var posx = null;
	var posy = null;
	for (var i = 0; i < chcheEqu.length; i++) {
		if (chcheEqu[i].drag === obj) {
			equid = chcheEqu[i].id;
			break;
		}
	}
	if (equid !== null && equLocation.length > 0) {
		for (var i = 0; i < equLocation.length; i++) {
			if (equLocation[i].id === equid) {
				posx = (
					$("#content").width() * equLocation[i].leftindex
				).toFixed(2);
				posy = (
					$("#content").height() * equLocation[i].topindex
				).toFixed(2);
				break;
			}
		}
	} else {
		posx = (
			$("#content").width() * localStorage.getItem("posX" + obj)
		).toFixed(2);
		posy = (
			$("#content").height() * localStorage.getItem("posY" + obj)
		).toFixed(2);
	}
	dragObj.style.left = posx + "px";
	dragObj.style.top = posy + "px";
}

// 鼠标事件
function Divmouse(obj) {}

// 初始化echart数据
function initEchartDat() {
	time = [];
	wd = [];
	sd = [];
	tvoc = [];
	clearInterval(lineInterval);
	getLine();
}
