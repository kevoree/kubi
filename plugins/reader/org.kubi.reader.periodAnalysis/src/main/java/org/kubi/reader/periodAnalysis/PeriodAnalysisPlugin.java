package org.kubi.reader.periodAnalysis;

import org.kevoree.brain.JavaPeriodCalculatorFFT;
import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KConfig;
import org.kevoree.modeling.KObject;
import org.kubi.Ecosystem;
import org.kubi.Period;
import org.kubi.StateParameter;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaStateParameter;
import org.kubi.meta.MetaTechnology;

import java.util.ArrayList;
import java.util.List;

public class PeriodAnalysisPlugin implements KubiPlugin {

    private KubiKernel kubiKernel;

    @Override
    public void start(KubiKernel kernel) {
        this.kubiKernel = kernel;
        try {
            Thread.sleep(5000);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        System.out.println("Period computing...");
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot(new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Ecosystem ecosystem = (Ecosystem) kObject;
                ecosystem.traversal().traverse(MetaEcosystem.REF_TECHNOLOGIES)
                        .traverse(MetaTechnology.REF_DEVICES)
                        .traverse(MetaDevice.REF_STATEPARAMETERS)
                        .then(new KCallback<KObject[]>() {
                            @Override
                            public void on(KObject[] kObjects) {
                                // TODO : check if the Period is null or not
                                if (kObjects.length > 0) {
//                            for (int i =0;i<kObjects.length;i++){
                                    for (int i = 0; i < 1; i++) {
                                        StateParameter parameter = (StateParameter) kObjects[i];
//                                parameter.timeWalker().allTimes().then(new Callback<long[]>() {
//                                    @Override
//                                    public void on(long[] longs) {
                                        long timeMax = 1428997126000L;
//                                        timeMax = longs[0];
                                        getPreviousValues(parameter, 7600, timeMax, 50000);
//                                    }
//                                });
                                    }
                                } else {
                                    System.err.println("ERROR PeriodAnalysisPlugin: no device detected");
                                }
                            }
                        });
            }
        });
    }

    @Override
    public void stop() {
        System.out.println("PeriodAnalysisPlugin Stop ... ");
    }

    /**
     * Get an array with the numberOfValues last values of the Parameter parameter
     * from the time time jumping backward in the spaceTime of periodOfGets milliseconds
     *
     * @param parameter
     * @param numberOfValues the number of values that you still have to get
     * @param time           the time of the next get of value
     * @param periodOfGets   time between the get of data (getDataAt(x) -> getDataAt(x-periodOfGets))
     * @return
     */
    public void getPreviousValues(StateParameter parameter, int numberOfValues, long time, long periodOfGets) {
        List<Double> res = new ArrayList<Double>();
        getPreviousValues(res, parameter, numberOfValues, time, periodOfGets);
    }

    private void getPreviousValues(List<Double> result, StateParameter parameter, int numberOfValues, long time, long periodOfGets) {
        parameter.jump(time, new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                StateParameter p = (StateParameter) kObject;
                if (p != null && numberOfValues > 0 && p.getValue() != null) {
                    try {
                        result.add(Double.parseDouble(p.getValue()));
                    } catch (Exception e) {
                    }

                    List<Double> list = new ArrayList<Double>(result);
                    getPreviousValues(list, p, numberOfValues - 1, time - periodOfGets, periodOfGets);
                }
                int frequencyOfCalculattionOfThePeriod = 100;
                if (result.size() >= 1300 && numberOfValues % frequencyOfCalculattionOfThePeriod == 0 && numberOfValues != 0) {
//                if(numberOfValues%500 == 0 && numberOfValues != 0){
//                else{
                    calculatePeriod(result.toArray(), p);
                }
            }
        });
    }

    private void calculatePeriod(Object[] result, StateParameter parameter) {
//        int size = result.length%2==0 ? result.length : result.length-1 ;
        int size = 1300;
        double[] observationsDouble = new double[size];
        for (int i = 0; i < size; i++) {
            observationsDouble[i] = Double.parseDouble(result[i + result.length - size] + "");
        }
//        int period = JavaPeriodCalculatorFFT.getPeriod(observationsDouble, observationsDouble.length / 8, observationsDouble.length / 4);
//        int period = JavaPeriodCalculatorFFT.getPeriod(observationsDouble, 2, observationsDouble.length / 2);
        int period = JavaPeriodCalculatorFFT.getOtherPeriod(observationsDouble, 150, 700);
        parameter.traversal().traverse(MetaStateParameter.REF_PERIOD).then(new KCallback<KObject[]>() {
            @Override
            public void on(KObject[] kObjects) {
                if (kObjects.length > 0) {
                    Period kPeriod = ((Period) kObjects[0]);
                    if (kPeriod.getPeriod() == null) {
                        kPeriod.setPeriod(((double) period) + "");
                        System.out.println(kPeriod.getPeriod());
                        kubiKernel.model().save(new KCallback() {
                            @Override
                            public void on(Object o) {
                            }
                        });
                    } else
                        System.out.println(kPeriod.getPeriod());
                }
            }
        });

    }
}
