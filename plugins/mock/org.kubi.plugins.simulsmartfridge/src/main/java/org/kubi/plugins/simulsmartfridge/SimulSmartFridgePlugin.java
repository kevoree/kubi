package org.kubi.plugins.simulsmartfridge;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KConfig;
import org.kevoree.modeling.KObject;
import org.kubi.Device;
import org.kubi.Ecosystem;
import org.kubi.SimulatedParameter;
import org.kubi.Technology;
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
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot(new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                if (kObject != null) {
                    Ecosystem e = ((Ecosystem) kObject);

                    currentTechnology = kernel.model().createTechnology(e.universe(), e.now()).setName(SimulSmartFridgePlugin.class.getSimpleName());
                    e.addTechnologies(currentTechnology);

                    Device electricDevice = kernel.model().createDevice(e.universe(), e.now()).setName("ElectricConsommation");

                    SimulatedParameter electricParameter = kernel.model().createSimulatedParameter(electricDevice.universe(), electricDevice.now()).setName("name").setUnit("kW");
                    kubiKernel.model().metaModel().metaClassByName("org.kubi.SimulatedParameter").attribute("value").setExtrapolation(new PolynomialExtrapolation());
                    electricDevice.addStateParameters(electricParameter);
                    currentTechnology.addDevices(electricDevice);
                    kubiKernel.model().save(new KCallback() {
                        @Override
                        public void on(Object o) {
                        }
                    });
                }
            }
        });
    }

    @Override
    public void stop() {
        if(currentTechnology != null){
        }
        System.out.println("SmartFridge Stop ... ");
    }
}
