/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 10/10/13
 * Time: 15:45
 * To change this template use File | Settings | File Templates.
 */

var instantaneousConsumption = 0;

var KubiMessageHandler = function(){

    return {
        handleMessage : function(message) {

            if (typeof KubiGraphHandler != 'undefined') {
                var reportTable = $('.reportsTable').first();
                var tbody = reportTable.find('tbody');
                if(tbody.children().length >= 10) {
                    tbody.children().last.remove();
                }
                instantaneousConsumption = Math.round(message.dataInstant * 100)/100;

                $('<span class="ticket">Message Received from node'+message.nodeId+' : '+instantaneousConsumption+'</span>').prependTo(tbody);

                var chart = $('#container-snap').highcharts();
                if (chart) {
                    var point = chart.series[0].points[0];
                    point.update(instantaneousConsumption);
                }
/*              var precisionConsumption = message.dataPrecision;
                var chart = $('#container-rpm').highcharts();
                if (chart) {
                    var point = chart.series[0].points[0];
                    point.update(instantaneousConsumption);
                }
*/            }
            if(typeof  KubiHome != 'undefined') {
                KubiHome.messageArrived(message);
            }

            console.debug("MessageReceivedFromServer", message);

        }
    }

}();


