count=0; 
(function(app,$,mycmd){
    mycmd.rfid=function({ wsUrl, cmd, row }, callback) {
        var wsUrl = wsUrl;
        var cmd = cmd;
        var row = row ? row : '';
        var rfids= new Array();
        var time_num=0;
        var t1;
		console.log('websocket')
        if(typeof (websocket)!="undefined"){
            //websocket.close();
            if (row) {
                websocket.send(JSON.stringify({ cmd, row }));
            } else {
                websocket.send(JSON.stringify({ cmd }))
            }
            if( window.websocket.readyState !=  window.websocket.OPEN){
                Handleerror();
            }
        }else {
        websocket = new WebSocket(wsUri);
        websocket.onopen = function (evt) {
            console.log('连接成功'); 
            if (row) {
                websocket.send(JSON.stringify({ cmd, row }));
            } else {
                websocket.send(JSON.stringify({ cmd }))
            }
        };
        websocket.onclose = function (evt) {  
            console.log('连接失败'); 
            Handleerror();
        };
        websocket.onmessage = function (evt) {
            clearTimeout(t1);
            count=1;
            var c = evt.data;
            var res = JSON.parse(c);
            if(res.row){
               if(rfids[res.row.EPC]==null){
                   rfids[res.row.EPC]=c;
               }
            }
            t1= setTimeout(callback_rfid, 1200);
        };
        websocket.onerror = function (evt) {
            var c = evt.data;
            if(!c) return;
            callback(c);
        };
        }
        function callback_rfid() {
            setTimeout(function(){
                if(rfids.length==0){Handleerror();}
            },3000)
            for(var key in rfids){
                callback(rfids[key]); 
            }
        }
        //error
        function Handleerror(){
            var data={state:false};
            callback(JSON.stringify(data));
            return false;
        }
    }
})(app,$,(window.mycmd={}))