package org.kubi.driver.mock.smartfridge;

import org.junit.Before;
import org.junit.Test;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kevoree.modeling.api.KUniverse;
import org.kevoree.modeling.api.KView;
import org.kubi.Ecosystem;
import org.kubi.KubiModel;
import org.kubi.Parameter;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaEcosystem;
import org.kubi.meta.MetaParameter;

import static org.junit.Assert.*;

public class SmartFridgePluginTest {

    private static int PORT = 8080;
    private static final String DB_NAME = "kubiDB";
    private KubiModel model;

    @Before
    public void setUp() throws Exception {
        System.out.println("SmartFridgePluginTest Start ... ");

    }

    @Test
    public void polynomialExtrapolationTest(){
        PolynomialLaw polynomialLaw = new PolynomialLaw(0.285796339, - 2736.016278, 7546.363798, -7460.92177, 3798.572543, - 1136.920265, 211.264638, - 24.65403975, 1.756913793, - 0.06983998705, 0.001186431353);
        double delta = 0.1;

        final KUniverse universe = model.universe(0);
        final Long time = System.currentTimeMillis();
        final KView kView = universe.time(time);
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
                            Parameter parameter = (Parameter) kObjects[0];
                            Double extrapolation = polynomialLaw.evaluate(Double.parseDouble(((time/1000) % 11) + ""));
                            assertEquals(extrapolation, Double.parseDouble(parameter.getValue()), delta);
                        }
                    });
                }
            }
        });
    }
}