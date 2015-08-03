package org.kubi.infer.statemachine;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KConfig;
import org.kevoree.modeling.KObject;
import org.kubi.KubiModel;
import org.kubi.infer.statemachine.model.StateTimed;
import org.synoptic.State;
import org.synoptic.StateMachine;
import org.synoptic.Transition;
import org.synoptic.meta.MetaState;
import org.synoptic.meta.MetaStateMachine;
import org.synoptic.meta.MetaTransition;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Created by jerome on 08/07/15.
 */
public class StateMachineBuilder {


    private String fileName = "sm.out";
    private List<StateTimed> stateTimedList;

    public StateMachineBuilder() {
        this.stateTimedList = new ArrayList<StateTimed>();
    }

    //region open & close
    public BufferedReader openFile(){
        // Open the file
        FileInputStream fstream = null;
        try {
            fstream = new FileInputStream(this.fileName);
            BufferedReader br = new BufferedReader(new InputStreamReader(fstream));
            return br;
        }
        catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Close the BufferReader
     * @param bufferedReader
     * @throws java.io.IOException
     */
    public void closeFile(BufferedReader bufferedReader) throws IOException {
        bufferedReader.close();
    }

    //endregion

    //region Read file & processed it
    public void readFile(){
        BufferedReader bufferedReader = openFile();
        String strLine;

        //Read File Line By Line
        try {
            while ((strLine = bufferedReader.readLine()) != null)   {
                this.stateTimedList.add(new StateTimed(strLine));
            }
            Collections.sort(this.stateTimedList, new Comparator<StateTimed>() {
                @Override
                public int compare(StateTimed o1, StateTimed o2) {
                    return o1.getTimestamp().compareTo(o2.getTimestamp());
                }
            });
            closeFile(bufferedReader);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void processData(KubiModel model, StateMachine stateMachine){
        for (StateTimed stateTimed : this.stateTimedList){
            stateMachine.jump(stateTimed.getTimestamp(), new KCallback<KObject>() {
                @Override
                public void on(KObject stateMachineTimedObj) {
                    if (stateMachineTimedObj != null) {
                        StateMachine stateMachineTimed = ((StateMachine) stateMachineTimedObj);
                        stateMachineTimed.getCurrentState(new KCallback<State>() {
                            @Override
                            public void on(State currentState) {
                                if (currentState == null) {
                                    // the first state to add in the current StateMachine
                                    State state = model.createState(0, stateTimed.getTimestamp());
                                    state.setName(stateTimed.getState());
                                    stateMachineTimed.addStates(state);
                                    stateMachineTimed.setCurrentState(state);

                                } else {
                                    stateMachineTimed.traversal().traverse(MetaStateMachine.REF_STATES).withAttribute(MetaState.ATT_NAME, stateTimed.getState())
                                            .then(new KCallback<KObject[]>() {
                                                @Override
                                                public void on(KObject[] existingStates) {
                                                    if (existingStates.length == 0) {
                                                        // the state doesn't exist yet
                                                        State state = model.createState(0, stateTimed.getTimestamp());
                                                        state.setName(stateTimed.getState());
                                                        linkStates(((State) currentState), state, model);
                                                        stateMachineTimed.addStates(state);
                                                        stateMachineTimed.setCurrentState(state);
                                                    } else {
                                                        stateMachineTimed.setCurrentState((State) existingStates[0]);
                                                        ((State) currentState).canGoTo(((State) existingStates[0]).getName(), new KCallback<Boolean>() {
                                                            @Override
                                                            public void on(Boolean canGoTo) {
                                                                if (canGoTo) {
//                                                                    updateMetrics(((State) currentState), ((State) existingStates[0]), model);
                                                                } else {
                                                                    //the states exist but there is not transition linking them
                                                                    linkStates(((State) currentState), ((State) existingStates[0]), model);
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
            });
            model.save(new KCallback() {
                @Override
                public void on(Object o) {

                }
            });
        }
    }

    private void updateMetrics(State currentState, State existingState, KubiModel model) {
        Integer currentStateOutCounter = currentState.getOutCounter()==null?0:currentState.getOutCounter();
        currentState.setOutCounter(currentStateOutCounter+1);
        currentState.traversal().traverse(MetaState.REF_TOTRANSITION).then(new KCallback<KObject[]>() {
            @Override
            public void on(KObject[] toTransitionObjs) {
                for(KObject toTransitionObj : toTransitionObjs){
                    // for all the transitions leaving the current State
                    Transition transition = (Transition) toTransitionObj ;
                    toTransitionObj.traversal().traverse(MetaTransition.REF_TOSTATE).then(new KCallback<KObject[]>() {
                        @Override
                        public void on(KObject[] stateFromCurrentObjs) {
                            for (KObject stateFromCurrentObj : stateFromCurrentObjs){
                                Double newProba;
                                Double probability = transition.getProbability()==null?0:transition.getProbability();
                                // for all the states S where (currentState --> S)
                                if(((State) stateFromCurrentObj).getName().equals(existingState.getName())){
                                    // The transition currentState --> existingState  <==> destination state
                                    currentState.timeWalker().timesBefore(existingState.now(), new KCallback<long[]>() {
                                        @Override
                                        public void on(long[] longs) {
                                            Long deltaNow = existingState.now() - longs[1];
                                            Long deltaMin = transition.getDeltaMin()==null? KConfig.END_OF_TIME:transition.getDeltaMin();
                                            Long deltaMax = transition.getDeltaMin()==null?0:transition.getDeltaMin();
                                            transition.setDeltaMin(Math.min(deltaMin, deltaNow));
                                            transition.setDeltaMax(Math.max(deltaMax, deltaNow));
                                        }
                                    });
                                    newProba = (((probability*currentStateOutCounter)+1)/(currentStateOutCounter+1));
                                }else {
                                    newProba = ((probability*currentStateOutCounter)/(currentStateOutCounter+1));
                                }
                                transition.setProbability(newProba);
                            }
                        }
                    });
                }
            }
        });
    }

    private void linkStates(State currentState, State existingState, KubiModel model) {
        Transition transition = model.createTransition(0, existingState.now());
        transition.setFromState(currentState);
        transition.setToState(existingState);
        currentState.addToTransition(transition);
        existingState.addFromTransition(transition);
        model.save(new KCallback() {
            @Override
            public void on(Object o) {
            }
        });
    }
}
