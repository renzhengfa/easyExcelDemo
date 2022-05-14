var form;
var jzqnum=[];
$(function () {
	layui.use(["form", "element", "layer", "table"], function () {
		var element = layui.element;
		var layer = layui.layer;
		form = layui.form;
		var table = layui.table;
		var username = "admin";
		var psd = "cc123456";
		app.post(
			"auth/user/userLogin", {
				account: username,
				password: psd
			},
			function (msg) {
				if (msg.state) {
					layer.msg(msg.msg);
					window.localStorage.setItem("token", msg.row);
					run();
				} else {
					console.log(msg.row);
					layer.msg(msg.msg);
				}
			}
		);
	});
}());

function run() {
	setTimeout(function () {
		var storeId = $("#door-room").val();
		alarminfo(storeId);
	}, 60000);
	mymore.selectroom("#door-room", "", "environmentmodule/wkStoTbStore/selectWkStoTbStore", "environment/equipment/selectEquipments");
    websocketMsg();
	$("#door-room").change(function(){
        jzqnum=[];
		var doorvalue = $('select  option:selected').val();

		var img = $("#door-room").find("option:selected").attr("imgAddress");
		var storeName = $("#door-room").find("option:selected").text();
		window.localStorage.localStoreId = doorvalue;
		window.localStorage.localStoreName = storeName;
		window.localStorage.localImgUrl = img;
		mymore.selectequipment(doorvalue, "", "environment/equipment/selectEquipments", storeName);
		websocket.send(JSON.stringify({storeId:$("#door-room").find("option:selected").val()}));
		alarminfo(doorvalue);
		try {
			$("#content").css("background", "url(" + imgurl + "" + img + ")no-repeat");
			$("#content").css("background-size", "100% 100%");
		} catch (error) {

		}
	});
	form.render();
	equimenu();
}

function alarminfo(fkStoreId) {
	app.get("environment/alarm/selectAlarms", {
		"map[fkStoreId]": fkStoreId, "pageSize": 2
	}, function (msg) {
		$("#alarm-info").html("");
		if (msg.state) {
			var tabletr = "";
			var data = msg.rows;
			tabletr = "<tr><th>报警信息</th><th>报警值</th><th>报警时间</th></tr>";
			for (var i = 0; i < data.length; i++) {
				tabletr += "<tr><td>" + data[i].alarmMsg + "</td><td class='alarm-value'>" + data[i].alarmValue + "</td><td>" + data[i].createTime + "</td></tr>";
			}
			$("#alarm-info").html(tabletr);
		} else {
			$("#alarm-info").html("暂无报警信息！");
			// console.log(msg.msg);
		}
	})
}
//设备监控数据
function equimenu() {
	var Accordion = function (el, multiple) {
		this.el = el || {};
		this.multiple = multiple || false;

		// Variables privadas
		var links = this.el.find('.link');
		// Evento
		links.on('click', {
			el: this.el,
			multiple: this.multiple
		}, this.dropdown);
	};

	Accordion.prototype.dropdown = function (e) {
		var $el = e.data.el;
		$this = $(this);
		$next = $this.next();

		$next.slideToggle();
		$this.parent().toggleClass('open');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
		}
	};

	var accordion = new Accordion($('#con_menu'), false);
	$('.submenu li').click(function () {
		$(this).addClass('current').siblings('li').removeClass('current');
	});
}
// 设备监控
function archivesratio(mapstoreName, data, cjqArr) {
	var submenu = "";
	var tag = "";
	for (var i = 0; i < cjqArr.length; i++) {
		var state = cjqArr[i].state;
		if (state == "on") {
			state = "运行";
		} else if (state == "off") {
			state = "在线";
		} else if (state == "offline") {
			state = "离线";
		}
		submenu += "<li><a>" + cjqArr[i].equName + "<span id='stateli" + cjqArr[i].equNum + "'>（" + state + "）</span><table id='cjqmenu" + cjqArr[i].equNum + "' class=\"wsdtable\"><tr>" +
			"<th>0.0<span class='minfont'>℃</span></th><th>0.0<span class='minfont'>%RH</span></th><th>0.0<span class='minfont'>mg/m³</span></th></tr></table></a></li>";
	}
	tag = "   <table class=\"wsdtitle\">\n" +
		"                            </table><li>\n" +
		"                        <div class=\"link\">" + mapstoreName + "\n" +
		"                        <table class=\"wsdtable\">\n" +
		"                        <tr>\n" +
		"                        <th id='stateon'>" + data[0] + "</th>\n" +
		"                        <th id='stateoff'>" + data[1] + "</th>\n" +
		"                        <th id='stateoffline'>" + data[2] + "</th>\n" +
		"                        </tr>\n" +
		"                            <tr>\n" +
		"                            <td>运行数量</td>\n" +
		"                            <td>在线数量</td>\n" +
		"                            <td>离线数量</td>\n" +
		"                            </tr>\n" +
		"                        </table>\n" +
		"                        </div> <ul class=\"submenu\" id=\"submenu\">" + submenu + "</ul></li>";
	$(".con_menu").html(tag);
}

