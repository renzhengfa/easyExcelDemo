// 获取库房
(function () {
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
        app.get('storeroommodule/stoTbRegion/selectByBind', {fkStoreId: that.dataset.id}, function (res) {
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

var leftcol=0;
var rightcol=0;
//密集架具体绘画方法
function dorwRegion(left,right,quid) {
    var small = $("#small").html();
    var big = $("#big").html();
    var ele = $('.columns');
    ele.empty();
    if(left==null){
        ele.append(big);
        for (var i = 0; i < right.cols - 1; i++) {
            var replace = small.replace("{{index}}",i+1).replace("{{index}}",i+1).replace("{{quIp}}",quid).replace("{{type}}",1);
            replace=replace.replace("{{class}}",'')
            if(i==0){
                replace=replace.replace("{{one}}","is")
            }else{
                replace=replace.replace("{{one}}","no")
            }
            ele.append(replace);
        }
        rightcol=right.cols - 1;
    }else if(right==null){
        for (var i = 0; i < left.cols - 1; i++) {
            var replace = small.replace("{{index}}",i+1).replace("{{index}}",i+1).replace("{{quIp}}",quid).replace("{{type}}",2);
            if(i==0){
                replace=replace.replace("{{class}}",'style="left:170px;"')
            }else{
                replace=replace.replace("{{class}}",'')
            }
            if(i==left.cols-2){
                replace=replace.replace("{{one}}","is")
            }else{
                replace=replace.replace("{{one}}","no")
            }
            ele.append(replace);
        }
        ele.append(big);
        leftcol=left.cols - 1;
    }else{
        for (var i = 0; i < left.cols - 1; i++) {
            var replace = small.replace("{{index}}",i+1).replace("{{index}}",i+1).replace("{{quIp}}",quid).replace("{{type}}",1);
            replace=replace.replace("{{class}}",'style="left:170px;"')
            if(i==left.cols-2){
                replace=replace.replace("{{one}}","is")
            }else{
                replace=replace.replace("{{one}}","no")
            }
            ele.append(replace);
        }
        ele.append(big);
        for (var i = 0; i < right.cols - 1; i++) {
            var replace = small.replace("{{index}}",i+1).replace("{{index}}",i+1).replace("{{quIp}}",quid).replace("{{type}}",2);
            replace=replace.replace("{{class}}",'style="left:170px;"')
            if(i==0){
                replace=replace.replace("{{one}}","is")
            }else{
                replace=replace.replace("{{one}}","no")
            }
            ele.append(replace);
        }
        leftcol=left.cols - 1;
        rightcol=right.cols - 1;
    }

}

//得到区信息与处理的方法
function getRegion() {
    $('.region li').on('click', function (e) {
        var that = this;
        $('#storeRegion li').removeClass('li-this');
        $(that).addClass('li-this');
        runStatus = undefined;
        _runStatus1 = undefined;
        _runStatus2 = undefined;
        app.get('storeroommodule/stoTbRegion/selectByBind', {id: that.dataset.id}, function (res) {
            var region=res.rows[0];
            // region.reqestIp = '192.168.43.213:8081';
            var quip=region.reqestIp;
            var quIp=region.reqestIp;
            var quNum=region.regionNum;
            var bandregion=null;
            var left=null;
            var right=null;
            console.log(res);
            var type=region.gdlType=="左边"?1:2;

            if(region.bindId!=0){
                var result=app.asyncGet('storeroommodule/stoTbRegion/selectByBind', {id: region.bindId})
                bandregion=result.rows[0];
            }
            if(type==1&&bandregion==null){
                left=region;
                right=bandregion;
            }else if(type==2&&bandregion==null){
                left=bandregion;
                right=region;
            }
            else{
                if(type==1){
                    left=region;
                    right=bandregion;
                }else{
                    left=bandregion;
                    right=region;
                }
            }
            dorwRegion(left,right,quip);//绘制密集架

            /*if (type == 1) {
                for (var i = 0; i < res.rows[0].cols - 1; i++) {
                    ele.append(small);
                }
                ele.append(big);
            }
            if (type == 2) {
                ele.append(big);
                for (var i = 0; i < res.rows[0].cols - 1; i++) {
                    ele.append(small);
                }
            }*/


            //以前的代码
            getTemperature(quIp, quNum);
            temperature = setInterval(function () {
                getTemperature(quIp, quNum);
            }, 1000);
            getStates(quIp, quNum);
            control(quIp, quNum);
            open(quIp, quNum);
            closeTask(quIp, quNum);
            tongFeng(quIp, quNum);
        });
        //e.stopPropagation();
    })
}

function getTemperature(url, quNum) {
    var data = {
        Into: 'gethumiture',
        qu_num: quNum
    };
    var url=`http://`+url+`/GDL`;
    app.myajax(url, 'GET', data, function (res) {
        if (res) {
            $('#temperature').text(res.temperature);
            $('#humidity').text(res.humidity);
            $('#tvoc').text(res.PM);
        }
    }, true);
    var state = $('#KN-state');
    var text = state.text();
    if(text != '锁定'){
       $('#locked').removeClass('locking');
    }
}

function getPosition(url, leftNum, rightNum) {
    var data = {
        Into: 'getposition',
        leftnum: leftNum,
        rightnum: rightNum
    };
    app.myajax(`http://${url}/GDL`, 'GET', data, function (res) {
        console.log(res);
        if (res) {
            var lLeftposition = res.left.leftposition,
                lRightposition = res.left.rightposition;
            // rLeftposition = res.right.leftposition,
            // rRightposition = res.right.rightposition;

            if (lLeftposition !== lRightposition || rLeftposition !== rRightposition) {
                $('#stop').trigger('click');
            }
        }
    })
}

function getStates(url, quNum) {
    var data = {
        Into: 'getstates',
        qu_num: quNum
    };
    app.myajax(`http://${url}/GDL`, 'GET', data, function (res) {
        console.log(res);
        if (res) {
            $('#KN-state').text(res.message);
            if (res.message == '自动开架') {
                state = true;
            }
            // 更新状态
        }
        else {
            alert('解锁失败')
        }
    }, true)
}

// function unlock(url, quNum) {
//
// }

var state = false;

function control(url, quNum) {
    var lie = $('#KN-this').text();
    // 解锁上锁
    $('#locked').on('click', function () {
        var lie = $('#KN-this').text();
        var index = lie.lastIndexOf("\-");
        lie = lie.substring(index + 1, lie.length);
        // 发送请求
        // 判断状态
        var stateItem = $('#KN-state');
        var state = stateItem.text();
        if (state !== '解锁') {
            // 解锁命令
            var data = {
                type: 'locking',
                qu_num: quNum,
            };
            app.myajax(`http://${url}/GDL`, 'POST', data, function (res) {
                console.log(res);
                if (res.code == "200") {
                    var lock = $('#locked');
                    stateItem.text(res.message);
                    lock.addClass('locking');
                    lock.find('p').text('解锁');
                    // 更新状态
                    return
                }
                else {
                    alert('解锁失败')
                }
            });
        }
        else {
            // 锁定
            var data = {
                type: 'Unlock',
                qu_num: quNum,
            };
            app.myajax(`http://${url}/GDL`, 'POST', data, function (res) {
                console.log(res);
                if (res) {
                    var lock = $('#locked');
                    stateItem.text(res.message);
                    lock.removeClass('locking');
                    lock.find('p').text('锁定');
                    // 更新状态
                }
                else {
                    alert('锁定失败')
                }
            });
        }

    })

}