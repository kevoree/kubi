package org.kubi.driver.mock.realsmartfridge;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.api.Plugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaParameter;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by jerome on 10/04/15.
 */
public class RealSmartFridgePlugin implements Plugin, Runnable {


    ScheduledExecutorService service = null;

    private KubiModel model;

    @Override
    public void start(KubiModel model) {
        System.out.println("Real SmartFridge Start ... ");
        this.model = model;
        service = Executors.newScheduledThreadPool(1);
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        System.out.println("Real SmartFridge Stop ... ");
    }

    @Override
    public void run() {
        final KubiUniverse ku = model.universe(0);
        final KubiView kv = ku.time(0);
        kv.select("/").then(new Callback<KObject[]>() {
            @Override
            public void on(KObject[] kObjects) {
                if (kObjects.length == 0) {
                    Ecosystem e = kv.createEcosystem();
                    e.setName("ecoSystemTest");

                    Device device = kv.createDevice();
                    device.setName("plug");
                    device.addParameters(kv.createParameter().setName("name"));
                    e.addDevices(device);


                    Device device2 = kv.createDevice();
                    device2.setName("openCheck");
                    device2.addParameters(kv.createParameter().setName("name"));
                    e.addDevices(device2);


                    // TODO : @dukeboard changer le chemin
                    String csvFile = "/Users/jerome/Documents/Jerome/stage_dev/kubi/drivers/mock/org.kubi.driver.realsmartfridge/src/main/resources/CSV_Cuisine_9-14_Avril.csv";
//                    String csvFile = "/Users/jerome/Documents/Jerome/stage_dev/kubi/drivers/mock/org.kubi.driver.realsmartfridge/src/main/resources/fridgeCoffee1.csv";
                    BufferedReader bufferedReader = null;
                    String line;
                    String csvSplitter = ";";



                    try {
                        bufferedReader = new BufferedReader(new FileReader(csvFile));
                        while ((line = bufferedReader.readLine()) != null) {
                            String[] data = line.split(csvSplitter);
                            if(data.length>2 && data[1]!=null && data[2]!=null) {
                                if ((new String(3 + "")).equals(data[1])) {
                                    // it's a data from the plug
                                    device.traversal().traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name").done().then(new Callback<KObject[]>() {
                                        @Override
                                        public void on(KObject[] kObjects) {
                                            if (kObjects.length != 0) {
                                                Parameter parameter = (Parameter) kObjects[0];
                                                parameter.jump(Long.parseLong(data[0]))
                                                        .then(new Callback<KObject>() {
                                                            @Override
                                                            public void on(KObject kObject) {
                                                                if (kObject != null) {
                                                                    try {
//                                                                        ((Parameter) kObject).setValue("" + (Double.parseDouble(data[2])>=0.1 ? 0.2 : 0));
                                                                        ((Parameter) kObject).setValue("" + (Double.parseDouble(data[2])));
                                                                    } catch (Exception e1) {
                                                                        System.err.println(data[2]);
                                                                    }
                                                                }
                                                            }
                                                        });
                                            }
                                        }
                                    });
                                    model.save();
                                }
                            if ((new String(2 + "")).equals(data[1])) {
                                // it's a data from the plug
                                device2.traversal().traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name").done().then(new Callback<KObject[]>() {
                                    @Override
                                    public void on(KObject[] kObjects) {
                                        if (kObjects.length != 0) {
                                            Parameter parameter = (Parameter) kObjects[0];
                                            parameter.jump(Long.parseLong(data[0]))
                                                    .then(new Callback<KObject>() {
                                                        @Override
                                                        public void on(KObject kObject) {
                                                            if (kObject != null) {
                                                                try {
                                                                    ((Parameter) kObject).setValue((Float.parseFloat(data[2]))==255.0 ? "1.0" : ((Float.parseFloat(data[2]))+""));
                                                                } catch (Exception e1) {
                                                                    System.err.println(data[2]);
                                                                }
                                                            }
                                                        }
                                                    });
                                        }
                                    }
                                });
                                model.save();
                            }
                            }
                        }

                    } catch (FileNotFoundException e1) {
                        e1.printStackTrace();
                    } catch (IOException e1) {
                        e1.printStackTrace();
                    } finally {
                        if (bufferedReader != null) {
                            try {
                                bufferedReader.close();
                            } catch (IOException e1) {
                                e1.printStackTrace();
                            }
                        }
                    }

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
        //        try {
        //            Thread.sleep(10000);
        //        } catch (InterruptedException e) {
        //            e.printStackTrace();
        //        }
        //        kv.getRoot().then(new Callback<KObject>() {
        //            @Override
        //            public void on(KObject kObject) {
        //                if (kObject != null) {
        //                    Ecosystem e = (Ecosystem)kObject;
        //                    e.traversal().traverse(MetaEcosystem.REF_DEVICES).withAttribute(MetaDevice.ATT_NAME, "openCheck").done().then(new Callback<KObject[]>() {
        //                        @Override
        //                        public void on(KObject[] kObjects) {
        //                            if (kObjects.length != 0){
        //                                ((Device)kObjects[0]).traversal().traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name").done().then(new Callback<KObject[]>() {
        //                                    @Override
        //                                    public void on(KObject[] kObjects) {
        //                                        if (kObjects.length !=0){
        //                                            for (int i = 0; i < 100; i++) {
        //                                                ((Parameter) kObjects[0]).jump(1428680933017L - i*2000).then(new Callback<KObject>() {
        //                                                    @Override
        //                                                    public void on(KObject kObject) {
        //                                                        System.out.println(Float.parseFloat(((Parameter) kObject).getValue()) + "_______" + ((Parameter) kObject).now());
        //                                                    }
        //                                                });
        //                                            }
        //                                        }
        //                                    }
        //                                });
        //                            }
        //                        }
        //                    });
        //                }
        //            }
        //
        //        });

    }
}
