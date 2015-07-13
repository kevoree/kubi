package org.kubi.plugins.switchYourLight;

import org.kevoree.modeling.KObject;
import org.kevoree.modeling.extrapolation.Extrapolation;
import org.kevoree.modeling.meta.KMetaAttribute;
import org.kubi.StateParameter;

/**
 * Created by jerome on 12/05/15.
 */
public class SwitchYourLightExtrapolation implements Extrapolation {
    @Override
    public Object extrapolate(KObject current, KMetaAttribute attribute) {
        double time = (double)(current.now()*Math.PI/(30000)); // 1 min periodic
        double phaseShift = 0;
        if (((StateParameter) current).getName().equals("light")){
            //if it's the light we need to phase shift the signal (simulation of the latency)
            phaseShift = 15000;
        }
        return (Math.sin(time + phaseShift)>0)+"";
    }

    @Override
    public void mutate(KObject current, KMetaAttribute attribute, Object payload) {

    }
}
