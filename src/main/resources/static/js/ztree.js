/**
 * myztree侧边树形图 --treeDemo(ul的id)
 * data 数据json;treeNodes形成的节点数据;setting配置数据(可以自己传入配置);isexpanAll(true表示打开，false表示折叠)
 * 调用ztree，menuform()刷新，myztreebind()方法必须存在
 * liuyuru
 */
(function(app, $, myztree) {
	/*ztree数据显示-liuyuru*/
	myztree.show = function(data, treeNodes, setting, isexpanAll) {
		$(document).ready(function() {
			var setvalue=setting;
			if(!setvalue){
				/*ztree对象的配置数据-liuyuru*/
			setvalue = {
				view: {
					addHoverDom: myztree.addHoverDom,//调用页对应存在myztreebind()方法
					removeHoverDom: myztree.removeHoverDom,
					selectedMulti: false,
					showLine: false,
					showIcon: true,
					addDiyDom: myztree.addDiyDom
				},
				edit: {
					enable: true, //单独设置为true时，可加载修改、删除图标
					editNameSelectAll: true,
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				async: {
					enable: true,
				},
				callback: {
					onClick: myztree.zTreeOnClick,/*单击事件查询菜单-liuyuru*/
					onRightClick: zTreeRightClick,//调用页存在方法
					beforeRename: myztree.beforeRename,
					beforeRemove: beforeRemove, //调用页存在方法
					onRename: onRename   //调用页存在方法
				}
			};
			}
			$.fn.zTree.init($("#treeDemo"), setvalue, treeNodes);
			var treeObj = $.fn.zTree.getZTreeObj("treeDemo");

			// if (!isexpanAll) {
			// 	isexpanAll = true;
			// }
			treeObj.expandAll(isexpanAll); //打开节点
			console.log(data);
			if (data && treeNodes) {
				postId = data[0].id === undefined ? data[0].id : 0;
				if (postId) {
					var treeNode = treeObj.getNodeByTId("treeDemo_1");
					var node = treeObj.getNodeByParam("id", postId, null); //根据新的id找到新添加的节点
					treeObj.selectNode(node); //让新添加的节点处于选中状态
					menuform(postId, treeNode);//调用页存在方法
				}
			}
		});
	}
	myztree.zTreeOnClick = function(event, treeId, treeNode) {
		postId = treeNode.id;
		menuform(postId, treeNode)
	}
	myztree.RightClick = function(treeNode, url, data,bind) {
		treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		var parenttitle
		if (treeNode) {
			parenttitle = "是否新增节点？";
		} else {
			parenttitle = "是否新增父节点？";
		}
		myztree.layerconfirm(parenttitle, url, data, function(msg) {
			if (msg.state == true) {
				var newID = msg.row; //获取新添加的节点Id
				var newpId;
				if (bind) {
					var switchObj = $("#" + treeNode.tId + "_switch"), // 占位元素
						icoObj = $("#" + treeNode.tId + "_ico"); // 图标元素
					var sObj = $("#" + treeNode.tId + "_span"); //获取节点信息
					if (!treeNode.children) {
						sObj.before(icoObj);
					}
				}
				if (treeNode) {
					newpId = treeNode.id;
				} else {
					newpId = 0;
				}
				treeObj.addNodes(treeNode, {
					id: newID.id,
					pId: newpId,
					name: "NewNode"
				});
				var node = treeObj.getNodeByParam("id", newID.id, null); //根据新的id找到新添加的节点
				//			treeObj.selectNode(node); //让新添加的节点处于选中状态
				treeObj.editName(node);
				menuform(newID.id, treeNode);
			}
			layer.msg(msg.msg);
		});
	};
	myztree.Remove = function(treeNode, treeNode, url, callback) {
		treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		treeObj.selectNode(treeNode);
		var parenttitle = "确认要删除当前节点（" + treeNode.name + "）吗？";
		var fromjson = {
			id: treeNode.id,
		};
		myztree.layerconfirm(parenttitle, url, fromjson, callback);
	};
	myztree.removeHoverDom = function(treeId, treeNode) {
		$("#addBtn_" + treeNode.tId).unbind().remove();
	};
	myztree.addHoverDom = function(treeId, treeNode) {
		if (treeNode.level < 2) {
			//			var switchObj = $("#" + treeNode.tId + "_switch"), // 占位元素
			//				icoObj = $("#" + treeNode.tId + "_ico"); // 图标元素
			var sObj = $("#" + treeNode.tId + "_span"); //获取节点信息
			if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;

			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='add node' onfocus='this.blur();'></span>";
			sObj.after(addStr); //加载添加按钮
			var btn = $("#addBtn_" + treeNode.tId);

			//绑定添加事件，并定义添加操作 需操作的调用页就必须存在该事件
			myztreebind(btn, treeNode);
		}
	};
	// 默认选中第一个节点
    myztree.oneclick = function (postId) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");//获取ztree对象
        var node = zTree.getNodeByParam('id', postId);//获取id为1的点
        zTree.selectNode(node);//选择点
        zTree.setting.callback.onClick(null, zTree.setting.treeId, node);//调用事件
    };
	/*修改菜单判断-liuyuru*/
	myztree.beforeRename = function(treeId, treeNode, newName, isCancel) {
		if (newName.length == 0) {
			layer.msg("名称不能为空!");
			return false;
		}
		return true;
	}
	myztree.addDiyDom = function(treeId, treeNode) {
		var switchObj = $("#" + treeNode.tId + "_switch"), // 占位元素
			icoObj = $("#" + treeNode.tId + "_ico"), // 图标元素
			sObj = $("#" + treeNode.tId + "_span"); //获取节点信息
		if (!treeNode.children) {
			sObj.before(switchObj);
		}
	}
	myztree.layerconfirm = function(parenttitle, url, data, callback) {
		window.parent.layer.confirm(parenttitle, {
			btnAlign: 'c',
			anim: 5,
			title: '提示',
		}, function(index, layero) {
			app.post(url, data, callback);
			parent.layer.close(index);
		}, function(index) {
			parent.layer.close(index);
		});
	}
    /*新建档案档案类型选择的ztree对象的配置数据-yuqi*/
    myztree.setfiletype = function (url, data, callback) {
        setting = {
            view: {
                selectedMulti: false,
                showLine: false,
                showIcon: false,
                fontCss: {
                    color: '#333333',
                    'font-size': '15px'
                },
                dblClickExpand: false, //屏蔽掉双击事件
                // addDiyDom: addDiyTriangle,
                expandSpeed: ''
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            async: {
                enable: true
            },
            // check: {
            //     enable: true,
            //     autoCheckTrigger: false,
            //     nocheckInherit: false
            // },
            callback: {
                // onCheck: onCheck,
                onClick: filetypeOnClick
                // addNodes:addNodes
            }
        }
        app.get(url, data, callback)
    }
}(app, $, window.myztree = {}));
function filetypeOnClick(event, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(treeId)
    zTree.expandNode(treeNode)
    var typeValue,
        sNodes = zTree.getSelectedNodes();

    //根据树所在的div来判断被点击的节点名称应该放在哪个input
    var oInput = $('input[name="moduleType"]')
    typeValue = sNodes[0].name
    oInput.val(typeValue)
    oInput.attr('id', sNodes[0].id)
    if(!sNodes[0].isParent){
        $('#show_module_type_tree').hide()
    }
    window.event.stopPropagation();
    // var showTypeTree = $('#show_type_tree').css('display')
    // var showModuleTypeTree = $('#show_module_type_tree').css('display')
    // if (showTypeTree !== 'none') {
    //     if (!sNodes[0].isParent) {

    //     // $('#show_type_tree').hide()
    //     }else{
    //     window.event.stopPropagation();
    //     }
    // }
    // if (showModuleTypeTree !== 'none') {
    //     if (!sNodes[0].isParent) {
    //         var oInput = $('input[name="moduleType"]')
    //         typeValue = sNodes[0].name
    //         oInput.val(typeValue)
    //         oInput.attr('id', sNodes[0].id)
    //     } else {
    //         window.event.stopPropagation();
    //     }
    // }
}
