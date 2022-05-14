var setting, zTree
;(function (app, $, myztree) {
    myztree.set = function (url, data, callback) {
        /*ztree对象的配置数据-liuyuru*/
        setting = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
                selectedMulti: false,
                showLine: false,
                showIcon: true,
                addDiyDom: addDiyDom
            },
            edit: {
                enable: true, //单独设置为true时，可加载修改、删除图标
                editNameSelectAll: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            async: {
                enable: true
            },
            callback: {
                onClick: zTreeOnClick,
                onRightClick: zTreeRightClick,
                beforeEditName: beforeEditName, // 没有这个函数的，添加一个beforeEditName函数，里面return true;
                beforeRename: beforeRename,
                beforeRemove: beforeRemove,
                onRename: onRename
            }
        }
        app.get(url, data, callback)
    }
    myztree.RightClick = function (ztreeid, parenttitle, url, data, callback) {
        zTree = $.fn.zTree.getZTreeObj(ztreeid)
        layer.confirm(
            parenttitle,
            {
                btn: ['确认', '取消'], //按钮
                success: function () {
                    this.enterEsc = function (event) {
                        if (event.keyCode === 13) {
                            $('.layui-layer-btn0').click()
                            return false //阻止系统默认回车事件
                        }
                    }
                    $(document).on('keydown', this.enterEsc) //监听键盘事件，关闭层
                },
                end: function () {
                    $(document).off('keydown', this.enterEsc) //解除键盘关闭事件
                }
            },
            function (index, layero) {
                app.post(url, data, callback)
                layer.close(index)
            },
            function (index) {
                layer.close(index)
            }
        )
    }
    myztree.Remove = function (ztreeid, treeNode, url, callback) {
        zTree = $.fn.zTree.getZTreeObj(ztreeid)
        zTree.selectNode(treeNode)

        layer.confirm(
            '确认要删除当前节点（' + treeNode.name + ')吗？',
            {
                btn: ['确认', '取消'],
                success: function () {
                    this.enterEsc = function (event) {
                        if (event.keyCode === 13) {
                            $('.layui-layer-btn0').click()
                            return false //阻止系统默认回车事件
                        }
                    }
                    $(document).on('keydown', this.enterEsc) //监听键盘事件，关闭层
                },
                end: function () {
                    $(document).off('keydown', this.enterEsc) //解除键盘关闭事件
                }
            },
            function (index, layero) {
                var fromjson = {
                    id: treeNode.id
                }
                app.post(url, fromjson, callback)
                layer.close(index)
            },
            function (index) {
                layer.close(index)
            }
        )
    }

    /*角色管理绑定菜单的ztree对象的配置数据-yuqi*/
    myztree.setrole = function (url, data, callback) {
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
                addDiyDom: addDiyTriangle,
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
            check: {
                enable: true,
                autoCheckTrigger: true,
                nocheckInherit: false
            },
            callback: {
                onCheck: onCheck,
                onClick: zTreeOnClick
            }
        }
        app.get(url, data, callback)
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
            callback: {
                onClick: zTreeOnClick
            }
        }
        app.get(url, data, callback)
    }


    //档案管理----tangli
myztree.archiveSearch=function(url,data,callback){
    setting = {
        view: { selectedMulti: false, showLine: false, showIcon: true },
        check: { enable: false },
        data: {
            simpleData: { enable: true, idKey: "id", pIdKey: "fkParentId", rootPId: null },
            key: { name: "typeName" }
        },
        callback: { onClick: zTreeOnClick }
    };
    app.get(url,data,callback);
}



})(app, $, (window.myztree = {}))


/**
 * 自定义节点样式
 * @param treeId 树节点id
 * @param treeNode 树节点信息，包括节点的所有属性
 * @author yangsheng 2018/10/24
 */
function addDiyDom(treeId, treeNode) {
    const switchObj = $('#' + treeNode.tId + '_switch'), // 占位元素
        icoObj = $('#' + treeNode.tId + '_ico'), // 图标元素
        node = $('#' + treeNode.tId + '_span') // 节点元素

    icoObj.remove();
    if (!treeNode.children) {
        node.before(switchObj)
    }
}

/*YuQi*/
// function addDiyTriangle(treeId, treeNode) {
//     var editStr, btn
//     var aObj = $('#' + treeNode.tId + '_a')
//     if (treeNode.isParent) {
//         if ($('#diyBtn_' + treeNode.id).length > 0) return
//         editStr =
//             "<i class='layui-icon layui-icon-triangle-d icon-dericttion' style='color: #dcdcdc;position: absolute;padding-bottom:0;' id='" +
//             'diyBtn_' +
//             treeNode.tId +
//             "'></i></button>"
//         aObj.append(editStr)
//         btn = $('#diyBtn_' + treeNode.tId)
//         aObj.dblclick(function () {
//             btn.toggleClass('change-icon-dericttion')
//         });
//     }
// }

function beforeEditName() {
    return true
}

/* yuqi*/

//点击展开节点
function zTreeOnClick(event, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(treeId)
    zTree.expandNode(treeNode)
    var typeValue,
        sNodes = zTree.getSelectedNodes();
    //根据树所在的div来判断被点击的节点名称应该放在哪个input
    var oInput = $('input[name="fileType"]')
    typeValue = sNodes[0].name
    oInput.val(typeValue)
    oInput.attr('id', sNodes[0].id)
    if(!sNodes[0].isParent){
        $('#show_type_tree').hide()
    }
    window.event.stopPropagation();
    // console.log(clicknodeId)
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
