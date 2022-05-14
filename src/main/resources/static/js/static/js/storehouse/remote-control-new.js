// 获取库房
var inittimer;
var quIp, quNum;
var receivelable = "";//密集架是否链接成功
var setup;
var getContext;//获取状态
(function () {
    getMenuBar();//自定义面包屑，引用public-menu.js
    app.get('storeroommodule/StoTbStore/selectIsNotDelete', '', function (res) {
        if (res.state) {
            var store = res.rows, li = '';
            for (var i = 0; i < store.length; i++) {
                li += `<li data-id ="${store[i].id}">${store[i].storeName}</li>`;
            }
            $('#storeRegion').append(li);
            storeMsg();
        }
    });
})();

var end = 0, mid = 0, status, fixed;
let runStatus, _runStatus1, _runStatus2;

// 查询区
function storeMsg() {
    $('#storeRegion li').on('click', function () {
        var that = this;
        $('.region').remove();
        app.get('storeroommodule/stoTbRegion/selectByBind', { fkStoreId: that.dataset.id }, function (res) {
            if (res.state) {
                var li = '';
                var regions = res.rows;
                for (var i = 0; i < regions.length; i++) {
                    li += `<li data-id="${regions[i].id}" data-num="${regions[i].regionNum}" data-bind="${regions[i].bindId}" data-gdlType="${regions[i].gdlType}">${regions[i].regionName}</li>`
                }
                var region = `<ul class="region">${li}</ul>`;
                $(that).append(region);
                getRegion();
            }
        });
    })
}

var temperature, statesTime, controlTime, positionTime;

function getRegion() {
    $('.region li').on('click', function (e) {
        var that = this;
        $('#storeRegion li').removeClass('li-this');
        $(that).addClass('li-this');
        runStatus = undefined;
        _runStatus1 = undefined;
        _runStatus2 = undefined;
	
        if (getContext) {
            window.clearInterval(getContext);
            $('.body-post').html("");
            setup = "";
        }
        app.get('storeroommodule/stoTbRegion/selectByBind', { id: that.dataset.id }, function (res) {
            quIp = res.rows[0].reqestIp + ":" + res.rows[0].httpPort;
            quNum = res.rows[0].regionNum;

            var ele = $('.columns');
            var colum = '', columns = '', lColumn = '', rColumn = '';
            if (res.state) {
                sessionStorage.removeItem('laya_qu');
                var data = res.rows;
                // if (data[0].bindId != 0) {
                //     app.get('storeroommodule/stoTbRegion/selectByBind', { id: data[0].bindId }, function (msg) {
                //         if (msg.state) {
                //             var dataBind = msg.rows;
                //             sessionStorage.setItem('laya_qubind', JSON.stringify(dataBind[0]));
                //             sessionStorage.setItem('laya_qu', JSON.stringify(data[0]));
                //             $('.body-post').html('<iframe id="menuframe" name="menuframe" src="modal.html" frameborder="no" style="width:100%;height:100%;"></iframe>');
                //             // setInterval("get_context()", 1000);
                //         }
                //     });
                // } else {
                // sessionStorage.setItem('laya_qubind', "");

                sessionStorage.setItem('laya_qu', JSON.stringify(data[0]));
                $('.body-post').html('<iframe id="menuframe" name="menuframe" src="modal.html" frameborder="no" style="width:calc(100% - 20px);height:100%;"></iframe>');
                getContext = setInterval("get_context()", 1000);
                // }
            }
        });
        e.stopPropagation();
    })
}

// function clock() {
//     var message = sessionStorage.getItem('laya_qu');
//     var jsonmessage = JSON.parse(message);
//     if (jsonmessage) {
//         $('.modal').html('<iframe id="menuframe" name="menuframe" src="modal.html" frameborder="no" style="width:748px;height:337px;"></iframe>');
//         window.clearInterval(inittimer);
//     } else {
//         // var infojson = new Object();
//         // infojson.info = "getinfo";
//         // modalsend(infojson);
//     }
// }

