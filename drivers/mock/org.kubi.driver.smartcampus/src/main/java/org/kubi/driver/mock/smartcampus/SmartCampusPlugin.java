package org.kubi.driver.mock.smartcampus;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.Ecosystem;
import org.kubi.KubiModel;
import org.kubi.KubiUniverse;
import org.kubi.KubiView;
import org.kubi.api.Plugin;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 20/03/15.
 */
public class SmartCampusPlugin implements Plugin, Runnable {

    ScheduledExecutorService service = null;

    private KubiModel model;

    @Override
    public void start(KubiModel model) {
        System.out.println("SmartCampus Start ... ");
        this.model = model;
        service = Executors.newScheduledThreadPool(1);
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        System.out.println("SmartCampus Stop ... ");
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
                }
            }
        });
    }
}
