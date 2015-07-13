package org.kubi.infer.statemachine;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KConfig;
import org.kevoree.modeling.KObject;
import org.kevoree.modeling.event.KEventListener;
import org.kevoree.modeling.meta.KMeta;
import org.kevoree.modeling.operation.KOperation;
import org.kubi.KubiModel;
import org.kubi.KubiUniverse;
import org.kubi.KubiView;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

/**
 * Created by jerome on 10/07/15.
 */
public class InferStateMachinePlugin  implements KubiPlugin {
    @Override
    public void start(KubiKernel kernel) {
        final KubiModel statemachineModel = kernel.model();

        final KubiUniverse smUniverse = statemachineModel.universe(0);
        final KubiView smView = smUniverse.time(0L);
        smView.getRoot(new KCallback<KObject>() {
            @Override
            public void on(KObject kObjects) {
                if (kObjects == null) {
//                    Log.debug("Read the file");


                    StateMachineBuilder stateMachineBuilder = new StateMachineBuilder();
                    stateMachineBuilder.readFile();

//                    Log.debug("Initiate the operation");

                    statemachineModel.setOperation(MetaState.OP_CANGOTO, new KOperation() {
                        @Override
                        public void on(KObject source, Object[] params, KCallback<Object> result) {
                            if (params.length > 0) {
                                source.traversal()
                                        .traverse(MetaState.REF_TOTRANSITION)
                                        .traverse(MetaTransition.REF_TOSTATE).withAttribute(MetaState.ATT_NAME, params[0])
                                        .then(new KCallback<KObject[]>() {
                                            @Override
                                            public void on(KObject[] kObjects) {
                                                if (kObjects.length > 0) {
                                                    result.on(true);
                                                } else {
                                                    result.on(false);
                                                }
                                            }
                                        });
                            }
                        }
                    });

                    System.out.println("Initiate the Root");

//                    Log.debug("Initiate the Root");

                    StateMachine stateMachine = smView.createStateMachine();
                    smView.setRoot(stateMachine, new KCallback() {
                        @Override
                        public void on(Object o) {
                        }
                    });
                    stateMachine.setName("StateMachine");

                    long smGroup = statemachineModel.nextGroup();
                    stateMachine.listen(smGroup, new KEventListener() {
                        @Override
                        public void on(KObject src, KMeta[] modifications) {
                            for (int m = 0; m < modifications.length; m++) {
                                if (modifications[m] == MetaStateMachine.REF_CURRENTSTATE) {
                                    currentStateListener(src, modifications[m], statemachineModel);
                                }
                            }
                        }
                    });

                    System.out.println("Process the data collected from the file");
//                    Log.debug("Process the data collected from the file");
                    stateMachineBuilder.processData(statemachineModel, stateMachine);

                    statemachineModel.save(new KCallback() {
                        @Override
                        public void on(Object o) {

                        }
                    });


                    try {
                        System.out.println("Wait ...");
//                        Log.debug("Wait ...");
                        Thread.sleep(3000);
                        System.out.println("Read the data");
//                        Log.debug("Read the data");
                        read(statemachineModel);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    @Override
    public void stop() {
        // TODO

    }

    private void currentStateListener(KObject src, KMeta modification, KubiModel statemachineModel) {
        System.out.println("coucou");
//        ((StateMachine) src).getCurrentState(new KCallback<State>() {
//            @Override
//            public void on(State newState) {
//                if (newState == null) {
//
//                } else {
//                    newState.timeWalker().timesBefore(newState.now(), new KCallback<long[]>() {
//                        @Override
//                        public void on(long[] longs) {
//                            if(longs.length>1) {
//                                src.jump(longs[1], new KCallback<KObject>() {
//                                    @Override
//                                    public void on(KObject prevStateMachine) {
//                                        ((StateMachine) prevStateMachine).getCurrentState(new KCallback<State>() {
//                                            @Override
//                                            public void on(State prevState) {
//                                                updateMetrics((State) prevState, newState, statemachineModel);
//                                            }
//                                        });
//                                    }
//                                });
//                            }
//                        }
//                    });
//                }
//            }
//        });
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
        currentState.jump(existingState.now(), new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                kObject.traversal().traverse(MetaState.REF_TOTRANSITION).then(new KCallback<KObject[]>() {
                    @Override
                    public void on(KObject[] toTransitionObjs) {
                        for(KObject toTransitionObj : toTransitionObjs){
                            // for all the transitions leaving the current State
                            Transition transition = (Transition) toTransitionObj ;
                            ((Transition) toTransitionObj).getToState(new KCallback<State>() {
                                @Override
                                public void on(State stateFromCurrentObj) {
                                    Double probability = transition.getProbability() == null ? 0 : transition.getProbability();
                                    Double newProba;
                                    // for all the states S where currentState --> S
                                    if (stateFromCurrentObj.getName().equals(existingState.getName())) {
                                        // The transition currentState --> existingState  <==> destination state
                                        currentState.timeWalker().timesBefore(existingState.now(), new KCallback<long[]>() {
                                            @Override
                                            public void on(long[] longs) {
                                                Long deltaNow = longs[0] - longs[1];
                                                Long deltaMin = transition.getDeltaMin() == null ? KConfig.END_OF_TIME : transition.getDeltaMin();
                                                Long deltaMax = transition.getDeltaMin() == null ? 0 : transition.getDeltaMin();
                                                transition.setDeltaMin(Math.min(deltaMin, deltaNow));
                                                transition.setDeltaMax(Math.max(deltaMax, deltaNow));
                                            }
                                        });
                                        newProba = (((probability*currentStateOutCounter)+1)/(currentStateOutCounter+1));
                                    } else {
                                        newProba = ((probability*currentStateOutCounter)/(currentStateOutCounter+1));
                                    }
                                    transition.setProbability(newProba);
                                }
                            });
                        }
                    }
                });
            }
        });
    }



    private void read(KubiModel statemachineModel) {
        final KubiUniverse smUniverse = statemachineModel.universe(0);
        final KubiView smView = smUniverse.time(System.currentTimeMillis());
        smView.getRoot(new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                if (kObject != null) {
                    System.out.println(((StateMachine) kObject).getName());
                    kObject.traversal().traverse(MetaStateMachine.REF_STATES).then(new KCallback<KObject[]>() {
                        @Override
                        public void on(KObject[] statesObj) {
                            for(KObject stateObj: statesObj){
                                String name = ((State) stateObj).getName();
                                stateObj.traversal().traverse(MetaState.REF_TOTRANSITION).then(new KCallback<KObject[]>() {
                                    @Override
                                    public void on(KObject[] toTransObjs) {
                                        System.out.println(" - " + name + "(" + ((State) stateObj).getOutCounter() + ")");
                                        for(KObject toTransObj : toTransObjs){
                                            System.out.println("\t --> " + toTransObj);
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
}
