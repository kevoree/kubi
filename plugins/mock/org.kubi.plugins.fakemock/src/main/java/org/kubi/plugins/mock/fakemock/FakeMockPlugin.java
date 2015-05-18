package org.kubi.plugins.mock.madmock;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kevoree.modeling.api.extrapolation.Extrapolation;
import org.kevoree.modeling.api.meta.MetaAttribute;
import org.kevoree.modeling.api.meta.MetaClass;
import org.kubi.Device;
import org.kubi.Ecosystem;
import org.kubi.KubiModel;
import org.kubi.Technology;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;

import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 20/03/15.
 */
public class FakeMockPlugin implements KubiPlugin, Runnable, Extrapolation
{

    ScheduledExecutorService service = null;

    private KubiModel model;

    private Technology technology;

    @Override
    public void start(KubiKernel kernel) {
        this.model = kernel.model();

        //Demonstration of MetaClass wide hacked extrapolation
        (this.model.metaModel().metaClass("org.kubi.Device")).attribute("homeId").setExtrapolation(this);

        service = Executors.newScheduledThreadPool(1);
        technology = model.universe(kernel.currentUniverse()).time(System.currentTimeMillis()).createTechnology();
        technology.setName("FakeTechnology");
        kernel.model().universe(kernel.currentUniverse()).time(System.currentTimeMillis()).getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                ((Ecosystem) kObject).addTechnologies(technology);
                model.save();
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
            technology.jump(System.currentTimeMillis()).then(new Callback<KObject>() {
                @Override
                public void on(KObject kObject) {
                    Technology currentTechno = (Technology) kObject;
                    float addDeviceProba = rand.nextFloat();
                    if (addDeviceProba < 0.3) {
                        String deviceName = "Device_" + rand.nextInt(1000);
                        System.err.println("FakeMock add a device ... named:" + deviceName);
                        Device newDevice = model.createDevice(currentTechno.universe(), currentTechno.now());
                        newDevice.setName(deviceName);
                        currentTechno.addDevices(newDevice);
                    }
                    currentTechno.getDevices().then(new Callback<Device[]>() {
                        @Override
                        public void on(Device[] devices) {
                            for (Device device : devices) {
                                device.setVersion(System.currentTimeMillis() + "");
                                System.err.println("Extrapolated HomeId="+device.getHomeId());
                            }
                            model.save();
                        }
                    });
                }
            });
            model.save();
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    private Random random = new Random();

    @Override
    public Object extrapolate(KObject current, MetaAttribute attribute) {
        return ""+random.nextInt();
    }

    @Override
    public void mutate(KObject current, MetaAttribute attribute, Object payload) {

    }

    @Override
    public String save(Object cache, MetaAttribute attribute) {
        return null;
    }

    @Override
    public Object load(String payload, MetaAttribute attribute, long now) {
        return null;
    }
}
