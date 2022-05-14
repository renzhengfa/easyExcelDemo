/**
 *
 * @author yuqi
 */
//获取URL后边？及之后的信息
var info, fileInfo = [],
	textareaId = 0;
var regionNum = "";
// var wsValue = webinit(window.wsUri)
// 离开页面关闭服务
window.onbeforeunload = function () {
	app.bindingget("rfid/end", {}, function (msg) {
		if ((msg.code = 200)) {
			console.log("关闭");
		} else {
			console.log(msg.msg);
		}
	});
};
layui.use(['table', 'layer', 'form', 'upload'], function() {
    // 进入页面开启读取RFID服务
    app.bindingget("rfid/start", {}, function (msg) {
        if ((msg.code = 200)) {
            console.log("开始读取");
        } else {
            console.log(msg.msg);
        }
    });
	// $('.title2').text('新增档案盒').css("cursor","pointer")
	// $('.title2').on("click",function(){
	//     window.location.href = "add-archiveBox.html";
	// });
	// $('#show_archive_info').css('display','none');
	var table = layui.table,
		form = layui.form,
		upload = layui.upload;

	$('.title2').text('新增档案盒');
	$(".addArchiveCancel").on("click", function() {
		window.location.href = "../../archive/archiveBox/archivesBox-admin.html";
	});
	// 获取库房名称、区、列、节、层......
	app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function(msg) {
		if (msg.state) {
			var str1 = '<option value=""></option>';
			var str = "";
			for (var i = 0; i < msg.rows.length; i++) {
				str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + '</option>';
			}
			$("#store_Room1").html(str1 + str);
			form.on("select(storeroom1)", function(data) {
				app.get("storeroommodule/stoTbRegion/selectByBind", {
					fkStoreId: data.value
				}, function(msg) {
					if (msg.state) {
						var str1 = '<option value=""></option>';
						var str = "";
						var str2 = "";
						var str3 = "";
						var str4 = "";
						for (var i = 0; i < msg.rows.length; i++) {
							str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
						}
						$("#area1").html(str1 + str);
						form.render('select');
						form.on("select(areaName1)", function(data) {
							str2 = "", str3 = "", str4 = "";
							app.get("storeroommodule/stoTbRegion/selectByRegionId", {
								id: data.value
							}, function(msg) {
								if (msg.state) {
									// console.log(msg.row.cols);
									$("#regionNum").val(msg.row.regionNum);
									if (msg.row.gdlType == '左边') {
										for (var i = 0; i < msg.row.cols; i++) {
											str2 += '<option value="' + i + '">' + i + '</option>';
										}
									} else {
										for (var i = 1; i <= msg.row.cols; i++) {
											str2 += '<option value="' + i + '">' + i + '</option>';
										}
									}
									for (var i = 1; i <= msg.row.divs; i++) {
										str3 += '<option value="' + i + '">' + i + '</option>';
									}
									for (var i = 1; i <= msg.row.lays; i++) {
										str4 += '<option value="' + i + '">' + i + '</option>';
									}
									$("#cols1").html(str1 + str2);
									$("#divs1").html(str1 + str3);
									$("#lays1").html(str1 + str4);
									form.render('select');
								}
							});
						});
					}
				});
			});
			form.render('select');
		}
	});
	form.render();
	//来源select初始渲染
	app.get('authmodule/sysTbDictCode/selectSysTbDictCodeByfkType', {
		"type": "arc_source"
	}, function(res) {
		var data = res.rows,
			origin = $('#arc_source'),
			opt;
		for (var key in data) {
			// if (info && data[key].id == info.fkSourceId) {
			//     opt = '<option selected="" value="' + data[key].id + '">' + data[key].svalue + '</option>';
			// } else {
			opt = '<option value="' + data[key].id + '">' + data[key].svalue + '</option>';
			// }
			origin.append(opt);
		}
		form.render('select');
	});
	//密级select初始渲染
	app.get('authmodule/sysTbDictCode/selectSysTbDictCodeByfkType', {
		"type": "ofthem "
	}, function(res) {
		var data = res.rows,
			origin = $('select[name="fkSecretId"]'),
			opt;
		for (var key in data) {
			// if (info && data[key].id == info.fkSecretId) {
			//     opt = '<option selected="" value="' + data[key].id + '">' + data[key].svalue + '</option>';
			// } else {
			opt = '<option value="' + data[key].id + '">' + data[key].svalue + '</option>';
			// }
			origin.append(opt);
		}
		form.render('select');
	});
	//档案类别输入框获取焦点
	$('input[name="fkTypeName"]').on('click', function() {
		myztree.setfiletype('archivesmodule/arcTbArcType/selectAll', '', function(res) {
			if (res.state) {
				var value = res.rows;
				var treeNodes = [];
				for (var key in value) {
					treeNodes[key] = {};
					treeNodes[key]['id'] = value[key].id;
					treeNodes[key]['name'] = value[key].typeName;
					treeNodes[key]['pId'] = value[key].fkParentId;
				}
				$(document).ready(function() {
					$.fn.zTree.init($("#treeDemo"), setting, treeNodes);
				});
			} else {
				layer.msg(res.msg);
			}
		});
		//档案类别选择时的弹出层
		layer.open({
			type: 1,
			content: $('#file_type_tree'),
			area: ['319px', '440px'],
			offset: 'auto',
			title: '<div class="bind-menu-title">档案类型</div>',
			resize: false,
			btnAlign: 'c', //按钮居中
			shade: [0.01, '#fff'], //不显示遮罩
			btn: ['确认', '取消'],
			cancel: function() {
				$('#file_type_tree').hide();
			},
			yes: function() {
				var zTree = $.fn.zTree.getZTreeObj("treeDemo");
				//获取被选择的节点
				var typeValue, sNodes = zTree.getSelectedNodes();
				//不是父节点的时候
				// if (!sNodes[0].isParent) {
				if (sNodes.length > 0) {
					typeValue = sNodes[0].name;
				} else {
					layer.msg("请选择档案类别！");
					return false;
				}
				//保存时需要传id和名字
				var typeInfo = $('input[name="fkTypeName"]');
				typeInfo.val(typeValue);
				typeInfo.attr('id', sNodes[0].id);
				typeInfo.removeClass('error');
				typeInfo.next().hide();
				textareaId = 0;
				layer.closeAll();
				$('#file_type_tree').hide();
			},
			btn1: function() {
				$('#file_type_tree').hide();
				layer.closeAll();
			}
		});
	});
	distinguish();
	//rfid识别搜索
	/*
	function distinguish() {
		$('#identify_tag').on('click', function() {
			var data = {
				wsUri: window.wsUri,
				cmd: 'readMany'
			};
			$('.rfid-loading').show();
			$('#identify_tag').attr('disabled', true).css('backgroundColor', '#58b7f7');
			mycmd.rfid(data, function(res) {
				if (res) {
					$('.rfid-loading').hide();
					$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
				}
				var res = JSON.parse(res);
				if (res.state && res.row) {
					if (res.row.EPC) {
						$('#rfid').val(res.row.EPC);
						app.get('archivesmodule/arcTbFile/validateRfidIfExist', {
							"id": "",
							"rfid": res.row.EPC
						}, function(res) {
							if (!res.state) {
								$("#identify_error").empty();
								$("#rfid").after('<label id="identify_error" class="error" for="fondsId">' + res.msg + '</label>');
							} else {
								layer.msg("电子标签正确！");
							}
						});
					}
				} else {
					// layer.msg('识别失败：请检查识别服务是否开启');
					return;
				}
			});

		})

	}
	*/
	//生成条码
	$('#generate_bar_code').on('click', function() {
		app.get('archivesmodule/brcode/createCodeNum', {}, function(msg) {
			if (msg.state) {
				$("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row);
				$("#barcode").val(msg.row);
			}

		});
	});
	//打印条码
	$('#print_bar_code').on('click', function() {
		$("#pic").jqprint();
	});
	//档案密级的名称(未选时是机密)
	var fkSecretName = '机密';
	// 监听密级，获取密级的名字
	form.on('select(secrete)', function(data) {
		fkSecretName = data.elem[data.elem.selectedIndex].text;
	});
	form.on('radio(radio_borrow_div)', function(data) {
		$('#borrow_div input').removeAttr('checked');
		$(data.elem).attr('checked', 'checked');
	});
	//新建档案的保存，给json数据分层级
	/**
	 * @other 根据.del获取的只是部分要，还有这些需要分离
	 * @obj 是基本信息和附件信息的值
	 * @data 被delete之后得data是模板的信息
	 */
	var lock = false;
	form.on('submit(saveEditInfo)', function(res) {
		if (formvalidate().form()) {
			var obj = {},
				other = ['cancel', 'fkTypeName', 'list', 'recordOrganize', 'author', 'fkSourceId', 'file'],
				baseInfo = $('.del'),
				views = $('.view');
			var data = $("#edit_info_form").serializeJson();
			for (var i = 0; i < baseInfo.length; i++) {
				var item = baseInfo.eq(i).attr('name');
				obj[item] = data[item];
				delete data[item];
			}
			for (var j = 0; j < other.length; j++) {
				var item = other[j];
				obj[item] = data[item];
				delete data[item];
			}
			for (var k = 0; k < views.length; k++) {
				var element = views.eq(k);
				var flag = element.attr('data-flag');
				if (flag === 'checkbox') {
					var details = [];
					var title = element.find('.layui-input-block').next().attr('name');
					var checked = element.find('.layui-input-block').find('.layui-form-checked');
					for (var h = 0; h < checked.length; h++) {
						var value = checked.eq(h).find('span').text();
						details.push(value);
					}
					data[title] = details.join();
				}
			}
			obj.detail = data;
			obj['barCode'] = $('#barcode').val();
			obj['allowBorrow'] = $('#borrow_div input[checked]').val();
			obj['list'] = fileInfo;
			obj['fkSecretName'] = fkSecretName;
			obj['tableName'] = $('input[name="fkTypeName"]').attr('id');
			obj['fkStoreId'] = $("#store_Room1").find("option:selected").val();
			obj['fkStoreName'] = $("#store_Room1").find("option:selected").html();
			obj['fkRegionId'] = $("#area1").find("option:selected").val();
			obj['fkRegionName'] = $("#area1").find("option:selected").html();
			obj['colNum'] = $("#cols1").find("option:selected").val();
			obj['divNum'] = $("#divs1").find("option:selected").val();
			obj['laysNum'] = $("#lays1").find("option:selected").val();
			obj['direction'] = $("#direction").find("option:selected").val();
			obj['number'] = $("#num").val();
			obj['fkRegionNum'] = $("#regionNum").val();
			obj['fk_attachment_ids'] = fileInfo;
			obj['rfid'] = data.rfid;
			// if (info) {
			//     //修改档案时，需要传递档案id
			//     obj['fkTypeId'] = info.fkTypeId;
			//     obj['id'] = info.id;
			//     if(!lock) {
			//         lock = true;//锁定
			//         app.post('archivesmodule/arcTbFiles/updateBoxAndLocation', obj, function (res) {
			//             if (res.state) {
			//                 layer.msg(res.msg);
			//                 //location.reload();
			//                 setTimeout(function () {
			//                     window.history.back(-1);
			//                 }, 2000);
			//             } else {
			//                 layer.msg(res.msg);
			//             }
			//         });
			//     }
			// } else {
			obj['fkTypeId'] = $('input[name="fkTypeName"]').attr('id');
			if (!lock) {
				lock = true; //锁定
				app.post('archivesmodule/arcTbFiles/insertFilesBox', obj, function(res) {
					if (res.state) {
						layer.msg(res.msg);
						setTimeout(function() {
							window.history.back(-1);
						}, 2000);
					} else {
						lock = false;
						layer.msg(res.msg);
					}
				});
			}
			// }
			return false;
		}
	});
});

