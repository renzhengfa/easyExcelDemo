var token = window.localStorage.getItem("token");
var tableObj;
(function(app, $, mytable) {
	//.存储当前页数据集
	window.pageData = [];
	var checkType = false;
	mytable.checkPar = function(par) {
		if (par.id == null || par.id == "") {
			throw "请传入表格id";
		}
		if (par.pageCode == null || par.pageCode == "") {
			throw "请传入pageCode";
		}
	};
	//初始化表格数据
	mytable.init = function(par) {
		var reusltCols = [
            [{
				// fixed: "left",
				hide: false,
				key: "0-0",
				templet: "<div>{{d.LAY_TABLE_INDEX+1}}</div>",
				title: "序号",
                type: "normal",
                width: 100
            },
            {
                field: "locationName",
                hide: false,
                key: "0-2",
                minWidth: "20",
                prop: "locationName",
                sort: 0,
                title: "位置信息",
                type: "normal",
            },
            {
                field: "rfid",
                hide: false,
                key: "0-3",
                minWidth: "20",
                prop: "rfid",
                sort: 0,
                title: "RFID",
                type: "normal",
            },
            {
                field: "stateString",
                // fixed: "right",
                hide: false,
                key: "0-4",
                minWidth: "20",
                prop: "stateString",
                sort: 0,
                templet: "#state_Tpl",
                title: "状态",
                type: "normal",
            },
            {
                field: "operation",
                // fixed: "right",
                key: "0-5",
                minWidth: "20",
                prop: "operation",
                sort: 0,
                title: "操作",
                toolbar: "#operate",
                type: "normal",
            }]
        ];
		
		if (!par.height) {
			var demoTable_height = $(".demoTable").outerHeight(true)+60;
			// par.limit = "20";
			par.height = "full-" + demoTable_height + "";
		}
		return new Promise(function(resolve, reject) {
			layui.use(["table"], function() {
				// console.log(par);
				var table = layui.table;
				if (checkType) {
					(layer = layui.layer), ($ = layui.$), (form = layui.form);
					var mytbl;
					//.存储已选择数据集，用普通变量存储也行
					layui.data('checked', null);
				} else {
					// var index = layer.load(1); //添加laoding,0-2两种方式
				}
				tableObj = table.render({
					elem: "#" + par.id,
					url: window.baseurl + par.url, //数据接口
                    height: par.height,
					page: false, //开启分页
					// page: {
					// 	theme: '#3a97ff'
					// },
                    // limit: 20,
                    // limit: Number.MAX_VALUE,
                    limit: 10,
					loading: true,
					cellMinWidth: 60,
					even: true, // 开启隔行背景
					headers: {
						"authorization": token
					},
                    where: par.data,
					request: {
						pageName: "currentPage", //页码的参数名称，默认：page
						limitName: "pageSize" //每页数据量的参数名，默认：limit
					},
					response: {
						statusName: "code",
						statusCode: 200,
						msgName: "msg", // 对应 msg
						countName: "total", // 对应 count
						dataName: "data" // 对应 data
					},
					// initSort: {
					//     field: 'id', //排序字段，对应 cols 设定的各字段名
					//     type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
					// },
					cols: reusltCols,
					done: function(res, c, a) {
						window.curr = c;
						window.pagesize = res.pageSize;
						$.each(layui.data('checked'), function(k, v) {
							layui.data('checked', {
								key: v.id,
								remove: true
							});
						});
						if (checkType) {
							var tbl = $('#' + par.id).next('.layui-table-view');
							//.记下当前页数据，Ajax 请求的数据集，对应你后端返回的数据字段
							pageData = res.rows;
							var len;
							if (pageData) {
								len = pageData.length;
								//.遍历当前页数据，对比已选中项中的 id
								for (var i = 0; i < len; i++) {
									if (layui.data('checked', pageData[i]['id'])) {
										//.选中它，目前版本没有任何与数据或表格 id 相关的标识，不太好搞，土办法选择它吧
										tbl
											.find('table>tbody>tr')
											.eq(i)
											.find('td')
											.eq(0)
											.find('input[type=checkbox]')
											.prop('checked', true)
									}
								}
							} else {

							}
							//.PS：table 中点击选择后会记录到 table.cache，没暴露出来，也不能 mytbl.renderForm('checkbox');
							//.暂时只能这样渲染表单
							form.render('checkbox')
						} else {
							if (par.callback) {
								par.callback();
							}
						}
						if (res.total == 0) {
							// layer.close(index); //返回数据关闭loading
							return false;
						}
						// if (res.state) {
						// 	if (res.rows.length == 0) {
						// 		var pagenum = res.page;
						// 		tableObj.reload({
						// 			where: par.data,
						// 			page: {
						// 				curr: pagenum //重新从第 1 页开始
						// 			}
						// 		});
						// 	}
						// } else {
						// 	var pagenum = res.page;
						// 	if (pagenum == undefined) {

						// 	} else {
						// 		if (pagenum != 0) {
						// 			tableObj.reload({
						// 				where: par.data,
						// 				page: {
						// 					curr: pagenum //重新从第 1 页开始
						// 				}
						// 			});
						// 		}
						// 	}
						// }
						// layer.close(index); //返回数据关闭loading
					}
				});
				resolve(table);
			});
		});
	};
})(app, $, (window.mytable = {}));
