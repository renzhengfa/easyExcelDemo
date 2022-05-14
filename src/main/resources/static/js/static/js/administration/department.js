var postId;
$(function(mytable,myztree){
	layui.use(['layer','form'],function(){
		var layer=layui.layer;
		var form=layui.form;
	});
    getMenuBar();
	/*查询部门-liuyuru*/
	app.get("authmodule/AuthTbDepartment/selectByType", "", function(msg) {
		if (msg.state) {
			var data = msg.rows;
			/*ztree树状图的数据结构-liuyuru*/
			var treeNodes = [];
            for(var key in data) {
                treeNodes[key] = {};
                treeNodes[key]['id'] = data[key].id;
				treeNodes[key]['name'] = data[key].sname;
				treeNodes[key]['pId'] = data[key].parentId;
			}
			myztree.show(data, treeNodes, "", true);
			postId=msg.rows[0].id;
            myztree.oneclick(postId);
		} else {
			layer.msg(msg.msg);
		}
	});

}(mytable,myztree));
function menuform(postId, treeNode) {
	tableRefresh( {id: postId});
}
/*ztree新增节点图标绑定事件-liuyuru*/
function myztreebind(btn, treeNode) {
	if (btn) btn.bind("click", function() {
		var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		//将新节点添加到数据库中
		var fromjson = {
			parentId: treeNode.id,
			sname: 'NewNode'
		}
		myztree.RightClick(treeNode, "authmodule/AuthTbDepartment/add", fromjson, "bind");
	});
}
function firstRefresh(){
	$(".layui-laypage-skip input").val(1);
	try {
		$(".layui-laypage-btn")[0].click();
	} catch (error) {
		$(".curSelectedNode").click();
	}
}
function testRefresh(){
	$(".layui-laypage-btn")[0].click(); 
}
function tableRefresh(datajson){
	datajson.field="create_time";
	mytable.init({
		id:"depart-post",url:"authmodule/AuthTbDepartment/selectById",pageCode:"department.html",limit:"20",height:"full-140",data:datajson
	}).then(function(table){});
}
/*ztree右键事件新增节点-liuyuru*/
function zTreeRightClick(event, treeId, treeNode){
	//将新节点添加到数据库中
	var parentvalue;
	if(treeNode){
		parentvalue=treeNode.id;
	}else{
		parentvalue=0;
	}	
	var fromjson={
		parentId:parentvalue,
		sname:'NewNode'
	}
	myztree.RightClick(treeNode, "authmodule/AuthTbDepartment/add", fromjson);
}

/*确认修改部门-liuyuru*/
function onRename(e, treeId, treeNode, isCancel) {
		var fromjson={
			id:treeNode.id,
			sname:treeNode.name
		}
		app.post('authmodule/AuthTbDepartment/update',fromjson,function (data) {
			if(data.state){
				postId = treeNode.id;
			menuform(postId, treeNode);
			}
			layer.msg(data.msg);
		});
}
/*删除部门-liuyuru*/
function beforeRemove(treeId, treeNode) {
	var flag=false;//此处必须定义一个变量，不然还没确定就把节点从树上删除
	myztree.Remove("treeDemo",treeNode,'authmodule/AuthTbDepartment/deleteId',function (data) {
		if(data.state){
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
