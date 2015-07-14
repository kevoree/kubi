/**
 * Created by jerome on 14/07/15.
 */

var dataTestVar = {
    universe : 0,
    end : 1428884298000,
    start :1428711786000,
    step : 80000,
    startJava : 1428599555443,
    endJava : 1428995607436
};


function initDataTest(modelDataTest){
    dataTestVar.model = modelDataTest;


    dataTestVar.model.universe(0).time(1428884298000).getRoot(function (root){
        root.traversal()
            .traverse(org.kubi.meta.MetaEcosystem.REF_TECHNOLOGIES)
            .traverse(org.kubi.meta.MetaTechnology.REF_DEVICES)
            .traverse(org.kubi.meta.MetaDevice.REF_STATEPARAMETERS)
            .then(function (params){

                for(var i = 0; i<params.length;i++) {
                    printer(params[i], dataTestVar.endJava, dataTestVar.startJava, dataTestVar.step);
                }
            });
    });
}

function printer(param, end, start, step){
    if(start<end){
        param.jump(end, function(paramTimed){
            if(paramTimed != undefined) {
                console.log("***`````````````````````", paramTimed.getValue(), "____", paramTimed.now());
                printer(paramTimed, end - step, start, step);
            }
        });
    }
}
