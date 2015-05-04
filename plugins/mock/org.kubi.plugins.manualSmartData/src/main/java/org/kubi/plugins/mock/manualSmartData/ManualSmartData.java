package org.kubi.plugins.mock.manualSmartData;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
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

    @Override
    public void start(KubiKernel kernel) {
        startTime = System.currentTimeMillis();
        long initialTime = 1428887547;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                if (kObject != null) {
                    Ecosystem e = ((Ecosystem) kObject);

                    currentTechnology = e.view().createTechnology().setName(ManualSmartData.class.getSimpleName());
                    e.addTechnologies(currentTechnology);

                    Device device = e.view().createDevice().setName("ManualDevice");

                    SimulatedParameter electricParameter = device.view().createSimulatedParameter().setName("name");
                    device.addStateParameters(electricParameter);
                    currentTechnology.addDevices(device);
                    e.view().universe().model().save();

                    device.traversal().traverse(MetaDevice.REF_STATEPARAMETERS).done().then((params) ->{
                        if(params.length>0){
                            for (int i = 0; i <100; i++) {
                                int k = 300000;
                                params[0].jump((1428887547000L + (i * k))).then((param) -> {
                                    if(param!=null) {
                                        double value = ((param.now() - 1428887547000L) / k) %10;
                                        System.out.println(value);
                                        ((StateParameter) param).setValue(value + "");
                                        currentTechnology.view().universe().model().save();
                                    }else {
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
            currentTechnology.delete();
            currentTechnology.view().universe().model().save();
        }
        System.out.println("ManualSmartData Stop ... ");
    }
}