function queryequicmd(equiId, fkTypeId, equNum) {
	//查询操作
	app.get('environment/cmd/selectCmds', {
		typeId: fkTypeId
	}, function (msg) {
		if (msg.state) {
			var str = "";
			$("#" + equiId).append("<div class='dropdown-menu'><ul class='layui-dropdown-menu" + equiId + "'></ul></div>")
			for (var i = 0; i < msg.rows.length; i++) {
				str += "<li><a title=" + msg.rows[i].cmdMark + " id=" + equNum + " onclick='moreclickul(this)'>" + msg.rows[i].cmdName + "</a></li>";
			}
			$(".layui-dropdown-menu" + equiId + "").append(str)
		}
	});
}

function moreclick(value) {
	$(".layui-dropdown-menu" + value.id + "").toggleClass("main");
}
var stateunder;
function moreclickul(value) {
	var info = {
		equNum: value.id,
		cmd: value.title
	};
	app.post('environmentmodule/cmd/sendMsg', info, function (msg) {
        if(msg.state) {
            stateunder = $("#data" + value.id + " dd.state span").attr('class');
        }
		layer.msg(msg.msg);
	});
}
// 拖拽
function drag(obj) {
	getPosition("drag_box"+obj);
	var obox = document.getElementById("content");
	var odrag = document.getElementById("drag_box"+obj);
	odrag.onmousedown = function (ev) {
		var oevent = ev || event;
		var distanceX = oevent.clientX - odrag.offsetLeft;
		var distanceY = oevent.clientY - odrag.offsetTop;
		var old_x=oevent.clientX;
		var old_y=oevent.clientY;
		document.onmousemove = function (ev) {
			var oevent = ev || event;
			var _x, _y;
			_x = oevent.clientX - distanceX;
			_y = oevent.clientY - distanceY;
			if (_x < 0) _x = 0;
			if (_y < 0) _y = 0;
			if (_x > obox.offsetWidth - 203) _x = obox.offsetWidth - 203;
			if (_y > obox.offsetHeight - odrag.offsetHeight) _y = obox.offsetHeight - odrag.offsetHeight;
			odrag.style.left = _x + 'px';
			odrag.style.top = _y + 'px';
			/*localStorage.setItem("posXdrag_box" + obj, _x);
			localStorage.setItem("posYdrag_box" + obj, _y);*/
		};
		document.onmouseup = function (ev) {
            var oevent = ev || event;
            var _x, _y;
            _x = oevent.clientX - distanceX;
            _y = oevent.clientY - distanceY;
            var equid=null;
            for(var i=0;i<chcheEqu.length;i++){
                if(chcheEqu[i].drag=="drag_box"+obj){
                    equid=chcheEqu[i].id;
                    break;
                }
            }
            var leftindex=(_x/$("#content").width()).toFixed(2);
            var topindex=(_y/$("#content").height()).toFixed(2);
            if( oevent.clientX!=old_x||oevent.clientY!=old_y){
				app.post('environmentmodule/equTbEquLocation/addOrUpdata',{fkEquId:obj,leftIndex:leftindex,topIndex:topindex},function success (msg) {
					console.log(msg);
					layui.layer.msg(msg.msg)
				})
			}
            localStorage.setItem("posXdrag_box" + obj, leftindex);
            localStorage.setItem("posYdrag_box" + obj, topindex);
			document.onmousemove = null;
			document.onmouseup = null;
		};
	}

	//手指触摸开始，记录div的初始位置
	var distanceX,distanceY;
	odrag.addEventListener('touchstart', function (ev) {

		var oevent = ev || window.event;
		var touch = oevent.touches[0];
		distanceX = touch.clientX - odrag.offsetLeft;
		distanceY = touch.clientY - odrag.offsetTop;
		/*document.addEventListener("touchmove", function () {
			oevent.preventDefault();
			// oevent.stopPropagation()
		}, false);*/
	});
	var nowx,nowy;
	var move_X,move_Y
	//触摸中的，位置记录
	   odrag.addEventListener('touchmove', function(ev) {
		var oevent = ev || window.event;
		var touch = oevent.touches[0];
		var _x, _y;
		_x = touch.clientX - distanceX;
		_y = touch.clientY - distanceY;
		move_X=touch.clientX;
		move_Y=touch.clientY;
		if (_x < 0) _x = 0;
				if (_y < 0) _y = 0;
				if (_x > obox.offsetWidth - 203) _x = obox.offsetWidth - 203;
				if (_y > obox.offsetHeight - odrag.offsetHeight) _y = obox.offsetHeight - odrag.offsetHeight;
				odrag.style.left = _x + 'px';
				odrag.style.top = _y + 'px';
           		nowx=_x;
           		nowy=_y;
				localStorage.setItem("posXdrag_box" + obj, _x);
				localStorage.setItem("posYdrag_box" + obj, _y);
				/*document.addEventListener("touchmove",function(){
					             oevent.preventDefault();
				 },false);*/
	   });
	//触摸结束时的处理
	odrag.addEventListener('touchend', function (ev) {
		//保存数据
        var oevent = ev || event;
        var _x, _y;
        _x = nowx;
        _y = nowy;
        var equid=null;
        for(var i=0;i<chcheEqu.length;i++){
            if(chcheEqu[i].drag=="drag_box"+obj){
                equid=chcheEqu[i].id;
                break;
            }
        }
        var leftindex=(_x/$("#content").width()).toFixed(2);
        var topindex=(_y/$("#content").height()).toFixed(2);
        if(move_X!=nowx||move_Y!=nowy){
        	app.post('environmentmodule/equTbEquLocation/addOrUpdata',{fkEquId:obj,leftIndex:leftindex,topIndex:topindex},function success (msg) {
        	    console.log(msg);
        	    layui.layer.msg(msg.msg)
        	})
		}
        localStorage.setItem("posXdrag_box" + obj, leftindex);
        localStorage.setItem("posYdrag_box" + obj, topindex);
	});
}

