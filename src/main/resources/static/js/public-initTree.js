// $(function(){
//     initTree('select');
// });
function initTree(value) {
    var treeNodes = [];
    app.get("archivesmodule/arcTbArcType/selectAll", '', function (msg) {
        if (msg.state) {
            var data = msg.rows;
            if (value) {
                $("#department_name").val("全部");
                $("#department_id").val("");
                // $('#btnyear').click();
            } else {
                /*ztree树状图的数据结构-liuyuru*/
                treeNodes[0] = {};
                treeNodes[0]['id'] = "";
                treeNodes[0]['name'] = "全部";
                treeNodes[0]['pId'] = "";
                for (var key in data) {
                    var numkey=parseInt(key)+1;
                    treeNodes[numkey] = {};
                    treeNodes[numkey]['id'] = data[key].id;
                    treeNodes[numkey]['name'] = data[key].typeName;
                    treeNodes[numkey]['pId'] = data[key].fkParentId;
                }
                treeDiv("departmentTree", "departmentTreeDiv", "department_name", "department_id", treeNodes, data,function selectclick(){
                    return false;
                });
                return treeNodes;
            }
        } else {
            console.log(msg.msg)
        }
    });
}
function initTree1(value,funSelect) {
    var treeNodes = [];
    app.getAsync("archivesmodule/arcTbArcType/selectAll", '', function (msg) {
        if (msg.state) {
            var data = msg.rows;
            if (value) {
                $("#department_name").val(data[0].typeName);
                $("#department_id").val(data[0].id);
                $('#btnyear').click();
            } else {
                /*ztree树状图的数据结构-liuyuru*/
                for (var key in data) {
                    treeNodes[key] = {};
                    treeNodes[key]['id'] = data[key].id;
                    treeNodes[key]['name'] = data[key].typeName;
                    treeNodes[key]['pId'] = data[key].fkParentId;
                }
                treeDiv("departmentTree", "departmentTreeDiv", "department_name", "department_id", treeNodes, data,function selectclick(){
                    if(funSelect){
                        var btnid=$(".wsdButton").attr("id");
                        $("#"+btnid).click();
                        return false;
                    }else{
                        return false;
                    }
                });
            }
        } else {
            console.log(msg.msg)
        }
    });
}