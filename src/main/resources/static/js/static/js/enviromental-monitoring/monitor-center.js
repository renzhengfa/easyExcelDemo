var form;
$(function() {
	layui.use(["form", "element", "layer"], function() {
		var element = layui.element;
		var layer = layui.layer;
		form = layui.form;
		getMenuBar(); //自定义面包屑，引用public-menu.js
		mymore.selectroom("#door-room"); //库房下拉框
		var storeIdvalue = $("#door-room").val();
		querymonitor(storeIdvalue);
		form.on('select(door-room)', function(data) {
			querymonitor(data.value);
		});
		form.on('select(bitstream)', function(data) {
			var iframe = $(data.elem.parentElement).parents(".layui-card-header").next().children("iframe");

			function getUrlParam(name) {
				var src = iframe.attr("src")
				var paths = src.substring(src.indexOf("?") + 1).split("&");
				for (var i = 0; i < paths.length; i++) {
					var path = paths[i].split("=");
					if (path[0] == name) {
						return path[1];
					}
				}
			}
			iframe.attr("src", "form/monitor.html?ip=" + getUrlParam("ip") + "&username=" + getUrlParam("username") +
				"&password=" + getUrlParam("password") + "&option=" + data.value)
			console.log(data.value)
		});
	})
	// 生成按钮绑定事件
	$('.body-table').on("click", "#downloadBtn", videoDownload)
}());

function querymonitor(storeIdvalue) {
	var storeIdjson = {
		storeId: storeIdvalue
	};
	//查询监控器
	app.get('environmentmodule/equTbEquipment/getEquInfoOfSXT', storeIdjson, function(msg) {
		var str = '';
		$(".body-table").html(str);
		if (msg.state) {
			for (var i = 0; i < msg.rows.length; i++) {
				var iframejson = {};
				for (var j = 0; j < msg.rows[i].settingList.length; j++) {
					if (msg.rows[i].settingList[j].parKey == "ip") {
						iframejson.ip = msg.rows[i].settingList[j].parValue;
					} else if (msg.rows[i].settingList[j].parKey == "user") {
						iframejson.username = msg.rows[i].settingList[j].parValue;
					} else if (msg.rows[i].settingList[j].parKey == "password") {
						iframejson.password = msg.rows[i].settingList[j].parValue;
					} else if (msg.rows[i].settingList[j].parKey == "vcrIP") {
						iframejson.vcrIP = msg.rows[i].settingList[j].parValue;
					} else if (msg.rows[i].settingList[j].parKey == "translate") {
						iframejson.translate = msg.rows[i].settingList[j].parValue;
					}
					// $("#"+msg.rows[i].equNum+"").attr(msg.rows[i].settingList[j].parKey,msg.rows[i].settingList[j].parValue);
				}

				str =
					"<div class='layui-card layui-col-md4' style='border:1px solid #ccc;padding-bottom: 4px;box-sizing: border-box;height: 300px'>" +
					"<div class='layui-card-header'><div class='layui-layout-left' style='left:10px'><a href='javascript:;' class='line'></a>" +
					msg.rows[i].equName + "</div>" +
					"<div class='layui-layout-right layui-form'><div class='layui-inline' style='width: 60px;margin-top: -7px; margin-right: 5px;'><div class='layui-input-inline'>" +
					"<a class='layui-btn modaljump' style='min-width: 50px;' href='html/environmental-monitoring/form/layer-playback.html?ip=" +
					iframejson.ip + "&vcrIP=" + iframejson.vcrIP + "&translate=" + iframejson.translate + "&username=" + iframejson.username +
					"&password=" + iframejson.password +
					"&option=1' data-title='回放'  action='close-layer' data-type='2' width='700px' height='680px' data-btn='关闭'>回放</a>" +
					"</div></div>" +
					" <div class='layui-inline' style='width: 100px;margin-top: -7px; margin-right: 5px;'><div class='layui-input-inline'>" +
					"<select name='bitstream' class='bitstream' lay-filter='bitstream'><option value='1'>主码流</option><option value='2'>子码流</option></select>" +
					"</div></div></div></div>" +
					"<div class='layui-card-body' id=" + msg.rows[i].equNum + " style='padding: 0'>" +
					"<iframe scrolling='no' src='camera.html?ip=" + iframejson.ip + "&username=" + iframejson.username +
					"&password=" + iframejson.password + "&option=1&type=live'></iframe></div>" +
					"<button class='layui-btn layui-btn-normal' id='downloadBtn'>下载监控插件</button>" +
					"</div>";
				// zifuchuanpinjiezhenshiyougouexindea
				$(".body-table").append(str);
			}
			form.render();
			// $(".body-table").html(str);
		}
		console.log(msg);
	});
}
// 点击下载

// 提前准备好标签
function videoDownload() {
	var a = document.getElementById('videoPlug')
	var href = window.imgurl + 'filemodule/file/downloadVideoRar'
	//var href = 'http://192.168.2.60:8083/filemodule/file/downloadVideoRar'
	a.setAttribute("href", href)
	a.setAttribute("download", '视频插件')

	//a.setAttribute('target', '_blank');
	a.click()
	console.log('元素被点击了')
}

// 创建一个下载链接
function createDownLoad() {

	var a = document.createElement('a');
	var href = window.imgurl + 'filemodule/file/downloadVideoRar'
	a.setAttribute('href', href);
	a.setAttribute("download", '视频插件')
	a.setAttribute('id', 'videoDownLoad');
	// 防止反复添加
	if (document.getElementById('videoDownLoad')) {
		document.body.removeChild(document.getElementById('videoDownLoad'));
	}
	document.body.appendChild(a);
	a.click();
}
