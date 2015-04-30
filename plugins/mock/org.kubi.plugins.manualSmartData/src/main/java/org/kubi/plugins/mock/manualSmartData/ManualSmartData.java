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
                            for (int i = 0; i <1000; i++) {
                                System.out.println(i + " - blop");
                                params[0].jump((1428887547 + (i * 300000))).then((param) -> {
                                    if(param!=null) {
                                        ((StateParameter) param).setValue((((param.now() - 1428887547) / 300000) % 10) + "");
                                    }else {
                                        System.out.println("azertyuiop");
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
        this.currentTechnology.view().universe().model().save();
        this.currentTechnology.view().universe().model().save();
        System.out.println(startTime - System.currentTimeMillis());
        System.out.println(endRun - System.currentTimeMillis());
    }
}
