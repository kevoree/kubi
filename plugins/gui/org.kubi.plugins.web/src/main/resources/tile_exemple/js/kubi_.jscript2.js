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
        sliderInit();
        sliderGraphInit();
    });
}

function initGraph() {
    chart = new CanvasJS.Chart("chartContainer",
        {
            width: 1000,
            height: 500,
            backgroundColor: "#F0F0F4",
            theme: "theme3",
            colorSet: "colorSet2",
            interactivityEnabled: true,
            zoomEnabled: true,
            animationEnabled: true,
            title: {
                text: "Graph of the electric consumption of the fridge of the coffee place depending of the time(hour)",
                fontColor: "#121212"
            },
            axisX: {
                valueFormatString: "HH:mm:ss",
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
                title: "Electric consumption(kW) of the fridge ",
                titleFontColor: "black",
                lineColor: "black",
                lineThickness: 1,
                gridColor: "grey",
                gridThickness: 1,
                labelFontColor: "black",
                tickColor: "black",
                tickLength: 5,
                tickThickness: 1,
                includeZero:false
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
        root.jump(1428932146000).then(function (rootNow){
            nunjucks.configure({autoescape: true});
            try {
                // init the graph
                nunjucks.renderString($("#ecosystem-template").html(), {
                    ecosystem: rootNow,
                    autoRefresh: true,
                    autoNow: true
                }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    $("#ecosystem").html(res);
                });
                nunjucks.configure({autoescape: true});
                // init the graph
                nunjucks.renderString($("#radioDevicePicker-template").html(), {
                    ecosystem: rootNow,
                    autoRefresh: true,
                    autoNow: true
                }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    $("#radioDevicePicker").html(res);
                });
            }catch (e){
                e.printStackTrace();
            }
        });


        root.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
            .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).done().then(function (devices){
            var d;
            for(d = 0; d< devices.length; d++)
            {
                var device = devices[d];
                // add a curb describing the device on the chart
                dataSeries[device.getName()] = ({type: "line", showInLegend: true, name: device.getName(), title: device.getName(), dataPoints: []});
                // add a curb describing the device period on the chart
                dataSeries[device.getName()+"_Period"] = ({type: "line", showInLegend: true, name: device.getName()+"_Period", title: device.getName()+"_Period", dataPoints: []});
                device.traversal().traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).withAttribute(org.kubi.meta.MetaStateParameter.ATT_NAME, "name").done().then(function (params){
                    if (params.length != 0) {
                        var param = params[0];
                        param.listen(groupListenerID, function (param, metaTabl){
                            param.parent().then(function(parent) {
                                var valueHasChanged = false;
                                var periodHasChanged = false;
                                for (var m = 0; m < metaTabl.length; m++) {
                                    if (metaTabl[m] == org.kubi.meta.MetaStateParameter.ATT_VALUE) {
                                        valueHasChanged = true;
                                    }
                                    if (metaTabl[m] == org.kubi.meta.MetaStateParameter.ATT_PERIOD) {
                                        periodHasChanged = true;
                                    }
                                }
                                if (param.getValue() != undefined && valueHasChanged) {
                                    // the value of the parameter has changed => add the value to the graph data set
                                    addDataPointWithSerie({
                                        x: new Date(param.now()),
                                        y: parseFloat(param.getValue())
                                    }, parent.getName());
                                }
                                if (param.getPeriod() != undefined && periodHasChanged && dataSeries[device.getName()+"_Period"].dataPoints.length >0) {
                                    // the period of the parameter has changed => add the period to the graph data set
                                    // /!\\ if the graph period doesn't exist the graph is not created
                                    addDataPointWithSerie({
                                        x: new Date(),
                                        y: parseFloat(param.getPeriod())
                                    }, parent.getName() + "_Period");
                                }
                            });
                        }); // end of listen
                        var endTime = 1428997126000;
                        // add old data to the chart
                        param.jump(endTime).then(function (paramTimed){
                            param.parent().then(function (parent){
                                var startTime = 1428599097936;
                                var stepTime = 90000;
                                addPreviousValuesWithPeriod(paramTimed, parent.getName(), startTime ,stepTime);
                            });
                        });
                    }
                });
            }
        });
    });
}

