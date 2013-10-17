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
    var onMessageAction;

    var init = function() {
        console.log("Opening WebSocket to " + wsAddr);
        reconnect();
    }

    var reconnect = function() {
        ws = new WebSocket(wsAddr);
        ws.onopen = function () {
            console.log("WebSocket opened.");
            var statusBar = $('.connectionStatus').first();
            if(statusBar.has("[hidden]").empty()) {
                statusBar.removeClass("alert-danger");
                statusBar.addClass("alert-success");
                statusBar.children().remove();
                $('<h4>Connection to server resumed.</h4>').appendTo(statusBar);
                window.setTimeout(function() {statusBar.attr("hidden","");}, 4000);
            }
        };
        ws.onclose = function () {
            console.log("WebSocket closed !");
            var statusBar = $('.connectionStatus').first();
            statusBar.removeClass("alert-success");
            statusBar.addClass("alert-danger");
            statusBar.children().remove();
            $('<h4>Connection to server lost !</h4>').appendTo(statusBar);
            statusBar.removeAttr("hidden");
            window.setTimeout(reconnect,2000);
        };
        if(onMessageAction != undefined) {
            ws.onmessage = onMessageAction;
        } else {
            ws.onmessage = function (msg) {
                var parsedMessage = JSON.parse(msg.data);
                //console.log(parsedMessage.messageType);
                if(parsedMessage.messageType == "MODEL") {
                    console.log("Model receive from server");
                    KubiKernel.setKubiModel(KubiKernel.getLoader.loadModelFromString(parsedMessage.content).get(0));
                    console.log("Model loaded");
                    if (typeof KubiGraphHandler != 'undefined') {
                        KubiGraphHandler.refreshModel();
                    }
                    if(typeof  KubiHome != 'undefined') {
                        KubiHome.modelUpdated();
                    }

                } else if(parsedMessage.messageType == "MESSAGE") {
                    KubiMessageHandler.handleMessage(parsedMessage.content);
                } else if(parsedMessage.messageType == "PAGE_TEMPLATE") {
                    KubiMenuHandler.applyPage(parsedMessage.content);
                } else {
                    console.log("Unknown message type received from server", parsedMessage);
                }
            };



        }

        ws.onerror = function() {
            console.log("WebSocket Error !");
            window.setTimeout(reconnect,2000);
        }
    }

    return {
        init : init,
        setOnMessage : function(action) {
            onMessageAction = action;
            ws.onmessage = action;
        },
        send : function(msg) {
            console.log("Sendin message", msg);
            ws.send(msg);
        }
    };

}();