/* 以下三个函数为绑定菜单树形菜单用到的函数*/
function onCheck(e, treeId, treeNode) {
	var id = e.target.id;
	count(id);
	if (clearFlag) {
		clearCheckedOldNodes(id);
	}
}

function clearCheckedOldNodes(id) {
	var zTree = $.fn.zTree.getZTreeObj(id),
		nodes = zTree.getChangeCheckedNodes();
	for (var i = 0, l = nodes.length; i < l; i++) {
		nodes[i].checkedOld = nodes[i].checked;
	}
}

function count(id) {
	var zTree = $.fn.zTree.getZTreeObj(id),
		checkCount = zTree.getCheckedNodes(true).length,
		nocheckCount = zTree.getCheckedNodes(false).length,
		changeCount = zTree.getChangeCheckedNodes().length;
	$("#checkCount").text(checkCount);
	$("#nocheckCount").text(nocheckCount);
	$("#changeCount").text(changeCount);

}

/**
 *
 * @param msg 提示信息
 * @param elem tip层黏该元素上
 * @returns {boolean}
 */
//关于tip层提示后清空输入框的信息且焦点在该输入框
function afterTip(msg, elem) {
	layer.tips(msg, $(elem), {
		tips: 2
	});
	$(elem).val('');
	$(elem)[0].focus();
	return false;
}
//rfid
// function  RFID(data) {
//     $('#rfid').val(data);
// }

