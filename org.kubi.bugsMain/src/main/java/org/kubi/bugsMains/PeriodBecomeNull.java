package org.kubi.bugsMains;

import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KConfig;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaStateParameter;
import org.kubi.meta.MetaTechnology;

import javax.sql.rowset.serial.SerialRef;
import java.beans.PersistenceDelegate;


/**
 * Created by jerome on 20/04/15.
 */
public class PeriodBecomeNull implements KubiPlugin {

    @Override
    public void start(KubiKernel kernel) {
        try {
            Thread.sleep(15000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        long initialTime = KConfig.BEGINNING_OF_TIME;
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Ecosystem ecosystem = (Ecosystem) kObject;
                ecosystem.traversal()
                        .traverse(MetaEcosystem.REF_TECHNOLOGIES)
                        .traverse(MetaTechnology.REF_DEVICES).withAttribute(MetaDevice.ATT_NAME, "plug")
                        .traverse(MetaDevice.REF_STATEPARAMETERS).withAttribute(MetaStateParameter.ATT_NAME, "name")
                        .traverse(MetaStateParameter.REF_PERIOD)
                        .done().then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if(kObjects.length > 0){
                            Period kPeriod = ((Period) kObjects[0]);
                            kPeriod.jump(1428932146000L).then(new Callback<KObject>() {
                                @Override
                                public void on(KObject kObject) {
                                    System.out.println("__________________________________________________"+((Period) kObject).getPeriod()
                                            +"______________  AT ____________________"+(kObject).now());
                                }
                            });
                            kPeriod.jump(1428935656000L).then(new Callback<KObject>() {
                                @Override
                                public void on(KObject kObject) {
                                    System.out.println("__________________________________________________"+((Period) kObject).getPeriod()
                                            +"____________  AT _____________________"+(kObject).now());
                                }
                            });
                        }else {
                            System.err.println("Error PeriodBecomeNull : no device detected");
                        }

                    }
                });

            }
        });
    }

    @Override
    public void stop() {
        System.out.println("PeriodBecomeNull Stop ... ");
    }
}
