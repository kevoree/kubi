/**
 * Created by jerome on 13/04/15.
 */


var last_timestamp = (new Date()).getTime();
var kubiModel = new org.kubi.KubiModel();
var chart;
/**
 * Contain the list of data for the graph
 * dataChart[
 *      dataSeries{
 *          type: "line", title : "plug",
 *          dataPoints : [
 *              {x: ..., y:...},
 *              {x: ..., y:...}, ...
 *          ]
 *      }, ...
 * ]
 * @type {Array}
 */
var dataChart = [];
/**
 * "Map":
 * <
 *  deviceName , dataSeries{
 *      type: "line",
 *      title : "plug",
 *      dataPoints : [
 *          {x: ..., y:...},
 *          {x: ..., y:...}, ...
 *      ]
 *    }
 *  >
 * @type {Array}
 */
var dataSeries = [];
windowSize = 1000000;

var universeNumber = 0;

init();



function init() {
    kubiModel.setContentDeliveryDriver(new org.kevoree.modeling.database.websocket.WebSocketClient("ws://" + location.host + "/cdn"));
    kubiModel.connect().then(function (e) {
        if (e) {
            console.error(e);
        } else {
            initGraph();
            getDataFromKubi();
        }
    });
}

function initGraph() {
    chart = new CanvasJS.Chart("chartContainer",
        {
            width: 1000,
            height: 500,
            backgroundColor: "#708090",
            theme: "theme3",
            zoomEnabled: true,
            animationEnabled: true,
            title: {
                text: "Graph of the electric consumption of the fridge of the coffee place depending of the time(hour)",
                fontColor: "white"
            },
            axisX: {
                valueFormatString: "HH:mm:ss",
                interval: 21600,
                intervalType: "second",
                labelFontColor: "#white",
                lineColor: "white",
                lineThickness: 1,
                tickColor: "white",
                tickLength: 5,
                tickThickness: 1,
                gridColor: "white",
                gridThickness: 1,
                labelAngle: -30
            },
            axisY: {
                title: "Electric consumption(kW) of the fridge ",
                titleFontColor: "white",
                lineColor: "white",
                lineThickness: 1,
                gridColor: "white",
                gridThickness: 1,
                labelFontColor: "white",
                tickColor: "white",
                tickLength: 5,
                tickThickness: 1,
                includeZero:false
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 16,
                fontColor: "white",
                cursor: "pointer",
                itemclick: function (e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    } else {
                        e.dataSeries.visible = true;
                    }

                    e.chart.render();
                }
            },
            toolTip: {
                shared: true
            },
            data: dataChart
        }
    );
}
function getDataFromKubi(){
    var currentView = kubiModel.universe(universeNumber).time(last_timestamp);
    var groupListenerID = kubiModel.nextGroup();

    currentView.getRoot().then(function (root) {
        root.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_DEVICES).done().then(function (devices){
            var d;
            for(d = 0; d< devices.length; d++)
            {
                var device = devices[d];
                // add a curb describing the device on the chart
                dataSeries[device.getName()] = ({type: "line", showInLegend: true, name: device.getName(), title: device.getName(), dataPoints: []});
                device.traversal().traverse(org.kubi.meta.MetaDevice.REF_PARAMETERS).withAttribute(org.kubi.meta.MetaParameter.ATT_NAME, "name").done().then(function (params){
                    if (params.length != 0) {
                        var param = params[0];
                        param.listen(groupListenerID, function (param, metaTabl){
                            param.parent().then(function(parent) {
                                var valueHasChanged = false;
                                var periodHasChanged = false;
                                for (var m = 0; m < metaTabl.length; m++) {
                                    if (metaTabl[m] == org.kubi.meta.MetaParameter.ATT_VALUE) {
                                        valueHasChanged = true;
                                    }
                                    //if (metaTabl[m] == org.kubi.meta.MetaParameter.ATT_PERIOD) {
                                    //    periodHasChanged = true;
                                    //}
                                }
                                if (param.getValue() != undefined && valueHasChanged) {
                                    // the value of the parameter has changed => add the value to the graph data set
                                    addDataPointWithSerie({
                                        x: new Date(param.now()),
                                        y: parseFloat(param.getValue())
                                    }, parent.getName());
                                }
                                //if (param.getPeriod() != undefined && periodHasChanged) {
                                //    addDataPointWithSerie({
                                //        x: new Date(),
                                //        y: parseFloat(param.getPeriod())
                                //    }, parent.getName() + "_Period");
                                //}
                            });
                        }); // end of listen
                        // add old data to the chart
                        param.jump(1428824570000).then(function (paramTimed){
                            param.parent().then(function (parent){
                                //addPreviousValuesWithPeriod(paramTimed, parent.getName());
                                addPreviousValues(paramTimed, parent.getName());
                            });
                        });
                    }
                });
            }
        });
    });
}
function addPreviousValues(paramTimed, deviceName){
    //if((paramTimed.now() > 1428599097936) && (paramTimed.getValue()!= undefined)) {
    if((paramTimed.now() > 1428773690000) && (paramTimed.getValue()!= undefined)) {
        dataSeries[deviceName].dataPoints.push({x: new Date(paramTimed.now()), y: parseFloat(paramTimed.getValue())});
        paramTimed.jump(paramTimed.now() - 50000).then(function (param1){
            addPreviousValues(param1, deviceName);
        });
    }
    else{
        console.log(deviceName,"-----in -addPreviousValues");
        // reverse the DataPoints set for the device given for the graph
        var unsortedDataPoints = dataSeries[deviceName].dataPoints;
        var sortedDataPoints = [];
        for(var i=0;i<unsortedDataPoints.length;i++){
            sortedDataPoints.push(unsortedDataPoints.slice(unsortedDataPoints.length-i-1,unsortedDataPoints.length-i)[0])
        }
        dataSeries[deviceName].dataPoints = sortedDataPoints;
        dataChart.push(dataSeries[deviceName]);
        chart.render();
    }
}
/**
 * Add some previous values and the periods calculated in the Java Plugin from these values
 */
