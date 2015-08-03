package org.kubi.plugins.smartfridgerepeatrealtime.extrapolation;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KObject;
import org.kevoree.modeling.defer.KDefer;
import org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation;
import org.kevoree.modeling.meta.KMetaAttribute;
import org.kubi.Period;
import org.kubi.StateParameter;
import org.kubi.meta.MetaStateParameter;
import org.kubi.plugins.smartfridgerepeatrealtime.brain.JavaPeriodCalculatorFFT;

/**
 * Created by jerome on 23/07/15.
 */
public class DiscreteExtrapolationWithPeriod extends DiscreteExtrapolation {
    @Override
    public void mutate(KObject current, KMetaAttribute attribute, Object payload) {
        super.mutate(current, attribute, payload);

        StateParameter stateParameter = ((StateParameter) current);

        KDefer kDefer = current.manager().model().defer();

        long step = stateParameter.getFrequencyOfCalculation();
        long start = current.now() - (2 * stateParameter.getPredictedPeriodMax());
        long end = current.now();
//        System.out.print("min : " + stateParameter.getPredictedPeriodMin());
//        System.out.print("___ max : " + stateParameter.getPredictedPeriodMax());
//        System.out.print("___ start : " + start);
//        System.out.print("___ end : " + end);
//        System.out.println("___ nb : " + stateParameter.getFrequencyOfCalculation());
        while (start < end) {
            current.jump(start, kDefer.waitResult());
            start = start + step;
        }
        kDefer.then(new KCallback<Object[]>() {
            @Override
            public void on(Object[] objects) {
                double[] paramValues = new double[objects.length];
                for (int i = 0; i < objects.length - 1; i++) {
                    if (objects[i] == null || ((StateParameter) objects[i]).getValue() == null) {
                        // System.out.println("not enough point in the past");
                        return;
                    }
                    String value = ((StateParameter) objects[i]).getValue();
                    paramValues[i] = Double.parseDouble(value);
                }
                calculatePeriod(paramValues, (StateParameter) current);
            }
        });
    }


    /**
     * Calculate a period according to the table result
     * And Insert the calculated period in the StateParameter parameter at the time now of this parameter
     *
     * @param result
     * @param parameter
     */
    private void calculatePeriod(double[] result, StateParameter parameter) {
//        int period = JavaPeriodCalculatorFFT.getPeriod(observationsDouble, observationsDouble.length / 8, observationsDouble.length / 4);
//        int period = JavaPeriodCalculatorFFT.getPeriod(observationsDouble, 2, observationsDouble.length / 2);
        int periodInPtNbMin = parameter.getPredictedPeriodMin() / parameter.getFrequencyOfCalculation();
        int periodInPtNbMax = parameter.getPredictedPeriodMax() / parameter.getFrequencyOfCalculation();
//        System.out.print("min : " + periodInPtNbMin);
//        System.out.println("  __  max : " + periodInPtNbMax);
        int period = JavaPeriodCalculatorFFT.getOtherPeriod(result, periodInPtNbMin, periodInPtNbMax);
        parameter.traversal().traverse(MetaStateParameter.REF_PERIOD).then(new KCallback<KObject[]>() {
            @Override
            public void on(KObject[] kObjects) {
                if (kObjects.length > 0) {
                    Period kPeriod = ((Period) kObjects[0]);
                    kPeriod.setPeriod(((double) period) * parameter.getFrequencyOfCalculation() + "");
                    kPeriod.setPeriod(((double) period) + "");
                    parameter.manager().model().save(new KCallback() {
                        @Override
                        public void on(Object o) {
                        }
                    });
                }
            }
        });
    }
}
