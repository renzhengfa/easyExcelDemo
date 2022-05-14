/**
 * mymore.selectroom库房下拉框的查询,roomid库房绑定id
 * mymore.selectequipment库房下的设备下拉框
 * mymore.selectequipmentAll所有设备下拉框
 * mymore.export导出当前页和导出全部
 * mymore.doordate日期分割转换
 * liuyuru
 */
var chcheEqu = [];
var equLocation = [];
(function(app, $, mymore) {
	mymore.selectroom = function(roomid, equid, url, urlequi) {
		layui.use('form', function() {
			var form = layui.form;
			if (!url) {
				url = 'storeroommodule/StoTbStore/selectIsNotDelete';
			}
			app.getAsync(url, "", function(msg) {
				if (msg.state && msg.rows != null) {
					var str = '';
					for (var i = 0; i < msg.rows.length; i++) {
						str += '<option value=' + msg.rows[i].id + ' imgAddress=' + msg.rows[i].imgAddress + '>' + msg.rows[i].storeName +
							'</option>';
					}
					$(roomid).append(str);
					if (!equid && urlequi && msg.rows.length > 0) {
						mymore.selectequipment(msg.rows[0].id, "", urlequi, msg.rows[0].storeName);
						alarminfo(msg.rows[0].id);
					}
					if (msg.rows.length > 0) {
						$("#content").css("background", "url(" + imgurl + "" + msg.rows[0].imgAddress + ")no-repeat");
						$("#content").css("background-size", "100% 100%");
					}
					form.render();
				}
			});
			if (equid) {
				form.on('select(door-room)', function(data) {
					mymore.selectequipment(data.value, equid);
				});
			}
		});
	}
	// 搁这 俄罗斯套娃呢？ 采集器 左上角拖动在这里渲染
	mymore.selectequipment = function(data, equid, urlequi, storeName) {
		layui.use('form', function() {
			var form = layui.form;
			if (!urlequi) {
				urlequi = 'storeroom/entranceGuard/getEntranceGuard?fkStoreId=' + data;
			} else {
				urlequi = urlequi + '?pageSize=50&&map[fkStoreId]=' + data;
			}
			//获取数据库中该库房设备的位置信息;
			var uri = 'environmentmodule/equTbEquLocation/getLocationByStoreId';
			app.get(uri, {
				"storeid": data
			}, function(msg) {
				console.log(msg)
				if (msg.state) {
					chcheEqu = [];
					equLocation = [];
					for (var i = 0; i < msg.rows.length; i++) {
						equLocation.push({
							"id": msg.rows[i].fkEquId,
							"leftindex": msg.rows[i].leftIndex,
							"topindex": msg.rows[i].topIndex
						})
					}
				}
			});
			app.get(urlequi, "", function(msg) {
				
				console.log(msg,'渲染','urlqui')
				console.log('pul')
				if (equid) {
					$(equid).empty();
					$(equid).append('<option value="" selected>全部</option>');
					if (msg.state) {
						var str = '';
						for (var i = 0; i < msg.rows.length; i++) {
							str += '<option value=' + msg.rows[i].entranceGuardNum + '>' + msg.rows[i].entranceGuardName + '</option>';
						}
						$(equid).append(str);
						form.render();
					} else {
						form.render();
					}
				} else {
					var statetotal = 0,
						onnum = 0,
						offnum = 0,
						offlinenum = 0;
					$("#content").html("");
					$("#room-area").html("");
					var cjqArr = [];
					window.equiNumber = [];
					if (msg.state) {
						var str = '';
						var cjqnum = 0;
						var strarea = '';
						//
						for (var i = 0; i < msg.rows.length; i++) {
							console.log(msg.rows)
							equiNumber.push(msg.rows[i].equNum);
							msg.rows[i].state = "offline";
							if (msg.rows[i].fkTypeCode == "cjq") {
								strarea += '<option value=' + msg.rows[i].equNum + '>' + msg.rows[i].equName + '</option>';
								cjqArr[cjqnum] = msg.rows[i];
								cjqnum++;
							}
							if (msg.rows[i].fkTypeCode != "afmj") {
								var state = msg.rows[i].state;
								var imgstate = "";
								// if(state==="on" || state === "up" || state === "down"){
								//     state="运行";
								//     msg.rows[i].state="on";
								//     onnum++;
								// }else if(state==="off"){
								//     state="关闭";
								//     // offnum++;
								// }else if(state==="offline"){
								//     state="离线";
								//     offlinenum++;
								//     imgstate="-off";
								// }
								state = "离线";
								offlinenum++;
								imgstate = "-off";
								var mode = msg.rows[i].mode;
								if (mode == "hand") {
									mode = "手动模式";
								} else {
									mode = "自动模式";
								}
								statetotal++;
								// if(msg.rows[i].fkTypeCode=="cjq"){
								//     str = "<div class='public part"+msg.rows[i].equNum+" layui-rows "+imgstate+"' id='drag_box"+i+"'>"+
								//     "<div class='layui-col-md2 layui-col-xs2 layui-col-sm2 img"+msg.rows[i].equNum+"'><img src='../../static/images/environment/"+msg.rows[i].fkTypeCode+""+imgstate+".png' alt='' srcset=''></div>"+
								//     "<div class='layui-col-md7 layui-col-xs7 layui-col-sm7' style='left:3px'>"+
								//     "<dl id='data"+msg.rows[i].equNum+"'><dd class='wsd'>"+msg.rows[i].equName+"&nbsp;&nbsp;<span>0℃</span></dd><dd class='state'>当前状态：<span class='"+msg.rows[i].state+"'></span>&nbsp;&nbsp;"+state+"</dd><dd class='mode'>当前模式："+mode+"</dd></dl></div>"+
								//     "<div class='layui-col-md3 layui-col-xs3 layui-col-sm3 cmdclick' id="+msg.rows[i].id+"><div style='margin-top: 17px;'><lable  class='morecmd' id="+msg.rows[i].id+" onclick='moreclick(this)'>更多操作</lable></div></div>"+
								//     "</div>";
								// }else{
								//     str = "<div class='public part"+msg.rows[i].equNum+" layui-rows "+imgstate+"' id='drag_box"+i+"'>"+
								//     "<div class='layui-col-md2 layui-col-xs2 layui-col-sm2 img"+msg.rows[i].equNum+"'><img src='../../static/images/environment/"+msg.rows[i].fkTypeCode+""+imgstate+".png' alt='' srcset=''></div>"+
								//     "<div class='layui-col-md7 layui-col-xs7 layui-col-sm7' style='left:3px'>"+
								//     "<dl id='data"+msg.rows[i].equNum+"'><dd class='wsd'>"+msg.rows[i].equName+"</dd><dd class='state'>当前状态：<span class='"+msg.rows[i].state+"'></span>&nbsp;&nbsp;"+state+"</dd><dd class='mode'>当前模式："+mode+"</dd></dl></div>"+
								//     "<div class='layui-col-md3 layui-col-xs3 layui-col-sm3 cmdclick' id="+msg.rows[i].id+"><div style='margin-top: 17px;'><lable  class='morecmd' id="+msg.rows[i].id+" onclick='moreclick(this)'>更多操作</lable></div></div>"+
								//     "</div>";
								// }
								if (msg.rows[i].fkTypeCode == "cjq") {
									str = "<div class='public all part" + msg.rows[i].equNum + " layui-rows -off jzq" + msg.rows[i].equCenterNum +
										"' id='drag_box" + msg.rows[i].id + "'>" +
										"<div class='layui-col-md2 layui-col-xs2 layui-col-sm2 img" + msg.rows[i].equNum +
										"'><img src='../../static/images/environment/" + msg.rows[i].fkTypeCode +
										"-off.png' alt='' srcset=''></div>" +
										"<div class='layui-col-md7 layui-col-xs7 layui-col-sm7' style='left:3px'>" +
										"<dl id='data" + msg.rows[i].equNum + "'><dd class='wsd'>" + msg.rows[i].equName +
										"&nbsp;&nbsp;<span>0℃</span></dd><dd class='state'>当前状态：<span class='offline'></span>&nbsp;&nbsp;离线</dd><dd class='mode'>当前模式：" +
										mode + "</dd></dl></div>" +
										"<div class='layui-col-md3 layui-col-xs3 layui-col-sm3 cmdclick' id=" + msg.rows[i].id +
										"><div style='margin-top: 17px;'><lable  class='morecmd' id=" + msg.rows[i].id +
										" onclick='moreclick(this)'>更多操作</lable></div></div>" +
										"</div>";
								} else {
									str = "<div class='public all part" + msg.rows[i].equNum + " layui-rows -off jzq" + msg.rows[i].equCenterNum +
										"' id='drag_box" + msg.rows[i].id + "'>" +
										"<div class='layui-col-md2 layui-col-xs2 layui-col-sm2 img" + msg.rows[i].equNum +
										"'><img src='../../static/images/environment/" + msg.rows[i].fkTypeCode +
										"-off.png' alt='' srcset=''></div>" +
										"<div class='layui-col-md7 layui-col-xs7 layui-col-sm7' style='left:3px'>" +
										"<dl id='data" + msg.rows[i].equNum + "'><dd class='wsd'>" + msg.rows[i].equName +
										"</dd><dd class='state'>当前状态：<span class='offline'></span>&nbsp;&nbsp;离线</dd><dd class='mode'>当前模式：" +
										mode + "</dd></dl></div>" +
										"<div class='layui-col-md3 layui-col-xs3 layui-col-sm3 cmdclick' id=" + msg.rows[i].id +
										"><div style='margin-top: 17px;'><lable  class='morecmd' id=" + msg.rows[i].id +
										" onclick='moreclick(this)'>更多操作</lable></div></div>" +
										"</div>";
								}
								$("#content").append(str);
								Divmouse("#drag_box" + msg.rows[i].id + "");
								//将设备信息与前端ID绑定
								chcheEqu.push({
									"id": msg.rows[i].id,
									"drag": "drag_box" + msg.rows[i].id + ""
								});
								drag(msg.rows[i].id);
								// if(state!="离线"){
								queryequicmd(msg.rows[i].id, msg.rows[i].fkTypeId, msg.rows[i].equNum);
								// }
							}
						}
						$("#room-area").append(strarea);
						form.render();
						if (cjqArr.length > 0) {
							$("#line-area").attr("class", "area" + cjqArr[0].equNum + "")
							// $("#line-area").addClass("area"+cjqArr[0].equNum+"");
							// $("#line-area").html("<div class='body-md' id='linearea"+cjqArr[0].equNum+"'></div>");
						}
					} else {}
					// 设备监控
					console.log(urlequi,'你是什么IP')
					archivesratio(storeName, [onnum, statetotal - offlinenum, offlinenum], cjqArr);
				}
			})
		});
	}
	mymore.selectequipmentAll = function(equid) {
		layui.use('form', function() {
			var form = layui.form;
			app.get('storeroom/entranceGuard/getEntranceGuard', "", function(msg) {
				if (msg.state) {
					var str = '';
					for (var i = 0; i < msg.rows.length; i++) {
						str += '<option value=' + msg.rows[i].entranceGuardNum + '>' + msg.rows[i].entranceGuardName + '</option>';
					}
					$(equid).append(str);
					form.render();
				}
			})
		});
	}
	//iscurrentpage是否当前页或全部，exportname导出名称，pagecode页码，datajson导出条件，url接口
	mymore.export = function(iscurrentpage, exportname, pagecode, datajson, url) {
		var datastr = "";
		if (iscurrentpage == 0) {
			datastr = "sheetName=" + exportname + "&excelTitle=" + exportname + "&excelName=" + exportname + "&pageCode=" +
				pagecode + "&flag=" + iscurrentpage + "";
			var currentPage = $(".layui-laypage-skip .layui-input").val();
			if (currentPage) {
				datastr += "&currentPage=" + currentPage;
			}
		} else {
			datastr = "sheetName=" + exportname + "&excelTitle=" + exportname + "&excelName=" + exportname + "&pageCode=" +
				pagecode + "";
		}
		for (var key in datajson) {
			if (datajson[key] != "") {
				datastr += "&" + key + "=" + datajson[key];
			}
		}
		document.location.href = baseurl + url + datastr;
	}
	// mymore.doordate=function(doordateid){
	//     var doordate = $(doordateid).val();
	//     var starttime = "", endtime = "";
	//     var doordatejson;
	//     if (doordate != "") {
	//         var result = doordate.split("~");
	//         doordatejson={
	//             starttime : result[0].replace(/(^\s*)|(\s*$)/g, ""),
	//             endtime : result[1].replace(/(^\s*)|(\s*$)/g, "")
	//         }
	//     }else{
	//         doordatejson={
	//             starttime : "",
	//             endtime : ""
	//         }
	//     }
	//     return doordatejson;
	// }
}(app, $, window.mymore = {}));
