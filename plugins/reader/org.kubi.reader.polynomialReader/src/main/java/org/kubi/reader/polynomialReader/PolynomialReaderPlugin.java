package org.kubi.reader.polynomialReader;

import org.kevoree.modeling.KCallback;
import org.kevoree.modeling.KObject;
import org.kubi.Ecosystem;
import org.kubi.SimulatedParameter;
import org.kubi.StateParameter;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaTechnology;

/**
 * Created by jerome on 22/04/15.
 */
public class PolynomialReaderPlugin implements KubiPlugin {

    @Override
    public void start(KubiKernel kernel) {
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        final long time = System.currentTimeMillis();
        PolynomialLaw polynomialLaw = new PolynomialLaw(0.285796339, - 2736.016278, 7546.363798, -7460.92177, 3798.572543, - 1136.920265, 211.264638, - 24.65403975, 1.756913793, - 0.06983998705, 0.001186431353);
        kernel.model().universe(kernel.currentUniverse()).time(time).getRoot(new KCallback<KObject>() {
            @Override
            public void on(KObject kObject) {
                Ecosystem ecosystem = (Ecosystem) kObject;
                ecosystem.traversal()
                        .traverse(MetaEcosystem.REL_TECHNOLOGIES)
                        .traverse(MetaTechnology.REL_DEVICES).withAttribute(MetaDevice.ATT_NAME, "ElectricConsommation")
                        .traverse(MetaDevice.REL_STATEPARAMETERS)//.withAttribute(MetaStateParameter.ATT_NAME, "name")
                        .then(kObjects -> {
                            if (kObjects.length == 0) {
                                System.err.println("Error PolynomialReader : no device detected");
                            } else {
                                kObjects[0].jump(time, new KCallback<KObject>() {
                                    @Override
                                    public void on(KObject kObject) {
                                        StateParameter parameter = (SimulatedParameter) kObject;
                                        String extrapolation = "" + polynomialLaw.evaluate((double) ((time / 1000) % 11));
                                        System.out.println("Extrapollation :" + extrapolation + "..value: " + parameter.getValue() + " ==> " + extrapolation.equals(parameter.getValue()));
                                    }
                                });
                            }
                        });
            }
        });
    }

    @Override
    public void stop() {
        System.out.println("PolynomialReaderPlugin Stop ... ");
    }
}
