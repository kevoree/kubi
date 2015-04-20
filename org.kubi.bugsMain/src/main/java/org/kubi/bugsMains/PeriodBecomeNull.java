package org.kubi.bugsMains;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.api.Plugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaParameter;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by jerome on 20/04/15.
 */
public class PeriodBecomeNull implements Runnable, Plugin {
    ScheduledExecutorService service = null;

    private KubiModel model;

    @Override
    public void start(KubiModel model) {
        System.out.println("PeriodBecomeNull Start ... ");
        this.model = model;
        service = Executors.newScheduledThreadPool(1);
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);

    }

    @Override
    public void stop() {
        System.out.println("PeriodBecomeNull Stop ... ");
    }

    @Override
    public void run() {
        try {
            Thread.sleep(40000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("_______________________   BUGS MAIN  ________________________________");
        final KubiUniverse ku = model.universe(0);
        final KubiView kv = ku.time(System.currentTimeMillis());
        kv.select("/").then(new Callback<KObject[]>() {
            @Override
            public void on(KObject[] kObjects) {
                Ecosystem ecosystem = (Ecosystem) kObjects[0];
                ecosystem.traversal()
                        .traverse(MetaEcosystem.REF_DEVICES).withAttribute(MetaDevice.ATT_NAME, "plug")
                        .traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name")
                        .done().then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if(kObjects.length > 0){
                            Parameter parameter = ((Parameter) kObjects[0]);
                            parameter.jump(1428932146000L).then(new Callback<KObject>() {
                                @Override
                                public void on(KObject kObject) {
                                    System.out.println("_______________________________________________________"+((Parameter) kObject).getPeriod()
                                            +"______________  AT ____________________"+(kObject).now());
                                    System.out.println();
                                }
                            });
                            parameter.jump(1428935656000L).then(new Callback<KObject>() {
                                @Override
                                public void on(KObject kObject) {
                                    System.out.println("_______________________________________________________"+((Parameter) kObject).getPeriod()
                                            +"____________  AT _____________________"+(kObject).now());
                                }
                            });
                        }

                    }
                });
            }
        });

    }
}
