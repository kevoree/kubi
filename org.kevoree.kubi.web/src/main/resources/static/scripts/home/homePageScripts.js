/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 17/10/13
 * Time: 18:14
 * To change this template use File | Settings | File Templates.
 */

var KubiHome = function(){

    var buildUpDownStopControl = function(node, service) {

        var serviceName = service.function.name.substring(0, service.function.name.lastIndexOf("::"));

        var control = $('<div class="btn-group"></div>');
        var btnUp = $('<a class="btn btn-small" href="javascript:;"><i class="icon-chevron-up"></i></button>');
        var btnStop = $('<a class="btn btn-small" href="javascript:;"><i class="icon-stop"></i></button>');
        var btnDown = $('<a class="btn btn-small" href="javascript:;"><i class="icon-chevron-down"></i></button>');
        btnUp.appendTo(control);
        btnStop.appendTo(control);
        btnDown.appendTo(control);

        $(btnUp).on('click', function () {
            var msg = {nodeId:node.id};

            msg.action = serviceName + "::START_LEVEL_CHANGE";
            msg.technology = node.technology.name;
            var paramArray = [];
            var paramVal = {};
            paramVal.name = "direction";
            paramVal.value = "up";
            paramArray.push(paramVal);
            msg.parameters = paramArray;

            var request = {};
            request.messageType = "MESSAGE";
            request.content = msg;

            WebSocketHandler.send(JSON.stringify(request));
        });

        $(btnDown).on('click', function () {
            var msg = {nodeId:node.id};

            msg.action = serviceName + "::START_LEVEL_CHANGE";
            msg.technology = node.technology.name;
            var paramArray = [];
            var paramVal = {};
            paramVal.name = "direction";
            paramVal.value = "down";
            paramArray.push(paramVal);
            msg.parameters = paramArray;

            var request = {};
            request.messageType = "MESSAGE";
            request.content = msg;

            WebSocketHandler.send(JSON.stringify(request));
        });


        $(btnStop).on('click', function () {
            var msg = {nodeId:node.id};

            msg.action = serviceName + "::STOP_LEVEL_CHANGE";
            msg.technology = node.technology.name;

            var request = {};
            request.messageType = "MESSAGE";
            request.content = msg;

            WebSocketHandler.send(JSON.stringify(request));
        });



        return control;
    };




    var buildBooleanControl = function(node, service) {
        var serviceName = service.function.name.substring(0, service.function.name.lastIndexOf("::"));
        var control = $('<div class="make-switch switch-small" id="'+serviceName+'"data-on="success" data-off="danger" data-animated="true"><input type="checkbox" checked></div>');

        $(control).bootstrapSwitch(); // $('#toggle-state-switch').bootstrapSwitch('setState', false);

        $(control).on('switch-change', function (e, data) {
            var msg = {nodeId:node.id};

            msg.action = serviceName + "::SET";
            msg.technology = node.technology.name;

            if(service.function.parameters.array.length > 0) {
                var paramArray = [];
                $.each(service.function.parameters.array, function(key, val){
                    var paramVal = {};
                    paramVal.name = val.name;
                    paramVal.valueType = val.valueType;
                    if(val.valueType == "BOOLEAN") {
                        paramVal.value = data.value;
                    } else {
                        console.log("Could not retrieve the value from the form for param", val);
                    }
                    paramArray.push(paramVal)
                });
                msg.parameters = paramArray;
            }

            var request = {};
            request.messageType = "MESSAGE";
            request.content = msg;

            WebSocketHandler.send(JSON.stringify(request));
        });
        return control;
    };


    var initHomePage = function(){
        var container = $("div.row-fluid");
        var updateStatusMessageList = new Array();

        $.each(KubiKernel.getKubiModel().nodes.array, function(key,kubiNode) {

            var deviceUi = $('<div class="span2 kubi-device"></div>');
            var deviceName = $('<div class="kubi-device-name">'+kubiNode.id+'</div>');
            var devicePic = $('<div class="kubi-device-icon"><img src="img/Fibaro-WallPlug.png" /></div>');
            var deviceServiceList = $('<div class="kubi-device-serviceList"></div>');


            if(kubiNode.services != undefined) {
                var treatedServiceClass = new Array();

                $.each(kubiNode.services.array, function(key,service) {
                    console.debug("TreatedService",treatedServiceClass);
                    var serviceName = service.function.name.substring(0, service.function.name.lastIndexOf("::"));
                    var functioneName = service.function.name.substring(service.function.name.lastIndexOf("::") + 2, service.function.name.length);
                    console.debug("ServiceName",serviceName);
                    console.debug("inArray",$.inArray(serviceName, treatedServiceClass));
                    //if($.inArray(serviceName, treatedServiceClass) == -1) {
                        var deviceService;
                        //console.log("SwitchBinary ??",serviceName.equals("SWITCH_BINARY"));
                        if(serviceName == "SWITCH_BINARY") {
                            if(functioneName == "SET") {
                                deviceService = buildBooleanControl(kubiNode, service);
                                deviceService.appendTo(deviceServiceList);
                                treatedServiceClass.push(serviceName);
                            } else {
                                var msg = {nodeId:kubiNode.id};
                                msg.action = serviceName + "::GET";
                                msg.technology = kubiNode.technology.name;
                                var request = {};
                                request.messageType = "MESSAGE";
                                request.content = msg;
                                updateStatusMessageList.push(request);
                            }
                        } else if(serviceName == "BASIC_WINDOW_COVERING") {
                            if(functioneName == "START_LEVEL_CHANGE") {
                                deviceService = buildUpDownStopControl(kubiNode, service);
                                deviceService.appendTo(deviceServiceList);
                                treatedServiceClass.push(serviceName);
                            }
                        } else {
                            deviceService = $('<div class="kubi-device-service">'+service.function.name+'</div>');
                            deviceService.appendTo(deviceServiceList);
                        }
                    //}
                });
            }
            deviceName.appendTo(deviceUi);
            devicePic.appendTo(deviceUi);
            deviceServiceList.appendTo(deviceUi);
            kubiNode.uiElem = deviceUi;

            deviceUi.appendTo(container);

        });

        //request status of devices
        console.debug("UpdateMessageList", updateStatusMessageList);
        updateStatus(updateStatusMessageList);

    };

    var updateHomePage = function() {
        $("div.row-fluid").first().children().remove();
        initHomePage();
    };

    var privateMessageArrived = function(message) {
        console.debug("MessageReceived", message);
        $.each(KubiKernel.getKubiModel().nodes.array, function(key,kubiNode) {
           if(kubiNode.id == message.nodeId) {
               var serviceName = message.action.substring(0, message.action.lastIndexOf("::"));
               if(serviceName == "SWITCH_BINARY") {
                   $(kubiNode.uiElem).find('#'+serviceName).bootstrapSwitch('setState', message.state);
               } else {
                   console.warn("privateMessageArrived with unhandled action", serviceName);
               }

           }
        });
    };

    var updateStatus = function(messageList) {
        $.each(messageList, function(key, message){
            WebSocketHandler.send(JSON.stringify(message));
        });
    };

    return {
        init : initHomePage,
        modelUpdated:updateHomePage,
        messageArrived : function(message){privateMessageArrived(message);}
    }
}();