// 获取初始位置
function getPosition(obj) {
    var dragObj = document.getElementById(obj);
    var equid=null;
    var posx=null;
    var posy=null;
    for(var i=0;i<chcheEqu.length;i++){
        if(chcheEqu[i].drag===obj){
            equid=chcheEqu[i].id;
            break;
        }
    }
    if(equid!=null&&equLocation.length>0){
        for(var i=0;i<equLocation.length;i++){
            if(equLocation[i].id==equid){
                posx=($("#content").width()*equLocation[i].leftindex).toFixed(2);
                posy=($("#content").height()*equLocation[i].topindex).toFixed(2);
                console.log(equid+":"+posx+":"+posy);
                break;
            }
        }
    }else{
        posx=($("#content").width()*localStorage.getItem("posX" + obj)).toFixed(2);
        posy=($("#content").height()*localStorage.getItem("posY" + obj)).toFixed(2);
    }
    dragObj.style.left = posx + "px";
    dragObj.style.top = posy + "px";
}

var msgdata;
var websocket = null;
function websocketMsg() {

	//判断当前浏览器是否支持WebSocket
	if ('WebSocket' in window) {
		websocket = new WebSocket("ws://" + baseurl.substring(7) + "equsocket");
	} else {
		alert('Not support websocket')
	}
	//连接发生错误的回调方法
	websocket.onerror = function () {
		websocketMsg();
		setMessageInnerHTML("error");
	};

	//连接成功建立的回调方法
	websocket.onopen = function (event) {
        websocket.send(JSON.stringify({storeId:$("#door-room").find("option:selected").val()}));
		setMessageInnerHTML("open");
	}

	//接收到消息的回调方法
	websocket.onmessage = function (event) {
		setMessageInnerHTML(event.data);
	}

	//连接关闭的回调方法
	websocket.onclose = function () {
		setMessageInnerHTML("close");
	}

	//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
	window.onbeforeunload = function () {
		websocket.close();
	}
}
//针对断网的情况的心跳重连
var value_devnum;
var timearr=[];
var timeoutObj;
var heartCheck = {
    timeout: 20000,//60ms
    timeoutObj: null,
    reset: function(values){
        clearTimeout(timearr[values]);
        this.start(values);
    },
    start: function(value){
        value_devnum=value;
        timeoutObj = setTimeout(function(value){
            jzqnum = [];
            var storeid = $("#door-room").find("option:selected").val();
            var storeName = $("#door-room").find("option:selected").text();
            mymore.selectequipment(storeid, "", "environment/equipment/selectEquipments", storeName);
            // console.log("断开" + value_devnum);
            clearTimeout(timeoutObj);
        }, this.timeout);
        timearr[value_devnum]=timeoutObj;
    }
};
function formatDate(now) {
    var year=now.getFullYear();
    var month=now.getMonth()+1;
    var date=now.getDate();
    var hour=now.getHours();
    var minute=now.getMinutes();
    var second=now.getSeconds();
    return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
}
//将消息显示在网页上
var myAudio=document.getElementById("wsd_alarm");
function setMessageInnerHTML(innerHTML) {
	try {
		var msgjson = JSON.parse(innerHTML);
        msgjson=JSON.parse(msgjson);
		// console.log(msgjson);
        var result1 = equiNumber.indexOf(msgjson.jsonData.devNum);
        if(msgjson.jsonData.alarmMsg){
            myAudio.play();
            var alarms=msgjson.jsonData;
            var d = new Date(alarms.createTime);
            var createTime = formatDate(d);
            // console.log("日期"+createTime);
            /*add_tabletr = "<tr><td>" + alarms.alarmMsg + "</td><td>" + alarms.alarmValue + "</td><td>" + createTime + "</td></tr>"+add_tabletr;
            $("#alarm-info tbody").html(add_tabletr);*/

            var storeId= $("#door-room").find("option:selected").val();
            alarminfo(storeId);

        }
		if (result1 != "-1") {
			var state = msgjson.jsonData.devState;

            var index_arr = $.inArray(msgjson.jsonData.centerNum,jzqnum);
            if(index_arr == -1){
                $(".img" + msgjson.jsonData.centerNum + "").html("<img src='static/images/environment/jzq.png' alt='' srcset=''>");
                $(".part" + msgjson.jsonData.centerNum + "").removeClass("-off");
                // $(".part" + msgjson.jsonData.centerNum + "").addClass("-ongreen");
                $("#data" + msgjson.jsonData.centerNum + " dd.state").html("当前状态：<span class='on'></span>&nbsp;&nbsp;运行");
                jzqnum.push(msgjson.jsonData.centerNum);
                $("#stateon").html(parseInt($("#stateon").text()) + 1);
                $("#stateoffline").html(parseInt($("#stateoffline").text()) - 1);
                heartCheck.start(msgjson.jsonData.centerNum);
            }
            if(index_arr >= 0){
                heartCheck.reset(msgjson.jsonData.centerNum);
            }
            if (state === "up" || state === "down") {
                state = "on";
            }

			var nowstate = $("#data" + msgjson.jsonData.devNum + " dd.state span").attr('class');
            if(nowstate=="undefined"){
                nowstate=stateunder;
            }
			if (msgjson.jsonData.devType == "jzq") {
				state = "on";
				msgjson.jsonData.devState = "on";
			}
			if (state == nowstate) {

			} else {
				// if (nowstate != "undefined") {
					var stateon = $("#stateon").text();
					var stateoff = $("#stateoff").text();
					var stateoffline = $("#stateoffline").text();
                if (state === "on") { //|| state === "up" || state === "down"
                    $("#stateon").html(parseInt(stateon) + 1);
                    if(nowstate==="off"){
                        $("#stateoff").html(parseInt(stateoff) - 1);
                    }else if(nowstate==="offline"){
                        $("#stateoffline").html(parseInt(stateoffline) - 1);
                    }
                    $(".img" + msgjson.jsonData.devNum + "").html("<img src='static/images/environment/" + msgjson.jsonData.devType + ".png' alt='' srcset=''>");
                    $(".part" + msgjson.jsonData.devNum + "").removeClass("-off");
                    // $(".part" + msgjson.jsonData.devNum + "").addClass("-ongreen");
                } else if (state === "off") {
                    $("#stateoff").html(parseInt(stateoff) + 1);
                    if(nowstate==="on"){
                        $("#stateon").html(parseInt(stateon) - 1);
                    }else if(nowstate==="offline"){
                        $("#stateoffline").html(parseInt(stateoffline) - 1);
                    }
                    $(".img" + msgjson.jsonData.devNum + "").html("<img src='static/images/environment/" + msgjson.jsonData.devType + ".png' alt='' srcset=''>");
                    $(".part" + msgjson.jsonData.devNum + "").removeClass("-off");
                    // $(".part" + msgjson.jsonData.devNum + "").removeClass("-ongreen");
                } else if (state === "offline") {
                    $(".img" + msgjson.jsonData.devNum + "").html("<img src='static/images/environment/" + msgjson.jsonData.devType + "-off.png' alt='' srcset=''>");
                    $(".part" + msgjson.jsonData.devNum + "").addClass("-off");
                    // $(".part" + msgjson.jsonData.devNum + "").removeClass("-ongreen");
                    $("#stateoffline").html(parseInt(stateoffline) + 1);
                    if(nowstate==="on"){
                        $("#stateon").html(parseInt(stateon) - 1);
                    }else if(nowstate==="off"){
                        $("#stateoff").html(parseInt(stateoff) - 1);
                    }
                }
					// if (nowstate == "on") {
					// 	$("#stateon").html(parseInt(stateon) - 1);
					// } else if (nowstate == "off") {
                    //
					// } else if (nowstate == "offline") {
					// 	$("#stateoff").html(parseInt(stateoff) + 1);
					// 	$("#stateoffline").html(parseInt(stateoffline) - 1);
					// }
				// }
			}
			if (state == "on") {
                msgjson.jsonData.devState="on";
				state = "运行";
			} else if (state == "off") {
				state = "在线";
			} else if (state == "offline") {
				state = "离线";
			}
			var mode = msgjson.jsonData.mode;
			if (mode == "hand") {
				mode = "手动模式";
			} else {
				mode = "自动模式";
			}
			$("#data" + msgjson.jsonData.devNum + " dd.state").html("当前状态：<span class=" + msgjson.jsonData.devState + "></span>&nbsp;&nbsp;" + state + "");
			$("#data" + msgjson.jsonData.devNum + " dd.mode").html("当前模式：" + mode + "");
		}
		if (msgjson.jsonData.devType == "cjq" && result1 != "-1") {
			var msgdata = msgjson.jsonData.data;
			var wd = msgdata.wd.toFixed(2);
			var sd = msgdata.sd.toFixed(2);
			var tvoc = msgdata.tvoc.toFixed(2);

			if (!wd) {
				wd = 0;
			}
			if (!sd) {
				sd = 0;
			}
			if (!tvoc) {
				tvoc = 0;
			}
			$("#data" + msgjson.jsonData.devNum + " dd.wsd").html("<span>" + wd + "</span><span class='wsd-minfont'>℃</span>&nbsp;<span>" + sd + "</span><span class='wsd-minfont'>%RH</span>&nbsp;<span>" + tvoc + "</span><span class='wsd-minfont'>mg/m³</span>");
			$("#stateli" + msgjson.jsonData.devNum + "").html("（" + state + "）");
			$("#cjqmenu" + msgjson.jsonData.devNum + " tr").html("<th>" + wd + "<span class='minfont'>℃</span></th><th>" + sd + "<span class='minfont'>%RH</span></th><th>" + tvoc + "<span class='minfont'>mg/m³</span></th>");
		}
	} catch (error) {
		console.log(innerHTML);
	}
}

//关闭连接
function closeWebSocket() {
	websocket.close();
}
//发送消息
function send() {
	var message = document.getElementById('text').value;
	websocket.send(message);
}
