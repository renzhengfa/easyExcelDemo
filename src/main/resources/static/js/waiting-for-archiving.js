/**
 * @author yuqi
 * @mender liuyuru
 */
var currentPage;
layui.use(['table', 'layer', 'form', 'upload'], function() {
	var info, table = layui.table,
		form = layui.form,
		upload = layui.upload;
	getMenuBar(); //自定义面包屑，引用public-menu.js
	mybtn.secret();
	mybtn.date("#date_picker1", "#date_picker2"); //日期范围
	initTree('select'); //档案类别下拉框
	// 初始表格
	mytableinit(mytable, "archivesmodule/arcTbFile/selectFiles");
	//导出当前页或者导出所有页
	$('#conditionPage').on('click', function() {
		if (info) {
			var TypeIdistrue = info['map[fkTypeId]'];
			if (TypeIdistrue) {
				var condition = 'field=fileNum&sort=asc&map[fkTypeId]=' + info['map[fkTypeId]'] + '&map[fkSecretId]=' + info[
						'map[fkSecretId]'] + '&map[starttime]=' + info['map[starttime]'] + '&map[endtime]=' + info['map[endtime]'] +
					'&map[content]=' + info['map[content]'];
				document.location.href = window.baseurl + 'archivesmodule/arcTbFile/exportSearch?' + condition;
			} else {
				layer.msg("请先选择档案类别再导出！");
			}
		} else {
			layer.msg("请先查询档案再导出！");
		}
	});
	var active = {
		batchDelete: function() { //批量删除
			window.parent.layer.confirm('确认删除？', {
				btnAlign: 'c',
				anim: 5,
				title: '提示',
				shade: [0.01, '#fff']
			}, function(index, layero) {
				app.post('archivesmodule/arcTbFile/deleteFiles', {
					fileIds: getCheckStatus()
				}, function(res) {
					if (res.state) {
						layui.table.reload('table_content', {});
						parent.layer.close(index);
					}
					parent.layer.msg(res.msg);
				})
			}, function(index) {
				parent.layer.close(index);
			});
		},
		batchReturn: function() { //批量归档
			var data = getCheckStatus();
		}
	};
	//新建档案
	$('#add_archive').on('click', function() {
		window.location.href = 'add-archive.html';
		// window.parent.addArchive();
	});
	//批量操作，根据自定义属性调用相应的函数
	$('.batch-operate').on('click', function() {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});
	//查询
	form.on('submit(saveSearchInfo)', function(res) {
		var data = res.field;
		info = {
			"map[fkTypeId]": data.department_id,
			'map[fkSecretId]': data.archiveLevel,
			'map[starttime]': data.starttime,
			'map[endtime]': data.endtime,
			'map[content]': data.searchWord,
			'field': 'fileNum',
			'sort': 'asc'
		};
		// mytable.init({
		//     id: "table_content",
		//     url: "archivesmodule/arcTbFile/selectFiles",
		//     pageCode: "file-admin",
		//     data: info
		// });
		var pattern = /[`^&% { } | ?]/im;
		if (!data.searchWord || data.searchWord && !pattern.test(data.searchWord)) {
			var url = 'archivesmodule/arcTbFile/selectFiles?map[starttime]=' + data.starttime +
				'&map[endtime]=' + data.endtime + '&map[fkTypeId]=' + data.department_id + '&map[fkSecretId]=' + data.archiveLevel +
				'&map[content]=' + data.searchWord;
			mytableinit(mytable, url);
		} else {
			layer.msg('查询条件不能包含特殊字符');
		}
		return false;
	});
});

// 初始化表格
function mytableinit(mytable, url) {
	var form = layui.form;
	var table = layui.table;
	var demoTable_height = $(".layui-form").outerHeight(true) + $(".btns").outerHeight(true) + 100;
	mytable.init({
			id: "table_content",
			pageCode: "file-admin",
			limit: 20,
			height: "full-" + demoTable_height + "",
			url: url,
			data: {
				field: 'fileNum',
				sort: 'asc'
			}
			// callback: function(){
			//     preview(".preview-file");
			// }
		})

		//  mytable.init({
		//     id: "table_content",
		//     url: "archivesmodule/arcTbFile/selectFiles",
		//     pageCode: "file-admin",
		//     data: {field: 'fileNum',sort:'asc'}
		// })
		.then(function(table) {
			// form.render('checkbox');
			//表格操作
			table.on('tool(table-operation)', function(obj) {
				var data = obj.data,
					selectId = data.id; //被选中行的id
				if (obj.event == 'edit') {
					if (data.state == 'ita') {
						layer.msg('档案归档中不能编辑！');
					} else {
						window.location.href = 'add-archive.html?id=' + selectId;
					}
				} else if (obj.event == 'applicate') {
					window.parent.layer.confirm('确认申请归档吗？', {
						btnAlign: 'c',
						anim: 5,
						title: '提示',
						shade: [0.01, '#fff']
					}, function(index, layero) {
						app.post('activity/start/startRegressFlow', {
							ids: selectId
						}, function(res) {
							if (res.state) {
								layui.table.reload('table_content', {});
								parent.layer.close(index);
							}
							parent.layer.msg(res.msg);
						})
					}, function(index) {
						parent.layer.close(index);
					});
				} else if (obj.event == 'del') {
					window.parent.layer.confirm('确认删除该档案吗？', {
						btnAlign: 'c',
						anim: 5,
						title: '提示',
						shade: [0.01, '#fff']
					}, function(index, layero) {
						app.post('archivesmodule/arcTbFile/deleteFile', {
							id: selectId
						}, function(res) {
							if (res.state) {
								layui.table.reload('table_content', {});
								parent.layer.close(index);
							}
							parent.layer.msg(res.msg);
						})
					}, function(index) {
						parent.layer.close(index);
					});
				}
			});
		});

}

function getCheckStatus() {
	var checkStatus = layui.table.checkStatus('table_content'),
		data = checkStatus.data,
		items = [];
	for (var key in data) {
		items.push(data[key].id);
	}
	return items;
}

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
//表格重载
function reloadTable(res) {
	if (res) {
		layer.msg(res.msg);
	}
	mytable.init({
		id: "table_content",
		url: "archivesmodule/arcTbFile/selectFiles",
		pageCode: "file-admin",
		data: {
			field: 'fileNum',
			sort: 'asc'
		}
	});
}

// 批量归档
$('#batchReturn').on('click', function() {
	var ids = getCheckStatus().join();
	if (ids !== '') {
		window.parent.layer.confirm('确认申请归档吗？', {
			btnAlign: 'c',
			anim: 5,
			title: '提示',
			shade: [0.01, '#fff']
		}, function(index, layero) {
			var loading = parent.layer.load(2); 
			app.post('stu/startStuRegressFlow', {
				ids: ids
			}, function(res) {
				parent.layer.close(loading);
				if (res.state) {
					layui.table.reload('table_content', {});
					parent.layer.close(index);
				}
				parent.layer.msg(res.msg);
			})
		}, function(index) {
			parent.layer.close(index);
		});
	} else {
		layui.layer.msg('请选择数据！！！');
	}
});

function firstRefresh() {
	$(".layui-laypage-skip input").val(1);
	$(".layui-laypage-btn")[0].click();
}

function testRefresh() {
	$(".layui-laypage-btn")[0].click();
}
