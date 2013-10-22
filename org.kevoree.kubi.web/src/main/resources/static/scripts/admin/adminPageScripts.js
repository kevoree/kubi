/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 22/10/13
 * Time: 17:27
 * To change this template use File | Settings | File Templates.
 */



var KubiAdminPage = function(){


    var initAddDeviceButton = function(){
        $('#adm_include_device').on('click', function(){
            var msg = {};
            msg.action = "ADMIN::START_DEVICE_ADDITION_DISCOVERY";
            msg.technology = "ALL";
            /*var paramArray = [];
            var paramVal = {};
            paramVal.name = "direction";
            paramVal.value = "down";
            paramArray.push(paramVal);
            msg.parameters = paramArray;
            */

            var request = {};
            request.messageType = "MESSAGE";
            request.content = msg;

            WebSocketHandler.send(JSON.stringify(request));
        });
    };

    var initRemoveDeviceButton = function(){
        $('#adm_remove_device').on('click', function(){
            var msg = {};
            msg.action = "ADMIN::START_DEVICE_REMOVAL_DISCOVERY";
            msg.technology = "ALL";
            var request = {};
            request.messageType = "MESSAGE";
            request.content = msg;

            WebSocketHandler.send(JSON.stringify(request));
        });
    };

    var initRemoveAllDevicesButton = function(){
        $('#adm_removeAll_devices').on('click', function(){
            var msg = {};
            msg.action = "ADMIN::REMOVE_ALL_DEVICES";
            msg.technology = "ALL";
            var request = {};
            request.messageType = "MESSAGE";
            request.content = msg;

            WebSocketHandler.send(JSON.stringify(request));
        });
    };


    return {

        init : function() {
            initAddDeviceButton();
            initRemoveDeviceButton();
            initRemoveAllDevicesButton();
        }
    }

}();

