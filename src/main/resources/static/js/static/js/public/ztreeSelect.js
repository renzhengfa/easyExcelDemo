function treeDiv(treeId, treeDivId, inputId, inputHideId, treeNodes, data,selectclick,treeDemo) {
    var setting = {
        view: {
            selectedMulti: false,
            showLine: false,
            showIcon: true,
            expandSpeed: "",
            // addDiyDom: myztree.addDiyDom
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
            onClick: zTreeOnClick,/*单击事件查询菜单-liuyuru*/
        }
    };
    myztree.show(data, treeNodes, setting, true);
    selectclick;
    function zTreeOnClick(event, treeId, treeNode) {
        $("#" + treeDivId).css("display", "none");
        $("#" + inputId).val(treeNode.name);
        $("#" + inputHideId).val(treeNode.id);
        selectclick();
    };
    $("#" + treeDivId).toggle();
    menuform(treeDivId, inputHideId,treeDemo);
}
function treeCheck(treeId, treeDivId, inputId, inputHideId, treeNodes, data,selectclick) {
    var setting = {
        view: {
            selectedMulti: false,
            showLine: false,
            showIcon: true,
            expandSpeed: "",
            // addDiyDom: myztree.addDiyDom
        },
        check: {
            enable: true,
            autoCheckTrigger: true,
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
            // onClick: zTreeOnClick,/*单击事件查询菜单-liuyuru*/
            onCheck: zTreeOnCheck
        }
    };
    myztree.show(data, treeNodes, setting, true);
    var inputvalue=[],inputArr=[];
    function zTreeOnCheck(event, treeId, treeNode) {
        // alert(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
        if(treeNode.checked==true && treeNode.level!=0){
            inputvalue.push(treeNode.name);
            inputArr.push(treeNode.not)
            $("#" + inputId).val(inputvalue.join());
            $("#" + inputHideId).val(inputArr);
        }else if(treeNode.checked==false && treeNode.level!=0){
            var index = inputvalue.indexOf(treeNode.name);
            if (index > -1) { 
                inputArr.splice(index, 1);
                inputvalue.splice(index, 1)
            }
            $("#" + inputId).val(inputvalue.join());
            $("#" + inputHideId).val(inputArr);
        }
    };
}
function menuform(treeDivId, inputHideId,treeDemo) {
    // $('.wsdButton').click();
    var id;
    var treeObj;
    if(treeDemo){
        treeObj = $.fn.zTree.getZTreeObj("treeDemo1");
        id = $("#department_id1").val();
    }else{
        treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        id = $("#department_id").val();
    }
    var node = treeObj.getNodeByParam("id", id, null); //根据新的id找到新添加的节点
    treeObj.selectNode(node); //让新添加的节点处于选中状态
    $(document).bind("click", function (e) {
        var target = $(e.target);
        if (target.closest("#ztreeSelect").length == 0) {
            $("#" + treeDivId).hide();
        }
    })
}
