var ws = new WebSocket("ws://127.0.0.1:7000/");

ws.onopen = function(evt) {
    console.log("Connection open ...");

};
ws.onerror=function(evt){
    ws = new WebSocket("ws://127.0.0.1:7000/");
}
ws.onmessage = function(evt) {
    console.log( "Received Message: " + evt.data);
    try {
        RFID(evt.data);
    }catch (e)
    {

    }
};

ws.onclose = function(evt) {
    console.log("Connection closed.");
};
function readRFID() {
    if(ws!=null)
    {
        ws.send("Rfid");
    }
}