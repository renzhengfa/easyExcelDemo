var gdltype, colnum, gdlnum, qunum, qunum2, divs, lays;
var terminalX, imagescale, character, characterA, characterB, characlick;
var deng, temperature, humidity, tvoc, tempval, humval, tvocval, quname1, quname2, unlock, openunclick, right, left,
	stop, close, articulator, ventilate, rightmove, openshelf;
var arrayObj = new Array();
var arraypause = new Array();
var letters, lable, statemessage, msglable;
var aeraInterval; //通风
var isclockOn = false; //false按钮不可用,true可用
var inittimer = self.setInterval("clock()", 1000);
var personNum = 0 // 人数
var personModel // 不清楚数据结构 渲染人数变量
var hasPerson = false // 架体内是否有人
function clock() {

	var message = sessionStorage.getItem('laya_qu');
	var jsonmessage = JSON.parse(message);
	console.log('有你这么写定时器的吗', jsonmessage)
	if (jsonmessage) {
		terminalX = jsonmessage.width;
		imagescale = (terminalX / 101).toFixed(2);
		if (jsonmessage != "") {
			gdltype = jsonmessage.gdlType;
			colnum = jsonmessage.cols;
			divs = jsonmessage.divs;
			lays = jsonmessage.lays;
			if (gdltype == "左边") {
				gdlnum = 0;
				qunum = parseInt(jsonmessage.regionNum);
			} else if (gdltype == "右边") {
				gdlnum = jsonmessage.cols;
				qunum = parseInt(jsonmessage.regionNum);
			}
		} else {
			gdltype = "";
			colnum = 0;
			gdlnum = 0;
			qunum = "";
		}
		setup();
		window.clearInterval(inittimer);
		// Laya.loader.load("../../static/images/img/btn-bg.png", Handler.create(this, setup));
	}
}

