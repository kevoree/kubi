package org.kubi.bugsMains;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KConfig;
import org.kevoree.modeling.KObject;
import org.kubi.Ecosystem;
import org.kubi.Period;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaStateParameter;
import org.kubi.meta.MetaTechnology;


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
        kernel.model().universe(kernel.currentUniverse()).time(initialTime).getRoot(new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Ecosystem ecosystem = (Ecosystem) kObject;
                ecosystem.traversal()
                        .traverse(MetaEcosystem.REL_TECHNOLOGIES)
                        .traverse(MetaTechnology.REL_DEVICES).withAttribute(MetaDevice.ATT_NAME, "plug")
                        .traverse(MetaDevice.REL_STATEPARAMETERS).withAttribute(MetaStateParameter.ATT_NAME, "name")
                        .traverse(MetaStateParameter.REL_PERIOD)
                        .then(new KCallback<KObject[]>() {
                            @Override
                            public void on(KObject[] kObjects) {
                                if (kObjects.length > 0) {
                                    Period kPeriod = ((Period) kObjects[0]);
                                    kPeriod.jump(1428932146000L, new KCallback<KObject>() {
                                        @Override
                                        public void on(KObject kObject) {
                                            System.out.println("__________________________________________________" + ((Period) kObject).getPeriod()
                                                    + "______________  AT ____________________" + (kObject).now());
                                        }
                                    });
                                    kPeriod.jump(1428935656000L, new KCallback<KObject>() {
                                        @Override
                                        public void on(KObject kObject) {
                                            System.out.println("__________________________________________________" + ((Period) kObject).getPeriod()
                                                    + "____________  AT _____________________" + (kObject).now());
                                        }
                                    });
                                } else {
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
