package org.kubi.reader.polynomialReader;

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
 * Created by jerome on 22/04/15.
 */
public class PolynomialReaderPlugin implements Runnable, Plugin {


    ScheduledExecutorService service = null;

    private KubiModel model;

    @Override
    public void start(KubiModel model) {
        System.out.println("PolynomialReaderPlugin Start ... ");
        this.model = model;
        service = Executors.newScheduledThreadPool(1);
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        System.out.println("PolynomialReaderPlugin Stop ... ");
    }

    @Override
    public void run() {

        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("PolynomialReaderPlugin Restarts ... ");


        PolynomialLaw polynomialLaw = new PolynomialLaw(0.285796339, - 2736.016278, 7546.363798, -7460.92177, 3798.572543, - 1136.920265, 211.264638, - 24.65403975, 1.756913793, - 0.06983998705, 0.001186431353);
        double delta = 0.1;

        final KubiUniverse universe = model.universe(0);
        final Long time = System.currentTimeMillis();
        final KubiView kView = universe.time(time);
        kView.getRoot().then(new Callback<KObject>() {
            @Override
            public void on(KObject kObject) {
                if (kObject != null) {
                    Ecosystem ecosystem = ((Ecosystem) kObject);
                    ecosystem.traversal()
                            .traverse(MetaEcosystem.REF_DEVICES).withAttribute(MetaDevice.ATT_NAME, "ElectricConsommation")
                            .traverse(MetaDevice.REF_PARAMETERS).withAttribute(MetaParameter.ATT_NAME, "name")
                            .done().then(new Callback<KObject[]>() {
                        @Override
                        public void on(KObject[] kObjects) {
                            if(kObjects.length == 0){
                                System.err.println("Error PolynomialReader : no device detected");
                            }else {
                                kObjects[0].jump(time).then(new Callback<KObject>() {
                                    @Override
                                    public void on(KObject kObject) {
                                        Parameter parameter = (Parameter) kObject;
                                        Double extrapolation = polynomialLaw.evaluate((double) ((time / 1000) % 11));
                                        parameter.getValue();
                                        System.out.println(extrapolation + "..........." + parameter.getValue());
                                        System.out.println(extrapolation.equals(parameter.getValue()));
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
