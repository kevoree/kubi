package org.kubi.kernel;

import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KConfig;
import org.kevoree.modeling.api.data.cdn.KContentDeliveryDriver;
import org.kevoree.modeling.api.scheduler.ExecutorServiceScheduler;
import org.kevoree.modeling.drivers.leveldb.LevelDbContentDeliveryDriver;
import org.kubi.Ecosystem;
import org.kubi.KubiModel;
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

    public KubiKernelImpl(KContentDeliveryDriver cdd) throws IOException {
        kubiModel = new KubiModel();
        kubiModel.setScheduler(new ExecutorServiceScheduler());
        if(cdd != null) {
        kubiModel.setContentDeliveryDriver(cdd);
        }
    }

    private boolean isConnected = false;

    private ServiceLoader<KubiPlugin> pluginLoaders;

    private ExecutorService executorService;

    public synchronized void start() {
        if (!isConnected) {
            kubiModel.connect().then(new Callback<Throwable>() {
                @Override
                public void on(Throwable throwable) {

                    Ecosystem ecosystem = kubiModel.universe(currentUniverse()).time(KConfig.BEGINNING_OF_TIME).createEcosystem();
                    ecosystem.setName("KubiRoot");
                    kubiModel.universe(currentUniverse()).time(KConfig.BEGINNING_OF_TIME).setRoot(ecosystem);

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
            });
        }
    }

    public synchronized void stop() throws InterruptedException {
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

}