$().ready(function() {
	formvalidate();

});

function formvalidate() {
	return $("#edit_info_form").validate({
		// onfocusout: function (element) {
		//     $(element).valid();
		// },
		rules: {
			fileName: {
				required: true,
				// maxlength: 100
			},
			fileNum: {
				english: true,
				required: true,
				maxlength: 30,
				// remote: {
				//     url: baseurl + "archivesmodule/arcTbFile/validateFileNumIfExist",
				//     type: "get",
				//     data: {
				//         fileNum: function () {
				//             return $("#fileNumber").val();
				//         }
				//     }
				// }
			},
			fondsId: {
				number: true,
				required: true,
				maxlength: 8
			},
			author: {
				required: true,
				maxlength: 8
			},
			recordOrganize: {
				required: true,
				maxlength: 24
			},
			pageNum: {
				required: true,
				number: true,
				maxlength: 5
			},
			integrity: {
				required: true,
				positive: true,
				range: [0, 100]
			},
			fkTypeName: {
				required: true
			},
			number: {
				required: false,
				number: true,
				maxlength: 22
			},
			rfid: {
				english: true,
				// number: true,
				maxlength: 24
			}
		},
		messages: {
			fileName: {
				required: "题名不能为空",
				// maxlength: '最大长度不能超过100位'
			},
			fileNum: {
				required: '档号不能为空',
				english: '档号不能输入汉字',
				maxlength: '最大长度不能超过30位',
				// remote: "档号已存在"
			},
			fondsId: {
				required: '全宗号不能为空',
				number: '全宗号只能为数字',
				maxlength: '最大长度不能超过8位'
			},
			author: {
				required: '著录人不能为空',
				maxlength: '最大长度不能超过8位'
			},
			recordOrganize: {
				required: '著录单位不能为空',
				maxlength: '最大长度不超过24位'
			},
			pageNum: {
				required: '页数不能为空',
				number: '页数只能为数字',
				maxlength: '最大长度不能超过5位'
			},
			integrity: {
				required: '完整度不能为空',
				positive: '完整度只能为正整数和0',
				range: '请输入0-100之间的数字'
			},
			fkTypeName: {
				required: '档案类别不能为空'
			},
			number: {
				number: '号只能位数字',
				maxlength: '最大长度不能超过22位'
			},
			rfid: {
				english: 'rfid只能为字母与数字',
				// number: 'rfid只能位数字',
				maxlength: '最大长度不能超过24位'
			}
		}
	});
}
//将form表单序列化为json
$.fn.serializeJson = function() {
	var serializeObj = {};
	var array = this.serializeArray();
	$.each(array, function() {
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


function distinguish() {
	$('#identify_tag').on('click', function() {
		console.log('发送')
		$('#rfid').val('');

        // wsValue.send('start')
        app.bindingget("rfid/getMessage", {}, function (msg) {
            if (msg.data) {
				if (msg.data.length > 1) {
                    layer.msg("请保证RFID识别区附近有且仅有一张电子标签");
				}
				else if (msg.data[0].code == 0) {
                    readRFID(msg.data[0].rfid);
				} else {
                    layer.msg(msg.data[0].msg);
				}
			} else {
                layer.msg("当前未识别到有效的电子标签");
			}
        });
	})
}

// function webinit(url) {
// 	var ws = new WebSocket(url);
// 	let that = this;
// 	ws.onopen = e => {
// 		ws.send("connect");
// 		console.log("连接成功");
// 	};
// 	ws.onmessage = e => {
// 		let result = /^EPC/.test(e.data);
// 		//let result = 'EPCE22200174010016614808282'
// 		let notice = /error/.test(e.data);
// 		let reconnect = /reconnect/.test(e.data);
// 		console.log("接收的信息", e.data, result);
// 		let error = '设备连接失败'
// 		if (error == e.data) {
// 			$("#identify_error").text('设备连接失败')
// 		}
// 		if (result) {
// 			console.log(e.data, '检测RFID')
// 			if (e.data.length > 4) {
// 				let res = e.data.slice(3)
// 				readRFID(res)
// 				console.log('你没执行啊')
// 			} else {
// 				// 弹框
// 				$("#identify_error").text('RFID为空')

// 				console.log(!e.data, 'RFID为空？')
// 			}
// 		}
// 		console.log("接收数据", e.data);
// 	};
// 	ws.onclose = e => {
// 		$('.rfid-loading').hide();

// 		$("#identify_error").text('连接关闭')
// 		console.log("连接关闭");
// 	};
// 	ws.onerror = e => {
// 		$('.rfid-loading').hide();

// 		$("#identify_error").text('设备连接失败')
// 		console.log("出错情况");
// 	};
// 	return ws;
// }


function readRFID(rfid) {
	if (rfid) {
		$('.rfid-loading').hide();
		console.log('rfid赋值', rfid)
		// 发送请求
		$('#rfid').val(rfid);

		app.get('archivesmodule/arcTbFile/validateRfidIfExist', {
			"id": "",
			"rfid": rfid
		}, function(res) {
			if (!res.state) {
				$("#identify_error").empty();
				$("#identify_error").text(res.msg)
				//$("#rfid").after('<label id="identify_error" class="error" for="fondsId">' + res.msg + '</label>');
			} else {
				layer.msg("电子标签正确！");
				$("#identify_error").text('')
			}
		});

	} else {
		layer.msg('RFID为空')
		return
	}


}