function setup() {
	var Sprite = Laya.Sprite;
	var Stage = Laya.Stage;
	var HTMLDivElement = Laya.HTMLDivElement;
	var Browser = Laya.Browser;
	var Ease = Laya.Ease;
	var Tween = Laya.Tween;
	var Event = Laya.Event;
	var Image = Laya.Image;
	var Handler = Laya.Handler;
	var WebGL = Laya.WebGL;

	Laya.init(1500, 815);
	Laya.stage.scaleMode = "showall";
	//设置横竖屏
	Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
	//设置水平对齐
	Laya.stage.alignH = "center";
	//设置垂直对齐
	Laya.stage.alignV = "middle";
	Laya.stage.bgColor = "#e5e5e5";

	var bg = new Image();
	bg.skin = "../../static/images/img/btn-bg.png";
	Laya.stage.addChild(bg);
	//状态灯,温度,湿度,PM2.5
	deng = createImage("../../static/images/img/lock-off.png", 30, 150);
	temperature = createImage("../../static/images/img/temperature.png", 30, 1000);
	tempval = createLable("0 °C", "", 1040, 30);
	//personModel = createLable(`${personNum}人`, "", 450, 30)
	humidity = createImage("../../static/images/img/humidity.png", 30, 1140);
	humval = createLable("0 %RH", "", 1180, 30);
	tvoc = createImage("../../static/images/img/tvoc.png", 30, 1300);
	tvocval = createLable("0 μg/m³", "", 1340, 30);
	unlock = createImage("../../static/images/img/locked.png", 710, 0, unlockClick);
	// close = createImage("../../static/images/img/btn-open.png", 710, 110);
	openshelf = createImage("../../static/images/img/btn-openshelf.png", 710, 110);
	articulator = createImage("../../static/images/img/btn-hejia.png", 710, 220);
	ventilate = createImage("../../static/images/img/btn-wind.png", 710, 330);
	left = createImage("../../static/images/img/btn-left.png", 710, 1050);
	right = createImage("../../static/images/img/btn-right.png", 710, 1270);
	stop = createImage("../../static/images/img/btn-stop.png", 710, 1160, );
	unlock.name = 1;
	clockOn(character);
	
	//区
	if (gdltype == "左边") {} else if (gdltype == "右边") {}
	var qu = createLable("区号:", "", 5, 30);
	quname1 = createLable("" + qunum + "区", "", 55, 30);
	var person = createLable("架内人数", "", 380, 30)
	
	if (gdltype == "左边") {
		characterA = createImage("../../static/images/img/fixedList.png", 172, 0, "", 0);
		characterA.name = 1;
		characterA.scale(imagescale, 1);
		for (var i = 1; i < colnum; i++) {
			character = characterB + i;
			character = createImage("../../static/images/img/moveList.png", 172, terminalX * (i), "", i);
			character.name = i;
			character.text = "空闲";
			if (character.name != null) {
				arrayObj.push(character);
			}
			character.on("click", this, myClick, [character]);
			character.scale(imagescale, 1);
		}
	} else if (gdltype == "右边") {
		for (var i = 0; i < colnum - 1; i++) {
			character = characterB + i;
			character = createImage("../../static/images/img/moveList.png", 172, terminalX * (i + 1), "", i + 1);
			character.name = i;
			character.text = "到位";
			if (character.name != null) {
				arrayObj.push(character);
			}
			character.on("click", this, myClick, [character]);
			character.scale(imagescale, 1);
		}
		characterA = createImage("../../static/images/img/fixedList.png", 172, terminalX * colnum, "", colnum);
		characterA.scale(imagescale, 1);
	}

	function createImage(skin, top, left, Click, lable) {
		var character = new Image();
		character.skin = skin;
		character.top = top;
		character.left = left;
		//解决_x不存在问题--liuyuru
		character.mytopY = top;
		character.myleftX = left;
		if (Click) {
			character.on("click", this, Click);
		}
		Laya.stage.addChild(character);
		if (lable != undefined) {
			var letter = new Laya.Text();
			letter.text = lable;
			letter.color = "#000000";
			letter.fontSize = 18;
			character.addChild(letter);
			if (skin == "../../static/images/img/fixedList.png") {
				letter.color = "red";
				letter.y = 36;
				letter.x = 42;
			} else {
				letter.color = "#3a97ff";
				letter.y = 36;
				letter.x = 42;
			}
		}
		return character;
	}

	function myClick(character) {
		characlick = character;
		for (var i = 0; i < arrayObj.length; i++) {
			arrayObj[i].loadImage("../../static/images/img/moveList.png")
		}
		character.loadImage("../../static/images/img/selectedList.png");
		if (unlock.name == 1) {
			clockOn(character);
			// remindoff();
		} else {
			//非解锁状态下也可以选中并且存储
			clockOn(character);
			// clockOff(character);
			// remindon();
		}
	}
	//解除状态
	function unlockno() {
		isclockOn = true;
		unlock.graphics.clear();
		deng.graphics.clear();
		unlock = createImage("../../static/images/img/btn-openlock.png", 710, 0, openlockClick);
		deng = createImage("../../static/images/img/lock-on.png", 30, 150);
		unlock.name = 1;
	}
	//禁止状态
	function unlockyes() {
		isclockOn = false;
		unlock.graphics.clear();
		deng.graphics.clear();
		unlock = createImage("../../static/images/img/locked.png", 710, 0, unlockClick);
		deng = createImage("../../static/images/img/lock-off.png", 30, 150);
		unlock.name = 0;
	}
	//解锁
	function unlockClick() {
		msglable = "";
		var infojson = new Object();
		infojson.info = "Unlock"; //unban
		infojson.qu = qunum;
		window.parent.modalsend(infojson);
	}
	this.unlockEvent = function() {
		if (msglable) {} else {
			if (statemessage) {
				statelable.destroy();
			}
			statemessage = createStateLable("解除禁止 ", 180, 30);
		}
		unlockno();
	}

	//锁定
	function openlockClick() {
		var infojson = new Object();
		infojson.info = "locking"; // ban
		infojson.qu = qunum;
		window.parent.modalsend(infojson);
	}
	this.openlockEvent = function() {
		// if (msglable) {} else {
		if (statemessage) {
			statelable.destroy();
		}
		statemessage = createStateLable("禁止", 180, 30);
		// }
		unlockyes();
	}

	var rightleft;
	//停止
	function stopClick(character) {
		if(hasPerson){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  
			  layer.msg('架内有人');
			}); 
			
			return
		}
		if (isclockOn) {
			var infojson = new Object();
			infojson.info = "stop";
			infojson.qu = qunum;
			// stopEvent(infojson)
			window.parent.modalsend(infojson);
		} else {
			remindClick();
		}
	}
	this.stopEvent = function(statemsg) {
		if (statemessage) {
			statelable.destroy();
		}
		if (statemsg == "电机测速异常") {
			msglable = "压力报警";
			unlockyes();
		} else if (statemsg == "过道报警" || statemsg == "烟雾报警" || statemsg == "到位") {
			msglable = statemsg;
			unlockyes();
		} else if (statemsg == "unarrive") {
			msglable = "运行未到位";
			unlockyes();
		} else if (statemsg == "停止") {
			msglable = "停止";
			unlockyes();
		}
		statemessage = createStateLable(msglable, 180, 30);
		if (rightleft == "right") {
			rightstop();
		}
		if (rightleft == "left") {
			leftstop();
		}
		if (rightleft == "openwind") {
			if (gdltype == "左边") {
				leftstop();
				aeraInterval = setInterval(leftaera, 10000); //每隔.秒执行一次
			} else if (gdltype == "右边") {
				rightstop();
				aeraInterval = setInterval(rightaera, 10000);
			} else if (gdltype == "中") {
				aeraInterval = setInterval(rightaera, 10000);
				aeraInterval = setInterval(leftaera, 10000);
			}
		}
	}

	function rightstop() {
		for (var i = 0; i < arraypause.length; i++) {
			arraypause[i].clear();
		}
	}

	function leftstop() {
		for (var i = 0; i < arraypause.length; i++) {
			arraypause[i].clear();
		}
	}
	//打开自动
	function openClick() {
		if(hasPerson){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  
			  layer.msg('架内有人');
			}); 
			
			return
		}
		
		if (isclockOn) {
			var infojson = new Object();
			infojson.info = "openshelf";
			infojson.qu = qunum;
			// openEvent();
			window.parent.modalsend(infojson);
		} else {
			remindClick();
		}
	}
	this.openEvent = function() {
		if (statemessage) {
			statelable.destroy();
		}
		statemessage = createStateLable("打开自动开架", 180, 30);
		close.graphics.clear();
		close = createImage("../../static/images/img/btn-close.png", 710, 110, closeClick);
	}
	//关闭自动
	function closeClick() {
		if(hasPerson){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  
			  layer.msg('架内有人');
			}); 
			
			return
		}
		
		if (isclockOn) {
			var infojson = new Object();
			infojson.info = "closeshelf";
			infojson.qu = qunum;
			window.parent.modalsend(infojson);
		} else {
			remindClick();
		}
	}
	this.closeEvent = function() {
		if (statemessage) {
			statelable.destroy();
		}
		statemessage = createStateLable("关闭自动开架", 180, 30);
		close.graphics.clear();
		close = createImage("../../static/images/img/btn-open.png", 710, 110, openClick);
	}
	//开架
	function openshelfClick() {
		if(hasPerson){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  
			  layer.msg('架内有人');
			}); 
			
			return
		}
		
		if (isclockOn) {
			var infojson = new Object();
			infojson.info = "openframe";
			infojson.qu = qunum;
			infojson.jie = '1';
			infojson.lay = '1';
			var direction;
			if (gdltype == "左边") {
				direction = "左";
				infojson.lie = 1;
			} else if (gdltype == "右边") {
				direction = "右";
				infojson.lie = colnum - 1;
			}
			infojson.direction = direction;
			window.parent.modalsend(infojson);
		} else {
			remindClick();
		}
	}


	//开架
	function openshelfClick1(character) {
		if (character != null) {
			if(hasPerson){
				layui.use('layer', function(){
				  var layer = layui.layer;
				  
				  layer.msg('架内有人');
				}); 
				
				return
			}
			
			
			
			if (isclockOn) {
				var infojson = new Object();
				infojson.info = "openframe";
				infojson.qu = qunum;
				infojson.jie = '1';
				infojson.lay = '1';
				debugger;
				var direction;
				if (gdltype == "左边") {
					direction = "左";
					infojson.lie = character.name;
				} else if (gdltype == "右边") {
					direction = "右";
					infojson.lie = character.name + 1;
				}
				infojson.direction = direction;
				window.parent.modalsend(infojson);
			} else {
				remindClick();
			}
		} else {
			alert('请选中密集架');
		}
	}
	this.testmove = function() {
		var infojson = new Object();
		infojson.info = "openframe";
		infojson.qu = qunum;
		infojson.jie = divs;
		infojson.lay = lays;
		var direction;
		if (gdltype == "左边") {
			direction = "左";
			infojson.lie = 1;
		} else if (gdltype == "右边") {
			direction = "右";
			infojson.lie = colnum - 1;
		}
		infojson.direction = direction;
		window.parent.modalsend(infojson);
	}
	this.moveEvent = function() {
		var infojson = new Object();
		infojson.info = "merge";
		infojson.qu = qunum;
		window.parent.modalsend(infojson);
	}
	//合架
	function articulatorClick() {
		if(hasPerson){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  
			  layer.msg('架内有人');
			}); 
			
			return
		}
		
		if (isclockOn) {
			articulatorEvent();
		} else {
			remindClick();
		}
	}

	function articulatorEvent() {
		if (gdltype == "左边") {
			leftClick(arrayObj[colnum - 2]);
		} else if (gdltype == "右边") {
			rightClick(arrayObj[0])
		} else if (gdltype == "中") {
			rightClick(arrayObj[0]);
			leftClick(arrayObj[colnum - 2]);
		}
	}
	//通风
	function aerationClick() {
		if(hasPerson){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  
			  layer.msg('架内有人');
			}); 
			
			return
		}
		
		if (isclockOn) {
			var infojson = new Object();
			infojson.info = "aeration";
			infojson.qu = qunum;
			window.parent.modalsend(infojson);
		} else {
			remindClick();
		}
	}
	var aeraright, aera;
	this.openwindEvent = function() {
		if (statemessage) {
			statelable.destroy();
		}
		msglable = "正在通风中...";
		statemessage = createStateLable(msglable, 180, 30);
		if (letters) {
			letters.destroy();
		}
		if (gdltype == "左边") {
			aera = 0;
			rightClick(arrayObj[0]);
		} else if (gdltype == "右边") {
			aeraright = colnum - 2;
			leftClick(arrayObj[colnum - 2])
		} else if (gdltype == "中") {
			aeraright = gdlnum - 2;
			aera = gdlnum - 1;
			if (characlick) {
				if (characlick.name < gdlnum) {
					leftClick(arrayObj[gdlnum - 2])
				} else if (characlick.name > gdlnum) {
					rightClick(arrayObj[gdlnum - 1]);
				}
			} else {
				leftClick(arrayObj[gdlnum - 2])
				//						aeraInterval = setInterval(rightaera, 10000); //每隔.秒执行一次
				rightClick(arrayObj[gdlnum - 1]);
				//						aeraInterval = setInterval(leftaera, 10000); //每隔.秒执行一次
			}
		}
		rightleft = "openwind";
	}

	function leftaera() {
		if (aera < colnum - 1) {
			var infojson = new Object();
			infojson.info = "leftmove";
			infojson.qu = qunum;
			infojson.lie = arrayObj[aera].name;
			window.parent.modalsend(infojson);
			arraypause.push(a);
			aera++;
		} else {
			if (statemessage) {
				statelable.destroy();
			}
			statemessage = createStateLable("通风完毕", 180, 30);
			//					openlockClick();
			rightleft = "left";
			clearInterval(aeraInterval);
		}
	}

	function rightaera() {
		if (aeraright >= 0) {
			var infojson = new Object();
			infojson.info = "rightmove";
			infojson.qu = qunum;
			infojson.lie = arrayObj[aeraright].name;
			window.parent.modalsend(infojson);
			aeraright--;
		} else {
			if (statemessage) {
				statelable.destroy();
			}
			statemessage = createStateLable("通风完毕", 180, 30);
			//					openlockClick();
			rightleft = "right";
			clearInterval(aeraInterval);
		}
	}
	var right1;
	var t, total = 0;
	var arrt, qu, lie;
	var left, right;

	function rightClick(character) {
		if(hasPerson){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  
			  layer.msg('架内有人');
			}); 
			
			return
		}
		
		
		if (isclockOn) {
			if (character) {
				arraypause = [];
				var right = "gdlrightmove";
				if (letters) {
					letters.destroy();
				}
				qu = qunum;
				if (gdltype == "左边") {
					lie = character.name;
				} else if (gdltype == "右边") {
					lie = character.name + 1;
				}
				var infojson = new Object();
				infojson.info = "rightmove";
				infojson.qu = qunum;
				infojson.lie = lie;
				// rightEvent(lie)
				window.parent.modalsend(infojson);
			} else {
				alert("请选中密集架！");
			}
		} else {
			remindClick();
		}

	}
	this.rightEvent = function(lie) {
		unlockno();
		if (letters) {
			letters.destroy();
		}
		if (statemessage) {
			statelable.destroy();
		}
		msglable = "列正在右移中...";
		statemessage = createStateLable(lie + msglable, 180, 30);
		rightleft = "right";
		arrt = arrayObj.length - 1;
		if (gdltype == "左边") {
			t = arrayObj.length - lie + 1;
		} else if (gdltype == "右边") {
			t = arrayObj.length - lie + 1;
		} else if (gdltype == "中") {
			if (character.name < gdlnum) {
				t = Math.abs(gdlnum - lie - 1);
				total = arrt - t + 1;
				//							total = gdlnum +1;
			} else {
				t = Math.abs(colnum - lie + 1);
				total = 0;
			}
		}
		arraypause = [];
		for (var i = 0; i < t; i++) {
			//if (arrayObj[arrt - i - total].text == "空闲" || arrayObj[arrt - i - total].text == "停止") {
			a = Tween.to(arrayObj[arrt - i - total], {
				x: terminalX * (arrayObj[arrt - i - total].name + 1) //arrayObj[t - i]._x + terminalX
			}, 5000, Ease.linearIn, null, i * 1000, true);
			// arrayObj[arrt - i - total].text = "到位";
			arraypause.push(a);
		}
	}
	//右到位信息
	this.rightarriveEvent = function(gdlstyles, leftinfo) {
		var NotArrNum = 0; //未到位个数
		var AreaLength = 0; //平均长度
		var tempx = 0;
		for (var i = 1; i < arrayObj.length + 1; i++) {
			if (leftinfo[0][i] == 0) {
				NotArrNum++;
			}
		}
		AreaLength = terminalX / NotArrNum;
		for (var i = 1; i < arrayObj.length + 1; i++) {
			tempx = terminalX + tempx;
			if (leftinfo[0][i] == 0) {
				tempx = tempx + AreaLength;
			} else {}
			if (arrayObj[i - 1]) {
				arrayObj[i - 1].myleftX = tempx;
				arrayObj[i - 1].left = tempx;
			}
		}
		// for (var i = 1; i < leftinfo.length; i++) {
		//     if (leftinfo[i] == 0) {
		//         NotArrNum++;
		//     }
		// }
		// AreaLength = terminalX / NotArrNum;
		// for (var i = 1; i < leftinfo.length; i++) {
		//     tempx = terminalX + tempx;
		//     if (leftinfo[i] == 0) {
		//         tempx = tempx + AreaLength;
		//     } else {
		//     }
		//     if(arrayObj[i - 1]){
		//         arrayObj[i - 1].myleftX = tempx;
		//     }
		// }
	};
	//左到位信息
	this.leftarriveEvent = function(gdlstyles, rightinfo) {
		var NotArrNum = 0; //未到位个数
		var AreaLength = 0; //平均长度
		var tempx = (arrayObj.length + 1) * terminalX;
		for (var i = arrayObj.length - 1; i >= 0; i--) {
			if (rightinfo[0][i] == 0) {
				NotArrNum++;
			}
		}
		AreaLength = terminalX / NotArrNum;
		for (var i = arrayObj.length - 1; i >= 0; i--) {
			tempx = tempx - terminalX;
			if (rightinfo[0][i] == 0) {
				tempx = tempx - AreaLength;
			} else {

			}
			if (arrayObj[i]) {
				arrayObj[i].myleftX = tempx;
				arrayObj[i].left = tempx;
			}
		}
		// var tempx = rightinfo.length * terminalX;
		// for (var i = rightinfo.length - 2; i >= 0; i--) {
		//     if (rightinfo[i] == 0) {
		//         NotArrNum++;
		//     }
		// }
		// AreaLength = terminalX / NotArrNum;
		// for (var i = rightinfo.length - 2; i >= 0; i--) {
		//     tempx = tempx - terminalX;
		//     if (rightinfo[i] == 0) {
		//         tempx = tempx - AreaLength;
		//     } else {
		//
		//     }
		//     if(arrayObj[i]) {
		//         arrayObj[i].myleftX = tempx;
		//     }
		// }
	}
	// function leftarriveEvent(gdlstyles, lie, move) {
	//     //          	 arrayObj[lie-1].x = terminalX * (lie+left);
	//     if (gdlstyles == "右边") {
	//         arrayObj[lie]._x = terminalX * (lie);
	//     } else if (gdlstyles == "左边") {
	//         arrayObj[lie - 1]._x = terminalX * (lie + move);
	//     }
	// }
	function leftClick(character) {
		if(hasPerson){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  
			  layer.msg('架内有人');
			}); 
			
			return
		}
		if (isclockOn) {
			if (character) {
				if (letters) {
					letters.destroy();
				}
				arraypause = [];
				var left = "gdlleftmove";
				qu = qunum;
				if (gdltype == "左边") {
					lie = character.name;
				} else if (gdltype == "右边") {
					lie = character.name + 1;
				}
				var infojson = new Object();
				infojson.info = "leftmove";
				infojson.qu = qunum;
				infojson.lie = lie;
				// leftEvent(lie);
				window.parent.modalsend(infojson);
			} else {
				alert("请选中密集架！");
			}
		} else {
			remindClick();
		}
	}
	this.leftEvent = function(lie) {
		unlockno();
		if (letters) {
			letters.destroy();
		}
		if (statemessage) {
			statelable.destroy();
		}
		msglable = "列正在左移中...";
		statemessage = createStateLable(lie + msglable, 180, 30);
		rightleft = "left";
		if (gdltype == "左边") {
			t = lie;
		} else if (gdltype == "右边") {
			t = lie;
		} else if (gdltype == "中") {
			//							t = character.name + 1; //Math.abs(character.name - gdlnum);
			if (lie > gdlnum) {
				t = Math.abs(lie - gdlnum);
				total = gdlnum - 1;
			} else {
				t = lie + 1;
				total = 0;
			}
		}
		for (var i = 0; i < t; i++) {
			//					if (arrayObj[i + total].text == "到位" || arrayObj[i + total].text == "停止") {
			a = Tween.to(arrayObj[i + total], {
				x: terminalX * (arrayObj[i + total].name)
			}, 5000, Ease.linearIn, null, i * 1000);
			// arrayObj[i + total].text = "空闲";
			arraypause.push(a);
			//					}
		}
	}
	//按钮事件开关
	function clockOn(character) {
		// close.on("click", this, openClick);
		openshelf.on("click", this, openshelfClick1, [character]);
		articulator.on("click", this, articulatorClick);
		ventilate.on("click", this, aerationClick);
		right.on("click", this, rightClick, [character]);
		left.on("click", this, leftClick, [character]);
		stop.on("click", this, stopClick, [character]);
	}
	// function clockOff(character) {
	//     // close.off("click", this, openClick);
	//     openshelf.off("click", this, openshelfClick);
	//     articulator.off("click", this, articulatorClick);
	//     ventilate.off("click", this, aerationClick);
	//     right.off("click", this, rightClick, [character]);
	//     left.off("click", this, leftClick, [character]);
	//     stop.off("click", this, stopClick, [character]);
	// }
	// function remindon() {
	//     // close.on("click", this, remindClick);
	//     openshelf.on("click", this, remindClick);
	//     articulator.on("click", this, remindClick);
	//     ventilate.on("click", this, remindClick);
	//     stop.on("click", this, remindClick, [character]);
	//     right.on("click", this, remindClick, [character]);
	//     left.on("click", this, remindClick, [character]);
	// }
	// function remindoff() {
	//     // close.off("click", this, remindClick);
	//     openshelf.off("click", this, remindClick);
	//     articulator.off("click", this, remindClick);
	//     ventilate.off("click", this, remindClick);
	//     stop.off("click", this, remindClick, [character]);
	//     right.off("click", this, remindClick, [character]);
	//     left.off("click", this, remindClick, [character]);
	// }
}

