/**
 * 引用form表单，防止表单内容不显示
 * liuyuru
 */
var form;
layui.use('form', function () {
	form = layui.form;
});
/**
 * layerVoluation表单赋值
 * msg表单数据json
 * formname input的name值
 * formval input的value值
 * select输入框属性值，$input输入框类型
 * liuyuru
 */
function layerVoluation(msg) {
	// console.log(msg);
	$.each(msg, function (formname, formval) {
		var select = document.getElementsByName(formname)[0];
		try {
			var $input = select.localName;
			if ($input === "input") {
				$input = $("input[name=" + formname + "]").map(function () {
					return this.type
				}).get();
				if ($input[0] == "radio") {
					var rObj = document.getElementsByName(formname);
					for (var i = 0; i < rObj.length; i++) {
						if (rObj[i].value == formval) {
							rObj[i].checked = 'checked';
						}
					}
				} else if ($input == "checkbox") {
					if (formval == 1) $("input[name=" + formname + "]").attr("checked", "checked");
				} else if ($input == "text" || $input == "password" || $input == "number") {
					 if (formname == "imgAddress") {
						$('#roomupload').html("<img class='layui-upload-img' id='upload-img' src='"+imgurl+""+formval+"'>");
					}else{
						$("input[name=" + formname + "]").val(formval);
					}	
				}
			} else if ($input === "select") {
				// for (var i = 0; i < select.options.length; i++) {
				// 	if (select.options[i].innerHTML == formval) {
				// 		select.options[i].selected = true;
				// 		break;
				// 	}
				// }
				$("#" + formname + "").find("option:contains('" + formval + "')").attr("selected", true);
				// $("#" + formname + "").val(formval);
			} else if ($input === "textarea") { // 多行文本框  
				$("textarea[name=" + formname + "]").html(formval);
			}
			form.render();
		} catch(e){
			return true;
		}

	});
	//以上做通用封装
	//用户自己编写的代码，要求可以取到数据值
}

/**
 * 将form表单序列化为json
 * @return {{}}
 * liuyuru
 */
$.fn.serializeJson = function () {
	var serializeObj = {};
	var array = this.serializeArray();
	$.each(array, function () {
		if (serializeObj[this.name] !== undefined) {
			if (!serializeObj[this.name].push) {
				serializeObj[this.name] = [serializeObj[this.name]];
			}
			serializeObj[this.name].push(this.value || '');
		} else {
			serializeObj[this.name] = this.value || '';
		}
	});
	return serializeObj;
};
/**
 * 获取url？后面的参数 json格式
 * @return {{}}
 * liuyuru
 */
function getRequest(url) {
	url = "?" + url.split("?")[1];
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}