// 初始化
var baseData = {};
let timer;
let rfid;
var table = function (mytable, url) {
	mytable
		.init({
			id: "tablle_info",
			pageCode: "warning-message",
			// pageMarker:"111",
			url: url,
			callback: function () {
				// preview();
			},
		})
		.then(function (table) {
			//console.log(table);
			//监听工具条
			table.on("tool(control)", function (obj) {
				var data = obj.data;
				let rfid = $(".keywords").val();
				let storeName = $("#store_name").find("option:selected").val();
				console.log(data);
				if (obj.event === "bind") {
					if (!rfid) {
						layer.msg("RFID不能为空");
						return false;
					}
					layer.confirm(
						`是否把RFID:${rfid}，注册到位置:${data.locationName}`,
						{ shade: 0 },
						function (index) {
							app.get(
								"shelf/location/bindRfid",
								{
									id: data.id,
									rfid: rfid,
								},
								function (msg) {
									if (msg.code == 200) {
										layer.msg("绑定成功");
										getTableData(storeName);
									} else {
										layer.msg(msg.msg);
									}
								}
							);
						}
					);
				} else if (obj.event === "unbind") {
					layer.confirm(
						`是否解除RFID:${data.rfid}与位置:${data.locationName}的绑定关系`,
						{ shade: 0 },
						function (index) {
							app.get(
								"shelf/location/untie",
								{
									id: data.id,
								},
								function (msg) {
									if (msg.code == 200) {
										layer.msg("解绑成功");
										getTableData(storeName);
									} else {
										layer.msg(msg.msg);
									}
								}
							);
						}
					);
				}
			});
		});
};

function resetForm() {
	$(".reason,.way").val("");
}

function firstRefresh() {
	$(".layui-laypage-skip input").val(1);
	try {
		$(".layui-laypage-btn")[0].click();
	} catch (error) {
		$(".curSelectedNode").click();
	}
}
function testRefresh() {
	$(".layui-laypage-btn")[0].click();
}

// 查询所有库房
function getStoreName() {
	app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function (msg) {
		if (msg.state) {
			var str = "";
			for (var i = 0; i < msg.rows.length; i++) {
				str +=
					'<option value="' +
					msg.rows[i].id +
					'">' +
					msg.rows[i].storeName +
					"</option>";
			}
			$("#store_name").html(str);
			getTableData(msg.rows[0].id);

			form.render();
		} else {
			layer.msg(msg.msg);
		}
	});
}

// 查询表格数据
function getTableData(storeId) {
	table(mytable, "shelf/location/getByStoreId?storeId=" + storeId);
}

// 搜索
function searchTable() {
	$(".msg-search").on("click", function () {
		var storeName = $("#store_name").find("option:selected").val();
        var keywords = $(".keywords").val();
        console.log(keywords);
		var pattern = /[`^&% { } | ?]/im;
		if (!(keywords && !pattern.test(keywords))) {
			layer.msg("查询条件不能为空或不能包含特殊字符");
			return false;
		}
		$(".msg-search").attr(
			"href",
			"html/binding/getone.html?id=" +
				keywords +
				"&storeName=" +
				storeName
		);
	});
}

// 重新连接
function restartMsg() {
	$(".restart").on("click", function () {
		app.bindingget("rfid/start", {}, function (msg) {
			if ((msg.code = 200)) {
				console.log("开始读取");
			} else {
				console.log(msg.msg);
			}
		});
		clearInterval(timer);
		getrfid();
	});
}

// 导出Excel表
function outputExcel() {
	$(".select_export").on("click", function () {
		var storeName = $("#store_name").find("option:selected").val();
		document.location.href =
			baseurl + "shelf/location/export?storeId=" + storeName;
	});
}

// 获取RFID
function getrfid() {
	timer = setInterval(() => {
		app.bindingget("rfid/getMessage", {}, function (msg) {
			if (msg.data) {
				if (msg.data.length > 1) {
					$(".keywords").val("");
					$(".hint-text").html(
						"无法同时操作多个标签，请保证RFID识别区附近有且仅有一张电子标签"
					);
					rfid = "";
					$(".hint-text").css("color", "red");
					$(".hint").css("background", "red");
					$(".restart").css("display", "none");
					return false;
				}
				else if (msg.data[0].code == 0) {
					if (msg.data[0].location) {
						$(".keywords").val(
							msg.data[0].rfid + "：" + msg.data[0].location
						);
					} else {
						$(".keywords").val(msg.data[0].rfid);
					}
					rfid = msg.data[0].rfid;
					$(".hint-text").html("RFID读写器连接正常");
					$(".hint-text").css("color", "#0D0");
					$(".hint").css("background", "#0D0");
					$(".restart").css("display", "none");
				} else {
					$(".keywords").val("");
					rfid = "";
					$(".hint-text").html(msg.data[0].msg);
					$(".hint-text").css("color", "red");
					$(".hint").css("background", "red");
					$(".restart").css("display", "block");
					layer.msg(msg.data[0].msg);
					endapp();
					clearInterval(timer);
				}
			} else {
				$(".keywords").val("");
				rfid = "";
				$(".hint-text").html("当前未识别到有效的电子标签");
				$(".hint-text").css("color", "red");
				$(".hint").css("background", "red");
				$(".restart").css("display", "none");
			}
		});
	}, 2000);
}

var form;
$(
	(function (mytable) {
		searchTable();
		// 进入页面读取标签
		app.bindingget("rfid/start", {}, function (msg) {
			if ((msg.code = 200)) {
				console.log("开始读取");
			} else {
				console.log(msg.msg);
			}
		});
		getrfid();
		restartMsg();
		outputExcel();
		layui.use(["form", "table"], function () {
			form = layui.form;
			var tabel = layui.table;
			getStoreName();
			outputExcel();
			form.on("select(store_name)", function (data) {
				console.log(data.value);
				getTableData(data.value);
			});
			form.render();
		});
	})(mytable)
);

function endapp() {
	app.bindingget("rfid/end", {}, function (msg) {
		if ((msg.code = 200)) {
			console.log("关闭");
		} else {
			console.log(msg.msg);
		}
	});
}

// 离开页面关闭读取
window.onbeforeunload = function () {
	endapp();
	clearInterval(timer);
};

document.addEventListener("visibilitychange", function () {
	if (document.visibilityState == "visible") {
		location.reload();
	}
	if (document.visibilityState == "hidden") {
		console.log("最小化");
	}
});
