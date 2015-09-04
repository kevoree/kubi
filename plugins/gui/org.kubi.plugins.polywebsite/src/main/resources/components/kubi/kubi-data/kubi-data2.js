/**
 * Created by jerome on 21/08/15.
 */


var kubiDataVar = {
    time: (new Date()).getTime(),
    model : undefined,
    universe:0,
    windowSize: 1000000,
    chartData: [],
    numberOfPoints : 100
};

function initWithModelCanvas(model){
    console.log("Kubi Data :: init model");
    kubiDataVar.model = model;
    initializeGraph();
    initializeData();
}



/**
 * Initialize the graph empty
 **/
function initializeGraph() {
    kubiDataVar.chart = new CanvasJS.Chart("chartContainer", {
        width: 700,
        height: 500,
        backgroundColor: "#F0F0F4",
        theme: "theme",
        colorSet: "colorSet1",
        interactivityEnabled: true,
        zoomEnabled: true,
        animationEnabled: true,
        title: {
            text: "Graph describing timed devices data",
            fontColor: "#121212"
        },
        axisX: {
            valueFormatString: "MM/DD/YY - HH:mm",
            interval: 21600,
            intervalType: "second",
            labelFontColor: "black",
            lineColor: "black",
            lineThickness: 1,
            tickColor: "black",
            tickLength: 5,
            tickThickness: 1,
            gridColor: "grey",
            gridThickness: 1,
            labelAngle: -30
        },
        axisY: {
            title: "Devices data",
            titleFontColor: "black",
            lineColor: "black",
            lineThickness: 1,
            gridColor: "grey",
            gridThickness: 1,
            labelFontColor: "black",
            tickColor: "black",
            tickLength: 5,
            tickThickness: 1,
            includeZero: false
        },
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center",
            fontSize: 16,
            fontColor: "black",
            cursor: "pointer",
            itemclick: function (e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        },
        toolTip: {
            shared: true
        },
        data: kubiDataVar.chartData
    });
}


/*

 */
function initializeData(){
    kubiDataVar.deviceNames = [];
    var initialRange = 4900000;
    var initialTime = ((new Date()).getTime()/1000)+4900;

    kubiDataVar.model.universe(kubiDataVar.universe).time(kubiDataVar.time).getRoot(function(root){
        if(root != undefined){
            root.traversal()
                .traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
                .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES)
                .then(function (devices){
                    for(var i=0; i<devices.length; i++){
                        kubiDataVar.deviceNames[i] = devices[i].getName();
                    }
                    updateGraph(initialTime, initialRange, kubiDataVar.deviceNames, false);
                });
        }
    });
}

function updateGraph(time, range, deviceNames, showPeriod){
    time = time * 1000;
    var start = time - range;
    var end = parseFloat(time) + parseFloat(range);
    var step = range / kubiDataVar.numberOfPoints;
    console.log("Kubi data :: updateGraph", time, range, deviceNames, showPeriod);
    clearDataSets();
    drawAll(deviceNames, start, end, step, showPeriod);
}

/**
 * Get and draw the data from kubi of the set of Devices named deviceNames in the time window [start,end] with a step of step
 * @param deviceNames
 * @param start
 * @param end
 * @param step
 * @param showPeriod
 */
function drawAll(deviceNames, start, end, step, showPeriod){
    showPeriod = showPeriod==undefined ? false : showPeriod;
    kubiDataVar.model.universe(kubiDataVar.universe).time(end).getRoot(function(root){
        if(root!=undefined){
            for(var i =0; i< deviceNames.length; i++){
                root.traversal()
                    .traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
                    .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).withAttribute(org.kubi.meta.MetaDevice.ATT_NAME, deviceNames[i])
                    .then(function(devices){
                        if(devices.length >0) {
                            getAndDraw(devices[0], start, end, step, showPeriod);
                        }
                    });
            }
        }
    });
}
function getAndDraw(device, start, end, step, showPeriod){
    var deviceName = device.getName();
    createDeviceInChart(deviceName);
    device.traversal().traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).then(function(params){
        var param = params[0];
        var kDefer = kubiDataVar.model.defer();
        for(var time= start; time<end; time+=step){
            param.jump(time, kDefer.waitResult());
        }
        kDefer.then(function(paramsTimed){
            var index = 0;
            var values = [];

            var kDeferPeriod = kubiDataVar.model.defer();
            var valuesPeriod = [];
            for(var time= start; time<end; time+=step) {
                var value = paramsTimed[index].getValue();
                if(value != undefined) {
                    values.push({
                        x: new Date(paramsTimed[index].now()),
                        y: parseFloat(value+"")
                    });
                }
                // add the period if needed
                if(showPeriod){
                    createDeviceInChart(deviceName + "_period");
                    paramsTimed[index].traversal().traverse(org.kubi.meta.MetaStateParameter.REF_PERIOD).then(kDeferPeriod.waitResult());
                }
                index++;
            }
            addValueInGraph(deviceName, values);
            if(showPeriod) {
                kDeferPeriod.then(function (periods) {
                    for (var i = 0; i < periods.length; i++) {
                        var period = periods[i][0].getPeriod();
                        if (period != undefined) {
                            valuesPeriod.push({
                                x: new Date(periods[i][0].now()),
                                y: parseFloat(period + "")
                            });
                        }
                    }
                    addValueInGraph(deviceName + "_period", valuesPeriod);
                });
            }
            kubiDataVar.chart.options.data = kubiDataVar.chartData;
            kubiDataVar.chart.render();
        });
    });
}

function createDeviceInChart(device) {
    var alreadyExist = false;
    for(var i=0; i<kubiDataVar.chartData.length; i++){
        alreadyExist = alreadyExist || (kubiDataVar.chartData[i].name.valueOf()==device.valueOf());
    }
    if(!alreadyExist) {
        kubiDataVar.chartData.push({
            type: "line",
            showInLegend: true,
            name: device,
            title: device,
            dataPoints: []
        });
    }
}


/**
 * Add the value in the
 * @param name
 * @param time
 * @param value
 */
function addValueInGraph(name, values) {
    for(var i=0; i<kubiDataVar.chartData.length;i++){
        if(kubiDataVar.chartData[i].name.valueOf() == name.valueOf()){
            kubiDataVar.chartData[i].dataPoints = values;
        }
    }
}

function clearDataSets(){
    if(kubiDataVar.chart != undefined){
        kubiDataVar.chartData = [];
        kubiDataVar.chart.options.data = kubiDataVar.chartData;
    }
}
