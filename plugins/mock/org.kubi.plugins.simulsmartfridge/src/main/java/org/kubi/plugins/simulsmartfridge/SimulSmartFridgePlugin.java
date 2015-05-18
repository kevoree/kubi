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
    private KubiKernel kubiKernel;

    @Override
    public void start(KubiKernel kernel) {
        this.kubiKernel = kernel;
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                if (kObject != null) {
                    Ecosystem e = ((Ecosystem) kObject);

                    currentTechnology = kernel.model().createTechnology(e.universe(), e.now()).setName(SimulSmartFridgePlugin.class.getSimpleName());
                    e.addTechnologies(currentTechnology);

                    Device electricDevice = kernel.model().createDevice(e.universe(),e.now()).setName("ElectricConsommation");

                    SimulatedParameter electricParameter = kernel.model().createSimulatedParameter(electricDevice.universe(),electricDevice.now()).setName("name").setUnit("kW");
                    kubiKernel.model().metaModel().metaClass("org.kubi.SimulatedParameter").attribute("value").setExtrapolation(new PolynomialExtrapolation());
                    electricDevice.addStateParameters(electricParameter);
                    currentTechnology.addDevices(electricDevice);
                    kubiKernel.model().save();
                }
            }
        });
    }

    @Override
    public void stop() {
        if(currentTechnology != null){
            currentTechnology.delete();
            kubiKernel.model().save();
        }
        System.out.println("SmartFridge Stop ... ");
    }
}
