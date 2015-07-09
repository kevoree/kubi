package org.kubi.plugins.switchYourLight;

import org.kevoree.modeling.api.KObject;
import org.kevoree.modeling.api.extrapolation.Extrapolation;
import org.kevoree.modeling.api.meta.MetaAttribute;
import org.kubi.StateParameter;

/**
 * Created by jerome on 12/05/15.
 */
public class SwitchYourLightExtrapolation implements Extrapolation {
    @Override
    public Object extrapolate(KObject kObject, MetaAttribute metaAttribute) {
        double time = (double)(kObject.now()*Math.PI/(30000)); // 1 min periodic
        double phaseShift = 0;
        if (((StateParameter) kObject).getName().equals("light")){
            //if it's the light we need to phase shift the signal (simulation of the latency)
            phaseShift = 15000;
        }
        return (Math.sin(time + phaseShift)>0)+"";
    }

    @Override
    public void mutate(KObject kObject, MetaAttribute metaAttribute, Object o) {

    }

    @Override
    public String save(Object o, MetaAttribute metaAttribute) {
        return null;
    }

    @Override
    public Object load(String s, MetaAttribute metaAttribute, long l) {
        return null;
    }
}
