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

                    // KubiUniverse kuparallele = ku.diverge();

                    final PolynomialLaw polynomialLaw = new PolynomialLaw(0.285796339, - 2736.016278, 7546.363798, -7460.92177, 3798.572543, - 1136.920265, 211.264638, - 24.65403975, 1.756913793, - 0.06983998705, 0.001186431353);
                    final long start = System.currentTimeMillis();
                    Thread t = new Thread(new Runnable() {
                        @Override
                        public void run() {
                            while (true) {
                                try {
                                    Thread.sleep(1000);
                                } catch (InterruptedException e1) {
                                    e1.printStackTrace();
                                }
                                //System.err.println("Simulate modification...");
                                device.traversal().traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name").done().then(new Callback<KObject[]>() {
                                    @Override
                                    public void on(KObject[] kObjects) {
                                        if (kObjects.length != 0) {
                                            Parameter parameter = ((Parameter) kObjects[0]);
                                            parameter.jump(System.currentTimeMillis()).then(new Callback<KObject>() {
                                                @Override
                                                public void on(KObject kObject) {
                                                    ((Parameter) kObject).setValue(polynomialLaw.evaluate(Double.parseDouble(((System.currentTimeMillis() - start) / 1000) % 11 + "")) + "");
                                                    model.save();
                                                }
                                            });
                                        }
                                    }
                                });
                                //device2.setVersion(System.currentTimeMillis() + "");
                                //km.save();
                            }
                        }
                    });
                    t.start();


                    model.setOperation(MetaFunction.OP_EXEC, new KOperation() {
                        @Override
                        public void on(KObject source, Object[] params, Callback<Object> result) {
                            if (((Function) source).getName().equals("sayEcho")) {
                                result.on("banane");
                            } else {
                                result.on(Arrays.asList(params));
                            }
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
}
