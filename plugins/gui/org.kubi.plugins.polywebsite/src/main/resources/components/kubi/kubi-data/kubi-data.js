var last_timestamp = (new Date()).getTime();
var kModeldata = new org.kubi.KubiModel();
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
var windowSize = 1000000;
var universeNumber = 0;
var timeNow = (new Date()).getTime();

function init() {
    kModeldata.setContentDeliveryDriver(new org.kevoree.modeling.database.websocket.WebSocketClient("ws://" + location.host + "/cdn"));
    kModeldata.connect().then(function (e) {
        if (e) {
            console.error(e);
        }
        else {
            initGraph();
            initDataAndListener();
        }
    });
}

function initWithModel(model) {
    kModeldata = model;
    initGraph();
    initDataAndListener();
}

/**
 * Initialize the graph empty
 */
function initGraph() {
    chart = new CanvasJS.Chart("chartContainer", {
        width: 1000,
        height: 500,
        backgroundColor: "#F0F0F4",
        theme: "theme3",
        colorSet: "colorSet2",
        interactivityEnabled: true,
        zoomEnabled: true,
        animationEnabled: true,
        title: {
            text: "Graph describing timed devices data",
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
        data: dataChart
    });
}

/**
 * Add a device named deviceName according to the chart expectations in the dataSeries set
 * @param deviceName
 */
function initDeviceInChartSeries(deviceName) {
    dataSeries[deviceName] = ({
        type: "line",
        showInLegend: true,
        name: deviceName,
        title: deviceName,
        dataPoints: []
    });
}

function initDataAndListener() {
    var deviceNames = [];
    var endTime = 1428997126000;
    var startTime = 1428599097936;
    var stepTime = 150000;
    var currentView = kModeldata.universe(universeNumber).time(last_timestamp);
    var groupListenerID = kModeldata.nextGroup();
    currentView.getRoot().then(function (root) {
        root.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES).traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).done().then(function (devices) {
            for (var d = 0; d < devices.length; d++) {
                var device = devices[d];
                deviceNames[deviceNames.length] = device.getName();
                device.traversal().traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).withAttribute(org.kubi.meta.MetaStateParameter.ATT_NAME, "name").done().then(function (params) {
                    if (params.length != 0) {
                        var param = params[0];
                        addListenerParam(param, groupListenerID);
                    }
                });
            }
            getAndDrawData(deviceNames, startTime, endTime, stepTime);
        });
    });
}

/**
 * Add a listener to the StateParameter param in parameter with the implementation of the action do to
 *  -> update of the value and the period ONLY if needed
 * @param param
 * @param groupListenerID
 */
function addListenerParam(param, groupListenerID) {
    param.listen(groupListenerID, function (param2, metaTabl) {
        param2.parent().then(function (parent) {
            var valueHasChanged = false;
            var periodHasChanged = false;
            for (var m = 0; m < metaTabl.length; m++) {
                if (metaTabl[m] == org.kubi.meta.MetaStateParameter.ATT_VALUE) {
                    valueHasChanged = true;
                }
                if (metaTabl[m] == org.kubi.meta.MetaPeriod.ATT_PERIOD) {
                    periodHasChanged = true;
                }
            }
            if (param2.getValue() != undefined && valueHasChanged) {
                // the value of the parameter has changed => add the value to the graph data set
                addDataPointWithSerie({
                    x: new Date(param.now()),
                    y: parseFloat(param.getValue())
                }, parent.getName());
            }
            if (periodHasChanged && dataSeries[parent.getName() + "_Period"].dataPoints.length >= 0) {
                param2.traversal().traverse(org.kubi.meta.MetaStateParameter.REF_PERIOD).done().then(function (periods) {
                    if (periods.length > 0 && periods[0].getPeriod() != undefined) {
                    }
                });
            }
        });
    });
}

/**
 * Add one StateParameter value in the dataSeries map
 * with its period ONLY if needed
 * @param param the StateParameter to add
 * @param keyMap name of the key in the map dataSeries
 */
function addDataWithPeriodInDataSeries(param, keyMap, hasToPrintPeriod) {
    if (dataChart[keyMap] == null || dataChart[keyMap] == undefined) {
        // TODO : init value ?? useless no ?? should be done before
    }
    dataSeries[keyMap].dataPoints.push({
        x: new Date(param.now()),
        y: parseFloat(param.getValue())
    });
    if(hasToPrintPeriod) {
        param.traversal().traverse(org.kubi.meta.MetaStateParameter.REF_PERIOD).done().then(function (periods) {
            if (periods.length > 0 && periods[0].getPeriod() != undefined) {
                if (dataSeries[keyMap + "_Period"] == null) {
                    initDeviceInChartSeries(keyMap + "_Period");
                }
                dataSeries[keyMap + "_Period"].dataPoints.push({
                    x: new Date(periods[0].now()),
                    y: parseFloat(periods[0].getPeriod())
                });
            }
        });
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
    for (var i in chart.options.data) {
        var d = chart.options.data[i];
        if (d.name.equals(serie)) {
            chart.options.data[i].dataPoints.push(point);
            if (chart.options.data[i].dataPoints.length > windowSize) {
                chart.options.data[i].dataPoints.shift();
            }
            this.chart.render();
            return;
        }
    }
    console.error("Bad series name (=", serie, ") : device not in the data set of the chart.");
}

/**
 * Get the value of the parameter named name of the device plug at the time time
 * @param time
 * @returns
 */
function getDeviceValue(time) {
    var currentView = kModeldata.universe(universeNumber).time(time * 1000);
    currentView.getRoot().then(function (root) {
        if (root != null) {
            root.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES).traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).withAttribute(org.kubi.meta.MetaDevice.ATT_NAME, "plug").traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).withAttribute(org.kubi.meta.MetaStateParameter.ATT_NAME, "name").done().then(function (kObecjts) {
                if (kObecjts.length > 0) {
                    var res = kObecjts[0].getValue();
                    // TODO : extract next line using the task to avoid the concurrency issue
                    document.getElementById("valDevice").innerHTML = (res == undefined ? "null" : res);
                }
            });
        }
    });
}


