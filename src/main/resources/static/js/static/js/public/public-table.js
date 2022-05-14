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
		var cols = app.asyncGet("authmodule/authTbPageols/selectCols", {
			pageCode: par.pageCode,
			pageMarker: par.pageMarker
		});
		var reusltCols = [];
        console.log(cols.rows);
        if (!window.sessionStorage.getItem("menuName")) {
            cols.rows.map((res, index) => {
                if (res.title == "操作") {
                    cols.rows.splice(index, 1); 
                }
            })
        }
		reusltCols.push();
		var rows = [];
		if (
			par.pageCode == "archives-admin" ||
			par.pageCode == "archivesBox-admin" ||
			par.pageCode == 'filesBox_info' || par.pageCode == 'door-equipment-manage'
		) {
			if (par.ischeckbox == 1) {
				rows[0] = {
					title: "序号",
					width: 60,
					fixed: 'left',
					templet: '<div>{{d.LAY_TABLE_INDEX+1}}</div>'
				};
				for (var i = 1; i <= cols.rows.length; i++) {
					rows[i] = cols.rows[i - 1];
				}
			} else {
				checkType = true;
				rows[0] = {
					type: "checkbox",
					title: "type",
					width: 60,
					fixed: "left"
				};
				rows[1] = {
					title: '序号',
					width: 60,
					fixed: 'left',
					templet: '<div>{{d.LAY_TABLE_INDEX+1}}</div>'
				};
				for (var i = 2; i <= cols.rows.length + 1; i++) {
					rows[i] = cols.rows[i - 2];
				}
			}
			reusltCols.push(rows);
		} else if (par.pageCode == "file-admin" ||
			par.pageCode == "file-search" ||
			par.pageCode == "borrow-run" ||
			par.pageCode == "borrow-manage" ||
			par.pageCode == 'transfer-manage' ||
			par.pageCode == 'destroy-manage' ||
			par.pageCode == 'archive-manage'
		) {
			if (arguments[1]) {
				if (arguments[1] == 'history' || arguments[1] == 'record') {
					rows[0] = {
						// type: 'numbers',
						title: '序号',
						width: 60,
						fixed: 'left',
						templet: '<div>{{d.LAY_TABLE_INDEX+1}}</div>'
					};
					rows = rows.concat(cols.rows);
				} else {
					rows[0] = {
						type: "checkbox",
						title: "type",
						width: 60,
						fixed: "left"
					};
					rows[1] = {
						title: '序号',
						width: 60,
						fixed: 'left',
						templet: '<div>{{d.LAY_TABLE_INDEX+1}}</div>'
					};
					if (arguments[1] == 'list') {
						rows = rows.concat(cols.rows);
					} else {
						rows = rows.concat(cols.rows);
					}
				}
			} else {
				rows[0] = {
					type: "checkbox",
					title: "type",
					width: 60,
					fixed: "left"
				};
				rows[1] = {
					// type: 'numbers',
					title: '序号',
					width: 60,
					fixed: 'left',
					templet: '<div>{{d.LAY_TABLE_INDEX+1}}</div>'
				};
				rows = rows.concat(cols.rows);
			}
			reusltCols.push(rows);
		} else if (par.pageCode == "archivesBoxs-admin") {
			rows[0] = {
				type: "radio",
				title: "",
				width: 60,
				fixed: "left"
			};
			for (var i = 1; i <= cols.rows.length; i++) {
				rows[i] = cols.rows[i - 1];
			}
			reusltCols.push(rows);
		} else {
			rows[0] = {
				title: "序号",
				width: 60,
				fixed: 'left',
				templet: '<div>{{d.LAY_TABLE_INDEX+1}}</div>'
			};

			for (var i = 1; i <= cols.rows.length; i++) {
				rows[i] = cols.rows[i - 1];
			}
			reusltCols.push(rows);
		}
		
		if (!par.height) {
			var demoTable_height = $(".demoTable").outerHeight(true) + 100;
			par.limit = "20";
			par.height = "full-" + demoTable_height + "";
		}
		/*
		reusltCols[0].push({
			field:'useTime',
			title: "有效期",
			templet: '<div>{{d.LAY_TABLE_INDEX+1}}</div>'
		})
		*/
		reusltCols[0].forEach((item)=>{
			if(item.width==''){
				item.width=230
			}
			if(item.title=="操作"&&item.fixed=="left"){
				item.fixed="right"
            }
        });	
        for (let i = 0; i < reusltCols[0].length; i++) {
            if(reusltCols[0][i].title=="操作"&&reusltCols[0][i].field==""){
                reusltCols[0].splice(i, 1);
                i--;
			}
        }
		console.log(reusltCols,'所谓的表头数据')
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
					// page: true, //开启分页
					page: {
						theme: '#3a97ff'
					},
					limit: par.limit,
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
						statusCode: 1,
						msgName: "msg", // 对应 msg
						countName: "total", // 对应 count
						dataName: "rows" // 对应 data
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
						if (res.state) {
							if (res.rows.length == 0) {
								var pagenum = res.page;
								tableObj.reload({
									where: par.data,
									page: {
										curr: pagenum //重新从第 1 页开始
									}
								});
							}
						} else {
							var pagenum = res.page;
							if (pagenum == undefined) {

							} else {
								if (pagenum != 0) {
									tableObj.reload({
										where: par.data,
										page: {
											curr: pagenum //重新从第 1 页开始
										}
									});
								}
							}
						}
						// layer.close(index); //返回数据关闭loading
					}
				});
				resolve(table);
				//其他操作
				//监听表格复选框选择
				table.on('checkbox(archivesBox)', function(obj) {
					window.mySelected = [];
					window.arr_state = [];
					//.全选或单选数据集不一样
					var data = obj.type == 'one' ? [obj.data] : pageData;

					//.遍历数据
					$.each(data, function(k, v) {
						//.假设你数据中 id 是唯一关键字
						console.log(v)
						if (obj.checked) {
							//.增加已选中项
							layui.data('checked', {
								key: v.id,
								value: v
							});
							// mySelected.push(v.id);
							// arr_state.push(v.state);
						} else {
							//.删除
							layui.data('checked', {
								key: v.id,
								remove: true
							});
							// mySelected.splice(mySelected.indexOf(v.id), 1);
							// arr_state.splice(arr_state.indexOf(v.state), 1)
						}
					});
					$.each(layui.data('checked'), function(k, v) {
						mySelected.push(v.id);
						arr_state.push(v.state);
					});
					localStorage.setItem("myselected", mySelected);
					//layer.alert(JSON.stringify(mySelected));
				});
				//监听排序
				table.on("sort(control)", function(obj) {
					console.log(obj);
					//注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
					//尽管我们的 table 自带排序功能，但并没有请求服务端。
					//有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
					table.reload(par.id, {
						initSort: obj, //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
						where: {
							//请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
							field: obj.field, //排序字段
							order: obj.type //排序方式
						}
					});
				});
				// table.reload(obj,{url});
			});
		});
	};
})(app, $, (window.mytable = {}));
