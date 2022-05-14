/**
 *
 * @author yuqi
 */
//获取URL后边？及之后的信息
var info, moudleInfo, enclosure, fileInfo = [],
	textareaId = 0;
var pro = parent.$("#menuframe")[0].contentWindow;
fileId = pro.baseData.id;
var typeId = pro.baseData.typeId;
console.log(fileId, typeId);
if (fileId !== null && fileId !== '' && fileId !== undefined) {
	var arr = [];
	var arrId = [];
	$('.title2').text('编辑档案');
	// fileId = fileId.split('=')[1];
	//获取大部分档案信息
	app.getAsync('archivesmodule/arcTbFiles/selectMoreDetails', {
		id: fileId,
		tableName: typeId
	}, function(res) {
		if (res.state) {
			info = res.row;
			moudleInfo = info.detail;
			// console.log(moudleInfo);
			//渲染附件列表
			enclosure = info.arcTbAttachmentList;
			if (enclosure !== undefined) {
				for (var i = 0; i < enclosure.length; i++) {
					var path = enclosure[i].fileStoragePath;
					var ids = enclosure[i].id;
					arr.push(path);
					arrId.push(ids);
					fileInfo.push(enclosure[i]);
					var tr = $(['<tr id="upload-' + i + '">', '<td>' + enclosure[i].fileOldName + "." + enclosure[i].fileSuffix +
						'</td>', '<td>' + enclosure[i].fileSize + 'kb</td>', '<td>已上传</td>', '<td>',
						'<button type="button" class="layui-btn layui-btn-xs demo-delete">删除</button>',
						'<button type="button" class="layui-btn layui-btn-xs download-file">下载</button>',
						'<button type="button" class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>', '</td>',
						'<td style="display: none;">' + JSON.stringify(enclosure[i]) + '</td>', '</tr>'
					].join(''));
					$('#fileList').append(tr);
				}
			}
			$('.demo-delete').each(function(index, ele) {
				$(this).on("click", function() {
					app.post('archivesmodule/arcTbAttachment/deleteAttachmentById', {
						id: arrId[index]
					}, function(res) {
						if (res.state) {
							layer.msg(res.msg);
						} else {
							layer.msg(res.msg);
						}
					});
				});
			});
			// selectRender(info);
			// initRender();
			$(".download-file").each(function(index, ele) {
				$(this).on("click", function() {
					//alert(index);
					var itemName = $(this).parent();
					console.log(itemName.parent().children().eq(0).text());
					var fileName = itemName.parent().children().eq(0).text();
					document.location.href = imgurl + 'filemodule/file/download?fileName=' + fileName + '&fileUrl=' + arr[index];
				});
			});
		}
	});
} else {
	$('.title2').text('新增档案');
}

