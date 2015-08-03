/**
 * Created by jerome on 22/06/15.
 */
var periodEvolution = {
    univers : 0
};

function initWithModelPeriod(model){
    this.periodEvolution.model = model;
}

function updatePeriodSettings(time, scale, devices){
    this.periodEvolution.time = time * 1000;
    var currentView = kModeldata.universe(this.periodEvolution.univers).time(this.periodEvolution.time);
    console.log(devices);
    currentView.getRoot().then(function (root) {
        root.traversal()
            .traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
            .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES).withAttribute(org.kubi.meta.MetaDevice.ATT_NAME,devices[0])// TODO: generalize with the all table of devices
            .traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS)
            .traverse(org.kubi.meta.MetaStateParameter.REF_PERIOD)
            .done().then(function (periodRes) {
                var period = periodRes[0]; // TODO : generalize to the all set of devices
                var value = period.getPeriod();
                var date = new Date(period.now());
                document.getElementById("periodValue").innerText =  toAnalogic(value*50/60);

                document.getElementById("date").innerHTML =  prettyDate(date);
                document.getElementById("periodValueNull").innerText ="no value for this time, Please go in the future";
                if(value == undefined){
                    document.getElementById("periodValue").style.display = "none";
                    document.getElementById("periodValueNull").style.display = "inline-block";
                }
                else{
                    document.getElementById("periodValue").style.display = "inline-block";
                    document.getElementById("periodValueNull").style.display = "none";

                }
                document.getElementById("compareScale").innerText = "" + (scale/3600000);
                period.jump(period.now()-scale).then(function (previousPeriod){
                    var previousValue = previousPeriod.getPeriod();
                    document.getElementById("periodEvolutionValue").innerText = toAnalogic((value - previousValue) * 50 / 60);
                    document.getElementById("periodEvolutionValueNull").innerText = "no value for this time, Please go in the future";
                    if(previousValue == undefined) {
                        document.getElementById("periodEvolutionValueNull").style.display = "inline-block";
                        document.getElementById("periodEvolutionValue").style.display = "none";
                    }
                    else{
                        document.getElementById("periodEvolutionValueNull").style.display = "none";
                        document.getElementById("periodEvolutionValue").style.display = "inline-block";
                    }
                });
            });
    });
}

function prettyDate(date) {
    return (date.getDate()<10?("0"+date.getDate()):date.getDate())+"/"
    +   ((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"/"
    +   (date.getFullYear()) +" At "
    +   (date.getHours()<10?("0"+date.getHours()):date.getHours()) +":"
    +   (date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes())+":"
    +   (date.getSeconds()<10?("0"+date.getSeconds()):date.getSeconds());
}

/**
 * Transform a number in a string
 * in format : number in minutes
 * out format :  (-) HH : mm
 * @param value
 * @returns {string}
 */
function toAnalogic(value){
    var isNegative = false;
    if(value<0){
        value = -value;
        isNegative = true;
    }
    var minutes = value % 60;
    var hours = (value - minutes)/60;
    var minutesStr = parseInt(minutes)<10 ? ("0"+parseInt(minutes)) : parseInt(minutes);
    return (isNegative?" -  ":"") + hours + " : " + minutesStr;
}

