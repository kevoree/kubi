package org.kubi.reader.periodAnalysis;

import org.kevoree.brain.JavaPeriodCalculatorFFT;
import org.kevoree.modeling.KConfig;
import org.kevoree.modeling.defer.KDefer;
import org.kubi.Ecosystem;
import org.kubi.Period;
import org.kubi.StateParameter;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaStateParameter;
import org.kubi.meta.MetaTechnology;

public class PeriodAnalysisPlugin implements KubiPlugin {

    private KubiKernel kubiKernel;
    private final int maxSize = 7600;
    private final int size = 1300;

    @Override
    public void start(KubiKernel kernel) {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        this.kubiKernel = kernel;
        System.out.println("Period computing...");
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot(root -> {
            Ecosystem ecosystem = (Ecosystem) root;
            ecosystem.traversal().traverse(MetaEcosystem.REF_TECHNOLOGIES)
                    .traverse(MetaTechnology.REF_DEVICES)
                    .traverse(MetaDevice.REF_STATEPARAMETERS)
                    .then(kObjects -> {
                        if (kObjects.length > 0) {
//                            for (int i =0;i<kObjects.length;i++){
                            for (int i = 0; i < 1; i++) {
                                StateParameter parameter = (StateParameter) kObjects[i];
                                parameter.allTimes(alltimes -> {
                                    long timeMax = alltimes[0];
                                    long timeMin = alltimes[alltimes.length - 2];
                                    System.out.println("max & min: "+timeMax+"-----//"+timeMin);
                                    getPreviousValues(parameter, timeMax, 50000);
                                });
                            }
                        } else {
                            System.err.println("ERROR PeriodAnalysisPlugin: no device detected");
                        }
                    });
        });

    }

    @Override
    public void stop() {
        System.out.println("PeriodAnalysisPlugin Stop ... ");
    }

    /**
     * Get an array with the last values of the Parameter parameter
     * from the time time jumping backward in the spaceTime of periodOfGets milliseconds
     *
     * @param parameter
     * @param time           the time of the next get of value
     * @param periodOfGets   time between the get of data (getDataAt(x) -> getDataAt(x-periodOfGets))
     * @return
     */
    private void getPreviousValues(StateParameter parameter, long time, long periodOfGets) {
        int frequencyOfCalculationOfThePeriod = 10;
        KDefer kDefer = kubiKernel.model().defer();
        for(int i=0; i<this.maxSize;i++){
            parameter.jump(time - i * periodOfGets, kDefer.waitResult());
        }
        kDefer.then(res -> {
            System.out.println(res.length+" -----------*****");
            double[] results = new double[res.length];
            StateParameter p = parameter;
            for (int j = 0; j < res.length; j++) {
                p = (StateParameter) res[j];
                if (p != null && p.getValue() != null) {
                    try {
                        results[j] = Double.parseDouble(p.getValue());
                        //System.out.print("--" + p.getValue());
                    } catch (Exception e) {
                        System.err.println("PeriodAnalysis :: parsing to double failed");
                    }
                }
                if (j > size && ((j % frequencyOfCalculationOfThePeriod) == 0) && j != 0) {
                    calculatePeriod(results, p);
                }
            }
            calculatePeriod(results, p);
        });
    }

    private void calculatePeriod(double[] result, StateParameter parameter) {
//        int size = result.length%2==0 ? result.length : result.length-1 ;
        double[] observationsDouble = new double[size];
        for (int i = 0; i < size; i++) {
            observationsDouble[i] = Double.parseDouble(result[i + result.length - size] + "");
        }
//        int period = JavaPeriodCalculatorFFT.getPeriod(observationsDouble, observationsDouble.length / 8, observationsDouble.length / 4);
//        int period = JavaPeriodCalculatorFFT.getPeriod(observationsDouble, 2, observationsDouble.length / 2);
        int period = JavaPeriodCalculatorFFT.getOtherPeriod(observationsDouble, 100, 700);
        parameter.traversal().traverse(MetaStateParameter.REF_PERIOD).then(kObjects -> {
            if (kObjects.length > 0) {
                Period kPeriod = ((Period) kObjects[0]);
                if (kPeriod.getPeriod() == null) {
                    kPeriod.setPeriod(((double) period) + "");
                    kubiKernel.model().save(o -> {});
                }
                System.out.println(period +" --> "+ kPeriod.now());
            }
        });
    }
}
