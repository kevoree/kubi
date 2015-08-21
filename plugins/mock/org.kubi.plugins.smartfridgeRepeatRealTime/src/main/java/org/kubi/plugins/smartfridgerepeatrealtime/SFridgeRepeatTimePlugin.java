package org.kubi.plugins.smartfridgerepeatrealtime;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KConfig;
import org.kevoree.modeling.KObject;
import org.kevoree.modeling.defer.KDefer;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaTechnology;
import org.kubi.plugins.smartfridgerepeatrealtime.extrapolation.DiscreteExtrapolationWithPeriod;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jerome on 10/04/15.
 */
public class SFridgeRepeatTimePlugin implements KubiPlugin {

    private Technology currentTechnology;

    private KubiKernel kubiKernel;

    private String fileToLoad = "CSV_Cuisine_9-14_Avril.csv";
    private static final String csvSplitter = ";";
    private List<TemperatureSensorValue> tempValueList;
    private long dataRange;

    @Override
    public void start(KubiKernel kernel) {
        this.tempValueList = new ArrayList<>();
        kubiKernel = kernel;
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot(new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Ecosystem ecosystem = (Ecosystem) kObject;

                currentTechnology = kernel.model().createTechnology(ecosystem.universe(), ecosystem.now()).setName(SFridgeRepeatTimePlugin.class.getSimpleName());
                ecosystem.addTechnologies(currentTechnology);

                Device device = kernel.model().createDevice(ecosystem.universe(), ecosystem.now()).setName("plug");

                StateParameter temperatureParam = kernel.model().createStateParameter(ecosystem.universe(), ecosystem.now()).setName("name").setUnit("kW");
                temperatureParam.setFrequencyOfCalculation(100000);
                temperatureParam.setPredictedPeriodMin(3500000);
                temperatureParam.setPredictedPeriodMax(20000000);
                kubiKernel.model().metaModel().metaClassByName("org.kubi.StateParameter").attribute("value").setExtrapolation(new DiscreteExtrapolationWithPeriod());
                temperatureParam.setPeriod(kernel.model().createPeriod(ecosystem.universe(), ecosystem.now()));
                device.addStateParameters(temperatureParam);

                currentTechnology.addDevices(device);

                KubiUniverse universe = kernel.model().universe(kernel.currentUniverse());
                initData(universe, this.getClass().getClassLoader().getResourceAsStream(fileToLoad), temperatureParam);
                kernel.model().save(o -> {});
                // TODO : reader
                readData();

//                try {
//                    Thread.sleep(10000);
//                    if (currentTechnology != null) {
//                        currentTechnology.delete(o -> {});
//                        kubiKernel.model().save(o -> {});
//                    }
//                } catch (InterruptedException e) {
//                    e.printStackTrace();
//                }
            }
        });
    }


    @Override
    public void stop() {
        if (currentTechnology != null) {
            System.out.println("STOP -> delete.");
            currentTechnology.delete(o -> {});
            kubiKernel.model().save(o -> {});
        }
        System.out.println("SmartFridgePlugin stops ...");
    }

    private void initData(KubiUniverse universe, InputStream stream, StateParameter param) {
        BufferedReader bufferedReader = null;
        String line;
        long firstValue = -1;
        long lastValue = -1;
        try {
            bufferedReader = new BufferedReader(new InputStreamReader(stream));
            while ((line = bufferedReader.readLine()) != null) {
                String[] data = line.split(csvSplitter);
                if (data.length > 2 && data[1] != null && data[2] != null) {
                    long recordTime = Long.parseLong(data[0]);
                    final Double temp = Double.parseDouble(data[2]);
                    if (("3").equals(data[1])) {
                        if (firstValue == -1) {
                            firstValue = recordTime;
                        }
                        lastValue = recordTime;
                        if (temp != null) {
                            this.tempValueList.add(new TemperatureSensorValue(temp, recordTime));
                        }
                    }
                }
            }
        } catch (Exception e1) {
            e1.printStackTrace();
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                    stream.close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
        }
        this.dataRange = lastValue - firstValue;


        putDataInKubi(universe, param);
    }



    private void putDataInKubi(KubiUniverse universe, StateParameter param) {
        System.out.println("Size:" + this.tempValueList.size());
        long[] times = new long[tempValueList.size()];
        for (int i = 0; i < tempValueList.size(); i++) {
            times[i] = tempValueList.get(i).getTime();
        }

        // ------- V0
        KDefer kDefer = kubiKernel.model().defer();
        for (long l : times){
            kubiKernel.model().manager().lookup(0, l, param.uuid(), kDefer.waitResult());
        }
        kDefer.then(new KCallback<Object[]>() {
            @Override
            public void on(Object[] objects) {
                for (int i = 0; i < objects.length; i++) {
                    ((StateParameter) objects[i]).setValue(tempValueList.get(i).getTemperature()+"");
                }
                ((StateParameter) objects[0]).allTimes(longs->{
                    System.out.println("*****"+longs.length);
                });

                kubiKernel.model().save(o -> {});
            }
        });

        // ------- V1
//        kubiKernel.model().manager().lookupAllTimes(0, times, param.uuid(), new KCallback<KObject[]>() {
//            @Override
//            public void on(KObject[] kObjects) {
//                System.out.println(kObjects.length + "___" + tempValueList.size());
//                for (int i = 0; i < tempValueList.size(); i++) {
//                    ((StateParameter) kObjects[i]).setValue(tempValueList.get(i).getTemperature() + "");
//                }
//                kubiKernel.model().save(new KCallback() {
//                    @Override
//                    public void on(Object o) {
//
//                    }
//                });
//            }
//        });


        // ------- V2

//        for (TemperatureSensorValue tempVal : this.tempValueList) {
//            long recordTime = tempVal.getTime();
//            Double temp = tempVal.getTemperature();
//
//            param.jump(recordTime, kObject -> {
//                if (temp != null) {
//                    ((StateParameter) kObject).setValue(temp + "");
//                }
//            });
//        }
    }


    private void readData() {
        try {
            Thread.sleep(5500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        kubiKernel.model().universe(0).time(System.currentTimeMillis()).getRoot(root -> {
            root.traversal().traverse(MetaEcosystem.REF_TECHNOLOGIES)
                    .traverse(MetaTechnology.REF_DEVICES)
                    .traverse(MetaDevice.REF_STATEPARAMETERS).then(a -> {
                for (KObject stateP : a) {
//                    System.out.println(stateP.universe()+", "+stateP.now()+", "+stateP.uuid());
                    stateP.allTimes(longs -> {
                        for (long l : longs) {
                            stateP.jump(l, kObject -> {
//                                if (((StateParameter) kObject).getValue() != null) {
                                System.out.println(((StateParameter) kObject).getValue() + "-----" + kObject.now());
//                                } else {
//                                    System.err.println(((StateParameter) kObject).getValue() + "-----" + kObject.now());
//                                }
                            });
                        }
                    });
                }
            });
        });
    }
}