package org.kubi.runner;

import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KConfig;
import org.kevoree.modeling.api.scheduler.ExecutorServiceScheduler;
import org.kevoree.modeling.drivers.leveldb.LevelDbContentDeliveryDriver;
import org.kubi.Ecosystem;
import org.kubi.KubiModel;
import org.kubi.KubiView;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

import java.io.IOException;
import java.util.ArrayList;
import java.util.ServiceLoader;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 20/03/15.
 */
public class KubiKernelImpl implements KubiKernel {

    private KubiModel kubiModel;

    public KubiKernelImpl(String dbPath) throws IOException {
        kubiModel = new KubiModel();
        kubiModel.setScheduler(new ExecutorServiceScheduler());
        LevelDbContentDeliveryDriver leveldb = new LevelDbContentDeliveryDriver(dbPath);
        kubiModel.setContentDeliveryDriver(leveldb);
    }

    private boolean isConnected = false;

    private ServiceLoader<KubiPlugin> pluginLoaders;

    private ExecutorService executorService;

    public synchronized void start() {
        Log.debug("Start");
        if (!isConnected) {
            kubiModel.connect().then(new Callback<Throwable>() {
                @Override
                public void on(Throwable throwable) {
                    Log.debug("Connected");
                    KubiView beginingOfTime = kubiModel.universe(currentUniverse()).time(KConfig.BEGINNING_OF_TIME);
                    Ecosystem ecosystem = beginingOfTime.createEcosystem();
                    ecosystem.setName("KubiRoot");
                    beginingOfTime.setRoot(ecosystem);
                    kubiModel.save().then(new Callback<Throwable>() {
                        @Override
                        public void on(Throwable throwable) {
                            if(throwable != null) {
                                throwable.printStackTrace();
                            } else {
                                executorService = Executors.newCachedThreadPool();
                                isConnected = true;
                                pluginLoaders = ServiceLoader.load(KubiPlugin.class);
                                for (KubiPlugin plugin : pluginLoaders) {
                                    Log.info("Found plugin: {}",plugin.getClass().getSimpleName());
                                    try {
                                        addDriver(plugin);
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }
    }

    public synchronized void stop() throws InterruptedException {
        Log.debug("Stop");
        if (isConnected) {
            for (KubiPlugin plugin : plugins.toArray(new KubiPlugin[plugins.size()])) {
                try {
                    removeDriver(plugin);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            executorService.shutdown();
            executorService.awaitTermination(3000, TimeUnit.SECONDS);
            executorService.shutdownNow();

            executorService = null;
            kubiModel.close();
            isConnected = false;
        }
    }

    public KubiModel model() {
        return kubiModel;
    }

    @Override
    public long currentUniverse() {
        return 0;
    }

    private ArrayList<KubiPlugin> plugins = new ArrayList<KubiPlugin>();

    private KubiKernel selfPointer = this;

    public void addDriver(KubiPlugin plugin) throws Exception {
        Log.debug("Adding driver");
        if (isConnected) {
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    plugins.add(plugin);
                    plugin.start(selfPointer);
                }
            });
        } else {
            throw new Exception("Please start KubiKernel before adding drivers");
        }
    }

    public void removeDriver(KubiPlugin plugin) throws Exception {
        Log.debug("Remove driver");
        if (isConnected) {
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    plugin.stop();
                    plugins.remove(plugin);
                }
            });
            //TODO keep trace of thread group
        } else {
            throw new Exception("Please start KubiKernel before removing drivers");
        }
    }

    public KubiModel getKubiModel() {
        return kubiModel;
    }
}
