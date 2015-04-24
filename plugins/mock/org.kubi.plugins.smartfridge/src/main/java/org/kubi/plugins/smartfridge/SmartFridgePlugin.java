package org.kubi.plugins.smartfridge;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KConfig;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

import java.io.*;

/**
 * Created by jerome on 10/04/15.
 */
public class SmartFridgePlugin implements KubiPlugin {

    private Technology currentTechnology;

    private String fileToLoad = "CSV_Cuisine_9-14_Avril.csv";
    private static final String csvSplitter = ";";

    @Override
    public void start(KubiKernel kernel) {
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Ecosystem ecosystem = (Ecosystem) kObject;

                currentTechnology = ecosystem.view().createTechnology().setName(SmartFridgePlugin.class.getSimpleName());
                ecosystem.addTechnologies(currentTechnology);

                Device device = ecosystem.view().createDevice().setName("plug");

                StateParameter temperatureParam = device.view().createStateParameter().setName("name").setUnit("kW");
                temperatureParam.setPeriod(temperatureParam.view().createPeriod());
                device.addStateParameters(temperatureParam);


                Device device2 = ecosystem.view().createDevice().setName("openCheck");

                StateParameter openParam = device.view().createStateParameter().setName("name");
                device2.addStateParameters(openParam);

                currentTechnology.addDevices(device);
                currentTechnology.addDevices(device2);
                long[] stateKeys = new long[2];
                stateKeys[0] = temperatureParam.uuid();
                stateKeys[1] = openParam.uuid();

                initData((KubiUniverse) ecosystem.universe(), stateKeys, this.getClass().getClassLoader().getResourceAsStream(fileToLoad));
                ecosystem.view().universe().model().save();
            }
        });
    }

    @Override
    public void stop() {
        if(currentTechnology != null){
            currentTechnology.delete();
            currentTechnology.view().universe().model().save();
        }
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
                                    ((StateParameter) kObjects[1]).setValue(openState + "");
                                }
                            }
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
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
        }
    }

}
