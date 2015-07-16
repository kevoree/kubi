package org.kubi.plugins.smartfridgerepeatrealtime;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KConfig;
import org.kevoree.modeling.KObject;
import org.kevoree.modeling.memory.KMemoryElement;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaTechnology;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

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
                temperatureParam.setPeriod(kernel.model().createPeriod(ecosystem.universe(), ecosystem.now()));
                device.addStateParameters(temperatureParam);

                currentTechnology.addDevices(device);

                long[] stateKeys = new long[2];
                stateKeys[0] = temperatureParam.uuid();

                KubiUniverse universe = kernel.model().universe(kernel.currentUniverse());
                initData(universe, stateKeys, this.getClass().getClassLoader().getResourceAsStream(fileToLoad));
                kernel.model().save(new KCallback() {
                    @Override
                    public void on(Object o) {
                    }
                });
                System.err.println("-°-°-°-°-----"+checkValues());

                // TODO : reader
                readData();
            }
        });
    }


    @Override
    public void stop() {
        if (currentTechnology != null) {
            currentTechnology.delete(new KCallback() {
                @Override
                public void on(Object o) {
                }
            });
            kubiKernel.model().save(new KCallback() {
                @Override
                public void on(Object o) {

                }
            });
//            currentTechnology.view().universe().model().save();
        }
        System.out.println("SmartFridgePlugin stops ...");
    }

    private void initData(KubiUniverse universe, long[] keys, InputStream stream) {
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
                    final double temp = Double.parseDouble(data[2]);
                    if (("3").equals(data[1])) {
                        if (firstValue == -1) {
                            firstValue = recordTime;
                        }
                        lastValue = recordTime;
                        this.tempValueList.add(new TemperatureSensorValue(temp, recordTime));
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
/*
        universe.model().lookup(universe.key(), KConfig.BEGINNING_OF_TIME, 4, new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                putData(0, (StateParameter) kObject);
                kObject.manager().model().save(new KCallback() {
                    @Override
                    public void on(Object o) {
                    }
                });
            }
        });
*/
       putDataInKubi(universe, keys, 0);
    }


    private void putData(final int dataIndex, StateParameter param) {
        param.jump(this.tempValueList.get(dataIndex).getTime(), new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                StateParameter param2 = (StateParameter) kObject;
                param2.setValue(tempValueList.get(dataIndex).getTemperature() + "");
                System.out.println("Inserting:" + tempValueList.get(dataIndex).getTime() + " -> " + tempValueList.get(dataIndex).getTemperature());
                if (dataIndex + 1 < 10) {
                    putData(dataIndex + 1, (StateParameter) kObject);
                }
            }
        });
    }


    private void putDataInKubi(KubiUniverse universe, long[] keys, int it) {
        System.out.println("Size:" +this.tempValueList.size());
        for (TemperatureSensorValue tempVal : this.tempValueList) {
            long recordTime = tempVal.getTime();
            Double temp = tempVal.getTemperature();
            //System.out.println("Record time:" + recordTime);
            universe.time((it * this.dataRange) + recordTime).lookupAll(keys, new KCallback<KObject[]>() {
                @Override
                public void on(KObject[] kObjects) {
                    if (kObjects[0] != null) {
                        System.out.println(temp + "____" + kObjects[0].now());
                        ((StateParameter) kObjects[0]).setValue(temp + "");
                        kubiKernel.model().save(new KCallback() {
                            @Override
                            public void on(Object o) {
                            }
                        });
                    }
                }
            });
        }
    }


    private void readData() {

        try {
            kubiKernel.model().manager().cache().clear(kubiKernel.model().metaModel());
            Thread.sleep(4000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        kubiKernel.model().universe(0).time(System.currentTimeMillis()).getRoot(new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                kObject.traversal().traverse(MetaEcosystem.REF_TECHNOLOGIES).then(new KCallback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        for (KObject t : kObjects) {
                            t.traversal().traverse(MetaTechnology.REF_DEVICES)
                                    .traverse(MetaDevice.REF_STATEPARAMETERS).then(new KCallback<KObject[]>() {
                                @Override
                                public void on(KObject[] a) {
                                    for (KObject stateP : a) {
                                        System.out.println(stateP.uuid());
                                        stateP.timeWalker().allTimes(new KCallback<long[]>() {
                                            @Override
                                            public void on(long[] longs) {
                                                for (long l : longs) {
                                                    stateP.jump(l, new KCallback<KObject>() {
                                                        @Override
                                                        public void on(KObject kObject) {
                                                            if(kObject.now() == 22321860941l) {
                                                                KMemoryElement g = kObject.manager().cache().get(0, KConfig.NULL_LONG, kObject.uuid());
                                                                System.out.println("jkhg");

                                                            }

                                                            System.out.println(((StateParameter) kObject).getValue() + "-----"+ kObject.now());
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });

                        }
                    }
                });
            }
        });
    }

    private int checkValues(){
        Map<Long, Double> map = new TreeMap<>();
        for (TemperatureSensorValue sensor: this.tempValueList) {
            map.put(sensor.getTime(), sensor.getTemperature());
        }
        Double previous = null;

        int counter = 1;
        for (Map.Entry<Long, Double> entry : map.entrySet()) {
            Double value = entry.getValue();
            if(previous==null || !value.equals(previous)){
                counter++;
            }
        }
        return counter;
    }
}
