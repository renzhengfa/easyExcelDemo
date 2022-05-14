var token = window.localStorage.getItem("token") || '';
/*ajax请求回调-liuyuru*/
/**
 * @type {string}
 */

window.baseurl = 'http://192.168.2.156:8082/';
window.imgurl = "http://192.168.2.121:8083/";
window.bindingurl = 'http://127.0.0.1:8889/';
window.wsUri ="ws://127.0.0.1:7500";
window.isHumiture=false;
(function (app, $) {
    app.url = baseurl
    app.send = function (url, type, data, async, callback,errorback) {
        var sendUrl = baseurl + url;
        var aj = $.ajax({
            url: baseurl + url,
            type: type,
            dataType: 'json',
            data: type == 'get' ? data : JSON.stringify(data),
            headers: {"authorization": token},
            async: async,
            contentType: 'application/json;charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            error: function (err) {
                if(errorback!=undefined)
                {
                    errorback(err);
                }
                console.log(err)
                //报错的时候提示
            },
            success: function (msg) {
                if(msg.status==403){
                    window.location.href='403.html';
                }else if(msg.status == 702){
                    window.location.href = 'login.html';
                }else {
                    callback(msg);
                }
            }
        })
    }

    app.bindingsend = function (url, type, data, async, callback,errorback) {
        console.log(type);
        var sendUrl = baseurl + url;
        var aj = $.ajax({
            url: bindingurl + url,
            type: type,
            dataType: 'json',
            data: type == 'get' ? data : JSON.stringify(data),
            headers: {"authorization": token},
            async: async,
            contentType: 'application/json;charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            error: function (err) {
                if(errorback!=undefined)
                {
                    errorback(err);
                }
                console.log(err)
                //报错的时候提示
            },
            success: function (msg) {
                if(msg.status==403){
                    window.location.href='403.html';
                }else if(msg.status == 702){
                    window.location.href = 'login.html';
                }else {
                    callback(msg);
                }
            }
        })
    }
    //用于查询
    app.get = function (url, data, callback,errorback) {
        app.send(url, 'get', data, true, callback,errorback)
    }
    // RFID查询
    app.bindingget = function (url, data, callback,errorback) {
        app.bindingsend(url, 'get', data, true, callback,errorback)
    }
    //用于同步查询
    app.getAsync = function (url, data, callback,errorback) {
        app.send(url, 'get', data, false, callback,errorback)
    }
    //用于非查询请求
    app.post = function (url, data, callback,errorback) {
        app.send(url, 'post', data, true, callback,errorback)
    }
    //用于同步非查询
    app.postAsync = function (url, data, callback,errorback) {
        app.send(url, 'post', data, false, callback,errorback)
    }
    //同步查询请求
    app.asyncGet = function (url, data) {
        var sendUrl = baseurl + url
        var result = null
        var aj = $.ajax({
            url: baseurl + url,
            type: 'get',
            dataType: 'json',
            data: data,
            async: false, //使用同步
            cache: true,
            headers: {"authorization": token},
            contentType: 'application/json;charset=utf-8',
            xhrFields: {
                withCredentials: true
            },
            error: function (err) {
                console.log(err)
                //报错的时候提示
            },
            success: function (msg) {
                result = msg
            }
        })
        return result
    }

    app.myajax = function (url, type, data, callback, async = false) {
        var aj = $.ajax({
            url:url,
            dataType: 'json',
            type: type,
            data: data,
            async:async,
            headers: {"authorization": token},
            contentType: 'application/x-www-form-urlencoded',
            error: function (err) {
                if(data.type=="openframe"){
                    layer.msg("出错了,请检查设备是否连接！");
                }
                if(isHumiture && data.Into === "gethumiture"){
                    tempRatio(0.0);
                    humRatio(0.0);
                }
                //layer.msg('出错了')
                console.log("出错了")
                console.log(err)
                //报错的时候提示
            },
            success: function (msg) {
                callback(msg)
            }
        })
    }
    app.myAxios = function (url, type, data, callback, async = true) {

        let promise = new Promise((resolve,reject)=>{
            $.ajax({
                url:url,
                dataType: 'json',
                type: type,
                data: data,
                async:async,
                headers: {"authorization": token},
                contentType: 'application/x-www-form-urlencoded',
                error: function (err) {
                    if(data.type=="openframe"){
                        layer.msg("出错了,请检查设备是否连接！");
                    }
                    if(isHumiture && data.Into === "gethumiture"){
                        tempRatio(0.0);
                        humRatio(0.0);
                    }
                    console.log("出错了")
                    console.log(err)
                    //报错的时候提示
                    reject(err)
                },
                success: function (msg) {
                    resolve(msg)
                }
            })
        })
        return promise
    }
})((window.app = {}), $)
