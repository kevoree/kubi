package org.kubi.plugins.switchYourLight;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KConfig;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Created by jerome on 12/05/15.
 */
public class SwitchYourLightPlugin implements KubiPlugin{

    private KubiKernel kubiKernel;
    private Technology currentTechnology;
    private String filename = "./stateMachine.out";

    @Override
    public void start(KubiKernel kernel) {
        this.kubiKernel = kernel;
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Ecosystem ecosystem = (Ecosystem) kObject;

                currentTechnology = kubiKernel.model().createTechnology(ecosystem.universe(), ecosystem.now()).setName(SwitchYourLightPlugin.class.getSimpleName());
                ecosystem.addTechnologies(currentTechnology);

                Device device = kubiKernel.model().createDevice(ecosystem.universe(), ecosystem.now()).setName("switch");

                SimulatedParameter switchState = kubiKernel.model().createSimulatedParameter(device.universe(), device.now()).setName("name").setUnit("kW");
//                switchState.setPeriod(switchState.view().createPeriod());
                device.addStateParameters(switchState);


                Device device2 = kubiKernel.model().createDevice(ecosystem.universe(), ecosystem.now()).setName("light");

                SimulatedParameter lightState = kubiKernel.model().createSimulatedParameter(device2.universe(), device2.now()).setName("name");
                device2.addStateParameters(lightState);

                kubiKernel.model().metaModel().metaClass("org.kubi.SimulatedParameter").attribute("value").setExtrapolation(new SwitchYourLightExtrapolation());

                currentTechnology.addDevices(device);
                currentTechnology.addDevices(device2);

                kubiKernel.model().save();

                long[] stateKeys = new long[2];
                stateKeys[0] = switchState.uuid();
                stateKeys[1] = lightState.uuid();

                readValues((KubiUniverse) kernel.model().universe(kernel.currentUniverse()), stateKeys);
            }
        });
    }

    @Override
    public void stop() {
        if(currentTechnology != null){
            currentTechnology.delete();
            kubiKernel.model().save();
        }
        System.out.println("SmartFridgePlugin stops ...");
    }

    private int counter;
    public void readValues(KubiUniverse universe, long[] keys) {
        this.counter = 0;
        BufferedWriter writer = null;
        try{
            writer = new BufferedWriter( new FileWriter(filename));
            long now = System.currentTimeMillis();
            int jumingSteps = 7000;
            int nbLoops = 10000;
            for (int i = 0; i < nbLoops; i++) {
                final BufferedWriter finalWriter = writer;
                universe.time(now + (i*jumingSteps)).lookupAll(keys).then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if(kObjects.length>0){
                            // kObjects[0] -> switchState
                            // kObjects[1] -> lightState
                            try {
                                finalWriter.write("" + (kObjects[0].now() - 1434500000000L) + "\t--\t" + (((SimulatedParameter) kObjects[0]).getValue().equals("true") ? "Switch_ON" : "Switch_OFF")+"_"+(((SimulatedParameter) kObjects[1]).getValue().equals("true") ? "Light_ON" : "Light_OFF")+"\n");
//                                finalWriter.write("" + (kObjects[1].now() + 1 - 1434500000000L) + "\t--\t" + +"\n");
                                finalWriter.flush();
                                counter++;


                                if (counter== nbLoops){/*
                                    // process the file
                                    Runtime runtime = Runtime.getRuntime();


                                    try {
                                        String path = (new File("")).getAbsolutePath();
                                        String libs = "/libs/synoptic";
//                                        Process p = null;
//                                        ProcessBuilder pb = new ProcessBuilder(
//                                                );
//                                        pb.directory(new File( path));
//                                        p = pb.start();
                                        int res = runtime.exec("java -ea -cp " +
                                                path+libs+"/lib/*:" +
                                                path+libs+"/synoptic/bin/:" +
                                                path+libs+"/daikonizer/bin/ " +
                                                "synoptic.main.SynopticMain "+

                                                " -r '^(?<TIME>)[^-]*--[^{L,S}]*(?<TYPE>)$'" +
                                                " -d /usr/local/bin/dot" +
                                                " -o "+path+"/libs/synoptic/output " +
                                                path +"/stateMachine.out").waitFor();
                                        System.out.println(res);
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }*/
                                }
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
//                        System.out.println((kObjects[0].now())%60000 + "," + (((SimulatedParameter) kObjects[0]).getValue().equals("true")?0:1)+ "," + (((SimulatedParameter) kObjects[1]).getValue().equals("true")?0:1));
//                        System.out.println((kObjects[0].now()) % 60000 + "," + ((SimulatedParameter) kObjects[0]).getValue() + "," + ((SimulatedParameter) kObjects[1]).getValue());
                        }
                    }
                });universe.time(1 + now + (i*jumingSteps)).lookupAll(keys).then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if(kObjects.length>0){
                            // kObjects[0] -> switchState
                            // kObjects[1] -> lightState
                            try {
                                finalWriter.write("" + (kObjects[0].now() - 1434500000000L) + "\t--\t" + (((SimulatedParameter) kObjects[0]).getValue().equals("true") ? "Switch_ON" : "Switch_OFF")+"_"+(((SimulatedParameter) kObjects[1]).getValue().equals("true") ? "Light_ON" : "Light_OFF")+"\n");
//                                finalWriter.write("" + (kObjects[1].now() + 1 - 1434500000000L) + "\t--\t" + +"\n");
                                finalWriter.flush();
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                });
            }
        }
        catch ( IOException e) {
        }
    }
}
