package org.kubi.infer.statemachine;

import org.kevoree.modeling.*;
import org.kevoree.modeling.meta.KMeta;
import org.kubi.Ecosystem;
import org.kubi.KubiModel;
import org.kubi.KubiUniverse;
import org.kubi.KubiView;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaEcosystem;
import org.synoptic.State;
import org.synoptic.StateMachine;
import org.synoptic.Transition;
import org.synoptic.meta.MetaState;
import org.synoptic.meta.MetaStateMachine;
import org.synoptic.meta.MetaTransition;

/**
 * Created by jerome on 10/07/15.
 */
public class InferStateMachinePlugin  implements KubiPlugin {
    @Override
    public void start(KubiKernel kernel) {
        final KubiModel statemachineModel = kernel.model();

        final KubiUniverse smUniverse = statemachineModel.universe(0);
        final KubiView smView = smUniverse.time(0L);
        smView.getRoot(kObjects -> {
            if (kObjects != null) {
                System.out.println("Read the file");

                StateMachineBuilder stateMachineBuilder = new StateMachineBuilder();
                stateMachineBuilder.readFile();

                System.out.println("Initiate the operation");

                statemachineModel.setClassOperation(MetaState.OP_CANGOTO, (KObject source, Object[] params, KCallback result) -> {
                    if (params.length > 0) {
                        source.traversal()
                                .traverse(MetaState.REF_TOTRANSITION)
                                .traverse(MetaTransition.REF_TOSTATE).withAttribute(MetaState.ATT_NAME, params[0])
                                .then(toState -> {
                                    if (toState.length > 0) {
                                        result.on(true);
                                    } else {
                                        result.on(false);
                                    }
                                });
                    }
                });

                System.out.println("Initiate the StateMachine");


                StateMachine stateMachine = smView.createStateMachine();
                stateMachine.setName("StateMachine");
                ((Ecosystem) kObjects).setStateMachine(stateMachine);

                KListener kListener = statemachineModel.createListener(smUniverse.key());
                kListener.listen(stateMachine);
                kListener.then(kObject -> {
//                    TODO : uncomment
//                    for (int m = 0; m < modifications.length; m++) {
//                        if (modifications[m] == MetaStateMachine.REF_CURRENTSTATE) {
//                            currentStateListener(kObject, modifications[m], statemachineModel);
//                        }
//                    }
                });


                System.out.println("Process the data collected from the file");
                stateMachineBuilder.processData(statemachineModel, stateMachine);
                System.out.println("Processed the data collected from the file");

                statemachineModel.save( o -> {});


                try {
                    System.out.println("Wait ...");
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("Read the data");
                read(statemachineModel);
            }
        });
    }

    @Override
    public void stop() {
        // TODO

    }

    private void currentStateListener(KObject src, KMeta modification, KubiModel statemachineModel) {
        System.out.println("coucou");
        ((StateMachine) src).getCurrentState(newState -> {
            if (newState == null) {

            } else {
                newState.timesBefore(newState.now(), longs -> {
                    if(longs.length>1) {
                        src.jump(longs[1], prevStateMachine -> {
                            ((StateMachine) prevStateMachine).getCurrentState(prevState -> {
                                updateMetrics((State) prevState, newState, statemachineModel);
                            });
                        });
                    }
                });
            }
        });
    }


    /**
     * Compute all the metrics wanted (delta min, delta max, probability, ... )
     * @param currentState the current state before the update (previous current state)
     * @param existingState the current state after the update (next current state)
     * @param model the model
     */
    private void updateMetrics(State currentState, State existingState, KubiModel model) {
        Integer currentStateOutCounter = existingState.getOutCounter()==null?0:existingState.getOutCounter();
        existingState.setOutCounter(currentStateOutCounter+1);
        currentState.jump(existingState.now(), kObject -> {
            kObject.traversal().traverse(MetaState.REF_TOTRANSITION).then(toTransitionObjs -> {
                for(KObject toTransitionObj : toTransitionObjs){
                    // for all the transitions leaving the current State
                    Transition transition = (Transition) toTransitionObj ;
                    ((Transition) toTransitionObj).getToState(stateFromCurrentObj -> {
                        Double probability = transition.getProbability() == null ? 0 : transition.getProbability();
                        Double newProba;
                        // for all the states S where currentState --> S
                        if (stateFromCurrentObj.getName().equals(existingState.getName())) {
                            // The transition currentState --> existingState  <==> destination state
                            currentState.timesBefore(existingState.now(),longs -> {
                                Long deltaNow = longs[0] - longs[1];
                                Long deltaMin = transition.getDeltaMin() == null ? KConfig.END_OF_TIME : transition.getDeltaMin();
                                Long deltaMax = transition.getDeltaMin() == null ? 0 : transition.getDeltaMin();
                                transition.setDeltaMin(Math.min(deltaMin, deltaNow));
                                transition.setDeltaMax(Math.max(deltaMax, deltaNow));
                            });
                            newProba = (((probability*currentStateOutCounter)+1)/(currentStateOutCounter+1));
                        } else {
                            newProba = ((probability*currentStateOutCounter)/(currentStateOutCounter+1));
                        }
                        transition.setProbability(newProba);
                    });
                }
            });
        });
    }



    private void read(KubiModel statemachineModel) {
        final KubiUniverse smUniverse = statemachineModel.universe(0);
        final KubiView smView = smUniverse.time(System.currentTimeMillis());
        smView.getRoot(kObject -> {
            if (kObject != null) {
                kObject.traversal().traverse(MetaEcosystem.REF_STATEMACHINE).then(kObjects -> {
                    System.out.println(((StateMachine) kObjects[0]).getName());
                    kObjects[0].traversal().traverse(MetaStateMachine.REF_STATES).then(statesObj -> {
                        for(KObject stateObj: statesObj){
                            String name = ((State) stateObj).getName();
                            stateObj.traversal().traverse(MetaState.REF_TOTRANSITION).then(toTransObjs -> {
                                System.out.println(" - " + name + "(" + ((State) stateObj).getOutCounter() + ")");
                                for(KObject toTransObj : toTransObjs){
                                    System.out.println("\t --> " + toTransObj);
                                }
                            });
                        }
                    });

                });
            }
        });
    }
}
