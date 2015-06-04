/**
 * Created by jerome on 03/06/15.
 */

var kModelSlider;
var universeSlider = 0;
var timeSlider = (new Date()).getTime();

function setModelSlider(model){
    kModelSlider = model;
}
function setMaxSlider(){
    kModelSlider.universe(universeSlider).time(timeSlider).getRoot().then(function(root){
        try {
            root.traversal()
                .traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
                .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES)
                .traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS).done().then(function (stateParams) {
                    allTimes(stateParams, function (timestamps) {
                        try{
                            var max = getMax(timestamps);
                            var min = getMinExcept(timestamps,-9007199254740990);
                            document.getElementById("slider1").max = max/1000;
                            document.getElementById("slider1").min = min/1000;
                            document.getElementById("slider1").value = (max - min)/(2*1000);
                            document.getElementById("slider1").step = (max - min)/(5000*1000);
                        }catch (e){
                            console.error(e);
                        }
                    })
                });
        }catch(e){console.error(e);}
    });
}

function allTimes(kobjects, callback){
    var count = kobjects.length;
    var resTimesAppend = [];
    for(var index=0; index<kobjects.length; index++){
        kobjects[index].timeWalker().allTimes().then(function (longs){
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