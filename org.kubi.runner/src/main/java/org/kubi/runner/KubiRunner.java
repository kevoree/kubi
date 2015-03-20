package org.kubi.runner;

import org.kevoree.log.Log;
import org.kevoree.modeling.api.KOperation;
import org.kevoree.modeling.databases.websocket.WebSocketWrapper;
import org.kevoree.modeling.drivers.leveldb.LevelDbContentDeliveryDriver;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.driver.zwave.ZWaveConnector;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaFunction;
import org.kubi.meta.MetaParameter;
import org.kubi.simulationLaws.PolynomialLaw;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Arrays;

/**
 * Created by cyril on 27/01/15.
 */
public class KubiRunner {

    private static int PORT = 8080;

    private static final String DB_NAME = "kubiDB";

    public static void main(String[] args) {

        Log.TRACE();

        clearDB();

        final KubiModel kubiModel = prepareModel();
        final ZWaveConnector zc = new ZWaveConnector(kubiModel);
        zc.start();

        /*
        Log.info("Starting ZWave Product Store");
        startZWaveProductsStore(kubiKernel);

        Log.info("Starting ZWave");
        startZWave(kubiKernel);
*/

        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            @Override
            public void run() {

                zc.stop();

/*
                stopWebServer(kubiKernel);

                stopZWave(kubiKernel);

                stopZWaveProductStore(kubiKernel);

                disconnectModel(kubiKernel);

                */
                kubiModel.close();

            }
        }));

    }

    private static void clearDB() {
        Path directory = Paths.get(DB_NAME);
        try {
            if (Files.exists(directory)) {
                Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
                    @Override
                    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                        Files.delete(file);
                        return FileVisitResult.CONTINUE;
                    }

                    @Override
                    public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                        Files.delete(dir);
                        return FileVisitResult.CONTINUE;
                    }

                });
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private static KubiModel prepareModel() {
        final KubiModel km = new KubiModel();
        LevelDbContentDeliveryDriver leveldb = null;
        try {
            leveldb = new LevelDbContentDeliveryDriver(DB_NAME);
        } catch (IOException e) {
            e.printStackTrace();
        }
        WebSocketWrapper webSocketWrapper = new WebSocketWrapper(leveldb, PORT);
        webSocketWrapper.exposeResourcesOf(KubiRunner.class.getClassLoader());
        km.setContentDeliveryDriver(webSocketWrapper);
        km.connect().then(new Callback<Throwable>() {
            @Override
            public void on(Throwable throwable) {
                final KubiUniverse ku = km.universe(0);
                final KubiView kv = ku.time(System.currentTimeMillis());
                kv.select("/").then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if (kObjects.length == 0) {
                            Log.debug("Root creation");
                            Ecosystem e = kv.createEcosystem();
                            e.setName("ecoSystemTest");

                            Device device = kv.createDevice();
                            device.setName("echo");
                            device.addParameters(kv.createParameter().setName("name"));
                            Function deviceEchoFunction = kv.createFunction();
                            deviceEchoFunction.setName("sayEcho");
                            deviceEchoFunction.addParameters(kv.createParameter().setName("name"));
                            device.addFunctions(deviceEchoFunction);
                            e.addDevices(device);


                            Device device2 = kv.createDevice();
                            device2.setName("echo2");
                            device2.addParameters(kv.createParameter().setName("name"));
                            Function deviceEchoFunction2 = kv.createFunction();
                            deviceEchoFunction2.setName("sayChocolat");
                            deviceEchoFunction2.addParameters(kv.createParameter().setName("name"));
                            device2.addFunctions(deviceEchoFunction2);
                            e.addDevices(device2);

                            final PolynomialLaw polynomialLaw = new PolynomialLaw(24839.21865, -14430.25924,
                                    3359.404392, -401.9522656, 26.18040012, -0.8830270156, 0.01208028907);
                            final PolynomialLaw polynomialLaw1 = new PolynomialLaw(0., 2.);
                            final long start = System.currentTimeMillis();
                            Thread t = new Thread(new Runnable() {
                                @Override
                                public void run() {
                                    while(true){
                                        try {
                                            Thread.sleep(1000);
                                        } catch (InterruptedException e1) {
                                            e1.printStackTrace();
                                        }
                                        System.err.println("Simulate modification...");
                                        device2.traversal().traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME,"name").done().then(new Callback<KObject[]>() {
                                            @Override
                                            public void on(KObject[] kObjects) {
                                                if(kObjects.length != 0){Parameter parameter = ((Parameter)kObjects[0]);
                                                    parameter.jump(System.currentTimeMillis()).then(new Callback<KObject>() {
                                                        @Override
                                                        public void on(KObject kObject) {
                                                            ((Parameter)kObject).setValue(polynomialLaw.evaluate((Double.parseDouble((System.currentTimeMillis()-start)+"")/1000 ) % 24) + "");

                                                            km.save();
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                        device.traversal().traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME,"name").done().then(new Callback<KObject[]>() {
                                            @Override
                                            public void on(KObject[] kObjects) {
                                                if(kObjects.length != 0){Parameter parameter = ((Parameter)kObjects[0]);
                                                    parameter.jump(System.currentTimeMillis()).then(new Callback<KObject>() {
                                                        @Override
                                                        public void on(KObject kObject) {
                                                            ((Parameter)kObject).setValue(polynomialLaw1.evaluate((Double.parseDouble((System.currentTimeMillis()-start)+"")/1000 ) % 24) + "");

                                                            km.save();
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


                            km.setOperation(MetaFunction.OP_EXEC, new KOperation() {
                                @Override
                                public void on(KObject source, Object[] params, Callback<Object> result) {
                                    if(((Function)source).getName().equals("sayEcho")){
                                        result.on("banane");
                                    }
                                    else{
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
                                        km.save().then(new Callback<Throwable>() {
                                            @Override
                                            public void on(Throwable throwable) {
                                                if (throwable != null) {
                                                    throwable.printStackTrace();
                                                }
                                                Log.debug("Root ready with UUID " + e.uuid());
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
        return km;
    }

    /*
    private static void startZWave(KubiKernel kernel) {
        ZWaveConnector zc = new ZWaveConnector(kernel.getKubiModel());
        zc.start();
        kernel.setzWaveConnector(zc);
    }


    private static void stopZWave(KubiKernel kubiKernel) {
        kubiKernel.getzWaveConnector().stop();
    }

    private static void startZWaveProductsStore(KubiKernel kernel) {
        ZWaveProductStoreServer server = new ZWaveProductStoreServer();
        server.start();
        kernel.setzWaveProductStoreServer(server);
    }

    private static void stopZWaveProductStore(KubiKernel kernel) {
        kernel.getzWaveProductStoreServer().stop();
    }*/

}
