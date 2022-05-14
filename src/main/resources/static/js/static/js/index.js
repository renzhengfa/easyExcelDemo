$(
	(function (app) {
		layui.use(["element", "layer"], function () {
			var element = layui.element;
			var layer = layui.layer;
			// //监听F5键
			// document.onkeydown = function(e){
			//   e = window.event || e;
			//   var keycode = e.keyCode || e.which;
			//   if(keycode == 116){
			//       // if(window.event){// ie
			//       //     try{e.keyCode = 0;}catch(e){}
			//       //     e.returnValue = false;
			//       // }else{// firefox
			//       //     e.preventDefault();
			//       // }
			//       var menuid=window.sessionStorage.menus;
			//       console.log(menuid)
			//       document.getElementById("#"+menuid+"").click();
			//       // $("a.layui-this").trigger("click");
			//       console.log(123)
			//   }
			// }
			app.get("authmodule/authTbUser/resultUserName", "", function (
				data
			) {
				if (data.state) {
					$("#username").html(data.row);
				} else {
					layer.msg(data.msg);
				}
			});
			/*菜单查询-liuyuru*/
			app.get("authmodule/AuthTbMenu/selectMenuByUserId", "", function (
				data
			) {
				if (data.state && data.rows.length > 0) {
					var tag = "",
						tagpc = "";
					for (var i = 0; i < data.rows.length; i++) {
						// if (i == 0) {
						//   tag +="<dd class='layui-this'><a href='javascript:;' onclick='menutag(" + data.rows[i].id +")' mobile>" +data.rows[i].menuName + '</a></dd>';
						//   tagpc +="<li class='layui-nav-item layui-this'><a href='javascript:;' onclick='menutag(" +data.rows[i].id +")'>" +data.rows[i].menuName +'</a></li>';
						// } else {
              if(data.rows[i].menuName=="智能环境集成控制系统"){
                console.log(data.rows[i])
                // tag += "<dd id='ulmenusdd" + data.rows[i].id + "'><a href='javascript:;' onclick='menutag(" + data.rows[i].id + ")' mobile>" + data.rows[i].menuName + '</a></dd>';
                tagpc += "<li class='layui-nav-item' id='ulmenusdd" + data.rows[i].id + "'><a href='"+data.rows[i].herf+"' target='_blank'>" + data.rows[i].menuName + '</a></li>';
                continue;
              }
						tag +=
							"<dd id='ulmenusdd" +
							data.rows[i].id +
							"'><a href='javascript:;' onclick='menutag(" +
							data.rows[i].id +
							")' mobile>" +
							data.rows[i].menuName +
							"</a></dd>";
						tagpc +=
							"<li class='layui-nav-item' id='ulmenusdd" +
							data.rows[i].id +
							"'><a href='javascript:;' onclick='menutag(" +
							data.rows[i].id +
							")'>" +
							data.rows[i].menuName +
							"</a></li>";
						// }
					}
					// menutag(data.rows[0].id);
					$("#dlmenus").html(tag);
					$("#ulmenus").html(tagpc);
					var widths = 0;
					for (var uli = 0; uli < $("ul#ulmenus li").length; uli++) {
						widths += $("ul#ulmenus li").eq(uli).width();
					}
					// console.log($('ul#ulmenus li').length*$('ul#ulmenus li').width());
					$("#dlmenus dd").click(function () {
						$("#dlmenus dd").removeClass("layui-this");
						$(this).addClass("layui-this");
					});
					$("#ulmenus .layui-nav-item").click(function () {
						$("#ulmenus .layui-nav-item").removeClass("layui-this");
						$(this).addClass("layui-this");
						window.sessionStorage.ulmenusdd = this.id;
					});
					var ulmenusdd = window.sessionStorage.ulmenusdd;

					if (ulmenusdd) {
						$("li#" + ulmenusdd + "").addClass("layui-this");
						$("dd#" + ulmenusdd + "").addClass("layui-this");
						var menutagid = ulmenusdd.substring(9);
						menutag(menutagid);
					} else {
						$("li#ulmenusdd1").addClass("layui-this");
						menutag(data.rows[0].id);
					}
				} else {
					layer.msg(data.msg);
					if (data.msg == "没有用户登录") {
						setTimeout(function () {
							window.location.href = "login.html";
						}, 2000);
					}
				}
			});

			/*菜单切换内容页-liuyuru*/
			$(".menu").on("click", function () {
				var ht = $(this).html();
				$(".tabChange").html(ht);
			});
			/*侧边伸缩页面布局-liuyuru*/
			$(".js-flexmenu").on("click", function () {
				$("#flexmenu").removeClass("layui-icon-shrink-right");
				$("#flexmenu").addClass("layui-icon-spread-left");
				$(".layui-side").toggleClass("mini");
				/*toggleClass切换效果-liuyuru*/
				$(".layui-layout-admin").toggleClass("showMenu");
				var oClass = $(".layui-side").hasClass("mini");
				if (!oClass) {
					if ($(".menu-more").find(".layui-nav-itemed").length > 1) {
						$(".menu-more .layui-nav-item").removeClass(
							"layui-nav-itemed"
						);
					}
				} else {
					$(".mini .layui-nav-item").removeClass("layui-nav-itemed");
					$("#flexmenu").removeClass("layui-icon-spread-left");
					$("#flexmenu").addClass("layui-icon-shrink-right");
				}
			});
			/*图标菜单的侧边功能框-liuyuru*/
			$(".menu-more .layui-nav-item").click(function () {
				if ($(".layui-side").hasClass("mini")) {
					if ($(this).hasClass("open")) {
					} else {
						$(".menu-more .layui-nav-item").removeClass(
							"layui-nav-itemed"
						);
						$(".menu-more .layui-nav-item").removeClass("open");
						if ($(this).has("dl").length) {
							//如果有子菜单，显示下拉样式
							$(this).addClass("layui-nav-itemed");
							$(this).addClass("open");
						}
					}
				}
			});
		});

		//  系统名称初始化-tangli
		app.get("globalmodle/sysTbAttribute/selectDetail", "", function (data) {
			if (data.state) {
				var settingInfo = data.row;
				// console.log('系统信息',settingInfo);
				if (settingInfo.systemName) {
					$("#systemTitle").html(settingInfo.systemName);
					$("#systemTitle").css({
						fontSize: settingInfo.fontSize,
						letterSpacing: settingInfo.fontSpacing,
					});
				} else {
					$("#systemLogo").attr(
						"src",
						window.imgurl + settingInfo.iconAddress
					);
					$("#systemLogo").css({
						height: 56 + "px",
						width: 126 + "px",
					});
				}
			}
		});

		// 获取历史信息
		showInfo();
		setInterval(function () {
			showInfo();
		}, 10000);
		handleClickRing();

		// 退出系统
		$(".exit-sys").click(function () {
			sessionStorage.clear();
		});
	})(app)
);
//退出事件
// function CloseWebPage() {
//   //判断是否为ie
//   if (navigator.userAgent.indexOf("MSIE") > 0) {
//     //判断是否为ie6
//     if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
//       window.opener = null; window.close();
//     }
//     else {
//       window.open('', '_top'); window.top.close();
//     }
//   }
//   //判断是否为firefox
//   else if (navigator.userAgent.indexOf("Firefox") > 0) {
//     window.location.href = 'about:blank ';
//   }
//   //其他非firefox等主流浏览器如chrome,safari
//   else {
//     window.opener = null;
//     window.open('', '_self', '');
//     window.close();
//   }
// }
/*侧边菜单查询-liuyuru*/

