package org.kubi.runner;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.scheduler.ExecutorServiceScheduler;
import org.kevoree.modeling.databases.websocket.WebSocketWrapper;
import org.kevoree.modeling.drivers.leveldb.LevelDbContentDeliveryDriver;
import org.kubi.KubiModel;
import org.kubi.api.Plugin;

import java.io.IOException;
import java.util.ArrayList;
import java.util.ServiceLoader;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by duke on 20/03/15.
 */
public class KubiKernel {

    private KubiModel kubiModel;

    public KubiKernel(String dbPath, int port) throws IOException {
        kubiModel = new KubiModel();
        kubiModel.setScheduler(new ExecutorServiceScheduler());
        LevelDbContentDeliveryDriver leveldb = new LevelDbContentDeliveryDriver(dbPath);
        WebSocketWrapper webSocketWrapper = new WebSocketWrapper(leveldb, port);
        webSocketWrapper.exposeResourcesOf(KubiRunner.class.getClassLoader());
        kubiModel.setContentDeliveryDriver(webSocketWrapper);
    }

    private boolean isConnected = false;

    private ServiceLoader<Plugin> pluginLoaders;

    private ExecutorService executorService;

    public synchronized void start() {
        if (!isConnected) {
            kubiModel.connect().then(new Callback<Throwable>() {
                @Override
                public void on(Throwable throwable) {
                    executorService = Executors.newCachedThreadPool();
                    isConnected = true;
                    pluginLoaders = ServiceLoader.load(Plugin.class);
                    for (Plugin plugin : pluginLoaders) {
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
            for (Plugin plugin : plugins) {
                try {
                    removeDriver(plugin);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            executorService.shutdownNow();
            executorService = null;
            kubiModel.close();
            isConnected = false;
        }
    }

    public KubiModel model() {
        return kubiModel;
    }

    private ArrayList<Plugin> plugins = new ArrayList<Plugin>();

    public void addDriver(Plugin plugin) throws Exception {
        if (isConnected) {
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    plugins.add(plugin);
                    plugin.start(kubiModel);
                }
            });
        } else {
            throw new Exception("Please start KubiKernel before adding drivers");
        }
    }

    public void removeDriver(Plugin plugin) throws Exception {
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