function addPreviousValuesWithPeriod(paramTimed, deviceName){
    if((paramTimed.now() > 1428599097936) && (paramTimed.getValue()!= undefined)) {
        dataSeries[deviceName].dataPoints.push({x: new Date(paramTimed.now()), y: parseFloat(paramTimed.getValue())});
        if(paramTimed.getPeriod()!= undefined){
            dataSeries[deviceName+"_Period"].dataPoints.push({x: new Date(paramTimed.now()), y: parseFloat(paramTimed.getPeriod())});
        }
        paramTimed.jump(paramTimed.now() - 95000).then(function (param1){
            addPreviousValuesWithPeriod(param1, deviceName);
        });
    }
    else{
        console.log(deviceName,"-----in -addPreviousValues");
        // reverse the DataPoints set for the device given for the graph
        var unsortedDataPoints = dataSeries[deviceName].dataPoints;
        var sortedDataPoints = [];
        for(var i=0;i<unsortedDataPoints.length;i++){
            sortedDataPoints.push(unsortedDataPoints.slice(unsortedDataPoints.length-i-1,unsortedDataPoints.length-i)[0])
        }
        dataSeries[deviceName].dataPoints = sortedDataPoints;
        dataChart.push(dataSeries[deviceName]);

        var unsortedPeriodDataPoints  = dataSeries[deviceName+"_Period"].dataPoints;
        var sortedPeriodDataPoints = [];
        for(var i=0;i<unsortedPeriodDataPoints.length;i++){
            sortedPeriodDataPoints.push(unsortedPeriodDataPoints.slice(unsortedPeriodDataPoints.length-i-1,unsortedPeriodDataPoints.length-i)[0])
        }
        dataSeries[deviceName+"_Period"].dataPoints = sortedPeriodDataPoints;
        dataChart.push(dataSeries[deviceName+"_Period"]);

        chart.render();
    }
}


/**
 * Add the point to the chart
 * @param point
 * {x: new Date(timestamp), y: Float_value}
 * @param serie name
 *     the name of the chart where you want to add the point (should be the name of the device)
 */
function addDataPointWithSerie(point, serie) {
    for(var i in chart.options.data){
        var d = chart.options.data[i];
        if(d.name.equals(serie)){
            chart.options.data[i].dataPoints.push(point);
            if (chart.options.data[i].dataPoints.length > windowSize) {
                chart.options.data[i].dataPoints.shift();
            }
            this.chart.render();
            return;
        }
    }
    console.error("Bad series name (=",serie ,") : device not in the data set of the chart.");
}