function menutag(value) {
	var fromjson = {
		id: value,
	};
	app.get("authmodule/AuthTbMenu/selectMenuByPid", fromjson, function (data) {
		console.log(data);
		if (data.state) {
			var menutag = "",
				dataherf;
			var idArr = [];
			var menuNameArr = [];

			for (var i = 0; i < data.rows.length; i++) {
				idArr[i] = data.rows[i].id;
				if (idArr.indexOf(data.rows[i].fkParentId) == -1) {
					if (data.rows[i].herf) {
						dataherf = data.rows[i].herf;
					} else {
						dataherf = "javascript:;";
					}
					//  if(i==0){
					//   menutag +="<li class='layui-nav-item  layui-this' id='menuName" +data.rows[i].id + "'>"+
					//   '<a href=' + dataherf +" id='href" +data.rows[i].id + "' class='js-menu' target='menuframe'>";
					//  }else{
					// <i v-if="!item.iconDefault" class="menu-icon el-icon-star-off"></i>
					// <img v-else class="menu-icon" style="width: 16px;" :src="item.iconDefault"/>
					var menuArr = [];
					menuArr.push(data.rows[i].menuName);
					menutag +=
						"<li class='layui-nav-item' id='menuName" +
						data.rows[i].id +
						"' menuName=" +
						menuArr +
						">";
					menutag +=
						"<a href=" +
						dataherf +
						" id='href" +
						data.rows[i].id +
						"' class='js-menu' target='menuframe'>";
					if (data.rows[i].iconDefault) {
						menutag +=
							"<img class='img-menu' src='" +
							imgurl +
							"" +
							data.rows[i].iconDefault +
							"' width='16' height='16'/>"; //静态
					} else {
						menutag += `<i class="menu-icon layui-icon layui-icon-rate"></i>`;
					}
					// if (data.rows[i].iconSelected) {
					//   menutag += "<img class='img-menu-hover' src='" + imgurl + "" + data.rows[i].iconSelected + "' width='20' height='20'/>"; //悬浮
					// }
					// if (data.rows[i].iconShrink) {
					//   menutag += "<img class='img-menu-open' src='" + imgurl + "" + data.rows[i].iconShrink + "' width='20' height='20'/>"; //点击
					// }
					menutag +=
						"<span>" +
						data.rows[i].menuName +
						"</span></a><dl class='layui-nav-child' id='dlmenu" +
						data.rows[i].id +
						"'></dl></li>";
					menuNameArr[data.rows[i].id] = data.rows[i].menuName;
				}
			}
			$("#menu-more").html(menutag);
			for (var i = 0; i < data.rows.length; i++) {
				if (data.rows[i].fkParentId > 1) {
					if (data.rows[i].herf) {
						dataherf = data.rows[i].herf;
					} else {
						dataherf = "javascript:;";
					}
					// if(i==0){
					//   menutag +="<li class='layui-nav-item  layui-this' id='menuName" +data.rows[i].id + "'>"+
					//   '<a href=' + dataherf +" id='href" +data.rows[i].id + "' class='js-menu' target='menuframe'>";
					//  }else{
					//   menutag +="<li class='layui-nav-item' id='menuName" +data.rows[i].id + "'>" +
					//   '<a href=' + dataherf +" id='href" +data.rows[i].id + "' class='js-menu' target='menuframe'>";
					//  }
					var menuArr = [];
					if (menuNameArr[data.rows[i].fkParentId]) {
						menuArr.push(menuNameArr[data.rows[i].fkParentId]);
					}

					menuArr.push(data.rows[i].menuName);
					if (
						dataherf ===
						"html/archive/archive-manage/waiting-for-archiving.html"
					) {
						$("#dlmenu" + data.rows[i].fkParentId + "").append(
							"<dd><a href=" +
								dataherf +
								" id='href" +
								data.rows[i].id +
								"' class='js-menu dlmenu archiveToWait' target='menuframe'  menuName=" +
								menuArr +
								">" +
								data.rows[i].menuName +
								"</a></dd>"
						);
					} else if (
						dataherf ===
						"html/archive/archive-manage/add-archive.html"
					) {
						$("#dlmenu" + data.rows[i].fkParentId + "").append(
							"<dd><a href=" +
								dataherf +
								" id='href" +
								data.rows[i].id +
								"' class='js-menu dlmenu addArchive' target='menuframe'  menuName=" +
								menuArr +
								">" +
								data.rows[i].menuName +
								"</a></dd>"
						);
					} else {
						$("#dlmenu" + data.rows[i].fkParentId + "").append(
							"<dd><a href=" +
								dataherf +
								" id='href" +
								data.rows[i].id +
								"' class='js-menu dlmenu' target='menuframe'  menuName=" +
								menuArr +
								">" +
								data.rows[i].menuName +
								"</a></dd>"
						);
					}
				}
			}
			// document.getElementById('href'+data.rows[j].id).click();
			// if(dataherf!='javascript:;'){
			// document.getElementById('href'+data.rows[0].id).click();
			// }else{
			//   document.getElementById('href'+data.rows[1].id).click();
			// }

			$(".dlmenu").on("click", function (event) {
				$("#menu-more .layui-nav-item").removeClass("layui-this");
				$("#menu-more .layui-nav-item .js-menu").removeClass(
					"layui-this"
				);
				$(this).addClass("layui-this");
				window.sessionStorage.menuName = $(this).attr("menuName");
				window.sessionStorage.iframes = this.id;
				/*阻止事件冒泡-liuyuru*/
				event.stopPropagation();
			});
			$("#menu-more .layui-nav-item").click(function () {
				if (this.lastChild.children.length > 0) {
					if ($(this).hasClass("layui-nav-itemed")) {
						$(".mini .layui-nav-item").removeClass(
							"layui-nav-itemed"
						);
						$(".menu-more .layui-nav-item").removeClass(
							"layui-nav-itemed"
						);
						window.sessionStorage.menuName = $(this).attr(
							"menuName"
						);
						window.sessionStorage.itemed = "";
					} else {
						$(".mini .layui-nav-item").removeClass(
							"layui-nav-itemed"
						);
						$(".menu-more .layui-nav-item").removeClass(
							"layui-nav-itemed"
						);
						$(this).addClass("layui-nav-itemed");
						window.sessionStorage.menuName = $(this).attr(
							"menuName"
						);
						window.sessionStorage.itemed = this.id;
					}
					/*添加class实现切换效果-liuyuru*/ //toggleClass

					// $(this).children('.layui-nav-child').slideToggle();
					// if($(this).hasClass('layui-nav-itemed')) {
					//   $(this).removeClass('layui-nav-itemed');
					//   $(this).children('.layui-nav-child').stop().slideUp();
					//   $(this).siblings().children('.layui-nav-child').slideUp();
					// } else {
					//   $(this).addClass('layui-nav-itemed');
					//   $(this).children('.layui-nav-child').stop().slideDown();
					//   $(this).siblings().children('.layui-nav-child').stop().slideUp();
					//   $(this).siblings().removeClass('layui-nav-itemed');
					// }
				} else {
					$(".mini .layui-nav-item").removeClass("layui-nav-itemed");
					$("#menu-more .layui-nav-item").removeClass("layui-this");
					$("#menu-more .layui-nav-item .js-menu").removeClass(
						"layui-this"
					);
					$(this).addClass("layui-this");
					window.sessionStorage.menuName = $(this).attr("menuName");
					window.sessionStorage.iframes = this.id;
				}
				// event.stopPropagation(); //不触发任何前辈元素上的事件处理函数
			});
			var menuid = window.sessionStorage.iframes;
			var itemed = window.sessionStorage.itemed;
			if (itemed) {
				// console.log($(".menu-more li#" + itemed + ""))
				if ($(".menu-more li#" + itemed + "").length > 0) {
					$("li#" + itemed + "").addClass("layui-nav-itemed");
				} else {
					itemedchange();
				}
			} else {
				itemedchange();
			}
			if (menuid) {
				try {
					if ($(".menu-more li#" + itemed + "").length > 0) {
						if ($(".menu-more .layui-nav-itemed")) {
							$("dd a#" + menuid + "").addClass("layui-this");
						} else {
							$("li#" + menuid + "").addClass("layui-this");
						}
						document.getElementById(menuid).click();
					} else {
						menuidchange(menuid);
					}
				} catch (error) {
					menuidchange(menuid);
				}
			} else {
				menuidchange(menuid);
			}
		} else {
			layer.msg(data.msg);
			if (data.msg == "没有用户登录") {
				setTimeout(function () {
					window.location.href = "login.html";
				}, 2000);
			}
		}
	});
}

