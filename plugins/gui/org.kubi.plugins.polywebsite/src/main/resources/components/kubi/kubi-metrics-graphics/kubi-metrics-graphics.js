/**
 * Created by jerome on 21/08/15.
 */


var kubiMetricsVar = {
    time: (new Date()).getTime(),
    model: undefined,
    universe:0,
    windowSize: 1000000,
    chartData: [],
    numberOfPoints : 100
};

function initWithModel(model){
    kubiMetricsVar.model = model;
    initData();
}


/**
 * Initialize the graph empty
 **/
function initGraph() {
    MG.data_graphic({
        title: "Timed sensors data.",
        description: "This is a simple line chart. You can remove the area portion by adding area: false to the arguments list.",
        data: kubiMetricsVar.chartData,
        width: 800,
        height: 300,
        right: 40,
        target: document.getElementById('chartContainerMetrics'),
        y_extended_ticks: true,
        x_accessor: 'date',
        x_label: 'Time',
        y_label: 'Sensors value',
        area: false,
        y_rug: true,
        y_accessor: kubiMetricsVar.deviceNames
    });
}


/*

 */
function initData(){
    kubiMetricsVar.deviceNames = [];
    var initialRange = 4900000;
    var initialTime = ((new Date()).getTime()/1000)+4900;

    kubiMetricsVar.model.universe(kubiMetricsVar.universe).time(kubiMetricsVar.time).getRoot(function(root){
        if(root != undefined){
            root.traversal()
                .traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
                .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES)
                .then(function (devices){
                    for(var i=0; i<devices.length; i++){
                        kubiMetricsVar.deviceNames[i] = devices[i].getName();
                    }
                    updateGraph(initialTime, initialRange, kubiMetricsVar.deviceNames, false);
                });
        }
    });
}

function updateGraph(time, range, deviceNames, showPeriod){
    time = time * 1000;
    var start = time - range;
    var end = parseFloat(time) + parseFloat(range);
    var step = range / kubiMetricsVar.numberOfPoints;
    console.log("Kubi Mozilla metrics graphics :: updateGraph", time, range, deviceNames, showPeriod);
    clearDataSets();
    collectData(deviceNames, start, end, step, showPeriod);
}

/**
 * @param deviceNames
 * @param start
 * @param end
 * @param step
 * @param showPeriod
 */
function collectData(deviceNames, start, end, step, showPeriod){
    showPeriod = showPeriod==undefined ? false : showPeriod;
    kubiMetricsVar.model.universe(kubiMetricsVar.universe).time(end).getRoot(function(root){
        if(root!=undefined){
            // defer to get all the devices wanted
            var kDeferDevice = kubiMetricsVar.model.defer();
            for(var i =0; i< deviceNames.length; i++){
                root.traversal()
                    .traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
                    .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).withAttribute(org.kubi.meta.MetaDevice.ATT_NAME, deviceNames[i])
                    .traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS)
                    .then(kDeferDevice.waitResult());
            }
            kDeferDevice.then(function(results){
                var uuidList = [];
                for(var j=0; j<results.length; j++){
                    if(results[j].length >0) {
                        uuidList.push(results[j][0].uuid());
                    }
                }

                var kDeferParameters = kubiMetricsVar.model.defer();
                // times is the set of times when we want data to be print in the graph
                for(var time= start; time<end; time+=step){
                    kubiMetricsVar.model.lookupAll(kubiMetricsVar.universe,time,uuidList,kDeferParameters.waitResult());
                }
                kDeferParameters.then(function(parametersTimed){
                    console.log(parametersTimed.length);
                    var index =0;
                    for(var time= start; time<end; time+=step){

                        var dataTimed = {
                            date : new Date(time)
                        };
                        for(var j=0; j<parametersTimed[index].length; j++){
                            var value = parametersTimed[index][j].getValue();
                            if(value != undefined) {
                                dataTimed[kubiMetricsVar.deviceNames[j]] = value;
                            }
                        }
                        kubiMetricsVar.chartData.push(dataTimed);
                        index++;
                    }
                    initGraph();
                });
            });
        }
    });
}


function clearDataSets(){
    if(kubiMetricsVar.chartData != undefined){
        kubiMetricsVar.chartData = [];
    }
}
