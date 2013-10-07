/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 07/10/13
 * Time: 11:43
 * To change this template use File | Settings | File Templates.
 */


var KubiUiActionsHandler = function(){

    var initDropdownMenuElements = function() {
        $(".dropdown-menu li a").click(function () {
            KubiKernel.selectedAction = $(this).text();
            document.getElementById("dropdown-link").innerHTML = KubiKernel.selectedAction + "<b class=\"caret\"></b>";
        });
    }

    var initExecuteAction = function () {

        var button = $('.action-executor');
        button.click(function() {
            console.log("execute " + KubiKernel.selectedAction);

            //selectedNode.data.trigger(factory.createShutdown(), selectedNode.data);
            var msg = {nodeId:KubiKernel.selectedNode.data.id, action:KubiKernel.selectedAction, technology:KubiKernel.selectedNode.data.technology.name};
            WebSocketHandler.send(JSON.stringify(msg));
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
        initDropdownMenuElements : initDropdownMenuElements
    }

}();