function remindClick() {
	alert("密集架已禁止，请解锁！");
}

function createLable(skin, rl, x, y) {
	lable = new Laya.Text();
	lable.text = skin;
	lable.color = "#666666";
	if (rl == "left") {
		lable.color = "#3a97ff";
	}
	lable.fontSize = 20;
	lable.x = x;
	lable.y = y;
	Laya.stage.addChild(lable);
	return lable;
}

function createStateLable(skin, x, y) {
	statelable = new Laya.Text();
	statelable.text = "状态:" + skin;
	statelable.color = "#3a97ff";
	statelable.fontSize = 20;
	statelable.x = x;
	statelable.y = y;
	Laya.stage.addChild(statelable);
	return statelable;
}

function humitureEvent(temp, hum, tvoc) {
	if (tempval) {
		tempval.destroy();
	}
	if (humval) {
		humval.destroy();
	}
	if (tvocval) {
		tvocval.destroy();
	}
	tempval = createLable("" + temp + " °C", "", 1040, 30);
	humval = createLable("" + hum + " %RH", "", 1180, 30);
	tvocval = createLable("" + tvoc + " μg/m³", "", 1340, 30);
}
// 接盘注释 修改人数
function personEvent(num){
	// num是否存在没有做验证
	if(personModel){
		personModel.destroy()
	}
	// 这里再检测状态 加上限定
	hasPerson = Number(num)?true:false
	personNum = num
	personModel = createLable(`${personNum}人`, "", 500, 30)
	console.log(num,'确认别调用',hasPerson)
}
// api 
// 获取密集架中的状态

