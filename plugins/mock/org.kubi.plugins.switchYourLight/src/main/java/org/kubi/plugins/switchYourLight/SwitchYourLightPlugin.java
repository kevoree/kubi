package org.kubi.plugins.switchYourLight;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KConfig;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

/**
 * Created by jerome on 12/05/15.
 */
public class SwitchYourLightPlugin implements KubiPlugin{

    private KubiKernel kubiKernel;
    private Technology currentTechnology;

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

                SimulatedParameter switchState = kubiKernel.model().createSimulatedParameter(device.universe(), device.now()).setName("switch").setUnit("kW");
//                switchState.setPeriod(switchState.view().createPeriod());
                device.addStateParameters(switchState);


                Device device2 = kubiKernel.model().createDevice(ecosystem.universe(), ecosystem.now()).setName("light");

                SimulatedParameter lightState = kubiKernel.model().createSimulatedParameter(device2.universe(), device2.now()).setName("light");
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


    public void readValues(KubiUniverse universe, long[] keys) {
        long now = System.currentTimeMillis();
        int jumingSteps = 3000;
        for (int i = 0; i < 10000; i++) {
            universe.time(now + (i*jumingSteps)).lookupAll(keys).then(new Callback<KObject[]>() {
                @Override
                public void on(KObject[] kObjects) {
                    if(kObjects.length>0){
                        // kObjects[0] -> switchState
                        // kObjects[1] -> lightState
//                        System.out.println("0\t---\t" + kObjects[0].now() + "\t,,\t" + ((SimulatedParameter) kObjects[0]).getValue());
//                        System.out.println("1\t---\t" + kObjects[1].now() + "\t,,\t" + ((SimulatedParameter) kObjects[1]).getValue());
//                        System.out.println((kObjects[0].now())%60000 + "," + (((SimulatedParameter) kObjects[0]).getValue().equals("true")?0:1)+ "," + (((SimulatedParameter) kObjects[1]).getValue().equals("true")?0:1));
                        System.out.println((kObjects[0].now()) % 60000 + "," + ((SimulatedParameter) kObjects[0]).getValue() + "," + ((SimulatedParameter) kObjects[1]).getValue());
                    }
                }
            });
        }

    }
}
