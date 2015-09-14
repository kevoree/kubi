package org.kubi.reader.periodAnalysis.extrapolation;

import org.kevoree.brain.JavaPeriodCalculatorFFT;
import org.kevoree.modeling.KObject;
import org.kevoree.modeling.defer.KDefer;
import org.kevoree.modeling.extrapolation.impl.DiscreteExtrapolation;
import org.kevoree.modeling.memory.manager.internal.KInternalDataManager;
import org.kevoree.modeling.meta.KMetaAttribute;
import org.kubi.Period;
import org.kubi.StateParameter;
import org.kubi.meta.MetaStateParameter;

/**
 * Created by jerome on 23/07/15.
 */
public class DiscreteExtrapolationWithPeriod extends DiscreteExtrapolation {
    @Override
    public void mutate(KObject current, KMetaAttribute attribute, Object payload, KInternalDataManager dataManager) {
        super.mutate(current, attribute, payload, dataManager);

        StateParameter  stateParameter = ((StateParameter) current);
        System.out.print("min : " + stateParameter.getPredictedPeriodMin());
        System.out.print("___ max : " + stateParameter.getPredictedPeriodMax());
        System.out.println("___ nb : "+stateParameter.getFrequencyOfCalculation());
        KDefer kDefer = current.manager().model().defer();

        long step = stateParameter.getFrequencyOfCalculation();
        long start = current.now()-(2*stateParameter.getPredictedPeriodMax());
        long end = current.now();
        while (start<end){
            current.jump(start,kDefer.waitResult());
            start = start + step;
        }
        kDefer.then(objects -> {
            double[] paramValues = new double[objects.length];
            for (int i = 0; i < objects.length; i++) {
                String value = ((StateParameter) objects[i]).getValue();
                if (value==null) {
                    System.err.println("Period computing error : some values are null.");
                    return;
                }
                paramValues[i] = Double.parseDouble(value);
            }
            calculatePeriod(paramValues, (StateParameter) current);
        });
    }


    /**
     * Calculate a period according to the table result
     * And Insert the calculated period in the StateParameter parameter at the time now of this parameter
     * @param result
     * @param parameter
     */
    private void calculatePeriod(double[] result, StateParameter parameter) {
//        int period = JavaPeriodCalculatorFFT.getPeriod(observationsDouble, observationsDouble.length / 8, observationsDouble.length / 4);
//        int period = JavaPeriodCalculatorFFT.getPeriod(observationsDouble, 2, observationsDouble.length / 2);
        int periodInPtNbMin = parameter.getPredictedPeriodMin() / parameter.getFrequencyOfCalculation();
        int periodInPtNbMax = parameter.getPredictedPeriodMin() / parameter.getFrequencyOfCalculation();
        int period = JavaPeriodCalculatorFFT.getOtherPeriod(result, periodInPtNbMin, periodInPtNbMax);
        parameter.traversal().traverse(MetaStateParameter.REL_PERIOD).then(kObjects -> {
            if (kObjects.length > 0) {
                Period kPeriod = ((Period) kObjects[0]);
                if (kPeriod.getPeriod() == null) {
                    kPeriod.setPeriod(((double) period) + "");
                    System.out.println("_period_" + kPeriod.getPeriod());
                    parameter.manager().model().save(o -> {});
                } else
                    System.out.println(kPeriod.getPeriod());
            }
        });

    }
}
