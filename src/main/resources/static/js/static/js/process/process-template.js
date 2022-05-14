$(function () {
	var layer;
	layui.use(["element", "layer"], function () {
		var element = layui.element;
		layer = layui.layer;
	});
	treeData=[];
	getMenuBar(); //自定义面包屑，引用public-menu.js
	/*查询流程应用场景-liuyuru*/
	app.get("authmodule/sysTbDictCode/selectBySceneAll", "", function (msg) {
		if (msg.state) {
			var data = msg.rows;
			treeData=data;
			var menutag = '';
			for (var i = 0; i < data.length; i++) {
				menutag += "<li class='layui-nav-item li-temp' id='" + data[i].id + "'>" +
					"<a href='javascript:;' class='js-temp' target='menuframe'>" +
					'<span>' + data[i].svalue + '</span></a></li>';
			}
			$('#process-temp').html(menutag);
			$(".body-table").html("<iframe src='../../frames/CustomLayoutEditor/index.html' id='myIframe' class='iframe'></iframe>");
			/*流程应用场景单击事件-liuyuru*/
			$('.li-temp').on('click', function (event) {
				$('.li-temp').removeClass('showtemp');
				$(this).addClass('showtemp');
				var id = { 
					id: '',
					fkSceneId: event.currentTarget.id,
					fkSceneCode: ''
				};
				
				window.uploadId = id;
				window.page = 'processTemplate';
				app.getAsync("activitymodule/ArcTbFlowTpl/selectOneArcTbFlowTpl?id=" + event.currentTarget.id, "", function (msg) {
					let iframe = document.getElementById('myIframe').contentWindow.document.getElementsByClassName('demo'); // 父页面获取iframe里面的dom元素
					iframe[0].innerHTML = "";
					if (msg.state) {
						if (msg.row != null) {
							uploadId = msg.row;
							for(var item of treeData){
								if(item.id==event.currentTarget.id){
									uploadId.fkSceneCode=item.code; 
								}
							}
							console.log(msg.row);
							iframe[0].innerHTML = msg.row.htmlTpl;
							// $(".showtemp a span").trigger('click');
						}
					} else {
						layer.msg(msg.msg);
					}
				});
			})
		} else {
			layer.msg(msg.msg);
		}
	});
}());

function showtemp_click() {
	$(".showtemp a span").trigger('click');
}