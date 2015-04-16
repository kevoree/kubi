package org.kubi.periodAnalysis;

import org.kevoree.brain.model.RisingEdge;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.api.Plugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaParameter;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class RisingEdgeAnalysisPlugin implements Plugin, Runnable {

    ScheduledExecutorService service = null;

    private KubiModel model;

    @Override
    public void start(KubiModel model) {
        System.out.println("PeriodAnalysis Start ... ");
        this.model = model;
        service = Executors.newScheduledThreadPool(1);
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);


        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        final KubiUniverse ku = model.universe(0);
        final KubiView kv = ku.time(0);
        kv.select("/").then(new Callback<KObject[]>() {
            @Override
            public void on(KObject[] kObjects) {
                Ecosystem ecosystem = (Ecosystem) kObjects[0];

                Device device = kv.createDevice();
                device.setName("plug_risingEdge");
                device.addParameters(kv.createParameter().setName("name"));
                ecosystem.addDevices(device);
            }
        });
    }

    @Override
    public void stop() {
        System.out.println("PeriodAnalysis Stop ... ");
    }

    @Override
    public void run() {

        try {
            Thread.sleep(20000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("PeriodAnalysis Restarts ... ");
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
                        Object[] values = null;
                        if(kObjects.length > 0){
                            getPreviousParameters((Parameter) kObjects[0], 7961, 1428997126000L, 50000);
                        }

                    }
                });
            }
        });

        try {
            Thread.sleep(20000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
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
    public void getPreviousParameters(Parameter parameter, int numberOfValues, long time, long periodOfGets) {
        List<Parameter> res = new ArrayList<>();
        getPreviousParameters(res, parameter, numberOfValues, time, periodOfGets);
    }

    private void getPreviousParameters(List<Parameter> result, Parameter parameter, int numberOfValues, long time, long periodOfGets) {
        parameter.jump(time).then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Parameter p = (Parameter)kObject;
                if (p!=null && numberOfValues>0 && p.getValue()!=null){
                    result.add(p);
                    getPreviousParameters(result, p, numberOfValues - 1, time - periodOfGets, periodOfGets);
                }
                else{
                    addRisingEdges(result);
                }
            }
        });
    }

    private void addRisingEdges(List<Parameter> result) {
        List<RisingEdge> edges = calculateRisingEdge(result);


        final KubiUniverse ku = model.universe(0);
        final KubiView kv = ku.time(0);
        kv.select("/").then(new Callback<KObject[]>() {
            @Override
            public void on(KObject[] kObjects) {
                Ecosystem ecosystem = (Ecosystem) kObjects[0];
                ecosystem.traversal().traverse(MetaEcosystem.REF_DEVICES).withAttribute(MetaDevice.ATT_NAME, "plug_risingEdge")
                        .traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name").done().then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if (kObjects.length != 0) {
                            Parameter parameter = (Parameter) kObjects[0];
                            for (int edgeIndex=edges.size()-1; edgeIndex>=0; edgeIndex--){
                                RisingEdge edge = edges.get(edgeIndex);
                                parameter.jump(edge.getTimestamp())
                                    .then(new Callback<KObject>() {
                                        @Override
                                        public void on(KObject kObject) {
                                            if (kObject != null) {
                                                try {
                                                    Parameter parameterOfEdge = (Parameter) kObject;
                                                    if (! (new String("" + edge.getValue() / 1000000)).equals(parameterOfEdge.getValue())) {
                                                        parameterOfEdge.setValue("" + edge.getValue() / 1000000);
                                                    }
                                                } catch (Exception e1) {
                                                    System.err.println(edge);
                                                }
                                            }
                                        }
                                    });
                            }

                        }
                    }
                });
                model.save();
            }
        });
    }



    /**
     * calculate and return the rising edges from the parameters list
     * @param parameters
     * @return
     */
    private List<RisingEdge> calculateRisingEdge(List<Parameter> parameters) {
        List<RisingEdge> res = new ArrayList<>();
        if (parameters== null || parameters.size()==0){
            return res;
        }
        Parameter previous = parameters.get(0);
        for (Parameter p : parameters){
            if (Float.parseFloat(previous.getValue()) < Float.parseFloat(p.getValue())){
                // add previous to be related to kubi way of filling blanks in the data set.
                res.add(new RisingEdge(p.now(), previous.now() - p.now()));
            }
            if(Float.parseFloat(previous.getValue()) != Float.parseFloat(p.getValue())) {
                previous = p;
            }
        }
        return res;

    }
}
