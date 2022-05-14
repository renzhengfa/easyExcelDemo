var form, upload, isupdate, uploadimg, fieldjson;
$(
	(function (myecharts) {
		layui.use(["layer", "form", "upload"], function () {
			var layer = layui.layer;
			form = layui.form;
			upload = layui.upload;
			/*弹出层loading开启-liuyuru*/
			//    var load = layer.load(1, {
			// shade: [0.1,'#fff'] //0.1透明度的白色背景
			// });
			getMenuBar(); //自定义面包屑，引用public-menu.js
			roomRefresh();
		});
	})(myecharts)
);
/*取消事件-liuyuru*/
function formclose() {
	layer.closeAll();
	return false;
}
function firstRefresh() {
	roomRefresh();
}
function testRefresh() {
	roomRefresh();
}
/*局部区刷新-liuyuru*/
function partialRefresh(data) {
	var roomid = data.fkStoreId;
	areaRefresh(roomid);
}
/*库房刷新-liuyuru*/
function roomRefresh() {
	app.get("storeroommodule/StoTbStore/selectIsNotDelete", "", function (
		data
	) {
		$("#room").html("");
		if (data.state) {
			if (data.rows != null) {
				var arearoom = data.rows[0].id;
				for (var i = 0; i < data.rows.length; i++) {
					$("#room").append(
						"<li class='layui-nav-item' id='" +
							data.rows[i].id +
							"'><div class='layui-card depart'>" +
							"<div class='layui-card-header layui-row'><div class='layui-layout-left'>" +
							data.rows[i].storeName +
							"</div><div class='layui-layout-right cursorclick'>" +
							"<a class='modaljump' href='html/storehouse/form/layer-room-management.html?id=" +
							data.rows[i].id +
							"' action='storeroommodule/StoTbStore/updateStore'" +
							"data-title='编辑' data-ico='static/images/modify.png' data-type='2' width='465px' height='500px' data-btn='保存,取消'>编辑</a><a>|</a>" +
							"<a class='modaljump' href='html/storehouse/form/layer-roomarea.html' action='storeroommodule/stoTbRegion/add'" +
							"data-title='添加' data-ico='static/images/add.png' data-type='2' width='885px' height='680px' data-btn='保存,取消' isPartialRefresh='true' title='" +
							data.rows[i].storeName +
							"' id='" +
							data.rows[i].id +
							"'>添加区</a>" +
							"<a>|</a><a class='confirm deletedjump' action='storeroommodule/StoTbStore/deleteStore?id=" +
							data.rows[i].id +
							"'>删除</a></div></div></div></li>"
					);
					// "<div class='layui-card-body room-card-body' id='room" + data.rows[i].id + "'><div class='layui-layout-left roomhum' id='room-pie" + data.rows[i].id + "'></div>" +
					// "<div class='layui-layout-right roomhum' id='roomhum" + data.rows[i].id + "'></div></div></div></li>");
					if (i == 0) {
						$(".layui-nav-item").addClass("layui-this");
					}

					// var wd=data.rows[i].wd;
					// var sd=data.rows[i].sd;
					// if(wd == null || wd == ""){
					//     wd=0;
					// }
					// if(sd == null || sd == ""){
					//     sd=0;
					// }
					// $("#room-pie" + data.rows[i].id + "").append("<div style='margin-top: 15px;'><span>"+wd+"</span></div>" +
					// "<div><span>温度</span></div>");
					// $("#roomhum" + data.rows[i].id + "").append("<div style='margin-top: 15px;'><span>"+sd+"</span></div>" +
					//     "<div><span>湿度</span></div>");
				}
				$("#room").append(
					"<li><div class='layui-card depart'>" +
						"<div class='layui-card-header'>添加库房</div>" +
						"<div class='layui-card-body'><a class='modaljump' href='html/storehouse/form/layer-room-management.html' action='storeroommodule/StoTbStore/add'" +
						"data-title='添加' data-ico='static/images/add.png' data-type='2' width='465px' height='500px' data-btn='保存,取消'><i class='layui-icon' id='room-add'>&#xe654;</i></a></div></div></li>"
				);
				// roomwsd();
				areaRefresh(arearoom);
				$(".layui-nav-item").on("click", function (event) {
					$(".layui-nav-item").removeClass("layui-this");
					$(this).addClass("layui-this");
					var load = layer.load(1, {
						shade: [0.1, "#fff"], //0.1透明度的白色背景
					});
					areaRefresh(event.currentTarget.id);
					/*阻止事件冒泡-liuyuru*/
					// event.stopPropagation();
				});
			} else {
				$("#room").append(
					"<li><div class='layui-card depart'>" +
						"<div class='layui-card-header'>添加库房</div>" +
						"<div class='layui-card-body'><a class='modaljump' href='html/storehouse/form/layer-room-management.html' action='storeroommodule/StoTbStore/add'" +
						"data-title='添加' data-ico='static/images/add.png' data-type='2' width='465px' height='500px' data-btn='保存,取消'><i class='layui-icon' id='room-add'>&#xe654;</i></a></div></div></li>"
				);
			}
		} else {
			layer.msg(data.msg);
		}
	});
}
//function roomecharts() {
//  app.get("countmodule/storeAndRegionCount/selectStoreCountFile", "", function (data) {
//      if (data.state == true) {
//          var mylables = new Array("现存档案盒", "现存档案", "在架档案盒", "在架档案", "借出档案盒", "借出档案");
//          for (var i = 0; i < data.rows.length; i++) {
//              var list = data.rows[i].list;
//              var dataArr = [];
//              for (var j = 0; j < list.length; j++) {
//                  var json = {};
//                  json.name = list[j].typeName;
//                  json.value = list[j].count;
//                  dataArr[j] = json;
//              }
//              var dataseries = [
//                  {
//                      name: '档案',
//                      type: 'pie',
//                      radius: '85%',
//                      center: ['50%', '50%'],
//                      color: ['#96e4ff', '#71d1f1', '#59c2e6', '#44b2d7', '#369dc0', '#0a799f'],
//                      data: dataArr,
//                      label: {
//                          normal: {
//                              position: 'inner',
//                          }
//                      },
//                  }
//              ];
//              myecharts.pie("room-pie" + data.rows[i].id + "", data.rows[i].storeName, mylables, dataseries);
//          }
//      }
//  });
//}
function modalhumiture(quIp, quNum, id) {
	return new Promise(function (resolve) {
		app.post(`denseShelves/getHumitureByGdlIp?ip=${quIp}`, {}, (res) => {
			if (res.state) {
				let data = {
					PM: "0",
					humidity: "0",
					temperature: "0",
					id: id,
				};
				if (res.state) {
					let datas = JSON.parse(res.row);
					data.PM = datas.data.PM25 || 0;
					data.humidity = datas.data.humidity || 0;
					data.temperature = datas.data.temperature || 0;
				}
				resolve(data);
			} else {
				// layer.msg(`${regionName}连接失败！`);
			}
		});
	});
}
// function roomwsd() {
//     app.get("doorguardmodule/doorEquAirDataReal/getStoreAirDataAll", "", function (data) {
//         if (data.state) {
//             for (var i = 0; i < data.rows.length; i++) {
//                 $("#roomhum" + data.rows[i].fkStoreId + "").html("<div style='margin-top: 30px;'><span>" + data.rows[i].wd + "</span></div>" +
//                 "<div><span>温度</span></div>" +
//                 "<div style='margin-top: 20px;'><span>" + data.rows[i].sd + "</span></div>" +
//                 "<div><span>湿度</span></div>")
//             }
//         }
//     });
// }
function areacecharts(roomid) {
	app.get(
		"countmodule/storeAndRegionCount/selectRegionCountFile",
		{ storeId: roomid },
		function (data) {
			if (data.state) {
				var mylables = new Array(
					"现存档案盒",
					"现存档案",
					"在架档案盒",
					"在架档案",
					"借出档案盒",
					"借出档案"
				);
				for (var i = 0; i < data.rows.length; i++) {
					var list = data.rows[i].list;
					var dataArr = [0, 0, 0, 0, 0, 0, 0];
					for (var j = 0; j < list.length; j++) {
						var json = {};
						json.name = list[j].typeName;
						json.value = list[j].count;
						if (list[j].typeName == "现存档案盒") {
							dataArr[0] = json;
						} else if (list[j].typeName == "现存档案") {
							dataArr[1] = json;
						} else if (list[j].typeName == "在架档案盒") {
							dataArr[2] = json;
						} else if (list[j].typeName == "在架档案") {
							dataArr[3] = json;
						} else if (list[j].typeName == "借出档案盒") {
							dataArr[4] = json;
						} else if (list[j].typeName == "借出档案") {
							dataArr[5] = json;
						}
					}
					var dataseries = [
						{
							name: "档案信息",
							type: "bar",
							barWidth: "10%",
							label: {
								normal: {
									position: "top",
									show: true,
								},
							},
							//配置样式
							itemStyle: {
								normal: {
									color: function (params) {
										var colorList = [
											"#3a97ff",
											"#ffa200",
											"#3a97ff",
											"#ffa200",
											"#3a97ff",
											"#ffa200",
										];
										return colorList[params.dataIndex];
									},
									barBorderRadius: 30,
								},
							},
							data: dataArr,
						},
					];
					myecharts.bar(
						"room-bar" + data.rows[i].id + "",
						"",
						mylables,
						dataseries
					);
				}
			}
		}
	);
}
//区的温湿度定时器
function areawsdTime(quIp, quNum, id) {
	// setInterval(function () {
	var qu_temp = 0,
		qu_hum = 0;
	modalhumiture(quIp, quNum, id).then((result) => {
		var humiture_data = result;
		qu_temp = humiture_data.temperature;
		qu_hum = humiture_data.humidity;

		if (qu_temp == undefined || qu_temp == null || qu_temp == "") {
			qu_temp = 0;
		}
		if (qu_hum == undefined || qu_hum == null || qu_hum == "") {
			qu_hum = 0;
		}
		let optionRefresh = { series: [{}, {}] };
		if (humiture_data.id) {
			var pieguaid = document.getElementById(humiture_data.id);
			if (pieguaid) {
				var myChart = echarts.init(pieguaid);
				optionRefresh.series[0].data = [
					{
						value: qu_temp,
						name: qu_temp.toString(),
						itemStyle: { color: "#ffabe0" },
					},
					{
						value: 100,
						name: "温度",
						itemStyle: { color: "#ebebeb" },
					},
				];
				optionRefresh.series[1].data = [
					{
						value: qu_hum,
						name: qu_hum.toString(),
						itemStyle: { color: "#61f6ff" },
					},
					{
						value: 100,
						name: "湿度",
						itemStyle: { color: "#ebebeb" },
					},
				];
				myChart.setOption(optionRefresh);
			}
		}
	});
	// }, 1000);
}
/*区刷新-liuyuru*/
function areaRefresh(roomid) {
	let fkId = roomid;
	app.get(
		"storeroommodule/stoTbRegion/selectByBind",
		{ fkStoreId: roomid },
		function (data) {
			layer.closeAll("loading");
			if (data.state) {
				$(".body-post").html("");
				var bindId, bindURL;
				for (var i = 0; i < data.rows.length; i++) {
					var quIp =
						// data.rows[i].reqestIp + ":" + data.rows[i].httpPort;
						data.rows[i].reqestIp;
					var quNum = data.rows[i].regionNum;
					var qu_temp = 0,
						qu_hum = 0;
					areawsdTime(quIp, quNum, "area-pie" + data.rows[i].id + "");

					var bindstr = "";
					if (data.rows[i].bindId == 0) {
						bindId = "绑定区";
						bindURL = "bind";
					} else {
						bindId = "解绑区";
						bindURL = "noBind";
						bindstr =
							" (绑定区:<span id=" +
							data.rows[i].bindId +
							">" +
							data.rows[i].bindName +
							"</span>)";
					}
					// <a>|</a><a class='area-control' id='" + data.rows[i].id + "'>远程控制</a>
					$(".body-post").append(
						"<li><div class='layui-card depart'>" +
							"<div class='layui-card-header layui-row'><div class='layui-layout-left'>" +
							data.rows[i].regionName +
							"" +
							bindstr +
							"</div><div class='layui-layout-right cursorclick'>" +
							// "<a class='modaljump' href='html/storehouse/form/layer-room-qrcode.html?id=" +
							// data.rows[i].id +
							// " ' action='close-layer' width='885px' height='680px' data-btn='关闭'>二维码</a><a>|</a>
							"<a class='modaljump' href='html/storehouse/form/layer-roomarea.html?id=" +
							data.rows[i].id +
							"&roomid=" +
							roomid +
							"' action='storeroommodule/stoTbRegion/update'" +
							"data-title='编辑' data-ico='static/images/modify.png' data-type='2' width='885px' height='680px' data-btn='保存,取消' isPartialRefresh='true'>编辑区</a>" +
							// "<a>|</a>" +
							// <a class='modaljump'  href='html/storehouse/form/layer-room-bindqu.html?id=" +
							// data.rows[i].id +
							// "' action='storeroommodule/stoTbRegion/" +
							// bindURL +
							// "' width='350px' height='260px'>" +
							// bindId +
							// "</a>" +
							"<a>|</a><a class='modaljump'  href='html/storehouse/form/layer-room-bindcamera.html?regionId=" +
							data.rows[i].id +
							"' action='storeroommodule/stoFkRegionEqu/bindQsxt' width='350px' height='300px'>绑定摄像头</a>" +
							"<a>|</a><a class='modaljump'  href='html/storehouse/form/layer-room-bindmonitor.html?id=" +
							data.rows[i].id +
							"' action='storeroommodule/stoTbRegion/updateLED' width='350px' height='260px'>绑定显示器</a>" +
							"<a>|</a>" +
							"<a class='modaljump'  href='html/storehouse/form/layer-room-opencase.html?id=" +
							roomid +
							"&quNum=" +
							quNum +
							"' action='close-layer' width='780px' height='740px' data-btn='关闭'>开架记录</a>" +
							"<a>|</a>" +
							"<a class='confirm deletedjump' action='storeroommodule/stoTbRegion/delete?id=" +
							data.rows[i].id +
							"'>删除</a>"+
                            "<a>|</a>" +
							"<a class='confirm initjump' action='shelf/location/initialization?regionId=" +
							data.rows[i].id +
							"'>初始化层架标签</a></div></div>" +
							"<div class='layui-card-body layui-row' id='room" +
							data.rows[i].id +
							"'><div class='room-bar layui-col-md8' id='room-bar" +
							data.rows[i].id +
							"'></div>" +
							"<div class='room-bar layui-col-md4' id='area-pie" +
							data.rows[i].id +
							"'></div></div></div></li>"
					);
					var dataseries = [
						{
							name: "档案信息",
							type: "bar",
							barWidth: "10%",
							label: {
								normal: {
									position: "top",
									show: true,
								},
							},
							//配置样式
							itemStyle: {
								normal: {
									color: function (params) {
										var colorList = [
											"#3a97ff",
											"#ffa200",
											"#3a97ff",
											"#ffa200",
											"#3a97ff",
											"#ffa200",
										];
										return colorList[params.dataIndex];
									},
									barBorderRadius: 30,
								},
							},
							data: [0, 0, 0, 0, 0, 0],
						},
					];
					var mylables = new Array(
						"现存档案盒",
						"现存档案",
						"在架档案盒",
						"在架档案",
						"借出档案盒",
						"借出档案"
					);
					myecharts.bar(
						"room-bar" + data.rows[i].id + "",
						data.rows[i].regionName,
						mylables,
						dataseries
					);
					var dataseries = [
						{
							name: "温度",
							type: "pie",
							radius: ["45%", "50%"],
							center: ["25%", "50%"],
							hoverAnimation: false,
							legendHoverLink: false,
							label: {
								normal: {
									fontSize: "30",
									color: "#b2b2b2",
									position: "center",
								},
							},
							labelLine: {
								normal: {
									show: false,
								},
							},
							emphasis: {
								show: false,
							},
							data: [
								{
									value: qu_temp,
									name: qu_temp.toString(),
									itemStyle: { color: "#ffabe0" },
								},
								{
									value: 100,
									name: "温度",
									itemStyle: { color: "#ebebeb" },
								},
							],
						},
						{
							name: "湿度",
							type: "pie",
							radius: ["45%", "50%"],
							center: ["75%", "50%"],
							hoverAnimation: false,
							legendHoverLink: false,
							label: {
								normal: {
									fontSize: "30",
									color: "#b2b2b2",
									position: "center",
								},
							},
							labelLine: {
								normal: {
									show: false,
								},
							},
							emphasis: {
								show: false,
							},
							data: [
								{
									value: qu_hum,
									name: qu_hum.toString(),
									itemStyle: { color: "#61f6ff" },
								},
								{
									value: 100,
									name: "湿度",
									itemStyle: { color: "#ebebeb" },
								},
							],
						},
					];
					myecharts.piegua(
						"area-pie" + data.rows[i].id + "",
						data.rows[i].regionName,
						mylables,
						dataseries
					);
				}
				areacecharts(roomid);
				/*区控制-liuyuru*/
				$(".area-control").on("click", function (e) {
					alert(4);
				});
			} else {
				layer.msg(data.msg);
			}
		}
	);
}

// var layerenter={
//     btn:['确认','取消'],
//     shade: [0.01, '#fff'],
//     success:function(){
//         enterclick();
//     },
//     end:function(){
//         $(document).off('keydown',this.enterEsc); //解除键盘关闭事件
//     }
// };

// function enterclick(){
//     this.enterEsc = function (event) {
//         if (event.keyCode === 13) {
//             $(".layui-layer-btn0").click();
//             return false; //阻止系统默认回车事件
//         }
//     };
//     $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
// }
