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
            window.setTimeout(reconnect,4000);
        };

        ws.onerror = function() {
            console.log("WebSocket Error !");
            window.setTimeout(reconnect,4000);
        };

        if(onMessageAction != undefined) {
            ws.onmessage = onMessageAction;
        } else {
            ws.onmessage = function (msg) {
                var parsedMessage = JSON.parse(msg.data);
                //console.log(parsedMessage.messageType);
                if(parsedMessage.CLASS == "MODEL") {
                    if (parsedMessage.ACTION == "UPDATE") {
                        console.log("Model Update receive from server");
                        var seq = new module.org.kevoree.modeling.trace.TraceSequence();
                        seq.populateFromString(parsedMessage.CONTENT);
                        seq.applyOn(KubiKernel.getKubiModel());
                    } else if (parsedMessage.ACTION == "INIT") {
                        console.log("Model Init receive from server");
                        KubiKernel.setKubiModel(KubiKernel.getLoader().loadModelFromString(parsedMessage.CONTENT).get(0));
                    }
                    if (typeof KubiGraphHandler != 'undefined') {
                        KubiGraphHandler.refreshModel();
                    }
                    if (typeof  KubiHome != 'undefined') {
                        KubiHome.modelUpdated();
                    }
                } else if(parsedMessage.CLASS == "REPORT") {
                    KubiMessageHandler.handleMessage(parsedMessage.CONTENT);
                } else if(parsedMessage.CLASS == "ACTION") {
                    KubiMessageHandler.handleMessage(parsedMessage.CONTENT);
                } else if(parsedMessage.CLASS == "PAGE_TEMPLATE") {
                    if(parsedMessage.ACTION == "REPORT") {
                        KubiMenuHandler.applyPage(parsedMessage.CONTENT);
                    }


                } else {
                    console.log("Unknown message type received from server", parsedMessage);
                }
            };
        }
    };

    return {
        init : init,
        setOnMessage : function(action) {
            onMessageAction = action;
            ws.onmessage = action;
        },
        send : function(msg) {
            console.log("Sending message", msg);
            ws.send(msg);
        }
    };

}();




