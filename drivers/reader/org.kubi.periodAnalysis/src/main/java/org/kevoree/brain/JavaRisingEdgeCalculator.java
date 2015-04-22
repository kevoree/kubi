package org.kevoree.brain;

import org.kubi.Parameter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jerome on 15/04/15.
 */
public class JavaRisingEdgeCalculator {
    public static List<Parameter> getRisingEdge(Parameter[] parameters){
        Parameter previous = null;
        List<Parameter> res = new ArrayList<>();
        for (Parameter p : parameters){
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