// function initRender() {
layui.use(['table', 'layer', 'form', 'upload', 'laydate'], function() {
	var laydate = layui.laydate;


	laydate.render({
		elem: '#test1' //指定元素
	});
	var table = layui.table,
		form = layui.form,
		upload = layui.upload;
	//点击编辑时，给表单赋值，否则渲染select
	app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function(msg) {
		if (msg.state) {
			var str1 = '<option value=""></option>';
			var str = "";
			var room = $("#store_Room1"),
				area = $("#area1"),
				cols = $("#cols1"),
				lays = $("#lays1"),
				divs = $("#divs1");

			for (var i = 0; i < msg.rows.length; i++) {
				str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + '</option>';
			}
			room.html(str1 + str);
			// 监听select下拉框
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
						area.html(str1 + str);
						form.render('select');
						form.on("select(areaName1)", function(data) {
							app.get("storeroommodule/stoTbRegion/selectByRegionId", {
								id: data.value
							}, function(msg) {
								if (msg.state) {
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
									cols.html(str1 + str2);
									lays.html(str1 + str3);
									divs.html(str1 + str4);
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
	layui.form.render();
	if (info) {
		//渲染大部分表单数据
		console.log(info);
		var locationId = info.fkLocationId;
		// 获取库房名称、区、列、节、层......
		// $("#store_Room1").html('<option value="' + info.fkStoreId + '" selected>' + info.fkStoreName + '</option>');
		// $("#area1").html('<option value="' + info.fkRegionId + '" selected>' + info.fkRegionName + '</option>');
		// $("#cols1").html('<option value="' + info.colNum + '" selected>' + info.colNum + '</option>');
		// $("#lays1").html('<option value="' + info.laysNum + '" selected>' + info.laysNum + '</option>');
		// $("#divs1").html('<option value="' + info.divNum + '" selected>' + info.divNum + '</option>');
		// form.render("select");
		form.val('archiveInfo', info);
		//条码无法自动渲染
		$('#barcode').val(info.barCode);
		$("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + info.barCode);
		//如果点击的是编辑，则在一开始就渲染模板
		showModule(info.fkTypeId);
		//单独渲染是否借阅
		if (!info.allowBorrow) {
			$("input[name='allowBorrow'][value='1']").attr("checked", false);
			$("input[name='allowBorrow'][value='0']").attr("checked", true);
		}
		const promise = new Promise(function(resolve, reject) {
			var data;
			app.get("archivesmodule/arcTbLocation/selectLocationId", {
				id: locationId
			}, function(res) {
				if (res.state) {
					data = res.row;
					resolve(data);
				} else {
					reject('错误');
				}
			});
		});

		promise.then(function(data) {
			var fkStoreName = data.fkStoreName;
			var fkStoreId = data.fkStoreId;
			var fkRegionName = data.fkRegionName;
			var fkRegionId = data.fkRegionId;
			var colNum = data.colNum;
			var divNum = data.divNum;
			var laysNum = data.laysNum;
			// 库房初始渲染
			app.get("storeroommodule/StoTbStore/selectIsNotDelete", {}, function(msg) {
				if (msg.state && msg.rows) {
					var str1 = '<option value=""></option>';
					var str = "";
					for (var i = 0; i < msg.rows.length; i++) {
						if (msg.rows[i].storeName == fkStoreName) {
							str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].storeName + "</option>";
						} else {
							str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].storeName + "</option>";
						}
					}
					$("#store_Room1").html(str1 + str);
					form.render();
				}
			});
			// 区初始渲染
			app.get("storeroommodule/stoTbRegion/selectByBind", {
				fkStoreId: fkStoreId
			}, function(msg) {
				var area = $("#area1");
				if (msg.state && msg.rows) {
					var str1 = '<option value=""></option>';
					var str = "";
					for (var i = 0; i < msg.rows.length; i++) {
						if (msg.rows[i].regionName == fkRegionName) {
							str += '<option value="' + msg.rows[i].id + '" selected>' + msg.rows[i].regionName + "</option>";
						} else {
							str += '<option value="' + msg.rows[i].id + '">' + msg.rows[i].regionName + '</option>';
						}
					}
					area.html(str1 + str);
					form.render();
				}
			});
			// 列节层初始渲染
			app.get("storeroommodule/stoTbRegion/selectByRegionId", {
				id: fkRegionId
			}, function(msg) {
				if (msg.state && msg.row) {
					var cols = $("#cols1"),
						lays = $("#lays1"),
						divs = $("#divs1");
					var str1 = '<option value=""></option>';
					var str2 = "";
					var str3 = "";
					var str4 = "";
					if (msg.row.gdlType == '左边') {
						for (var i = 0; i < msg.row.cols; i++) {
							if (i == colNum) {
								str2 += '<option value="' + i + '" selected>' + i + '</option>';
							} else {
								str2 += '<option value="' + i + '">' + i + '</option>';
							}
						}
					} else {
						for (var i = 1; i <= msg.row.cols; i++) {
							if (i == colNum) {
								str2 += '<option value="' + i + '" selected>' + i + '</option>';
							} else {
								str2 += '<option value="' + i + '">' + i + '</option>';
							}
						}
					}
					for (var i = 1; i <= msg.row.divs; i++) {
						if (i == divNum) {
							str3 += '<option value="' + i + '" selected>' + i + '</option>';
						} else {
							str3 += '<option value="' + i + '">' + i + '</option>';
						}
					}
					for (var i = 1; i <= msg.row.lays; i++) {
						if (i == laysNum) {
							str4 += '<option value="' + i + '" selected>' + i + '</option>';
						} else {
							str4 += '<option value="' + i + '">' + i + '</option>';
						}
					}
					cols.html(str1 + str2);
					lays.html(str1 + str3);
					divs.html(str1 + str4);
					form.render();
				}
			});
			if (data.direction == '左') {
				$('#direction option[value="左"]').attr('selected', true);
			} else {
				$('#direction option[value="右"]').attr('selected', true);
			}
			form.render();
			$('#num').val(data.number);
		});
	}
	//来源select初始渲染
	app.get('authmodule/sysTbDictCode/selectSysTbDictCodeByfkType', {
		"type": "arc_source"
	}, function(res) {
		var data = res.rows,
			origin = $('#arc_source'),
			opt;
		for (var key in data) {
			if (info && data[key].id == info.fkSourceId) {
				opt = '<option selected="" value="' + data[key].id + '">' + data[key].svalue + '</option>';
			} else {
				opt = '<option value="' + data[key].id + '">' + data[key].svalue + '</option>';
			}
			origin.append(opt);
		}
		form.render('select');
	});
	//密级select初始渲染
	app.get('authmodule/sysTbDictCode/selectSysTbDictCodeByfkType', {
		"type": "ofthem"
	}, function(res) {
		var data = res.rows,
			origin = $('select[name="fkSecretId"]'),
			opt;
		for (var key in data) {
			if (info && data[key].id == info.fkSecretId) {
				opt = '<option selected="" value="' + data[key].id + '">' + data[key].svalue + '</option>';
			} else {
				opt = '<option value="' + data[key].id + '">' + data[key].svalue + '</option>';
			}
			origin.append(opt);
		}
		form.render('select');
	});

	//多文件列表示例
	var fileListView = $('#file_list'),
		uploadListIns = upload.render({
			elem: '#upload_files',
			url: window.imgurl + 'filemodule/file/addOneFilesAttachments',
			accept: 'file',
			multiple: true,
			auto: false,
			size: 0,
			bindAction: '#reupload',
			choose: function(obj) {
				var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
				//读取本地文件
				obj.preview(function(index, file, result) {
					var tr = $(['<tr style="text-align: center" id="upload-' + index + '">', '<td>' + file.name + '</td>',
						'<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>',
						'<a class="demo-reload layui-hide" style="color: #3a97ff">重传<span style="color:#3a97ff" >&nbsp;&nbsp;|&nbsp;</span></a>',
						'<a class="demo-delete" style="color: #3a97ff">删除</a>', '</td>', '</tr>'
					].join(''));
					//单个重传
					tr.find('.demo-reload').on('click', function() {
						obj.upload(index, file);
					});
					//删除
					tr.find('.demo-delete').on('click', function() {
						delete files[index]; //删除对应的文件
						tr.remove();
						uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
					});
					fileListView.append(tr);
				});
			},
			done: function(res, index, upload) {
				if (res.code == 1) { //上传成功
					var tr = fileListView.find('tr#upload-' + index),
						tds = tr.children();
					tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
					tds.eq(3).html(''); //清空操作
					fileInfo.push(res.row); // 存储上传文件后的返回信息
					console.log(fileInfo);
					return delete this.files[index]; //删除文件队列已经上传成功的文件
				}
				this.error(index, upload);
			},
			error: function(index, upload) {
				var tr = fileListView.find('tr#upload-' + index),
					tds = tr.children();
				tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
				tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
			}
		});
	//档案密级的名称(未选时是机密)
	var fkSecretName = '机密';
	// 监听密级，获取密级的名字
	form.on('select(secrete)', function(data) {
		fkSecretName = data.elem[data.elem.selectedIndex].text;
	});

	//新建档案的保存，给json数据分层级
	/**
	 * @other 根据.del获取的只是部分要，还有这些需要分离
	 * @obj 是基本信息和附件信息的值
	 * @data 被delete之后得data是模板的信息
	 */


	//根据档案类别显示档案信息模板
	function showModule(id) {
		app.get('archivesmodule/arcTbArcType/selectOne', {
			"id": id
		}, function(res) {
			var contanier = $('#archiveInfo');
			contanier.empty();
			var module = downloadLayoutSrc(res);
			contanier.append(module);
			for (var z = 0; z < textareaId; z++) {
				var editor = new Simditor({
					textarea: $(`#editor${z}`),
					//optional options
					toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color',
						'ol', 'ul', 'blockquote', 'code', //# code block
						'table', 'link', 'image', 'hr', // # horizontal ruler
						'indent', 'outdent', 'alignment',
					]
				});
			}
			form.render();
			if (moudleInfo) {
				form.val('archiveInfo', moudleInfo);
			}
		});
	}

	//生成条码
	$('#generate_bar_code').on('click', function() {
		app.get('archivesmodule/brcode/createCodeNum', {}, function(msg) {
			if (msg.state) {
				$("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + msg.row);
				$("#barcode").val(msg.row);
				// $('#barcode').html(
				//     baseurl + 'archivesmodule/brcode/img?code=' + res.row
				// )
			}

		});
	});
	//打印条码
	$('#print_bar_code').on('click', function() {
		$("#pic").jqprint();
	});
	//得到模板的html代码
	function downloadLayoutSrc(res) {
		if (res.row.htmlTpl !== null) {
			let code = res.row.htmlTpl;
			//转换为dom对象
			code = $(code).get(0);
			// console.log(code);
			let flagEle = $(code).find('span'),
				flagDiv = $(code).find('div'),
				oInput = $(code).find('input');
			for (var i in flagEle) {
				flagEle.eq(i).remove();
			}
			for (var j in flagDiv) {
				var Odiv = flagDiv.eq(j);
				if (Odiv.hasClass('preview')) {
					Odiv.remove();
				}
				if (Odiv.hasClass('layui-form-select')) {
					Odiv.remove();
				}
				if (Odiv.hasClass('simditor')) {
					var parentEle = Odiv.parent();
					Odiv.remove();
					var textarea = `<textarea id="editor${textareaId}"></textarea>`
					parentEle.append(textarea);
					textareaId++;
				}
			}
			for (var k in oInput) {
				if (oInput.eq(k).hasClass('hide')) {
					oInput.eq(k).remove();
				}
			}
			return code;
		}
	}
});
// }


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

//完整度输入后判断其大小
function integrityRange(elem) {
	var value = $(elem).val();
	if (!RegExp(/^[0-9]*$/).test(value)) {
		afterTip('完整度只能是数字！', $(elem));
	} else if (value > 100 || value < 0) {
		afterTip('完整度只能在0-100之间！', $(elem));
	} else if (!value) {
		afterTip('完整度不能为空！', $(elem));
	}
}

//页数的判断
function pageNumber(elem) {
	var value = $(elem).val();
	if (!RegExp(/^[0-9]*$/).test(value)) {
		afterTip('页数只能是数字！', $(elem))
	}
}

$('#close').on('click', function() {
	parent.layer.closeAll();
});
