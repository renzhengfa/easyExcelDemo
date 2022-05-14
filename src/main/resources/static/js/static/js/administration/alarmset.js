$(
	(function () {
		layui.use(["layer", "form"], function () {
			var layer = layui.layer;
			form = layui.form;
			getMenuBar();
			formvalidate();
			getPortsList();
			//监听提交
			var lock = false;
			form.on("submit(formDemo)", function (data) {
				if (formvalidate().form()) {
					var fieldjson = data.field;
					var fromjson = {
						name: fieldjson.name,
                        phone: fieldjson.phone,
                        port: $("#port").find("option:selected").val()
					};
					if (!lock) {
						lock = true; //锁定
						app.post(
							"equipmentmodule/equAramPhone/uploadPhone",
							fromjson,
							function (data) {
								if (data.state) {
									ztreeRefresh();
								}
								layer.msg(data.msg);
							}
						);
					}
					return false;
				} else {
				}
			});
			ztreeRefresh();
		});
	})()
);
// 电话号码验证
//   $.validator.addMethod("ackphone", function (value, element, params) {
//     var pattern=/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
//     var res = pattern.test(value);
//     if (res) {
//         return true
//     }
// }, "请输入正确的手机号格式");
// 表单校验
function formvalidate() {
	return $("#menuform-reset").validate({
		rules: {
			name: {
				required: true,
			},
			phone: {
				required: true,
				// number: true,
				// ackphone: "",
			},
			port: {
				required: true,
			},
		},
		messages: {
			name: {
				required: "请输入联系人名称",
			},
			phone: {
				required: "电话不能为空",
				// number: "请输入有效的数字"
			},
			port: {
				required: "请选择串口号",
			},
		},
	});
}
function ztreeRefresh() {
	/*查询报警联系人-liuyuru*/
	app.get("equipmentmodule/equAramPhone/getAramPhone", "", function (msg) {
		if (msg.state) {
			var data = msg.row;
			$("#name").val(data.name);
			$("#phone").val(data.phone);
		} else {
			layer.msg(msg.msg);
		}
	});
}

/**查询串口 */
function getPortsList() {
	var str = "";
	app.post("SeriaPortManager/getPortsList", {}, function (msg) {
		if (msg.code == 200) {
			for (var i = 0; i < msg.data.length; i++) {
			    str += '<option value="' + msg.data[i] + '">' + msg.data[i] + "</option>";
			}
			$("#port").html(str);
			form.render();
		} else {
			console.log(msg);
		}
	});
}
