package org.kubi.plugins.smartfridge;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KConfig;
import org.kevoree.modeling.api.KObject;
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

/**
 * Created by jerome on 10/04/15.
 */
public class SmartFridgePlugin implements KubiPlugin {

    private Technology currentTechnology;

    private KubiKernel kubiKernel;

    private String fileToLoad = "CSV_Cuisine_9-14_Avril.csv";
    private static final String csvSplitter = ";";

    @Override
    public void start(KubiKernel kernel) {
        kubiKernel = kernel;
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Ecosystem ecosystem = (Ecosystem) kObject;

                currentTechnology = kernel.model().createTechnology(ecosystem.universe(),ecosystem.now()).setName(SmartFridgePlugin.class.getSimpleName());
                ecosystem.addTechnologies(currentTechnology);

                Device device = kernel.model().createDevice(ecosystem.universe(),ecosystem.now()).setName("plug");

                StateParameter temperatureParam = kernel.model().createStateParameter(ecosystem.universe(),ecosystem.now()).setName("name").setUnit("kW");
                temperatureParam.setPeriod(kernel.model().createPeriod(ecosystem.universe(),ecosystem.now()));
                device.addStateParameters(temperatureParam);

                Device device2 = kernel.model().createDevice(ecosystem.universe(),ecosystem.now()).setName("openCheck");

                StateParameter openParam = kernel.model().createStateParameter(ecosystem.universe(),ecosystem.now()).setName("name");
                device2.addStateParameters(openParam);

                currentTechnology.addDevices(device);
                currentTechnology.addDevices(device2);

                long[] stateKeys = new long[2];
                stateKeys[0] = temperatureParam.uuid();
                stateKeys[1] = openParam.uuid();

                KubiUniverse universe = kernel.model().universe(kernel.currentUniverse());
                initData(universe, stateKeys, this.getClass().getClassLoader().getResourceAsStream(fileToLoad));
                kernel.model().save();


                // TODO : reader
//                readData();
            }
        });
    }


    @Override
    public void stop() {
        if(currentTechnology != null){
            currentTechnology.delete();
            kubiKernel.model().save();
//            currentTechnology.view().universe().model().save();
        }
        System.out.println("SmartFridgePlugin stops ...");
    }

    private void initData(KubiUniverse universe, long[] keys, InputStream stream) {
        BufferedReader bufferedReader = null;
        String line;
        try {
            bufferedReader = new BufferedReader(new InputStreamReader(stream));
            while ((line = bufferedReader.readLine()) != null) {
                String[] data = line.split(csvSplitter);
                if (data.length > 2 && data[1] != null && data[2] != null) {
                    long recordTime = Long.parseLong(data[0]);
                    universe.time(recordTime).lookupAll(keys).then(new Callback<KObject[]>() {
                        @Override
                        public void on(KObject[] kObjects) {
                            if (("3").equals(data[1])) {
                                final double temp = Double.parseDouble(data[2]);
                                if(kObjects[0] != null){
                                    ((StateParameter) kObjects[0]).setValue(temp + "");
                                }
                            } else if (("2").equals(data[1])) {
                                float openRawState = Float.parseFloat(data[2]);
                                boolean openState = false;
                                if (openRawState == 255) {
                                    openState = true;
                                }
                                if(kObjects[1] != null){
                                    ((StateParameter) kObjects[1]).setValue((openState?0.2:0) + "");
                                }
                            }
                            kubiKernel.model().save();
                        }
                    });
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
    }

    private void readData() {

        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        kubiKernel.model().universe(0).time(System.currentTimeMillis()).getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {

                kObject.traversal().traverse(MetaEcosystem.REF_TECHNOLOGIES).done().then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        for (KObject t : kObjects){
                            System.out.println((Technology)t);
                            t.traversal().traverse(MetaTechnology.REF_DEVICES)
                                    .traverse(MetaDevice.REF_STATEPARAMETERS).done().then(new Callback<KObject[]>() {
                                @Override
                                public void on(KObject[] a) {
                                    for(KObject stateP : a){
                                        stateP.timeWalker().allTimes().then(new Callback<long[]>() {
                                            @Override
                                            public void on(long[] longs) {
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
}
