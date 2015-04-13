/**
 * Created by jerome on 13/04/15.
 */


var last_timestamp = (new Date()).getTime();
var kubiModel = new org.kubi.KubiModel();
var chart;
windowSize = 1000000;
var dataPoints = {};

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
            title: {
                text: "Graph of the electric consumption of the fridge of the coffee place depending of the time(hour)",
                fontColor: "white"
            },
            axisX: {
                valueFormatString: "HH:mm:ss",
                interval: 10800,
                intervalType: "second",
                labelFontColor: "#white",
                lineColor: "white",
                lineThickness: 1,
                tickColor: "white",
                tickLength: 5,
                tickThickness: 1,
                gridColor: "white",
                gridThickness: 1
            },
            axisY2: {
                title: "truc2",
                titleFontColor: "white",
                lineColor: "white",
                lineThickness: 1,
                gridColor: "white",
                gridThickness: 1,
                labelFontColor: "white",
                tickColor: "white",
                tickLength: 5,
                tickThickness: 1
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
                tickThickness: 1
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 16,
                fontColor: "white"
            },
            toolTip: {
                shared: true
            },
            data: []
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
                chart.options.data.push({type: "line", showInLegend: true, name: device.getName(), dataPoints: []});
                dataPoints[device.getName()]=[];
                device.traversal().traverse(org.kubi.meta.MetaDevice.REF_PARAMETERS).withAttribute(org.kubi.meta.MetaParameter.ATT_NAME, "name").done().then(function (params){
                    if (params.length != 0) {
                        var param = params[0];
                        param.parent().then(function (param12){
//TODO : incompréhensible ..... il ne passe pas dans le addValuesPrevious dans le cas de l'ouverture de porte -- c'est l'erreur qui casse tout :'(
                            console.log(param12.getName(),"----FIRST !!");
                        });
                        param.listen(groupListenerID, function (param, metaTabl){
                            param.parent().then(function(parent) {
                                var valueHasChanged = false;
                                var periodHasChanged = false;
                                for (var m = 0; m < metaTabl.length; m++) {
                                    if (metaTabl[m] == org.kubi.meta.MetaParameter.ATT_VALUE) {
                                        valueHasChanged = true;
                                    //} else if (metaTabl[m] == org.kubi.meta.MetaParameter.ATT_PERIOD) {
                                    //    periodHasChanged = true;
                                    }
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
                        });
                        // add old data to the chart
                        param.jump(1428685739017).then(function (paramTimed){
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
    if((paramTimed.now() > 428599098412) && (paramTimed.getValue()!= undefined)) {
        dataPoints[deviceName].push({x: new Date(paramTimed.now()), y: parseFloat(paramTimed.getValue())});
        if(deviceName.equals("openCheck")){
            try {
                //console.log("---");
            }catch (err){
                console.error("_________"+err);
//                    err.printStackTrace();
            }
        }
        paramTimed.jump(paramTimed.now() - 2000).then(function (param1){
            addPreviousValues(param1, deviceName);
        });
    }
    else{
        console.log(deviceName,"-----in -addPreviousValues");
        // reverse the DataPoints set for the device given for the graph
        var unsortedDataPoints = dataPoints[deviceName];
        var sortedDataPoints = [];
        for(var i=0;i<unsortedDataPoints.length;i++){
            sortedDataPoints.push(unsortedDataPoints.slice(unsortedDataPoints.length-i-1,unsortedDataPoints.length-i)[0])
        }
        addDataPointsWithSerieName(sortedDataPoints,deviceName);
        chart.render();
    }
}
/**
 * Add some previous values and the periods calculated in the Java Plugin from these values
 */
function addPreviousValuesWithPeriod(paramTimed, deviceName){
    if((paramTimed.now() > 428599098412) && (paramTimed.getValue()!= undefined)) {
        dataPoints[deviceName].push({x: new Date(paramTimed.now()), y: parseFloat(paramTimed.getValue())});
        if(paramTimed.getPeriod()!= undefined){
            dataPoints[deviceName+"_Period"].push({x: new Date(paramTimed.now()), y: parseFloat(paramTimed.getPeriod())});
        }
        paramTimed.jump(paramTimed.now() - 2000).then(function (param1){
            addPreviousValuesWithPeriod(param1, deviceName);
        });
    }
    else{
        var unsortedDataPoints = dataPoints[deviceName];
        var sortedDataPoints = [];
        for(var i=0;i<unsortedDataPoints.length;i++){
            sortedDataPoints.push(unsortedDataPoints.slice(unsortedDataPoints.length-i-1,unsortedDataPoints.length-i)[0])
        }
        addDataPointsWithSerieName(sortedDataPoints,deviceName);

        var unsortedPeriodDataPoints  = dataPoints[deviceName+"_Period"];
        var sortedPeriodDataPoints = [];
        for(var i=0;i<unsortedPeriodDataPoints.length;i++){
            sortedPeriodDataPoints.push(unsortedPeriodDataPoints.slice(unsortedPeriodDataPoints.length-i-1,unsortedPeriodDataPoints.length-i)[0])
        }
        addDataPointsWithSerieName(sortedPeriodDataPoints,deviceName+"_Period");
        initPage();
        chart.render();
    }
}

/**
 *Add a set of points to the chart
 * @param  value the set of poins
 * @param serieName the name of the serie that you want to add the points
 * [
 *     {x: new Date(timestamp), y: Float_value},
 *     {x: new Date(timestamp), y: Float_value}
 * ]
 **/
function addDataPointsWithSerieName(values, serieName) {
    var dpsCollection;
    var index;
    // this loop get the index of the serie in the data set named serieName
    for(var d in chart.options.data){
        data = chart.options.data[d];
        if(data.name.equals(serieName)){
            dpsCollection = data.dataPoints;
            index = d;
        }
    }
    if(dpsCollection != null && index != null) {
        // add the values in the data set according to the size of the window chosen
        for (var point in values) {
            dpsCollection.push(values[point]);
            if (dpsCollection.length > windowSize) {
                dpsCollection.shift();
            }
        }
    }
    else{
        console.error("Bad series name ",serieName, " : device not in the data set of the chart.");
    }
    this.chart.render();
}

/**
 * Add the point to the chart
 * @param point
 * {x: new Date(timestamp), y: Float_value}
 * @param serie name
 *     the name of the chart where you want to add the point (should be the name of the device)
 */
function addDataPointWithSerie(point, serie) {
    var dpsCollection;
    var index;
    // this loop get the index of the serie in the data set named serieName
    for(var i in chart.options.data){
        data = chart.options.data[i];
        if(data.name.equals(serie)){
            dpsCollection = data.dataPoints;
            index=i;
        }
    }
    if(dpsCollection != null && index!=null) {
        // add the value in the data set according to the size of the window chosen
        var dpsCollection = chart.options.data[index].dataPoints;
        dpsCollection.push(point);
        if (dpsCollection.length > windowSize) {
            dpsCollection.shift();
        }
    }
    else{
        console.error("Bad series name (=",serie ,") : device not in the data set of the chart.");
    }
    this.chart.render();
}