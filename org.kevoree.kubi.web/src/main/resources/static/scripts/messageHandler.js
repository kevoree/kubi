/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 10/10/13
 * Time: 15:45
 * To change this template use File | Settings | File Templates.
 */


var KubiMessageHandler = function(){


    return {
        handleMessage : function(message) {

            if (typeof KubiGraphHandler != 'undefined') {
                var reportTable = $('.reportsTable').first();
                var tbody = reportTable.find('tbody');
                if(tbody.children().length >= 10) {
                    tbody.children().last.remove();
                }

                $('<span class="ticket">Message Received from node'+message.nodeId+'</span>').prependTo(tbody);
            }
            if(typeof  KubiHome != 'undefined') {
                KubiHome.messageArrived(message);
            }

            console.debug("MessageReceivedFromServer", message);





        }
    }

}();


