$(
	(function (mytable) {
		var layer, form;
		layui.use(["layer", "form"], function () {
			layer = layui.layer;
			form = layui.form;
			getMenuBar(); //自定义面包屑，引用public-menu.js
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
				// var doordatejson= mymore.doordate("#doordate");
				var datajson = {
					// "map[fkStoreId]": $("#door-room").val(),
					"map[fkEntranceGuardNum]": $("#door-equi").val(),
					"map[starttime]": $("#date_picker1").val(),
					"map[endtime]": $("#date_picker2").val(),
				};
				mymore.export(
					data.value,
					"出入记录",
					"access_control",
					datajson,
					"storeroom/excel/entranceGuardInoutExcel?"
				);
			});
			var data = "";
			mytableinit(data);
		});
		/*表格初始化、出入记录的查询-liuyuru*/
		function mytableinit(data) {
			mytable
				.init({
					id: "goin-record",
					url: "storeroom/entranceGuardAlarm/getEntranceGuardInouts",
					pageCode: "access_control",
					data: data,
				})
				.then(function (table) {});
		}
		/*查询出入记录-liuyuru*/
		$("#query-goin-record").on("click", function () {
			// var doordatejson= mymore.doordate("#doordate");
			var data = {
				// fkStoreId: $("#door-room").val(),
				fkEntranceGuardNum: $("#door-equi").val(),
				starttime: $("#date_picker1").val(),
				endtime: $("#date_picker2").val(),
			};
			mytableinit(data);
		});
	})(mytable)
);
