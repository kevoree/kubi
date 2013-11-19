/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 07/10/13
 * Time: 11:43
 * To change this template use File | Settings | File Templates.
 */


var KubiUiActionsHandler = function(){

    var displayParameters = function(listItem) {

        //console.log("MenuItem", listItem);
        var funId = $(listItem).attr("function_id");
        var theFunction = KubiKernel.getKubiModel()._functions.get(funId);
        //console.log(theFunction);
        var parameterTable = $(".parameterTable").first();
        if(theFunction.parameters.array.length > 0) {
            parameterTable.removeAttr("hidden");
            var tbody = parameterTable.find('tbody');
            tbody.children().remove();
            $.each(theFunction.parameters.array, function(key, val){
                //console.log("parameter:", key, val);
                if(val.valueType == "BOOLEAN") {
                    var newParameterLine = $('<tr><td>'+val.name+'</td><td><input type="checkbox" class="functionParameter" parameter_id="'+val.name+'"></td></tr>');
                   // console.log("ParameterLine", newParameterLine);
                    newParameterLine.appendTo(tbody);
                } else {
                    console.log("Could not fill the parameter Table for parameter type:" + val.valueType, val);
                }

            });
        } else {
            parameterTable.attr("hidden","");
        }

    }


    var initDropdownMenuElements = function() {
        $(".dropdown-menu li a").click(function () {

            displayParameters(this);

            KubiKernel.setSelectedAction($(this));
            document.getElementById("dropdown-link").innerHTML = KubiKernel.getSelectedAction().text() + "<b class=\"caret\"></b>";
        });
    }

    var initExecuteAction = function () {

        var button = $('.action-executor');
        button.click(function() {
            console.log("execute " + KubiKernel.getSelectedAction().text());

            var msg = {nodeId:KubiKernel.getSelectedNode().data.id};
            msg.action = KubiKernel.getSelectedAction().text();
            msg.technology = KubiKernel.getSelectedNode().data.technology.name;

            var funId = KubiKernel.getSelectedAction().attr("function_id");
            var theFunction = KubiKernel.getKubiModel()._functions.get(funId);
            if(theFunction.parameters.array.length > 0) {
                var paramArray = [];
                $.each(theFunction.parameters.array, function(key, val){
                    var paramVal = {};
                    paramVal.name = val.name;
                    paramVal.valueType = val.valueType;
                    if(val.valueType == "BOOLEAN") {
                        var input = $(".parameterTable input[type=checkbox][parameter_id="+val.name+"]");
                        paramVal.value = input.is(':checked');
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


//                refreshModel(smartGridModel);

//        var msg = selectedAction + "/" + selectedNode.data.id
//        ws.send(msg);
        // TODO replace by incremental graph updates!
        // document.location.reload()
    };




    return {
        initAll : function() {
            initDropdownMenuElements();
            initExecuteAction();
        },
        initDropdownMenuElements : initDropdownMenuElements,
        refreshParametersDisplay : displayParameters
    }

}();