function addPreviousValues(paramTimed, deviceName,startTime, stepTime){
    if((paramTimed.now() > startTime) && (paramTimed.getValue()!= undefined)) {
        dataSeries[deviceName].dataPoints.push({x: new Date(paramTimed.now()), y: parseFloat(paramTimed.getValue())});
        paramTimed.jump(paramTimed.now() - stepTime).then(function (param1){
            addPreviousValues(param1, deviceName, startTime, stepTime);
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
function addPreviousValuesWithPeriod(paramTimed, deviceName, startTime, stepTime){
    if((paramTimed.now() > startTime) && (paramTimed.getValue()!= undefined)) {
        dataSeries[deviceName].dataPoints.push({x: new Date(paramTimed.now()), y: parseFloat(paramTimed.getValue())});
        if(paramTimed.getPeriod()!= undefined){
            dataSeries[deviceName+"_Period"].dataPoints.push({x: new Date(paramTimed.now()), y: parseFloat(paramTimed.getPeriod())});
        }
        paramTimed.jump(paramTimed.now() - stepTime).then(function (param1){
            addPreviousValuesWithPeriod(param1, deviceName, startTime, stepTime);
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

        if(dataSeries[deviceName+"_Period"] != undefined && dataSeries[deviceName+"_Period"].dataPoints.length != 0) {
            var unsortedPeriodDataPoints = dataSeries[deviceName + "_Period"].dataPoints;
            var sortedPeriodDataPoints = [];
            for (var i = 0; i < unsortedPeriodDataPoints.length; i++) {
                sortedPeriodDataPoints.push(unsortedPeriodDataPoints.slice(unsortedPeriodDataPoints.length - i - 1, unsortedPeriodDataPoints.length - i)[0])
            }
            dataSeries[deviceName + "_Period"].dataPoints = sortedPeriodDataPoints;
            dataChart.push(dataSeries[deviceName + "_Period"]);
        }

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


/**
 * Get the value of the parameter named name of the device plug at the temps
 * @param time
 * @returns
 */
function getDeviceValue(time){
    var currentView = kubiModel.universe(universeNumber).time(time*1000);
    currentView.getRoot().then(function(root){
        if(root!= null){
            root.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES).
                traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).withAttribute(org.kubi.meta.MetaDevice.ATT_NAME, "plug")
                .traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).withAttribute(org.kubi.meta.MetaStateParameter.ATT_NAME, "name")
                .done().then(function (kObecjts){
                    if(kObecjts.length >0){
                        var res = kObecjts[0].getValue();
                        $("#valDevice").html(res == undefined?"null":res);
                    }
                });
        }
    });
}



function sliderInit() {
    $("#update").click(function () {
        var choosenValue = $("#seekTo").val();
        $("#val").html(choosenValue);
        getDeviceValue(choosenValue);
    });

    $("#slider").change(function(){
        var value = $("#slider").val();
        $("#val").html(value);
        $("#seekTo").html(value);
        getDeviceValue(value);
    });

}

function sliderGraphInit() {
    $("#slider1").click(function(){
        var value = $("#slider1").val() * 1000;
        var range = $("#selectScale")[0].value;
        var deviceName = "plug"; // TODO : generalisation get radio.* value
        var start = value - range;
        var end = parseInt(value) + parseInt(range);
        var step = range / 500;
        console.log(start,"-----", end, "_____", range, "_____", step);
        //var end = ( end==0 ? start-86400000 : end  );
        //var step = ( step==0 ? 3600000 : step );
        var currentView = kubiModel.universe(universeNumber).time(start);
        currentView.getRoot().then(function(root) {
            if (root != null) {
                root.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
                    .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).withAttribute(org.kubi.meta.MetaDevice.ATT_NAME, deviceName).done().then(function (kObjects) {
                    if (kObjects.length > 0) {
                        // TODO : useful ?? maybe if it doesn't not exist, we can just create it ?
                        var device = kObjects[0];
                        device.traversal().traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).withAttribute(org.kubi.meta.MetaStateParameter.ATT_NAME, "name").done().then(function (parameters){
                            if(parameters.length >0){
                                var param = parameters[0];
                                // emptying the dataset of the device
                                dataSeries[device.getName()] = ({
                                    type: "line",
                                    showInLegend: true,
                                    name: device.getName(),
                                    title: device.getName(),
                                    dataPoints: []
                                });
                                if (dataSeries[device.getName() + "_Period"] != null) {
                                    dataSeries[device.getName() + "_Period"] = ({
                                        type: "line",
                                        showInLegend: true,
                                        name: device.getName() + "_Period",
                                        title: device.getName() + "_Period",
                                        dataPoints: []
                                    });
                                }

                                setInGraphDeviceRangeValuesWithPeriod(device.getName(), param, start, end, step);
                            }
                        });
                    }
                });
            }
        });
    });

}

function setInGraphDeviceRangeValuesWithPeriod(deviceName, param, start, end, step){
    if(start<end){
        param.jump(end).then(function(paramTimed){
            if(paramTimed != null && paramTimed.getValue()!= undefined) {
                dataSeries[deviceName].dataPoints.push({
                    x: new Date(paramTimed.now()),
                    y: parseFloat(paramTimed.getValue())
                });
                if (paramTimed.getPeriod() != undefined) {
                    if (dataSeries[deviceName + "_Period"] == null) {
                        dataSeries[deviceName + "_Period"] = ({
                            type: "line",
                            showInLegend: true,
                            name: deviceName,
                            title: deviceName,
                            dataPoints: []
                        });
                    }
                    dataSeries[deviceName + "_Period"].dataPoints.push({
                        x: new Date(paramTimed.now()),
                        y: parseFloat(paramTimed.getPeriod())
                    });
                }
                setInGraphDeviceRangeValuesWithPeriod(deviceName, paramTimed, start , end - step, step);
            }
        });
    }
    else{
        // add in graph
        console.log(deviceName,"-----in -setInGraphDeviceRangeValuesWithPeriod");
        // reverse the DataPoints set for the device given for the graph
        var unsortedDataPoints = dataSeries[deviceName].dataPoints;
        var sortedDataPoints = [];
        for(var i=0;i<unsortedDataPoints.length;i++){
            sortedDataPoints.push(unsortedDataPoints.slice(unsortedDataPoints.length-i-1,unsortedDataPoints.length-i)[0])
        }
        dataSeries[deviceName].dataPoints = sortedDataPoints;
        createOrReplaceValuesSetInChart(dataSeries[deviceName], deviceName);

        if(dataSeries[deviceName+"_Period"] != undefined && dataSeries[deviceName+"_Period"].dataPoints.length != 0) {
            var unsortedPeriodDataPoints = dataSeries[deviceName + "_Period"].dataPoints;
            var sortedPeriodDataPoints = [];
            for (var i = 0; i < unsortedPeriodDataPoints.length; i++) {
                sortedPeriodDataPoints.push(unsortedPeriodDataPoints.slice(unsortedPeriodDataPoints.length - i - 1, unsortedPeriodDataPoints.length - i)[0])
            }
            createOrReplaceValuesSetInChart(dataSeries[deviceName + "_Period"], deviceName + "_Period");
        }

        chart.render();
    }
}

/**
 * if there is no data in the dataChart named according to the seriesName in parameter ==> push the values into the dataChart
 * if there is a set of data having the same name as the seriesName in parameter ==> replace this set of values into the dataChart
 * @param values the values to add into the dataChart
 * @param seriesName the name of the series of values
 */
function createOrReplaceValuesSetInChart(values, seriesName){
    console.log("_____",values);
    for(var i in dataChart){
        if(seriesName.equals(dataChart[i].name)){
            dataChart[i] = values;
            return;
        }
    }
    dataChart.push(values);
}