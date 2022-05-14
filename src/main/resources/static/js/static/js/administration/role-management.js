/**
 * @author yuqi
 * @description 角色管理
 */
var clearFlag = false,
    selectedRoleId;
$(function (mytable) {
        layui.use(['table', 'layer', 'form'], function () {
            var table = layui.table,
                form = layui.form,
                layer = layui.layer,
                //绑定操作时，复选框被选选中的id数组
                permissionIdArray = [],
                menuIdArray = [],
                elemIdArray = [],
                formLayer = $('#edit_info_form');
            getMenuBar();//自定义面包屑，引用public-menu.js
            // var index = layer.load(1, {
            //     shade: [0.1, '#fff'] //0.1透明度的白色背景
            // });
            form.render();
            mytable.init({
                id: 'table_content',
                url: 'authmodule/authTbRole/selectRoles',
                pageCode: 'role-admin',
                data: {field: 'create_time'}
            }).then(function (table) {
                table.on("tool(control)", function (obj) {
                    var data = obj.data;
                    if (obj.event === "delete") {
                        layer.confirm(
                            `是否删除？`,
                            { shade: 0 },
                            function (index) {
                                app.get(
                                    "authmodule/authTbRole/deleteUserRole",
                                    {
                                        id: data.id,
                                    },
                                    function (msg) {
                                        if (msg.code == 1) {
                                            layer.msg("删除成功");
                                            Search();
                                        } else {
                                            layer.msg(msg.msg);
                                        }
                                    }
                                );
                            }
                        );
                    }
                });
            });

            //绑定元素一级菜单点击事件
            $('.bind-element-first-level-menu').on('click', function () {
                //三角标的旋转
                $(this).children().eq(1).toggleClass('change-icon-dericttion');
                $(this).siblings().toggle()
            });

            var elementTwoMenuId;
            //监听绑定元素弹出层上的复选框
            form.on('checkbox(check-element)', function (data) {
                var isSelectedElem = data.elem;
                if (isSelectedElem.checked) {
                    elemIdArray.push(parseInt(isSelectedElem.id))
                } else {
                    elemIdArray = removeArrayVal(elemIdArray, parseInt(isSelectedElem.id))
                }
                // console.log(elemIdArray);
            });

            //保存绑定菜单
            // $('#save_bind_menu').on('click', function () {
            //     var treeObj = $.fn.zTree.getZTreeObj('bind_menu_tree');
            //     //获取被勾选节点的集合
            //     var nodes = treeObj.getCheckedNodes(true);
            //     var ids = [];
            //     for (var i = 0, len = nodes.length; i < len; i++) {
            //         ids.push(nodes[i].id);
            //     }
            //     // console.log(nodes);
            //     // console.log(ids);
            //     var info = {
            //         roleId: selectedRoleId,
            //         ids: ids
            //     };
            //     app.post('authmodule/AuthTbMenu/updateRoleMenu', info, function (res) {
            //         layer.msg(res.msg);
            //         resetLayer('.bind-menu-form-title', '.bind-menu-submenu');
            //         $('#bind_menu_form').hide()
            //     });
            //     return false
            // });
            //
            // //保存元素的绑定
            // $('#save_bind_element').on('click', function () {
            //     var info = {
            //         fkRoleId: selectedRoleId,
            //         fkPageId: elementTwoMenuId,
            //         fkElementIds: elemIdArray
            //     };
            //     app.post('authmodule/AuthFkRolePage/add', info, function (res) {
            //         // console.log(res.msg);
            //         layer.msg(res.msg);
            //         $('#element_area').empty();
            //         elemIdArray.length = 0
            //     })
            // });

            //按下回车键搜索
            var searchWord, selectValue;
            $('#search_word').bind('keydown', function (event) {
                if (event.keyCode == '13') {
                    Search();
                }
            });

            // 点击查询按钮搜索
            $('#search_btn').on('click', function () {
                Search();
            });

            //点击查询时或者按下回车键触发的事件
            function Search() {
                searchWord = $('#search_word').val();
                selectValue = $('select[name="default"]').val();
                // console.log(xx);
                var pattern = /[`^&% { } | ?]/im;
                if(!searchWord||  searchWord && !pattern.test(searchWord)) { 
                    mytable.init({
                        id: 'table_content',
                        url: 'authmodule/authTbRole/selectRoles',
                        pageCode: 'role-admin',
                        data:{
                            'map[content-like]': searchWord,
                            'map[isDefault]': selectValue,
                            'field': 'create_time'
                        }
                    });
            }else {
                layer.msg('查询条件不能包含特殊字符');
            }
            }

            //校验角色名称
            $('input[name="roleName"]').on('change', function () {
                var rolecode = $(this).val();
                if (rolecode.length > 10) {
                    layer.msg('角色名称长度不能超过10个字符！')
                } else if (!rolecode.length) {
                    layer.msg('角色名称长度必须大于1个字符！')
                } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(rolecode)) {
                    layer.msg('角色名称只能输入汉字，数字，字母！')
                }
            });

            //校验角色编码是否重复
            $('input[name="roleCode"]').on('change', function () {
                var rolecode = $(this).val();
                if (selectedRoleId === undefined) {
                    selectedRoleId = null
                }
                var info = {
                    id: selectedRoleId,
                    roleCode: rolecode
                };
                if (!/(.+){2,12}$/.test(rolecode)) {
                    layer.tips('角色编码必须2-12个字符！',$('input[name="roleCode"]'))
                } else if (/[^\w\/]/gi.test(rolecode)) {
                    layer.msg('角色编码只能输入字母和数字！')
                } else {
                    app.get('authmodule/authTbRole/testRoleCodeIfExist', info, function (res) {
                        if (!res.state) {
                            layer.msg(res.msg)
                        }
                    })
                }
            });

            /**
             * @author yuqi
             * @param ele 弹出层显示的内容
             * @param size 弹出层大小
             * @param title 自定义弹出层标题
             * @param callback 右上角取消事件
             *
             */
            //弹出层
            // function Popup(ele, size, title, callback) {
            //     layer.open({
            //         type: 1,
            //         content: ele,
            //         area: size,
            //         offset: 'auto',
            //         title: title,
            //         resize: false,
            //         shade: false,
            //         cancel: function () {
            //             ele.hide()
            //             callback
            //         }
            //     })
            // }

            //重置表单
            function resetForm() {
                //表单初始赋值
                form.val('edit-info-form', {
                    roleName: '',
                    roleCode: '',
                    isDefault: '0'
                })
            }

            //绑定权限和绑定菜单点击保存或者取消后的点击事件
            /**
             * @author:yuqi
             * @param class1:弹出层标题的类
             * @param class2:二级菜单的类
             */
            // function resetLayer(class1, class2) {
            //     var title = $(class1);
            //     layer.closeAll();
            //     //移除一级菜单上让三角形旋转的类
            //     for (var i = 0, len = title.length; i < len; i++) {
            //         title
            //             .eq(i)
            //             .children()
            //             .eq(1)
            //             .removeClass('change-icon-dericttion')
            //     }
            //     //复选框区域隐藏
            //     title.next().css('display', 'none');
            //     //被选复选框数组清零
            //     if (class1 === '.bind-permission-form-title') {
            //         permissionIdArray.length === 0;
            //     } else {
            //         menuIdArray.length === 0;
            //     }
            //     // 清除复选框
            //     $(class2).attr('checked', false)
            // }

            // //绑定元素取消时的事件
            // function cancelBindElement() {
            //     layer.closeAll();
            //     //隐藏弹出层上的内容div
            //     $('#bingd_element').hide();
            //     //清空复选框id数组
            //     elemIdArray.length = 0;
            //     // 清空左栅格中的菜单和右栅格中的复选框
            //     $('#menu_area').empty();
            //     $('#element_area').empty();
            // }
        })
}(mytable));

/* 以下三个函数为绑定菜单树形菜单用到的函数*/
function onCheck(e, treeId, treeNode) {
    var id = e.target.id;
    count(id);
    if (clearFlag) {
        clearCheckedOldNodes(id)
    }
}

function clearCheckedOldNodes(id) {
    var zTree = $.fn.zTree.getZTreeObj(id),
        nodes = zTree.getChangeCheckedNodes();
    for (var i = 0, l = nodes.length; i < l; i++) {
        nodes[i].checkedOld = nodes[i].checked
    }
}

function count(id) {
    var zTree = $.fn.zTree.getZTreeObj(id),
        checkCount = zTree.getCheckedNodes(true).length,
        nocheckCount = zTree.getCheckedNodes(false).length,
        changeCount = zTree.getChangeCheckedNodes().length;
    $('#checkCount').text(checkCount);
    $('#nocheckCount').text(nocheckCount);
    $('#changeCount').text(changeCount);
}

//渲染表格
function initTable() {
    mytable.init({
        id: 'table_content',
        url: 'authmodule/authTbRole/selectRoles',
        pageCode: 'role-admin',
        data: {field: 'create_time'}
    }).then(function (table) {
            layer.closeAll('loading')
    })
}

function firstRefresh() {
    $(".layui-laypage-skip input").val(1);
    $(".layui-laypage-btn")[0].click();
}

function testRefresh() {
    $(".layui-laypage-btn")[0].click();
}