package org.kubi.plugins.mock.manualSmartData;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KObject;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;

/**
 * Created by jerome on 30/04/15.
 */
public class ManualSmartData implements KubiPlugin{
    private Technology currentTechnology;
    private long startTime;
    private long endRun;
    private KubiKernel kubiKernel;

    @Override
    public void start(KubiKernel kernel) {
        this.kubiKernel = kernel;
        startTime = System.currentTimeMillis();
        long initialTime = 1428887547;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot(new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                if (kObject != null) {
                    Ecosystem e = ((Ecosystem) kObject);

                    currentTechnology = kubiKernel.model().createTechnology(e.universe(), e.now()).setName(ManualSmartData.class.getSimpleName());
                    e.addTechnologies(currentTechnology);

                    Device device = kubiKernel.model().createDevice(e.universe(), e.now()).setName("ManualDevice");

                    SimulatedParameter electricParameter = kubiKernel.model().createSimulatedParameter(device.universe(), device.now()).setName("name");
                    device.addStateParameters(electricParameter);
                    currentTechnology.addDevices(device);
                    kubiKernel.model().save(new KCallback() {
                        @Override
                        public void on(Object o) {
                        }
                    });

                    device.traversal().traverse(MetaDevice.REL_STATEPARAMETERS).then((params) -> {
                        if (params.length > 0) {
                            for (int i = 0; i < 100; i++) {
                                int k = 300000;
                                params[0].jump((1428887547000L + (i * k)), (param) -> {
                                    if (param != null) {
                                        double value = ((param.now() - 1428887547000L) / k) % 10;
                                        System.out.println(value);
                                        ((StateParameter) param).setValue(value + "");
                                        kubiKernel.model().save(new KCallback() {
                                            @Override
                                            public void on(Object o) {
                                            }
                                        });
                                    } else {
                                        System.err.println("The parameter is null");
                                    }
                                });
                            }
                            endRun = System.currentTimeMillis();
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
        System.out.println("ManualSmartData Stop ... ");
    }
}
