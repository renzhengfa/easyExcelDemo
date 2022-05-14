var curMenu = null,
    zTree_Menu = null;
var form, postId;
$(function (myztree) {
        layui.use(['layer', 'form', 'upload'], function () {
            var layer = layui.layer,
                form = layui.form,
                upload = layui.upload;
            getMenuBar();//自定义面包屑，引用public-menu.js
            var load = layer.load(1, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            //监听提交
            form.on('submit(formDemo)', function (data) {
                var fieldjson = data.field;
                var fromjson = {
                    id: postId,
                    menuName: fieldjson.name,
                    herf: fieldjson.URL,
                    disabled: fieldjson.disabled
                };
                app.post('authmodule/AuthTbMenu/update', fromjson, function (data) {
                    if (data.state) {
                        ztreeRefresh()
                    }
                    layer.msg(data.msg)
                });
                return false
            });
            ztreeRefresh()
        })
    }(myztree));

function ztreeRefresh() {
    var setting = {
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
            editNameSelectAll: true,
            renameTitle: 'edit node'
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
            beforeEditName: beforeEditName, // 没有这个函数的，添加一个beforeEditName函数，里面return true;
            beforeRemove: beforeRemove,
            onRightClick: zTreeRightClick//调用页存在方法
        }
    };

    /*查询菜单-liuyuru*/
    app.get('archivesmodule/arcTbArcType/selectAll', '', function (msg) {
        layer.closeAll('loading')
        $('.bodyheader').css('display', 'block')
        $('.layui-layout-admin').css('display', 'block')
        if (msg.state) {
            var value = msg.rows;
            /*ztree树状图的数据结构-liuyuru*/
            var treeNodes = [];
            for (var key in value) {
                treeNodes[key] = {};
                treeNodes[key]['id'] = value[key].id;
                treeNodes[key]['name'] = value[key].typeName;
                treeNodes[key]['pId'] = value[key].fkParentId;
                treeNodes[key]['info'] = value[key].typeInfo
                treeNodes[key]['wordTplAddress'] = value[key].wordTplAddress
            }
            myztree.show(value, treeNodes, setting, true);
        } else {
            layer.msg(msg.msg)
        }
    })
}

window.node = null;
window.flag = false;

function addDiyDom(treeId, treeNode) {
    const switchObj = $('#' + treeNode.tId + '_switch'), // 占位元素
        node = $('#' + treeNode.tId + '_span'); // 节点元素
    // icoObj.remove();
    if (!treeNode.children) {
        node.before(switchObj)
    }
}

//点击展开节点
function onClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.expandNode(treeNode);
    return false
}

function menuform(postId, treeNode) {}

/*ztree右键事件新增节点-liuyuru*/
function zTreeRightClick(event, treeId, treeNode) {
    //将新节点添加到数据库中
    window.node = treeNode;
    window.flag = false;
    var parentvalue;
    if (treeNode) {
        parentvalue = treeNode.id;
    } else {
        parentvalue = 0;
    }
    var fromjson = {
        fkParentId: parentvalue,
        menuName: 'NewNode'
    };
    if (treeNode) {
        return false;
    } else {
        var modaljump =$('.modaljump');
        modaljump.attr('data-title', '新增父节点');
        modaljump.attr('action', 'archivesmodule/arcTbArcType/insert');
        modaljump.trigger('click');
    }
}

/*单击事件查询菜单-liuyuru*/
function zTreeOnClick(event, treeId, treeNode) {
    window.uploadId = treeNode.id;
    window.page = 'archiveModel';
    app.get(
        'archivesmodule/arcTbArcType/selectOne',
        {
            id: treeNode.id
        },
        function (res) {
            var iframe = getIframe('myIframe').getElementsByClassName('demo'); // 父页面获取iframe里面的dom元素
            iframe[0].innerHTML = '';
            if (res.state) {

                iframe[0].innerHTML = res.row.htmlTpl;
                document.getElementById('myIframe').contentWindow.layui.form.render();
                document.getElementById('myIframe').contentWindow.initDrag();
            }
        }
    )
}

function chageTextarea(res) {
    var html = $(res).get(0);
    // html.
}

function addHoverDom(treeId, treeNode) {
    if (treeNode.level < 2) {
        var sObj = $('#' + treeNode.tId + '_span'); //获取节点信息
        if (treeNode.editNameFlag || $('#addBtn_' + treeNode.tId).length > 0) return;

        var addStr =
            "<span class='button add' id='addBtn_" +
            treeNode.tId +
            "' title='add node' onfocus='this.blur();'></span>";
        sObj.after(addStr);//加载添加按钮
        var btn = $('#addBtn_' + treeNode.tId);

        //绑定添加事件，并定义添加操作
        if (btn)
            btn.bind('click', function () {
                $('input[name="typeName"]').val('');
                $('input[name="wordTplAddress"]').val('');
                $('textarea[name="typeInfo"]').val('');
                var zTree = $.fn.zTree.getZTreeObj('treeDemo');
                window.node = treeNode;
                window.flag = false;
                var modaljump =$('.modaljump');
                modaljump.attr('data-title', '新增节点');
                modaljump.attr('action', 'archivesmodule/arcTbArcType/insert');
                modaljump.trigger('click');
            })
    }
}

function removeHoverDom(treeId, treeNode) {
    $('#addBtn_' + treeNode.tId)
        .unbind()
        .remove()
}

function beforeEditName(treeId, treeNode) {
    window.node = treeNode;
    window.flag = true;
    var modaljump =$('.modaljump');
    modaljump.attr('data-title', '编辑节点');
    modaljump.attr('action', 'archivesmodule/arcTbArcType/update');
    modaljump.trigger('click');

    return false
}

/*删除菜单-liuyuru*/
function beforeRemove(treeId, treeNode) {
    var flag = false; //此处必须定义一个变量，不然还没确定就把节点从树上删除
    myztree.Remove("treeDemo", treeNode, 'archivesmodule/arcTbArcType/delete', function (data) {
        if (data.state) {
            flag = true;
            treeObj.removeNode(treeNode); //删除当前节点
            var menureset = document.getElementById("menuform-reset");
            if (menureset) {
                menureset.reset();
            }
            layui.form.render();
        }
        layer.msg(data.msg);
    });
    return flag;
}

/*修改菜单判断-liuyuru*/
function beforeRename(treeId, treeNode, newName, isCancel) {
    if (newName.length == 0) {
        layer.msg('名称不能为空!');
        return false
    }
    return true
}

/*确认修改菜单-liuyuru*/
function onRename(e, treeId, treeNode, isCancel) {
    return false
}

function testRefresh(){
    ztreeRefresh();
}
function firstRefresh(){
    ztreeRefresh();
}