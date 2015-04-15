package org.kubi.periodAnalysis;

import org.kevoree.brain.JavaPeriodCalculatorFFT;
import org.kevoree.brain.JavaPeriodCalculatorPearson;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kevoree.modeling.api.KOperation;
import org.kevoree.modeling.api.meta.Meta;
import org.kubi.*;
import org.kubi.api.Plugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaFunction;
import org.kubi.meta.MetaParameter;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 20/03/15.
 */
public class PeriodAnalysisPlugin implements Plugin, Runnable {

    ScheduledExecutorService service = null;

    private KubiModel model;

    @Override
    public void start(KubiModel model) {
        System.out.println("PeriodAnalysis Start ... ");
        this.model = model;
        service = Executors.newScheduledThreadPool(1);
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);

    }

    @Override
    public void stop() {
        System.out.println("PeriodAnalysis Stop ... ");
    }

    @Override
    public void run() {
        try {
            Thread.sleep(30000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        final KubiUniverse ku = model.universe(0);
        final KubiView kv = ku.time(System.currentTimeMillis());
        kv.select("/").then(new Callback<KObject[]>() {
            @Override
            public void on(KObject[] kObjects) {
                Ecosystem ecosystem = (Ecosystem) kObjects[0];
                ecosystem.traversal()
                        .traverse(MetaEcosystem.REF_DEVICES).withAttribute(MetaDevice.ATT_NAME, "plug")
                        .traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name")
                        .done().then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if(kObjects.length > 0){
                            getPreviousValues((Parameter) kObjects[0], 1050, 1428892490000L, 50000);
                        }

                    }
                });
            }
        });
    }

    /**
     * Get an array with the numberOfValues last values of the Parameter parameter
     * from the time time jumping backward in the spaceTime of periodOfGets milliseconds
     * @param parameter
     * @param numberOfValues the number of values that you still have to get
     * @param time the time of the next get of value
     * @param periodOfGets time between the get of data (getDataAt(x) -> getDataAt(x-periodOfGets))
     * @return
     */
    public void getPreviousValues(Parameter parameter, int numberOfValues, long time, long periodOfGets) {
        List<Double> res = new ArrayList<Double>();
        getPreviousValues(res, parameter, numberOfValues, time, periodOfGets);
    }

    private void getPreviousValues(Parameter parameter, int numberOfValues) {
        getPreviousValues(parameter, numberOfValues, System.currentTimeMillis(), 1000);
    }

    private void getPreviousValues(List<Double> result, Parameter parameter, int numberOfValues, long time, long periodOfGets) {
        parameter.jump(time).then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Parameter p = (Parameter) kObject;
                if (p!=null && numberOfValues>0 && p.getValue()!=null){
                    result.add(Double.parseDouble(p.getValue()));
                    getPreviousValues(result, p, numberOfValues - 1, time - periodOfGets, periodOfGets);
                }
                else{
                    calculatePeriod(result.toArray(), p);
                }
            }
        });
    }
int i=0;
    private void calculatePeriod(Object[] result, Parameter parameter) {
        int size = result.length%2==0 ? result.length : result.length-1 ;
        double[] observationsDouble = new double[size];
        for (int i = 0; i<size; i++){
            observationsDouble[i] = Double.parseDouble(result[i] + "");
        }
        System.out.println("Length-----------" + observationsDouble.length);
        int period = JavaPeriodCalculatorFFT.getPeriod(observationsDouble, observationsDouble.length / 8, observationsDouble.length / 4);
        System.out.println(JavaPeriodCalculatorFFT.getAllPeriods(observationsDouble, observationsDouble.length / 8, observationsDouble.length / 4));
        parameter.setPeriod(period + "");

        System.out.println("FFT........." + period + "______" + (new Date(parameter.now())).toString());

        if(i%10==0) {
            System.out.println(i);
            i++;
            System.out.println("Pearson........." + JavaPeriodCalculatorPearson.getPeriod(observationsDouble, observationsDouble.length / 8, observationsDouble.length / 4) + "______" + (new Date(parameter.now())).toString());
        }

    }
}
