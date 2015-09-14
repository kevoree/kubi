/**
 * Created by jerome on 31/07/15.
 */


var stateMachineBasicVar = stateMachineBasicVar || {
        universe : 0,
        time : (new Date()).getTime()
    }


function setFSMModel(model) {
    stateMachineBasicVar.model = model;
    stateMachineBasicVar.modelContext = stateMachineBasicVar.model.createModelContext();
    stateMachineBasicVar.modelContext.set((new Date()).getTime(),org.kevoree.modeling.KConfig.END_OF_TIME,0,0);
}

function showBasicStateMachine(fsmDivId){
    var smUniverse = stateMachineBasicVar.model.universe(stateMachineBasicVar.universe);
    var smView = smUniverse.time(stateMachineBasicVar.time);
    smView.getRoot(function (ecosystem){
        if (ecosystem != null) {
            console.log(ecosystem.getName());
            ecosystem.traversal()
                .traverse(org.kubi.meta.MetaEcosystem.REF_STATEMACHINE)
                .traverse(org.synoptic.meta.MetaStateMachine.REF_STATES).then(function (statesObj) {
                    for(var stateObj in statesObj){
                        addStateInDivDropdown(statesObj[stateObj], fsmDivId, stateObj);
                        addStateInDiv(statesObj[stateObj], fsmDivId);
                    }
                });
        }
    });
}

function initTemplateFSM(htmlIdSource, htmlIdTarget) {
    var smUniverse = stateMachineBasicVar.model.universe(stateMachineBasicVar.universe);
    var smView = smUniverse.time(stateMachineBasicVar.time);
    smView.getRoot(function (ecosystem){
        if (ecosystem != null) {
            console.log(ecosystem.getName());
            ecosystem.traversal().traverse(org.kubi.meta.MetaEcosystem.REF_STATEMACHINE).then(function(stateMachine){
                try {
                    var template = paperclip.template((document.getElementById(htmlIdSource)).innerHTML);
                    var view = template.view({stateMachine: stateMachine[0] }, {modelContext : stateMachineBasicVar.modelContext});
                    (document.getElementById(htmlIdTarget)).appendChild(view.render());
                }
                catch (e) {
                    console.error(htmlIdTarget, " has some issues initializing the template.",e);
                }
            });
        }
    });
}

paperclip.modifiers.getOutCounter = function(state) {
    return state.getOutCounter();
};

function addStateInDiv(stateObj, fsmDivId){
    var div = document.createElement('div');
    var name =  stateObj.getName();
    stateObj.traversal()
        .traverse(org.synoptic.meta.MetaState.REF_TOTRANSITION)
        .then(function(toTransObjs){
            var ul = document.createElement('ul');
            ul.id = "dropdown"+stateObj;
            ul.className += "collection with-header";
            console.log(" - " + name + "(" + stateObj.getOutCounter() + ")");
            var liTitle = document.createElement('li');
            var title = document.createElement('h5');
            title.innerHTML = name + "(outCounter : " + stateObj.getOutCounter() + " )";
            liTitle.innerHTML = title.outerHTML;
            liTitle.className += "collection-header";
            ul.appendChild(liTitle);
            for(var toTransObj  in toTransObjs){
                console.log("\t --> " + toTransObjs[toTransObj]);
                var li = document.createElement('li');
                li.className += "collection-item";
                li.innerHTML = "-->" + toTransObjs[toTransObj];
                toTransObjs[toTransObj].traversal().traverse(org.synoptic.meta.MetaTransition.REF_TOSTATE).then(function(toState){
                    // TODO : make it thread safe
                    li.innerHTML = "<span>-->"+ toState[0].getName() + "</span>";
                });
                ul.appendChild(li);
            }
            div.appendChild(ul);
            document.getElementById(fsmDivId).appendChild(div);
        });
}

function addStateInDivDropdown(stateObj, fsmDivId, stateObjNum){
    var div = document.createElement('div');
    stateObj.traversal()
        .traverse(org.synoptic.meta.MetaState.REF_TOTRANSITION)
        //.traverse(org.synoptic.meta.MetaTransition.REF_TOSTATE)
        .then(function(toTransObjs){
            var name =  stateObj.getName();
            var ul = document.createElement('ul');
            ul.id = "dropdown"+stateObjNum;
            ul.className += "dropdown-content";
            console.log(" - " + name + "(" + stateObj.getOutCounter() + ")");
            for(var toTransObj  in toTransObjs){
                console.log("\t --> " + toTransObjs[toTransObj]);
                var li = document.createElement('li');
                var aIn = document.createElement('a');
                aIn.href = "#!";
                aIn.innerHTML = "-->" + toTransObjs[toTransObj];
                li.appendChild(aIn);
                ul.appendChild(li);
            }
            var a = document.createElement("a");
            a.innerHTML = name + "(" + stateObj.getOutCounter() + ") <i class=\"mdi-navigation-arrow-drop-down right\"></i>";
            a.className += "btn dropdown-button";
            a.setAttribute("data-activates", "dropdown"+stateObjNum);
            a.href = "#!";
            div.appendChild(ul);
            div.appendChild(a);
            document.getElementById(fsmDivId).appendChild(div);
        });
}

//<ul id="dropdown2" class="dropdown-content">
//<li><a href="#!">one<span class="badge">1</span></a></li>
//<li><a href="#!">two<span class="new badge">1</span></a></li>
//<li><a href="#!">three</a></li>
//</ul>
//<a class="btn dropdown-button" href="#!" data-activates="dropdown2">Dropdown<i class="mdi-navigation-arrow-drop-down right"></i></a>
