package org.kubi.driver.mock.echomock;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.Device;
import org.kubi.Ecosystem;
import org.kubi.KubiModel;
import org.kubi.api.Plugin;

import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 20/03/15.
 */
public class EchoMockPlugin implements Plugin, Runnable {

    ScheduledExecutorService service = null;

    private KubiModel model;

    private Ecosystem madEchoSystem;

    @Override
    public void start(KubiModel model) {
        this.model = model;
        service = Executors.newScheduledThreadPool(1);
        System.out.println("Kubi Mock Start ... ");
        madEchoSystem = model.universe(0).time(System.currentTimeMillis()).createEcosystem();
        madEchoSystem.setName("MadMockEcoSystem");
        model.universe(0).time(System.currentTimeMillis()).setRoot(madEchoSystem);
        model.save();
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        System.out.println("Kubi Mock Stop ... ");
    }

    @Override
    public void run() {
        //add devices or change values
        Random rand = new Random();
        madEchoSystem.jump(System.currentTimeMillis()).then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Ecosystem newEcoSystem = (Ecosystem) kObject;
                float addDeviceProba = rand.nextFloat();
                if (addDeviceProba < 0.3) {
                    String deviceName = "Device_" + rand.nextInt(1000);
                    System.err.println("MadMock add a device ... named:" + deviceName);
                    Device newDevice = newEcoSystem.view().createDevice();
                    newDevice.setName(deviceName);
                    madEchoSystem.addDevices(newDevice);
                }
                newEcoSystem.getDevices().then(new Callback<Device[]>() {
                    @Override
                    public void on(Device[] devices) {
                        for (Device device : devices) {
                            device.setVersion(System.currentTimeMillis() + "");
                        }
                        model.save();
                    }
                });
            }
        });
        model.save();
    }
}
