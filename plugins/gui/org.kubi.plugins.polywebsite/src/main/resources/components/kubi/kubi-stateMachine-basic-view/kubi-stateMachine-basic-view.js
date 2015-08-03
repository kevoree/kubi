/**
 * Created by jerome on 31/07/15.
 */


var stateMachineBasicVar = {
    universe : 0,
    time : (new Date()).getTime()
}


function setFSMModel(model) {
    stateMachineBasicVar.model = model;
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
                        var name =  statesObj[stateObj].getName();
                        var div = document.createElement('div');
                        statesObj[stateObj].traversal().traverse(org.synoptic.meta.MetaState.REF_TOTRANSITION).then(function(toTransObjs){
                            var ul = document.createElement('ul');
                            ul.id = "dropdown"+stateObj;
                            ul.className += "dropdown-content";
                            console.log(" - " + name + "(" + statesObj[stateObj].getOutCounter() + ")");
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
                            a.innerHTML = name + "(" + statesObj[stateObj].getOutCounter() + ") <i class=\"mdi-navigation-arrow-drop-down right\"></i>";
                            a.className += "btn dropdown-button";
                            a.setAttribute("data-activates", "dropdown"+stateObj);
                            a.href = "#!";
                            div.appendChild(ul);
                            div.appendChild(a);
                            document.getElementById(fsmDivId).appendChild(div);
                        });
                    }
                });
        }
    });
}

//<ul id="dropdown2" class="dropdown-content">
//<li><a href="#!">one<span class="badge">1</span></a></li>
//<li><a href="#!">two<span class="new badge">1</span></a></li>
//<li><a href="#!">three</a></li>
//</ul>
//<a class="btn dropdown-button" href="#!" data-activates="dropdown2">Dropdown<i class="mdi-navigation-arrow-drop-down right"></i></a>
