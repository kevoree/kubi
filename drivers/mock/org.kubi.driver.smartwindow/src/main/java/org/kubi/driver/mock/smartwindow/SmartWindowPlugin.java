package org.kubi.driver.mock.smartwindow;

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
public class SmartWindowPlugin implements Plugin, Runnable {

    ScheduledExecutorService service = null;

    private KubiModel model;

    @Override
    public void start(KubiModel model) {
        System.out.println("SmartWindow Start ... ");
        this.model = model;
        service = Executors.newScheduledThreadPool(1);
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        System.out.println("SmartWindow Stop ... ");
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
                    device.setName("airQuality");
                    device.addParameters(kv.createParameter().setName("name"));
                    Function deviceEchoFunction = kv.createFunction();
                    deviceEchoFunction.setName("sayEcho");
                    deviceEchoFunction.addParameters(kv.createParameter().setName("name"));
                    device.addFunctions(deviceEchoFunction);
                    e.addDevices(device);


                    Device device2 = kv.createDevice();
                    device2.setName("temperature");
                    device2.addParameters(kv.createParameter().setName("name"));
                    Function deviceEchoFunction2 = kv.createFunction();
                    deviceEchoFunction2.setName("sayChocolat");
                    deviceEchoFunction2.addParameters(kv.createParameter().setName("name"));
                    device2.addFunctions(deviceEchoFunction2);
                    e.addDevices(device2);

                    final PolynomialLaw polynomialLaw = new PolynomialLaw(21.98543123, - 2.230361305, 0.3107517482, 0.01966783215
                            - 0.006555944053, 0.0003205128204);
                    final PolynomialLaw polynomialLaw1 = new PolynomialLaw(60.01311188, 29.11611306, - 11.10467657, 2.090253497
                            - 0.1948572261, 0.007211538463);
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
                                System.err.println("Simulate modification...");
                                device2.traversal().traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name").done().then(new Callback<KObject[]>() {
                                    @Override
                                    public void on(KObject[] kObjects) {
                                        if (kObjects.length != 0) {
                                            Parameter parameter = ((Parameter) kObjects[0]);
                                            parameter.jump(System.currentTimeMillis()).then(new Callback<KObject>() {
                                                @Override
                                                public void on(KObject kObject) {
                                                    ((Parameter) kObject).setValue(polynomialLaw.evaluate(((Double.parseDouble((System.currentTimeMillis() - start) + "") / 1000) % 24)/8) + "");
                                                    model.save();
                                                }
                                            });
                                        }
                                    }
                                });
                                device.traversal().traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name").done().then(new Callback<KObject[]>() {
                                    @Override
                                    public void on(KObject[] kObjects) {
                                        if (kObjects.length != 0) {
                                            Parameter parameter = ((Parameter) kObjects[0]);
                                            parameter.jump(System.currentTimeMillis()).then(new Callback<KObject>() {
                                                @Override
                                                public void on(KObject kObject) {
                                                    ((Parameter) kObject).setValue(polynomialLaw1.evaluate(((Double.parseDouble((System.currentTimeMillis() - start) + "") / 1000) % 24)/8) + "");
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