/**
 * Action after the slider changed
 *  - take all the info needed in the web page then call the getter and drawer of the data wanted
 */
function updateGraphSettings(value, range, devicesList) {
    value = value * 1000;
    var deviceNames = [];
    for (var i = 0; i < devicesList.length; i++) {
        if (devicesList[i].checked) {
            deviceNames[deviceNames.length] = devicesList[i].value;
        }
    }
    var start = value - range;
    var end = value - (-range);
    var numberOfPoint = 300;
    var step = range / numberOfPoint;
    console.log("... update values in graph ... (=updateGraphSettings)", value, range, devicesList);
    getAndDrawData(devicesList, start, end, step);
}

/**
 * Get and draw the data from kubi of the set of Devices named deviceNames in the time window [start,end] with a step of step
 * @param deviceNames
 * @param start
 * @param end
 * @param step
 */
function getAndDrawData(deviceNames, start, end, step) {
    var hasToPrintPeriod = false;
    //    dataChart = [];
    //dataSeries =[];
    var currentView = kModeldata.universe(universeNumber).time(end);
    currentView.getRoot().then(function (root) {
        if (root != null) {
            root.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES).done().then(function (technos) {
                if (technos.length != 0) {
                    for (var namesIndex = 0; namesIndex < deviceNames.length; namesIndex++) {
                        // TODO for all technologies
                        technos[0].traversal().traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).withAttribute(org.kubi.meta.MetaDevice.ATT_NAME, deviceNames[namesIndex]).done().then(function (devices) {
                            if (devices.length > 0) {
                                var device = devices[0];
                                device.traversal().traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).withAttribute(org.kubi.meta.MetaStateParameter.ATT_NAME, "name").done().then(function (parameters) {
                                    if (parameters.length > 0) {
                                        var param = parameters[0];
                                        // emptying the dataset of the device
                                        initDeviceInChartSeries(device.getName());
                                        if (hasToPrintPeriod && dataSeries[device.getName() + "_Period"] != null) {
                                            initDeviceInChartSeries(device.getName() + "_Period");
                                        }
                                        setInGraphDeviceRangeValuesWithPeriod(device.getName(), param, start, end, step, hasToPrintPeriod);
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

function setInGraphDeviceRangeValuesWithPeriod(deviceName, param, start, end, step, hasToPrintPeriod) {
    if (start < end) {
        param.jump(end).then(function (paramTimed) {
            if (paramTimed != null && paramTimed.getValue() != undefined) {
                addDataWithPeriodInDataSeries(paramTimed, deviceName, hasToPrintPeriod);
                setInGraphDeviceRangeValuesWithPeriod(deviceName, paramTimed, start, end - step, step, hasToPrintPeriod);
            }
        });
    }
    else {
        // add in graph
        console.log(deviceName, "-----in -setInGraphDeviceRangeValuesWithPeriod");
        // reverse the DataPoints set for the device given for the graph
        var unsortedDataPoints = dataSeries[deviceName].dataPoints;
        var sortedDataPoints = [];
        for (var i = 0; i < unsortedDataPoints.length; i++) {
            sortedDataPoints.push(unsortedDataPoints.slice(unsortedDataPoints.length - i - 1, unsortedDataPoints.length - i)[0]);
        }
        dataSeries[deviceName].dataPoints = sortedDataPoints;
        createOrReplaceValuesSetInChart(dataSeries[deviceName], deviceName);
        if (hasToPrintPeriod && dataSeries[deviceName + "_Period"] != undefined && dataSeries[deviceName + "_Period"].dataPoints.length != 0) {
            var unsortedPeriodDataPoints = dataSeries[deviceName + "_Period"].dataPoints;
            var sortedPeriodDataPoints = [];
            for (var i = 0; i < unsortedPeriodDataPoints.length; i++) {
                sortedPeriodDataPoints.push(unsortedPeriodDataPoints.slice(unsortedPeriodDataPoints.length - i - 1, unsortedPeriodDataPoints.length - i)[0]);
            }
            dataSeries[deviceName + "_Period"].dataPoints = sortedPeriodDataPoints;
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
function createOrReplaceValuesSetInChart(values, seriesName) {
    for (var i in dataChart) {
        if (seriesName.equals(dataChart[i].name)) {
            dataChart[i] = values;
            return;
        }
    }
    dataChart.push(values);
}