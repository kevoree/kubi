package org.kubi.plugins.smartfridgerepeatrealtime.brain;


import org.kubi.StateParameter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jerome on 15/04/15.
 */
public class JavaRisingEdgeCalculator {
    public static List<StateParameter> getRisingEdge(StateParameter[] parameters){
        StateParameter previous = null;
        List<StateParameter> res = new ArrayList<>();
        for (StateParameter p : parameters){
            if (previous != null) {
                if (previous.getValue().equals(p.getValue())){
                    // add previous to be related to kubi way of filling blanks in the data set.
                    res.add(previous);
                }
            }
            previous = p;
        }
        return res;
    }
}
