/// <reference path="org.kubi.model.d.ts" />
/// <reference path="org.kevoree.modeling.database.websocket.WebSocket.d.ts" />
var nunjucks;
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
var windowSize = 1000000;
var universeNumber = 0;
var timeNow = (new Date()).getTime();
try {
    init();
}
catch (e) {
    console.log(e);
}
function init() {
    kubiModel.setContentDeliveryDriver(new org.kevoree.modeling.database.websocket.WebSocketClient("ws://" + location.host + "/cdn"));
    kubiModel.connect().then(function (e) {
        if (e) {
            console.error(e);
        }
        else {
            initGraph();
            initTemplate("ecosystem-template", "ecosystem", universeNumber, timeNow);
            initTemplate("radioDevicePicker-template", "radioDevicePicker", universeNumber, timeNow);
            getDataFromKubi();
        }
        sliderInit();
        sliderGraphInit();
    });
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
 * initialize the template htmlIdSource to fill the htmlIdTarget at the time timeTemplate iun the universe universeTemplate
 * @param htmlIdSource
 * @param htmlIdTarget
 * @param universeTemplate
 * @param timeTemplate
 */
function initTemplate(htmlIdSource, htmlIdTarget, universeTemplate, timeTemplate) {
    var viewTemplate = kubiModel.universe(universeTemplate).time(timeTemplate);
    viewTemplate.getRoot().then(function (rootNow) {
        nunjucks.configure({ autoescape: true });
        try {
            // init the graph
            nunjucks.renderString((document.getElementById(htmlIdSource)).innerHTML, {
                ecosystem: rootNow,
                model: kubiModel,
                autoRefresh: true,
                autoescape: true,
                autoNow: true
            }, function (err, res) {
                if (err) {
                    console.log(err);
                }
                try {
                    (document.getElementById(htmlIdTarget)).innerHTML = res;
                }
                catch (e) {
                    console.log(e);
                }
            });
        }
        catch (e) {
            console.error(htmlIdSource, " has some issues initializing the template.");
            e.printStackTrace();
        }
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
function getDataFromKubi() {
    var endTime = 1428997126000;
    var startTime = 1428599097936;
    var stepTime = 150000;
    var currentView = kubiModel.universe(universeNumber).time(last_timestamp);
    var groupListenerID = kubiModel.nextGroup();
    currentView.getRoot().then(function (root) {
        root.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES).traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).done().then(function (devices) {
            for (var d = 0; d < devices.length; d++) {
                var device = devices[d];
                // add a curb describing the device and its period in the chart
                initDeviceInChartSeries(device.getName());
                initDeviceInChartSeries(device.getName() + "_Period");
                device.traversal().traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).withAttribute(org.kubi.meta.MetaStateParameter.ATT_NAME, "name").done().then(function (params) {
                    if (params.length != 0) {
                        var param = params[0];
                        addListenerParam(param, groupListenerID);
                        // add old data to the chart
                        param.parent().then(function (parent) {
                            setInGraphDeviceRangeValuesWithPeriod(parent.getName(), param, startTime, endTime, stepTime);
                        });
                    }
                });
            }
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
function addDataWithPeriodInDataSeries(param, keyMap) {
    dataSeries[keyMap].dataPoints.push({
        x: new Date(param.now()),
        y: parseFloat(param.getValue())
    });
    param.traversal().traverse(org.kubi.meta.MetaStateParameter.REF_PERIOD).done().then(function (periods) {
        if (periods.length > 0 && periods[0].getPeriod() != undefined) {
            if (dataSeries[keyMap + "_Period"] == null) {
                dataSeries[keyMap + "_Period"] = ({
                    type: "line",
                    showInLegend: true,
                    name: keyMap,
                    title: keyMap,
                    dataPoints: []
                });
            }
            dataSeries[keyMap + "_Period"].dataPoints.push({
                x: new Date(periods[0].now()),
                y: parseFloat(periods[0].getPeriod())
            });
        }
    });
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
 * Get the value of the parameter named name of the device plug at the temps
 * @param time
 * @returns
 */
function getDeviceValue(time) {
    var currentView = kubiModel.universe(universeNumber).time(time * 1000);
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
function rangeChanged() {
    var value = document.getElementById("slider").value;
    document.getElementById("val").textContent = value;
    document.getElementById("seekTo").value = value;
    getDeviceValue(value);
}
/**
 * function initializing the handler for the numerical values print
 */
function sliderInit() {
    try {
        document.getElementById("update").onclick = function () {
            var choosenValue = document.getElementById("seekTo").value;
            document.getElementById("val").textContent = choosenValue;
            document.getElementById("seekTo").value = choosenValue;
            getDeviceValue(choosenValue);
        };
        document.getElementById("slider").onchange = rangeChanged;
        document.getElementById("slider").oninput = rangeChanged;
    }
    catch (e) {
        console.log(e);
    }
}
/**
 * function initializing the handlers for the graph view updates
 */
function sliderGraphInit() {
    try {
        document.getElementById("slider1").onclick = sliderUpdatesGraph;
        document.getElementById("slider1").oninput = sliderUpdatesGraph;
    }
    catch (e) {
        console.log(e);
    }
}
function sliderUpdatesGraph() {
    var value = parseInt(document.getElementById("slider1").value) * 1000;
    var select = document.getElementById("selectScale");
    var range = select.options[select.selectedIndex].value;
    var deviceNames = [];
    var form = document.getElementById("radioDevicePicker");
    for (var i = 0; i < form.length; i++) {
        if (form[i].checked) {
            deviceNames[deviceNames.length] = form[i].value;
        }
    }
    var start = value - range;
    var end = value - (-range);
    var numberOfPoint = 300;
    var step = range / numberOfPoint;
    console.log(start, "-----", end, "_____", range, "_____", step);
    contentSliderGraphInit(deviceNames, start, end, step);
}
function contentSliderGraphInit(deviceNames, start, end, step) {
    //var end = ( end==0 ? start-86400000 : end  );
    //var step = ( step==0 ? 3600000 : step );
    var currentView = kubiModel.universe(universeNumber).time(end);
    currentView.getRoot().then(function (root) {
        if (root != null) {
            root.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES).done().then(function (kObjects) {
                if (kObjects.length != 0) {
                    for (var namesIndex = 0; namesIndex < deviceNames.length; namesIndex++) {
                        kObjects[0].traversal().traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).withAttribute(org.kubi.meta.MetaDevice.ATT_NAME, deviceNames[namesIndex]).done().then(function (kObjects) {
                            if (kObjects.length > 0) {
                                var device = kObjects[0];
                                device.traversal().traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).withAttribute(org.kubi.meta.MetaStateParameter.ATT_NAME, "name").done().then(function (parameters) {
                                    if (parameters.length > 0) {
                                        var param = parameters[0];
                                        // emptying the dataset of the device
                                        initDeviceInChartSeries(device.getName());
                                        if (dataSeries[device.getName() + "_Period"] != null) {
                                            initDeviceInChartSeries(device.getName() + "_Period");
                                        }
                                        setInGraphDeviceRangeValuesWithPeriod(device.getName(), param, start, end, step);
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
function setInGraphDeviceRangeValuesWithPeriod(deviceName, param, start, end, step) {
    if (start < end) {
        param.jump(end).then(function (paramTimed) {
            if (paramTimed != null && paramTimed.getValue() != undefined) {
                addDataWithPeriodInDataSeries(paramTimed, deviceName);
                setInGraphDeviceRangeValuesWithPeriod(deviceName, paramTimed, start, end - step, step);
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
        if (dataSeries[deviceName + "_Period"] != undefined && dataSeries[deviceName + "_Period"].dataPoints.length != 0) {
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