function itemedchange() {
	if ($(".menu-more li:first dl dd").length > 0) {
		$(".menu-more li:first").addClass("layui-nav-itemed");
	} else {
	}
}

function menuidchange(menuid) {
	try {
		var numid = "href" + menuid.replace(/[^0-9]/gi, "");
		document.getElementById(numid).click();
	} catch (error) {
		if ($(".menu-more li:first dl dd").length > 0) {
			$(".menu-more li:first dl dd:first a").addClass("layui-this");
			var li_firstid = $(".menu-more li:first dl dd:first a")[0].id;
			document.getElementById(li_firstid).click();
		} else {
			$(".menu-more li:first").addClass("layui-this");
			var li_firstid = $(".menu-more li:first a")[0].id;
			document.getElementById(li_firstid).click();
		}
	}
}

function archiveToWait() {
	$(".archiveToWait")[0].click();
}

function addArchive() {
	$(".addArchive")[0].click();
}

var info_arr = [];
// 获取消息
function showInfo() {
	var data = {
		pageSize: 8,
		currentPage: 1,
		state: 0,
		isDelete: 0,
	};
	app.get("message/getMessage", data, function (data) {
		if (data.state) {
			if (data.rows.length != 0) {
				$(".info_point").show();
			} else {
				$(".info_point").hide();
			}
			info_arr = data.rows;
		} else {
		}
	});
}
// 点击展示消息
function handleClickRing() {
	$(".info_ring").on("click", function (event) {
		event.stopPropagation();
		$(".new_info table").empty();
		showInfo();
		var that = this;
		var html = "";
		if ($(".new_info").is(":hidden")) {
			$(".new_info").show();
			$("#mc").show();
			if (info_arr.length != 0) {
				for (var item of info_arr) {
					html += ` <tr>
            <td><img src="static/images/info/read.png" style="margin-right:2px;width:14px;">${
				item.content
			}</td>
            <td>${item.updateTime.split(" ")[0]}</td>
          </tr>`;
				}
			} else {
				html = `<div style="line-height: 320px;text-align:center;" >暂无数据！</div>`;
			}
			$(".new_info table").append(html);
		} else {
			$(".new_info").hide();
			$("#mc").hide();
		}
	});

	$(".new_info").click(function (event) {
		event.stopPropagation();
	});
	$(document).click(function (event) {
		$(".new_info").hide();
		$("#mc").hide();
	});
	$(".show_his").click(function (event) {
		$(".new_info").hide();
		$("#mc").hide();
	});
	$("#mc").click(function (event) {
		$(".new_info").hide();
		$("#mc").hide();
	});
}
