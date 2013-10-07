/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 07/10/13
 * Time: 11:04
 * To change this template use File | Settings | File Templates.
 */



var WebSocketHandler = function(){

    var wsAddr =  'ws://' + document.location.host + '/ws';
    var ws;

    var init = function() {
        console.log("Opening WebSocket to " + wsAddr);
        ws = new WebSocket(wsAddr);
        ws.onopen = function () {
            console.log("WebSocket opened.");
        };
        ws.onclose = function () {
            console.log("WebSocket closed !");
        };
        ws.onmessage = function (msg) {
            console.log("Default message received action", msg);
        };
    }


    return {
        init : init,
        setOnMessage : function(action) {
            ws.onmessage = action;
        },
        send : function(msg) {
            console.log("Sendin message", msg);
            ws.send(msg);
        }
    };

}();




