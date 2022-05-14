/**
 *
 * @author yuqi
 */
//获取URL后边？及之后的信息
// var wsValue = webinit(window.wsUri)
var info, moudleInfo, enclosure, fileInfo = [],
	fileId = window.location.search,
	textareaId = 0;
$().ready(function() {
	formvalidate();

});
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
layui.use(['table', 'layer', 'form', 'upload', 'laydate'], function() {
    // 进入页面开启读取RFID服务
    app.bindingget("rfid/start", {}, function (msg) {
        if ((msg.code = 200)) {
            console.log("开始读取");
        } else {
            console.log(msg.msg);
        }
    });
	var laydate = layui.laydate;
	laydate.render({
		elem: '#test1', //指定元素
		range: true
	});

	var table = layui.table,
		form = layui.form,
		upload = layui.upload;
	if (!(fileId !== null && fileId !== '' && fileId !== undefined)) {
		// $('.title2').text('新增档案');
		getMenuBar(); //自定义面包屑，引用public-menu.js
		info = {};
	} else {
		var arr = [];
		var arrId = [];
		$('.title2').text('编辑档案');
		fileId = fileId.split('=')[1];
		//获取大部分档案信息
		app.getAsync('archivesmodule/arcTbFile/selectFileById', {
			id: fileId
		}, function(res) {
			if (res.state) {
				info = res.row;
				moudleInfo = info.detail;
				//渲染附件列表
				enclosure = info.arcTbAttachmentList;
				if (enclosure !== null) {
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
				$(".download-file").each(function(index, ele) {
					$(this).on("click", function() {
						//alert(index);
						var itemName = $(this).parent();
						// console.log(itemName.parent().children().eq(0).text());
						var fileName = itemName.parent().children().eq(0).text();
						document.location.href = imgurl + 'filemodule/file/download?fileName=' + fileName + '&fileUrl=' + arr[
							index];
					});
				});
			}
		});
	}
	if (info) {
		//渲染大部分表单数据
		form.val('archiveInfo', info);
		var storeRegionJson = {
			fkStoreId: info.fkStoreId,
			fkRegionId: info.fkRegionId,
			colNum: info.colNum,
			divNum: info.divNum,
			laysNum: info.laysNum
		};
		renderStoreRegion(storeRegionJson);
		//条码无法自动渲染
		if (info.barCode) {
			$('#barcode').val(info.barCode);
			$("#pic").attr("src", baseurl + "archivesmodule/brcode/img?code=" + info.barCode);
		}
		//如果点击的是编辑，则在一开始就渲染模板
		showModule(info.fkTypeId);
		//单独渲染是否借阅
		if (info.allowBorrow == 0 || info.allowBorrow == 1) {
			$("input[name=allowBorrows][value='0']").attr("checked", info.allowBorrow == 0 ? true : false);
			$("input[name=allowBorrows][value='1']").attr("checked", info.allowBorrow == 1 ? true : false);
		}
	} else {
		selectStoreRegion();
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
					// $.fn.zTree.init($("#file_type_tree"), setting, treeNodes);
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
				// }
				//保存时需要传id和名字
				var typeInfo = $('input[name="fkTypeName"]');
				typeInfo.val(typeValue);
				typeInfo.attr('id', sNodes[0].id);
				info.fkTypeId = sNodes[0].id;
				typeInfo.removeClass('error');
				typeInfo.next().hide();
				textareaId = 0;
				layer.closeAll();
				$('#file_type_tree').hide();
				showModule(sNodes[0].id); //档案模型显示
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
		console.log('？？')
		$('#identify_tag').on('click', function() {
			$('.rfid-loading').show();
			$('#identify_tag').attr('disabled', true).css('backgroundColor', '#58b7f7');
			var data = {
				wsUri: window.wsUri,
				cmd: 'readMany'
			};
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
	//多文件列表示例
	var fileListView = $('#file_list');
	var uploadListIns = upload.render({
		elem: '#upload_files',
		url: window.imgurl + 'filemodule/file/addOneFilesAttachments',
		accept: 'file',
		multiple: true,
		auto: false,
		size: 0,
		bindAction: '#reupload',
		choose: function(obj) {
			console.log(obj, '上传文件')
			var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
			//读取本地文件
			obj.preview(function(index, file, result) {
				console.log(file.type,'file.type')
				var tr = $(['<tr style="text-align: center" id="upload-' + index + '">', '<td>' + file.name + '</td>',
					'<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>',
					'<a class="demo-reload layui-hide" style="color: #3a97ff">重传<span style="color:#3a97ff" >&nbsp;&nbsp;|&nbsp;</span></a>',
					'<a class="demo-delete" style="color: #3a97ff">删除</a>',
					'<a class="preview-pdf" style="color: #3a97ff">预览</a>', '</td>', '</tr>'
				].join(''));
				if (file.type == 'application/pdf') {
					var tr = $(['<tr style="text-align: center" id="upload-' + index + '">', '<td>' + file.name + '</td>',
						'<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>',
						'<a class="demo-reload layui-hide" style="color: #3a97ff">重传<span style="color:#3a97ff" >&nbsp;&nbsp;|&nbsp;</span></a>',
						'<a class="demo-delete" style="color: #3a97ff">删除</a>',
						'<a class="preview-pdf" style="color: #3a97ff">pdf预览</a>', '</td>', '</tr>'
					].join(''));
				} else if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
					var tr = $(['<tr style="text-align: center" id="upload-' + index + '">', '<td>' + file.name + '</td>',
						'<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>',
						'<a class="demo-reload layui-hide" style="color: #3a97ff">重传<span style="color:#3a97ff" >&nbsp;&nbsp;|&nbsp;</span></a>',
						'<a class="demo-delete" style="color: #3a97ff">删除</a>',
						'<a class="preview-excel" style="color: #3a97ff">excel预览</a>', '</td>', '</tr>'
					].join(''));
				}
				// else if (file.type == 'text/plain') {//
				// 	var tr = $(['<tr style="text-align: center" id="upload-' + index + '">', '<td>' + file.name + '</td>',
				// 		'<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>',
				// 		'<a class="demo-reload layui-hide" style="color: #3a97ff">重传<span style="color:#3a97ff" >&nbsp;&nbsp;|&nbsp;</span></a>',
				// 		'<a class="demo-delete" style="color: #3a97ff">删除</a>',
				// 		'<a class="preview-excel" style="color: #3a97ff">txt预览</a>', '</td>', '</tr>'
				// 	].join(''));
				// } else if (file.type.indexOf('image/')!=-1) {//
				// 	var tr = $(['<tr style="text-align: center" id="upload-' + index + '">', '<td>' + file.name + '</td>',
				// 		'<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>',
				// 		'<a class="demo-reload layui-hide" style="color: #3a97ff">重传<span style="color:#3a97ff" >&nbsp;&nbsp;|&nbsp;</span></a>',
				// 		'<a class="demo-delete" style="color: #3a97ff">删除</a>',
				// 		'<a class="preview-excel" style="color: #3a97ff">图片预览</a>', '</td>', '</tr>'
				// 	].join(''));
				// } 
				else {
					var tr = $(['<tr style="text-align: center" id="upload-' + index + '">', '<td>' + file.name + '</td>',
						'<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>',
						'<a class="demo-reload layui-hide" style="color: #3a97ff">重传<span style="color:#3a97ff" >&nbsp;&nbsp;|&nbsp;</span></a>',
						'<a class="demo-delete" style="color: #3a97ff">删除</a>',
						'</td>', '</tr>'
					].join(''));
				}

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
				tr.find('.preview-pdf').on('click', function() {
					console.log(index, file,'点了pdf') // 需要转为blob对象
					var reader = new FileReader();
					let rs = reader.readAsArrayBuffer(file)
					let blob = null
					reader.onload = function(e) {
						if (typeof e.target.result === 'object') {
							blob = new Blob([e.target.result])
						} else {
							blob = e.target.result
						}
						var url = URL.createObjectURL(blob)
						window.open('../../../html/archive/archive-manage/add-archive/pdf/web/viewer.html?file=' + url, 'PDF')
						//window.open('./js/pdf/web/viewer.html?file=' + url, 'PDF')
						// 转换为base64格式
					};
				})
				tr.find('.preview-excel').on('click', function() {
					console.log(index, file,'点了excel') // 需要转为blob对象
					// 生成DOM结构 转交给弹框？
					var html 
					readWorkbookFromLocalFile(file, function(workbook) {
					  html = readWorkbook(workbook);
					});
					console.log(html)
				})
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
		if (formvalidate().one.form() && formvalidate().two.form()) {
			var obj = {},
				other = ['cancel', 'fkTypeName', 'list', 'recordOrganize', 'author', 'fkSourceId', 'file', 'colNum',
					'direction', 'divNum', 'fkRegionName', 'fkStoreName', 'laysNum', 'number', 'rfid', 'regionNum'
				],
				baseInfo = $('.del'),
				views = $('.view');
			var data = $("#edit_info_form").serializeJson();
			console.log(data, '删了啥就NMD离谱')
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
				var name = element.find('.layui-form-item').find('.hide').attr('name');
				var flag = element.attr('data-flag');
				if (flag === 'checkbox') {
					var details = [];
					var title = element.find('.layui-input-block').next().attr('name');
					var checked = element.find('.layui-input-block').find('.layui-form-checked');
					for (var h = 0; h < checked.length; h++) {
						var value = checked.eq(h).find('span').text();
						details.push(value);
					}
					// titleList.push(title);
					data[title] = details.join();
				} else if (flag === 'select') {
					data[name] = element.find('.layui-input-block').find('.layui-select-title').find('input').val();
				} else if (flag === 'radio') {
					var radio = element.find('.layui-input-block').find('.layui-form-radioed').find('div').text();
					data[name] = radio;
				} else {
					data[name] = element.find('.layui-input-block').children().val();
				}
			}
			obj.detail = data;
			var allowBorrows = "是";
			if ($('#borrow_div input[checked]').val() == 0) {
				allowBorrows = "否";
			}
			// 提交数据
			obj['allowBorrows'] = allowBorrows;
			obj['barCode'] = $('#barcode').val();
			obj['allowBorrow'] = $('#borrow_div input[checked]').val();
			obj['list'] = fileInfo;
			obj['fkSecretName'] = fkSecretName;
			obj['fkStoreId'] = $("#store_Room1").find("option:selected").val();
			obj['fkStoreName'] = $("#store_Room1").find("option:selected").html();
			obj['fkRegionId'] = $("#area1").find("option:selected").val();
			obj['fkRegionName'] = $("#area1").find("option:selected").html();
			obj['colNum'] = $("#cols1").find("option:selected").val();
			obj['divNum'] = $("#lays1").find("option:selected").val();
			obj['laysNum'] = $("#divs1").find("option:selected").val();
			obj['direction'] = $("#direction").find("option:selected").val();
			obj['number'] = $("#num").val();
			obj['fkRegionNum'] = $("#regionNum").val();
			obj['fk_attachment_ids'] = fileInfo;
			console.log(obj, '这里是待归档档案吗')


			if (info.id != undefined && info.id != null) {
				//修改档案时，需要传递档案id
				obj['fkTypeId'] = info.fkTypeId;
				obj['id'] = info.id;
				if (!lock) {
					lock = true; //锁定
					app.post('archivesmodule/arcTbFile/updateFile', obj, function(res) {
						if (res.state) {
							layer.msg(res.msg);
							//location.reload();
							setTimeout(function() {
								window.parent.archiveToWait();
								// window.location.href = "waiting-for-archiving.html";
							}, 2000);
						} else {
							lock = false; //锁定
							layer.msg(res.msg);
						}
					});
				}
			} else {
				obj['fkTypeId'] = $('input[name="fkTypeName"]').attr('id');
				if (!lock) {
					lock = true; //锁定
					app.post('archivesmodule/arcTbFile/insertFile', obj, function(res) {
						if (res.state) {
							layer.msg(res.msg);
							setTimeout(function() {
								window.parent.archiveToWait();
							}, 2000);
						} else {
							lock = false; //锁定
							layer.msg(res.msg);
						}
					});
				}
			}
			return false;

		}
	});
	//根据档案类别显示档案信息模板
	function showModule(id) {
		app.get('archivesmodule/arcTbArcType/selectOne', {
			"id": id
		}, function(res) {
			if (res.state) {
				var contanier = $('#archiveInfo');
				contanier.empty();
				var module = downloadLayoutSrc(res);
				if (module) {
					for (var module_i = 0; module_i < module.length; module_i++) {
						contanier.append(module[module_i]);
					}
				}
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
					$('.simditor-placeholder').empty();
					if (moudleInfo['checkbox'] != undefined) {
						var value = moudleInfo['checkbox'].split(',');
						for (var h = 0; h < value.length; h++) {
							var prop = `like[${value[h]}]`;
							moudleInfo[prop] = 'on';
						}
					}
					var list = $('textarea');
					for (var i = 0; i < list.length; i++) {
						// var textareaId = $(list[i]).attr('id');
						if ($(list[i]).attr('id') !== undefined) {
							var textareaName = $(list[i]).attr('name');
							$(list[i]).prev().empty().append(moudleInfo[textareaName]);
						}
					}
					form.val('archiveInfo', moudleInfo);
					form.render('select');
				}
			}
		});
	}
	//得到模板的html代码
	function downloadLayoutSrc(res) {
		if (res.row !== null && res.row.htmlTpl !== null) {
			let code = res.row.htmlTpl;
			var code_arr = [];
			for (var code_i = 0; code_i < $(code).length; code_i++) {
				//转换为dom对象
				let codemode = $(code).get(code_i);
				// console.log(code);
				let flagEle = $(codemode).find('span'),
					flagDiv = $(codemode).find('div'),
					oInput = $(codemode).find('input');
				for (var i in flagEle) {
					if (flagEle[i].className === "icon" || flagEle[i].className === "form-value") {

					} else {
						flagEle.eq(i).remove();
					}
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
						var textarea = `<textarea id="editor${textareaId}" class="hide"></textarea>`;
						parentEle.append(textarea);
						Odiv.remove();
						textareaId++;
					}
				}
				for (var k in oInput) {
					if (oInput.eq(k).hasClass('hide')) {
						var nameAttr = $(oInput.eq(k)).attr('name');
						var elem = $(oInput.eq(k));
						//给除了富文本之外的元素添加属性
						if ($(elem).parent().hasClass('layui-form-item')) {
							var childElem = $(elem).prev().children(),
								flag = $(elem).closest('.view').attr('data-flag');
							//给除了富文本和checkbox之外的元素添加name属性
							if (flag !== 'checkbox') {
								$(childElem).attr('name', nameAttr);
							}
							//如果是input和textarea还需添加maxlength,minlength
							if (flag == 'input' || flag == 'textarea') {
								var max = $(oInput.eq(k)).attr('maxlength'),
									min = $(oInput.eq(k)).attr('minlength'),
									tip = $(oInput.eq(k)).attr('placeholder');
								$(childElem).attr({
									'maxlength': max,
									'minlength': min,
									'placeholder': tip
								});
							}
						} else if ($(elem).parent().attr('data-flag')) {
							//给富文本设置属性
							var richTextName = $(elem).attr('name'),
								max = $(elem).attr('maxlength'),
								min = $(elem).attr('minlength'),
								tip = $(elem).attr('placeholder');
							$(elem).next().attr({
								'name': richTextName,
								'minlength': min,
								'maxlength': max,
								'placeholder': tip
							});
						}
						//将传递属性的input删除
						// $(elem).remove();
					}
				}
				code_arr[code_i] = codemode;
			}
			return code_arr;
		}
	}
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
//rfid
function RFID(data) {
	$('#rfid').val(data);
}

// websocket专供
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
// 				$('.rfid-loading').hide();
// 				$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
// 				// 弹框
// 				$("#identify_error").text('RFID为空')

// 				console.log(!e.data, 'RFID为空？')
// 			}
// 		}
// 		console.log("接收数据", e.data);
// 	};
// 	ws.onclose = e => {
// 		$('.rfid-loading').hide();
// 		$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
// 		$("#identify_error").text('连接关闭')
// 		console.log("连接关闭");
// 	};
// 	ws.onerror = e => {
// 		$('.rfid-loading').hide();
// 		$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
// 		$("#identify_error").text('设备连接失败')
// 		console.log("出错情况");
// 	};
// 	return ws;
// }

function readRFID(rfid) {
	if (rfid) {
		$('.rfid-loading').hide();
		$('#identify_tag').attr('disabled', false).css('backgroundColor', '#3a97ff');
		// 发送请求
		$('#rfid').val(rfid);
		app.get('archivesmodule/arcTbFile/validateRfidIfExist', {
			"id": "",
			"rfid": rfid
		}, function(res) {
			if (!res.state) {
				$("#identify_error").empty();
				$("#identify_error").text(res.msg)
				layer.msg(res.msg);
				//$("#rfid").after('<label id="identify_error" class="error" for="fondsId">' + res.msg + '</label>');
			} else {
				layer.msg("电子标签正确！");
				$("#identify_error").text('')
			}
		});
	} else {
		return
	}


}

function distinguish() {
	$('#identify_tag').on('click', function() {
		$('#rfid').val('');
		$('.rfid-loading').show();
		$('#identify_tag').attr('disabled', true).css('backgroundColor', '#58b7f7');
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
            $(".rfid-loading").hide();
            $("#identify_tag").attr("disabled", false).css("backgroundColor", "#3a97ff");
        });
	})
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


