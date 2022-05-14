$(
	(function (mytable) {
		layui.use(["layer", "form"], function () {
			var layer = layui.layer;
			var form = layui.form;
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
			// mymore.selectequipmentAll("#door-equi");
			mytableinit("");
			form.on("select(output)", function (data) {
				// var doordatejson= mymore.doordate("#doordate");
				var datajson = {
					"map[fileName]": $("#filename").val(),
					"map[isBox]": $("#isBox").val(),
					"map[fkStoreId]": $("#door-room").val(),
					"map[fkEntranceGuardNum]": $("#door-equi").val(),
					"map[starttime]": $("#date_picker1").val(),
					"map[endtime]": $("#date_picker2").val(),
				};
				mymore.export(
					data.value,
					"档案出入记录",
					"door-archivegoin-record",
					datajson,
					"storeroom/excel/arcInoutExcel?"
				);
			});
		});
		/*查询出入记录-liuyuru*/
		$("#query-archivegoin-record").on("click", function () {
			// var doordatejson= mymore.doordate("#doordate");
			var data = {
				fileName: $("#filename").val(),
				isBox: $("#isBox").val(),
				fkStoreId: $("#door-room").val(),
				fkEntranceGuardNum: $("#door-equi").val(),
				starttime: $("#date_picker1").val(),
				endtime: $("#date_picker2").val(),
			};
			// mytableinit(data);
			var keywords = $("#filename").val();
			var pattern = /[`^&% { } | ?]/im;
			if (!keywords || (keywords && !pattern.test(keywords))) {
				mytableinit(data);
			} else {
				layer.msg("查询条件不能包含特殊字符");
			}
		});
	})(mytable)
);
/*表格初始化、出入记录的查询-liuyuru*/
function mytableinit(data) {
	mytable
		.init({
			id: "archivegoin-record",
			url: "storeroom/arcInout/getArcInouts",
			pageCode: "door-archivegoin-record",
			data,
		})
		.then(function (table) {});
}
