package org.kubi.plugins.simulsmartfridge;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KConfig;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;


/**
 * Created by duke on 20/03/15.
 */
public class SimulSmartFridgePlugin implements KubiPlugin {

    private Technology currentTechnology;


    @Override
    public void start(KubiKernel kernel) {
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                if (kObject != null) {
                    Ecosystem e = ((Ecosystem) kObject);

                    currentTechnology = e.view().createTechnology().setName(SimulSmartFridgePlugin.class.getSimpleName());
                    e.addTechnologies(currentTechnology);

                    Device electricDevice = e.view().createDevice().setName("ElectricConsommation");

                    StateParameter electricParameter = electricDevice.view().createStateParameter().setName("name").setUnit("kW");
                    electricParameter.metaClass().attribute(electricParameter.getName()).setExtrapolation(new PolynomialExtrapolation());
                    electricDevice.addStateParameters(electricParameter);
                    currentTechnology.addDevices(electricDevice);
                    e.view().universe().model().save();
                }
            }
        });
    }

    @Override
    public void stop() {
        if(currentTechnology != null){
            currentTechnology.delete();
            currentTechnology.view().universe().model().save();
        }
        System.out.println("SmartFridge Stop ... ");
    }
}
