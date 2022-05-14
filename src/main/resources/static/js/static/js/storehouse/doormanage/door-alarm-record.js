$(
	(function (mytable) {
		layui.use(["layer", "form", "laydate"], function () {
			var layer = layui.layer;
			var form = layui.form;
			var laydate = layui.laydate;
			getMenuBar(); //自定义面包屑，引用public-menu.js
			//日期范围
			mybtn.date("#date_picker1", "#date_picker2");
			app.get("storeroom/entranceGuard/getEntranceGuard", {}, (res) => {
				var str = "";
				for (var i = 0; i < res.rows.length; i++) {
					str +=
						"<option value=" +
						res.rows[i].entranceGuardNum +
						">" +
						res.rows[i].entranceGuardName +
						"</option>";
				}
				$("#door-equi").append(str);
				form.render();
			});
			// mymore.selectroom("#door-room", "#door-equi");
			form.on("select(output)", function (data) {
				var datajson = {
					// 'map[fkStoreId]': $('#door-room').val(),
					"map[fkEntranceGuardNum]": $("#door-equi").val(),
					"map[fkFileName]": $("#fkFileName").val(),
					"map[starttime]": $("#date_picker1").val(),
					"map[endtime]": $("#date_picker2").val(),
				};
				mymore.export(
					data.value,
					"设备报警记录",
					"door-alarm-record",
					datajson,
					"storeroom/excel/entranceGuardAlarmExcel?"
				);
			});
			mytableinit("");
		});
		/*查询报警记录-liuyuru*/
		$("#query-alarm-record").on("click", function () {
			// var doordatejson= mymore.doordate("#doordate");
			var data = {
				// 'fkStoreId': $('#door-room').val(),
				fkEntranceGuardNum: $("#door-equi").val(),
				fkFileName: $("#fkFileName").val(),
				starttime: $("#date_picker1").val(),
				endtime: $("#date_picker2").val(),
			};
			var keywords = $("#fkFileName").val();
			var pattern = /[`^&% { } | ?]/im;
			if (!keywords || (keywords && !pattern.test(keywords))) {
				mytableinit(data);
			} else {
				layer.msg("查询条件不能包含特殊字符");
			}
		});
	})(mytable)
);
/*表格初始化、报警记录的查询-liuyuru*/
function mytableinit(data) {
	mytable
		.init({
			id: "alarm-record",
			url: "storeroom/entranceGuardAlarm/getEntranceGuardAlarmInfos",
			pageCode: "door-alarm-record",
			data: data,
		})
		.then(function (table) {});
}
