package org.kubi.driver.mock.smartfridge;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kevoree.modeling.api.KOperation;
import org.kubi.*;
import org.kubi.api.Plugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaFunction;
import org.kubi.meta.MetaParameter;

import java.util.Arrays;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 20/03/15.
 */
public class SmartFridgePlugin implements Plugin, Runnable {

    ScheduledExecutorService service = null;

    private KubiModel model;

    @Override
    public void start(KubiModel model) {
        System.out.println("SmartFridge Start ... ");
        this.model = model;
        service = Executors.newScheduledThreadPool(1);
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        System.out.println("SmartFridge Stop ... ");
    }

    @Override
    public void run() {
        final KubiUniverse ku = model.universe(0);
        final KubiView kv = ku.time(System.currentTimeMillis());
        kv.select("/").then(new Callback<KObject[]>() {
            @Override
            public void on(KObject[] kObjects) {
                if (kObjects.length == 0) {
                    Ecosystem e = kv.createEcosystem();
                    e.setName("ecoSystemTest");

                    Device device = kv.createDevice();
                    device.setName("ElectricConsommation");
                    device.addParameters(kv.createParameter().setName("name"));
                    e.addDevices(device);


                    /*
                     * The device deviceVirtual is the device containing the peiord calculated by the FFT algorithm
                     * The value at a time T is the period calculated between T-x and T+x (in the middle of the segment).
                     */
                    Device deviceVirtual = kv.createDevice();
                    deviceVirtual.setName("ElectricConsommation_Period");
                    deviceVirtual.addParameters(kv.createParameter().setName("name"));
                    e.addDevices(deviceVirtual);
                    // KubiUniverse kuparallele = ku.diverge();

                    device.traversal().traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name").done().then(new Callback<KObject[]>() {
                        @Override
                        public void on(KObject[] kObjects) {
                            Parameter parameter = (Parameter) kObjects[0];
                            // the getter of the parameter return values following the PolynomialExtrapolation
                            System.out.println("bob=================================");
                            parameter.metaClass().attribute(parameter.getName()).setExtrapolation(new PolynomialExtrapolation());
                            model.save();
                        }
                    });
                    kv.setRoot(e).then(new Callback<Throwable>() {
                        @Override
                        public void on(Throwable throwable) {
                            if (throwable != null) {
                                throwable.printStackTrace();
                            } else {
                                model.save().then(new Callback<Throwable>() {
                                    @Override
                                    public void on(Throwable throwable) {
                                        if (throwable != null) {
                                            throwable.printStackTrace();
                                        }
                                        //Log.debug("Root ready with UUID " + e.uuid());
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    public KubiModel getModel() {
        return model;
    }
}
