/**
 * Created by jerome on 14/07/15.
 */

var dataTestVar = {
    universe: 0,
    end: 1428884298000,
    start: 1428711786000,
    step: 80000000,
    startJava: 1428599555443,
    endJava: 1428995607436,
    uuidParam: 4
};


function initDataTest(modelDataTest) {
    dataTestVar.model = modelDataTest;

    dataTestVar.model.universe(0).time(1428884298000).lookup(dataTestVar.uuidParam, function (param) {
        console.log("////////", param, dataTestVar.endJava, dataTestVar.startJava, dataTestVar.step)
        printer(param, dataTestVar.endJava, dataTestVar.startJava, dataTestVar.step);
    });
}

function printer(param, end, start, step) {

    param.timeWalker().allTimes(function (times) {
        for (var l in times) {
            param.jump(times[l], function (kObject) {
                    console.log(kObject.getValue() + "-----" + kObject.now());
                }
            );
        }
    });


    /*
     console.log(param,".....................");
     if(start<end){
     param.manager().model().universe(dataTestVar.universe).time(end).lookup(dataTestVar.uuidParam, function(paramTimed){
     if(paramTimed != undefined) {
     console.log("****```````````", paramTimed.uuid(), paramTimed.getValue(), "____", paramTimed.now());
     printer(paramTimed, end - step, start, step);
     }
     });
     }
     */
}


function initDataTestTraverse(modelDataTest) {
    dataTestVar.model = modelDataTest;


    dataTestVar.model.universe(0).time(1428884298000).getRoot(function (root) {
        root.traversal()
            .traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
            .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES)
            .traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS)
            .then(function (params) {

                for (var i = 0; i < params.length; i++) {
                    printerTraverse(params[i], dataTestVar.endJava, dataTestVar.startJava, dataTestVar.step);
                }
            });
    });
}

function initDataTestLookup(modelDataTest) {
    dataTestVar.model = modelDataTest;


    dataTestVar.model.universe(0).time(1428884298000).lookup(dataTestVar.uuidParam, function (param) {
        printerTraverse(param, dataTestVar.endJava, dataTestVar.startJava, dataTestVar.step);
    });
}

function printerTraverse(param, end, start, step) {
    if (start < end) {
        param.jump(end, function (paramTimed) {
            if (paramTimed != undefined) {
                console.log("***`````", paramTimed.getValue(), "____", paramTimed.now());
                printerTraverse(paramTimed, end - step, start, step);
            }
        });
    }
}
