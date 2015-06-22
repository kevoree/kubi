/**
 * Created by jerome on 04/06/15.
 */

var KubiEpoch = {
    universe : 0,
    legendColors : [
        "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
        "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
    ]
};

var lineChartData = [
    {
        label: "Series 2",
        values: [ {x: 1428797898000, y: 78}, {x: 1428797899000, y: 98} ]
    }
];


function initEpochChart(model){
    KubiEpoch.kubiModel = model;
    var initialTime = 1428797898;
    var initialScale = 86400000;
    console.log("initEpochChart");

    emptyChartData();
    getAllDeviceNames(initialTime, initialScale);
    // TODO : add with a task updateEpochChartSettings(initialTime, initialScale, getAllDeviceNames(), false);
}

function emptyChartData(){
    lineChartData = [];
}

function updateEpochChartSettings(time, scale, devices, wantPeriod){
    if(KubiEpoch.kubiModel != undefined) {
        console.log("-- Epoch : updateEpochChartSettings", time, scale, devices, wantPeriod);
        time = time * 1000;
        var start = time - scale;
        var end = time - (-scale);
        var numberOfPoint = 300;
        var step = scale / numberOfPoint;

        emptyChartData();
        getDataAndEpochDraw(devices, start, end, step, wantPeriod);
    }
}



/**
 * For each device in deviceNames it launch to getting function to add the values in [start;end] in the graph
 * @param deviceNames
 * @param start
 * @param end
 * @param step
 * @param wantPeriod
 */
function getDataAndEpochDraw(deviceNames, start, end, step, wantPeriod) {
    var haveToShowPeriod = (wantPeriod == undefined ? false : wantPeriod);
    var view = KubiEpoch.kubiModel.universe(KubiEpoch.universe).time(end);
    view.getRoot().then(function (rootEnd) {
        if (rootEnd != undefined) {
            rootEnd.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES).done().then(function (technos) {
                for (var nameIndex = 0; nameIndex < deviceNames.length; nameIndex++) {
                    for(var technoIndex=0; technoIndex<technos.length; technoIndex++) {
                        technos[technoIndex].traversal().traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).withAttribute(org.kubi.meta.MetaDevice.ATT_NAME, deviceNames[nameIndex]).done().then(function (devices) {
                            if (devices.length > 0) {
                                var device = devices[0];
                                device.traversal().traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).done().then(function(params){
                                    if(params.length>0){
                                        addValueInEpochGraph(device.getName(),params[0], start, end, step, haveToShowPeriod);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
}

/**
 * Visit the time from end to start step by step and push the values (and its period if needed) in the epoch graph
 * @param deviceName
 * @param parameter
 * @param start
 * @param end
 * @param step
 * @param haveToShowPeriod
 */
function addValueInEpochGraph(deviceName,parameter, start, end, step, haveToShowPeriod){
    if(start < end){
        parameter.jump(end).then(function(paramTimed){
            if(paramTimed != undefined && paramTimed.getValue() !=undefined){
                pushValueInEpoch(paramTimed, deviceName, haveToShowPeriod);
                addValueInEpochGraph(deviceName, parameter, start, end-step, step, haveToShowPeriod);
            }
        });
    }
    else{
        var deviceDataIndex = getDataIndexByLabelName(deviceName);
        try {
            lineChartData[deviceDataIndex].values.sort(function (a, b){return a.x - b.x;});
        }catch(ex){console.log(ex);}
        KubiEpoch.chart.update(lineChartData);
        makeLegend();
    }
}

function getDataIndexByLabelName(name){
    for(var i = 0; i< lineChartData.length; i++){
        if(lineChartData[i].label == name){
            return i;
        }
    }
}

/**
 * Call the method to add the data in the epoch graph
 * And to the same for its period IF needed
 * @param param
 * @param deviceName
 * @param haveToShowPeriod
 */
function pushValueInEpoch(param, deviceName, haveToShowPeriod){
    addEpochPointWithPeriod(param.now(),parseFloat(param.getValue()), deviceName);
    if(haveToShowPeriod){
        param.traversal().traverse(org.kubi.meta.MetaStateParameter.REF_PERIOD).done().then(function(periods){
            if(periods.length>0){
                addEpochPointWithPeriod(periods[0].now(), parseFloat(periods[0].getPeriod()), deviceName+"_Period");
            }
        });
    }
}

/**
 * Add the point (time, value) in the graph of deviceName
 * @param deviceName
 * @param time
 * @param value
 */
function addEpochPointWithPeriod(time, value, deviceName){
    for(var i = 0; i< lineChartData.length; i++){
        if(lineChartData[i].label == deviceName){
            lineChartData[i].values.push({x: time, y: value});
            return;
        }
    }
    // label not found in the graph then add a new one
    lineChartData.push({
        label: deviceName,
        values :[{x:time, y: value}]
    });
}

/**
 * Make a legend according to th labels of the lineDataChart and the KubiEpoch.legendColors
 */
function makeLegend(){
    var legend = document.createElement("ul");
    try {
        document.getElementById("epochLegend").removeChild(document.getElementById("epochLegend").firstChild);
    }catch (ex){console.log("epochLegend is empty.")}
    document.getElementById("epochLegend").appendChild(legend);

    for(var graph=0; graph<lineChartData.length; graph++){
        var legendItem = document.createElement("li");
        legendItem.innerHTML = "<p style=\"color:"+KubiEpoch.legendColors[graph%KubiEpoch.legendColors.length] + "\">" + lineChartData[graph].label + "</p>";
        legend.appendChild(legendItem);
    }
}






function getAllDeviceNames(initialTime, initialScale){
    KubiEpoch.kubiModel.universe(KubiEpoch.universe).time(1428997126000).getRoot().then(function(newRoot){
        newRoot.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
            .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).done().then(function (alldevices){
                var deviceNames = [];
                for(var deviceIndex=0; deviceIndex<alldevices.length; deviceIndex++){
                    deviceNames[deviceIndex] = alldevices[deviceIndex].getName();
                }
                // TODO: remove the next call AND wait with a task in the init method
                updateEpochChartSettings(initialTime, initialScale, deviceNames, false);
            });
    });
}