var context;
function get_context() {
    if (setup) {
        //发送命令
        modalreceive();
        modalstate();
        //测试移动
        // test_move();
        modalhumiture();
		//modalPerson()
    } else {
        setup = new menuframe.window.setup();
    }
}
//发送命令
var isgetposition=true;
function modalsend(infojson, style) {
    if (receivelable == "出错了" || receivelable == "") {
        alert("设备未连接,请检查！");
    } else {
        var data;
        if (infojson.lie) {
            data = {
                type: infojson.info,
                qu_num: infojson.qu,
                column: infojson.lie,
            };
        } else {
            data = {
                type: infojson.info,
                qu_num: infojson.qu,
            };
        }
        if (infojson.info == "openframe") {
            data = {
                type: infojson.info,
                qu_num: infojson.qu,
                column: infojson.lie,
                section: infojson.jie,
                layer: infojson.lay,
                direction: infojson.direction,
            };
        }
        app.myajax(`http://${quIp}/GDL`, 'POST', data, function (res) {
            console.log(res);
            if(res.message=="左移中" || res.message=="右移中" ||res.message=="打开架体" || res.message=="通风"){
                isgetposition=false;
            }else {
                isgetposition=true;
            }
            //测试移动
            // nowstate = res.message;
        });
    }
}
//接收命令
var gdlnum, gdlstyles;
var nowstate = "禁止";//ban
function modalreceive() {
    if (nowstate == "正在右移中" || nowstate == "正在左移中" || nowstate == "右移中" || nowstate == "左移中" || !isgetposition) {
    } else {
        var message = sessionStorage.getItem('laya_qu');
        var jsonmessage = JSON.parse(message);
        var gdltype = jsonmessage.gdlType;
        colnum = jsonmessage.cols;
        var leftNum = 0, rightNum = 0;
        gdlnum = jsonmessage.cols;
        if (gdltype == "左边") {
            leftNum = jsonmessage.regionNum;
        } else if (gdltype == "右边") {
            rightNum = jsonmessage.regionNum;
        }
        action = "getposition";
        var data = {
            Into: 'getposition',
            leftnum: leftNum,
            rightnum: rightNum
        };
        app.myajax(`http://${quIp}/GDL`, 'GET', data, function (res) {
            console.log(res);
            receivelable = res;
            if (res) {
                var move = 0;
                if (gdltype == "左边") {
                    var leftinfo = res.right.leftposition;
                    setup.rightarriveEvent(gdltype, leftinfo);
                } else if (gdltype == "右边") {
                    var rightinfo = res.left.rightposition;
                    setup.leftarriveEvent(gdltype, rightinfo);
                }
            }
        }, true);
    }
}
var ismove=true;
var islock=true;
var statenumber=0;
function modalstate() {
    action = "getstates";
    var data = {
        Into: action,
        qu_num: quNum
    };
    app.myajax(`http://${quIp}/GDL`, 'GET', data, function (res) {
        console.log(res);
        receivelable = res;
        if (res) {
            var statemsg = res.message;
            if (statemsg == "禁止" ) { //ban
                setup.openlockEvent();
            }else if(statemsg == "解除") {
                setup.unlockEvent();
            }
            if (nowstate == statemsg) {
                return;
            }
            if(nowstate =="左移中" || nowstate =="右移中" || nowstate =="打开架体"|| nowstate =="通风"){
                isgetposition=false;
            }else {
                isgetposition=true;
            }
            nowstate = statemsg;
            try {
                if (statemsg == "closescreen" || statemsg == "禁止") {
                    setup.openlockEvent();
                } else if (statemsg == "到位" || statemsg == "unarrive" ||statemsg == "停止" || statemsg == "压力报警" || statemsg == "过道报警" || statemsg == "烟雾报警" || statemsg == "电机测速异常") {
                    setup.stopEvent(statemsg);
                } else if (statemsg == "解除") { //unban
                    setup.unlockEvent();
                } else if (statemsg == "正在右移中") {
                    if (quNum == res.qu) {
                        var lie = res.lie;
                        // setup.unlockEvent();
                        setup.rightEvent(lie);
                    }
                } else if (statemsg == "正在左移中") {
                    if (quNum == res.qu) {
                        var lie = res.lie;
                        // setup.unlockEvent();
                        setup.leftEvent(lie);
                    }
                } else if (statemsg == "openwind") {
                    setup.openwindEvent();
                } else if (statemsg == "打开自动开架") {
                    setup.openEvent();
                } else if (statemsg == "closeshelf") {
                    setup.closeEvent();
                } else if (statemsg == "息屏") {
                    layer.msg("密集架息屏中");
                }else if (statemsg == "打开合架") {
                    console.log("是否进入"+statemsg);
                    setup.moveEvent();
                }

            } catch (e) {

            }
        }
    }, true);
}
var temp, hum, tvoc;
function modalhumiture() {
    action = "gethumiture";
    var data = {
        Into: action,
        qu_num: quNum
    };
    app.myajax(`http://${quIp}/GDL`, 'GET', data, function (res) {
        receivelable = res;
        console.log(res);
        if (res) {
            temp = res.temperature;
            hum = res.humidity;
            tvoc = res.PM;
			let person = Number(res.personCount)
			menuframe.window.personEvent(person)
            menuframe.window.humitureEvent(temp, hum, tvoc);
        }
    }, true);
}
// 修改人数
function modalPerson(){
	app.post("denseShelves/getstates?quNum="+ quNum,'',function(res){
		if (res.state && res.row){
			let data = JSON.parse(res.row);
			let person = Number(data.personCount)
			//menuframe.window.personEvent(500)
			menuframe.window.personEvent(person)
		}
		console.log(res,'传递人数数据')
	})
	
}
//测试移动
function  test_move() {
    action = "getstates";
    var data = {
        Into: action,
        qu_num: quNum
    };
	
    app.myajax(`http://${quIp}/GDL`, 'GET', data, function (res) {
        console.log(res);
        receivelable = res;
        
        if (res) {
            var statemsg = res.message;
            if(statemsg == "解除" || statemsg == "正在右移中" || statemsg == "正在左移中"){
                statenumber++;
                if(statenumber>30){
                    statenumber=0;
                    var infojson = {};
                    infojson.info = "locking";//unban
                    infojson.qu = res.qu;
                    modalsend(infojson);
                }
            }
            if(statemsg == "禁止" || statemsg == "到位" ){
                console.log(islock);
                statenumber++;
                if(statenumber>10){
                    islock=true;
                }
                if(islock) {
                    statenumber=0;
                    islock = false;
                    var infojson = {};
                    infojson.info = "Unlock";//unban
                    infojson.qu = res.qu;
                    modalsend(infojson);
                }
                return;
            }
            if(statemsg=="打开合架"){
                statemsg="合架";
                ismove=false;
            }
            if (nowstate == statemsg) {
                return;
            }
            if(nowstate =="左移中" || nowstate =="右移中" || nowstate =="打开架体"|| nowstate =="通风"){
                isgetposition=false;
            }else {
                isgetposition=true;
            }
            if(ismove){
                if(statemsg == "正在右移中" || statemsg == "正在左移中" ||statemsg=="合架" ){
                    return;
                }else{
                    islock = true;
                    ismove=false;
                    // nowstate = "开架";
                    var infojson = new Object();
                    infojson.info = "leftmove";
                    infojson.qu = 2;
                    infojson.lie = 2;
                    modalsend(infojson);
                }
            }else {
                if(statemsg == "正在右移中" || statemsg == "正在左移中"  ){
                    return;
                }else {
                    ismove = true;
                    islock = true;
                    var infojson = new Object();
                    infojson.info = "rightmove";
                    infojson.qu = 2;
                    infojson.lie = 1;
                    modalsend(infojson);
                    // nowstate = "合架";
                    // setup.moveEvent();//合架
                }
            }
            nowstate = statemsg;
            try {
                if (statemsg == "closescreen" || statemsg == "禁止") {
                    setup.openlockEvent();
                } else if (statemsg == "到位" || statemsg == "unarrive" ||statemsg == "停止" || statemsg == "压力报警" || statemsg == "过道报警" || statemsg == "烟雾报警" || statemsg == "电机测速异常") {
                    setup.stopEvent(statemsg);
                } else if (statemsg == "解除") { //unban
                    setup.unlockEvent();
                } else if (statemsg == "正在右移中") {
                    if (quNum == res.qu) {
                        var lie = res.lie;
                        // setup.unlockEvent();
                        setup.rightEvent(lie);
                    }
                } else if (statemsg == "正在左移中") {
                    if (quNum == res.qu) {
                        var lie = res.lie;
                        // setup.unlockEvent();
                        setup.leftEvent(lie);
                    }
                } else if (statemsg == "openwind") {
                    setup.openwindEvent();
                } else if (statemsg == "打开自动开架") {
                    setup.openEvent();
                } else if (statemsg == "closeshelf") {
                    setup.closeEvent();
                } else if (statemsg == "息屏") {
                    layer.msg("密集架息屏中");
                }else if (statemsg == "打开合架") {
                    console.log("是否进入"+statemsg);
                    setup.moveEvent();
                }

            } catch (e) {

            }
        }
    }, true);
}