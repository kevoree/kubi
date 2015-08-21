package org.kubi.plugins.switchYourLight;

import org.kevoree.modeling.KConfig;
import org.kevoree.modeling.KObject;
import org.kevoree.modeling.defer.KDefer;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;

/**
 * Created by jerome on 12/05/15.
 */
public class SwitchYourLightPlugin implements KubiPlugin{

    private KubiKernel kubiKernel;
    private Technology currentTechnology;
    private String filename = "./stateMachinePara.rand.2.out";

    @Override
    public void start(KubiKernel kernel) {
        this.kubiKernel = kernel;
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot(root ->{
            Ecosystem ecosystem = (Ecosystem) root;
            currentTechnology = kubiKernel.model().createTechnology(ecosystem.universe(), ecosystem.now()).setName(SwitchYourLightPlugin.class.getSimpleName());
            ecosystem.addTechnologies(currentTechnology);

            Device device = kubiKernel.model().createDevice(ecosystem.universe(), ecosystem.now()).setName("switch");
            SimulatedParameter switchState = kubiKernel.model().createSimulatedParameter(device.universe(), device.now()).setName("switch").setUnit("kW");
//                switchState.setPeriod(switchState.view().createPeriod());
            device.addStateParameters(switchState);

            Device device2 = kubiKernel.model().createDevice(ecosystem.universe(), ecosystem.now()).setName("light");
            SimulatedParameter lightState = kubiKernel.model().createSimulatedParameter(device2.universe(), device2.now()).setName("light");
            device2.addStateParameters(lightState);

            kubiKernel.model().metaModel().metaClassByName("org.kubi.SimulatedParameter").attribute("valueUnredundant").setExtrapolation(new SwitchYourLightExtrapolation());

            currentTechnology.addDevices(device);
            currentTechnology.addDevices(device2);
            kubiKernel.model().save(o -> {});


            long[] stateKeys = new long[2];
            stateKeys[0] = switchState.uuid();
            stateKeys[1] = lightState.uuid();

            KubiUniverse universe = kernel.model().universe(kernel.currentUniverse());

            unredundantiseValues(kubiKernel.model(), universe, stateKeys);

//            readValues(universe , stateKeys);
//                timeTreeReader(universe, stateKeys);
        });
    }

    private void unredundantiseValues(KubiModel model, KubiUniverse universe, long[] keys) {
        long now = System.currentTimeMillis();
        int jumingSteps = 5000;
        int nbLoops = 2000;
        KDefer kDefer = model.defer();
        for (int i = 0; i < nbLoops; i++) {
            universe.time(now + (i * jumingSteps)).lookupAll(keys,kDefer.waitResult());
        }
        kDefer.then(resDefer -> {
            for (int i = 0; i < nbLoops; i++) {
                try {
                    KObject[] resLoop = (KObject[]) resDefer[i];
                    if (resLoop!=null) {
                        if (resLoop.length > 0) {
                            // kObjects[0] -> switchState
                            // kObjects[1] -> lightState
                            ((SimulatedParameter) resLoop[0]).setValue(stringBoolToStringInt(((SimulatedParameter) resLoop[0]).getValueUnredundant()));
                            ((SimulatedParameter) resLoop[1]).setValue(stringBoolToStringInt(((SimulatedParameter) resLoop[1]).getValueUnredundant()));
                            // set the values of [0] && [1]
                        }
                    }else{
                        System.out.println("kDeferRes == null");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            model.save(o ->{});
        });
    }


    private String stringBoolToStringInt(String StringBool) {
        return ""+(StringBool.equals("true")?1:0);
    }


    @Override
    public void stop() {
        if(currentTechnology != null){
            currentTechnology.delete(o -> {});
            kubiKernel.model().save(o -> {});
        }
        System.out.println("SmartFridgePlugin stops ...");
    }



    private void timeTreeReader(KubiUniverse universe, long[] keys){
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        Long time = System.currentTimeMillis();
        universe.time(time).lookupAll(keys, kObjects -> {
            if(kObjects.length > 0){
                for(int i = 0; i < 2; i++){
                    KObject kobj = kObjects[i];
                    kobj.allTimes(longs -> {
//                      System.err.println("time tree size : "+ longs.length);
                        for (long l : longs) {
                            kobj.jump(l, kObject -> {
//                              System.out.println(kObject.now() + "____" + ((SimulatedParameter) kObject).getValue());
                            });
                        }
                    });
                }
            }
        });

    }


    private int counter;
    public void readValues(KubiUniverse universe, long[] keys) {
        System.out.println(" -- Read Values");
        this.counter = 0;
        BufferedWriter writer = null;
        try{
            writer = new BufferedWriter( new FileWriter(filename));
            long now = System.currentTimeMillis();
            int jumingSteps = 70000;
            final Random random = new Random();
            int nbLoops = 2500;
            for (int i = 0; i < nbLoops; i++) {
                final BufferedWriter finalWriter = writer;
                int nb = random.nextInt(jumingSteps/50);
                final int finalNb = nb;
                universe.time(now + (i*jumingSteps) +nb).lookupAll(keys, kObjects -> {
                    if(kObjects.length>0){
                    // kObjects[0] -> switchState
                    // kObjects[1] -> lightState
                        try {
                            finalWriter.write("" + (kObjects[0].now() - (1434500000000L )+ finalNb) + "--" + (((SimulatedParameter) kObjects[0]).getValueUnredundant().equals("true") ? "Switch_ON" : "Switch_OFF") + "_" + (((SimulatedParameter) kObjects[1]).getValueUnredundant().equals("true") ? "Light_ON" : "Light_OFF")+"\n");
//                          finalWriter.write("" + (kObjects[1].now() + 1 - 1434500000000L) + "--" + +"\n");
                            finalWriter.flush();
                            counter++;

                        } catch (IOException e) {
                            e.printStackTrace();
                        }
//                  System.out.println((kObjects[0].now())%60000 + "," + (((SimulatedParameter) kObjects[0]).getValue().equals("true")?0:1)+ "," + (((SimulatedParameter) kObjects[1]).getValue().equals("true")?0:1));
//                  System.out.println((kObjects[0].now()) % 60000 + "," + ((SimulatedParameter) kObjects[0]).getValue() + "," + ((SimulatedParameter) kObjects[1]).getValue());
                    }
                });
                nb = random.nextInt(jumingSteps/50);
                final int finalNb1 = nb;
                universe.time(100 + now + (i*jumingSteps) +nb).lookupAll(keys, kObjects -> {
                    if(kObjects.length>0){
                        // kObjects[0] -> switchState
                        // kObjects[1] -> lightState
                        try {
                            finalWriter.write("" + (kObjects[0].now() - (1434500000000L )+ finalNb1) + "--" + (((SimulatedParameter) kObjects[0]).getValueUnredundant().equals("true") ? "Switch_ON" : "Switch_OFF")+"_"+(((SimulatedParameter) kObjects[1]).getValueUnredundant().equals("true") ? "Light_ON" : "Light_OFF")+"\n");
//                          finalWriter.write("" + (kObjects[1].now() + 1 - 1434500000000L) + "--" + +"\n");
                            finalWriter.flush();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        }
        catch ( IOException e) {
        }
    }
}
