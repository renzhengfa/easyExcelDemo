var cpLock = false;

/**
 * 搜索方法
 * @param nodes 传入节点
 * @author yangsheng
 */
function searchFileModel(nodes) {
    var oText = document.getElementById('search');
    var treeObj = $.fn.zTree.getZTreeObj('treeDemo');

    oText.addEventListener('keydown', function (e) {
        if (e.keyCode == 13) {
            var keyWord = oText.value;
            searchByRegExp(keyWord, nodes)
        }
    });

    $('#search').on('compositionstart', function () {
        cpLock = true;
        console.log('不搜索')
    });

    $('#search').on('compositionend', function () {
        cpLock = false;
        console.log('汉字搜索');
        var keyWord = oText.value;
        searchByRegExp(keyWord, nodes)
    });

    $('#search').on('input', function () {
        cpLock = false;
        console.log('字母搜索');
        var keyWord = oText.value;
        searchByRegExp(keyWord, nodes)
    });

    function searchByRegExp(keyWord, nodes) {
        var len = nodes.length;
        var arr = [];
        var reg = new RegExp(keyWord);

        if (reg != '/(?:)/') {
            // 递归，找它的父节点，直到根节点
            for (var i = 0; i < len; i++) {
                //如果字符串中不包含目标字符会返回-1
                if (nodes[i].name.match(reg)) {
                    arr.push(nodes[i])
                    ;(function findPnodes(node) {
                        for (let k = 0; k < len; k++) {
                            if (nodes[k].id === node.pId) {
                                // 找到节点的父节点
                                arr.push(nodes[k])
                            } else if (node.id === nodes[k].pId) {
                                // 找到子节点
                                arr.push(nodes[k]);
                                findPnodes(nodes[k])
                            }
                        }
                    })(nodes[i])
                }
            }

            var r = [];
            for (var m = 0; m < arr.length; m++) {
                for (var n = m + 1; n < arr.length; n++) {
                    if (arr[m] === arr[n]) ++m
                }
                r.push(arr[m])
            }
        } else {
            r = nodes
        }
        $.fn.zTree.init($('#treeDemo'), setting, r);
        treeObj.expandAll(true) // 默认展开
    }
}

function getIframe(id) {
    return document.getElementById(id).contentWindow.document;
}

layui.use(['upload'], function () {
    var upload = layui.upload;

    var uploadIns = upload.render({
        elem: '#uploadWord',
        url: window.imgurl + 'filemodule/file/wordUpload',
        accept: 'file',
        auto: false,
        bindAction: '#upload',
        exts: 'doc|docx',
        data: {
            fileUrlName: '/upload/ArcFileType/word'
        },
        before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        // choose: function(obj){
        //     var file = document.getElementsByClassName("layui-upload-file")[0].value;
        //     $('input[name="wordTplAddress"]').val(file)
        // },
        // done: function (res) {
        //     // var file = document.getElementsByClassName("layui-upload-file")[0].value;
        //     // console.log(res)
        //     if (res.state) {
        //         $('.warn-msg').hide();
        //         // $('input[name="wordTplAddress"]').val(res.row);
        //     } else {
        //         $('.warn-msg').show()
        //     }
        //     layer.msg(res.msg)
        // },
        // error: function () {
        //     $('.warn-msg').show()
        // }
    })
});
// 'use strict';
// function ArchiveModel(...arg) {
//     if(!(this instanceof ArchiveModel)){
//         return new ArchiveModel(...arg);
//     }
//     this.argArr = arg;
// }
//
// ArchiveModel.prototype.Node = {
//     search: function(){
//
//     },
//     getData: function () {
//         var labelData = ['借阅流程', '销毁流程', '移交流程', '归档流程'];
//         var ele = '';
//         var process = $('#process');
//         process.empty();
//         var options = '';
//         for (var i = 0; i < labelData.length; i++) {
//             var res = app.asyncGet('activitymodule/actReModel/selectDeployByFlowType', {id: i + 2});
//             if (res.state) {
//                 options = '';
//                 var data = res.rows;
//                 if (data.length > 0) {
//                     for (var j = 0; j < data.length; j++) {
//                         options += `<option value="${data[j].flowId}">${
//                             data[j].flowName
//                             }</option>`
//                     }
//                 }
//                 ele += `<div class="layui-inline">
//                     <label class="layui-form-label ${i + 1}">${labelData[i]}:</label>
//                     <div class="layui-input-block">
//                         <select name="liucheng">
//                             ${options}
//                         </select>
//                     </div>
//                 </div>
// `
//             }
//         }
//         process.append(ele);
//         layui.form.render();
//     },
// }