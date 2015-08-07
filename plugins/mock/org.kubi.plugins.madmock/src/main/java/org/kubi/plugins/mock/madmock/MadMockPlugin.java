package org.kubi.plugins.mock.madmock;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KObject;
import org.kubi.Device;
import org.kubi.Ecosystem;
import org.kubi.KubiModel;
import org.kubi.Technology;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 20/03/15.
 */
public class MadMockPlugin implements KubiPlugin, Runnable {

    ScheduledExecutorService service = null;

    private KubiModel model;

    private Technology technology;

    @Override
    public void start(KubiKernel kernel) {
        this.model = kernel.model();
        service = Executors.newScheduledThreadPool(1);
        technology = model.universe(kernel.currentUniverse()).time(System.currentTimeMillis()).createTechnology();
        technology.setName("MadTechnology");
        kernel.model().universe(kernel.currentUniverse()).time(System.currentTimeMillis()).getRoot(new KCallback<KObject>() {

            public void on(KObject kObject) {
                ((Ecosystem) kObject).addTechnologies(technology);
                model.save(new KCallback() {
                    @Override
                    public void on(Object o) {

                    }
                });
            }
        });
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        service.shutdownNow();
    }

    @Override
    public void run() {
        try {
            //add devices or change values
            Random rand = new Random();
            technology.jump(System.currentTimeMillis(), new KCallback<KObject>() {
                @Override
                public void on(KObject kObject) {
                    Technology currentTechno = (Technology) kObject;
                    float addDeviceProba = rand.nextFloat();
                    if (addDeviceProba < 0.3) {
                        String deviceName = "Device_" + rand.nextInt(1000);
                        System.err.println("MadMock add a device ... named:" + deviceName);
                        Device newDevice = ((KubiModel)currentTechno.manager().model()).createDevice(currentTechno.universe(), currentTechno.now());
                        newDevice.setName(deviceName);
                        currentTechno.addDevices(newDevice);
                    }
                    /*
                    currentTechno.getDevices(new KCallback<Device[]>() {
                        @Override
                        public void on(Device[] devices) {
                            for (Device device : devices) {
                                device.setVersion(System.currentTimeMillis() + "");
                            }
                            model.save(new KCallback() {
                                @Override
                                public void on(Object o) {

                                }
                            });
                        }
                    });
                    */
                }
            });
            model.save(new KCallback() {
                @Override
                public void on(Object o) {

                }
            });
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
