/**
 * Created by jerome on 03/06/15.
 */

var kModelSlider;
var universeSlider = 0;
var nbOfPoints = 500;
var timeSlider = (new Date()).getTime();

function setModelSlider(model){
    kModelSlider = model;
}
function setMaxSlider(){
    if(kModelSlider != undefined && kModelSlider != null) {
        kModelSlider.universe(universeSlider).time(timeSlider).getRoot(function (root) {
            try {
                root.traversal()
                    .traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
                    .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES)
                    .traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).then(function (stateParams) {
                        allTimes(stateParams, function (timestamps) {
                            try {
                                var max = getMax(timestamps);
                                var min = getMinExcept(timestamps, -9007199254740990);
                                setupSlider(min, max);
                            } catch (e) {
                                console.error(e);
                            }
                        })
                    });
            } catch (e) {
                console.error(e);
            }
        });
    }
}

function setupSlider(min, max){
    document.getElementById("slider1").max = max/1000;
    document.getElementById("slider1").min = min/1000;
    document.getElementById("slider1").value = (min + (max - min)/(2))/1000;
    document.getElementById("slider1").step = (max - min)/(nbOfPoints*1000);
}
function setupSliderFromNewValue(newValue){
    var slider = document.getElementById("slider1");
    var halfRange = (slider.max - slider.min)/2;
    setupSlider(newValue - halfRange, newValue + halfRange);
}

function allTimes(kobjects, callback){
    var count = kobjects.length;
    var resTimesAppend = [];
    for(var index=0; index<kobjects.length; index++){
        kobjects[index].allTimes(function (longs){
            // concat the longs table with the resTimeAppend table
            for(var j=0; j<longs.length;j++){
                resTimesAppend[resTimesAppend.length] = longs[j];
            }
            --count;
            if(count==0){
                callback(resTimesAppend);
            }
        });
    }
}


function getMax(table){
    var max;
    for(var k =0; k<table.length; k++){
        if(max == undefined || table[k]>max){
            max = table[k];
        }
    }
    return max;
}
function getMinExcept(table, numberException){
    var min;
    for(var k =0; k<table.length; k++){
        if((min == undefined || table[k]<min) && table[k]!= numberException){
            min = table[k];
        }
    }
    return min;
}