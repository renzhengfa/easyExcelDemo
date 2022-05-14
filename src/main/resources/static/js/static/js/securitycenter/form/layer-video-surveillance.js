/**
 * @author chentong
 * @description 视频监控弹框
 */
function formVoluation(selectId) {
  console.log(selectId);
  app.get(
    "safemodule/SafeTbMonitor/selectByIdSafeMonitor",
    selectId,
    function (msg) {
      console.log(msg);
      layerVoluation(msg.row); //传参并赋值
    }
  );
}
//获取弹出层表单的数据
function getSaveData() {
  //序列化数据
  var data = $("#edit_command").serializeJson();
  console.log("执行了getSaveData");
  console.log(data);
  if (data.pageCode) {
  }
  if (data.pageUri) {
  }
  if (data)
    return {
      data: data
    };
}
