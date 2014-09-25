/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 10/10/13
 * Time: 15:45
 * To change this template use File | Settings | File Templates.
 */

var instantaneousConsumption = 0;
var recurrentConsumption = 0;

var KubiMessageHandler = function(){

    return {
        handleMessage : function(message) {

            if (typeof KubiHome != 'undefined') {
                var reportTable = $('.reportsTable').first();
                var tbody = reportTable.find('tbody');
                if(tbody.children().length >= 10) {
                    tbody.children().last.remove();
                }
                instantaneousConsumption = Math.round(message.dataInstant * 100)/100;
                recurrentConsumption = Math.round(message.dataRec * 100)/100;

                $('<span class="ticket">Message Received from node'+message.nodeId+' : '+instantaneousConsumption+'</span>').prependTo(tbody);

                if(instantaneousConsumption!=0) {
                    var chartsnap = $('#container-snap').highcharts();
                    if (chartsnap) {
                        var point = chartsnap.series[0].points[0];
                        point.update(instantaneousConsumption);
                    }
                    ;
                }
                if(recurrentConsumption != 0) {
                    var chartrpm = $('#container-rpm').highcharts();
                    if (chartrpm) {
                        var point = chartrpm.series[0].points[0];
                        point.update(recurrentConsumption);
                    }
                    ;
                }
            }
            if(typeof  KubiHome != 'undefined') {
                KubiHome.messageArrived(message);
            }
            console.debug("MessageReceivedFromServer", message);

        }
    }

}();


