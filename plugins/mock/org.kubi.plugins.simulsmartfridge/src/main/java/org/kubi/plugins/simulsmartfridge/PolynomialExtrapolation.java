package org.kubi.plugins.simulsmartfridge;

import org.kevoree.modeling.KObject;
import org.kevoree.modeling.extrapolation.Extrapolation;
import org.kevoree.modeling.memory.manager.internal.KInternalDataManager;
import org.kevoree.modeling.meta.KMetaAttribute;

/**
 * Created by jerome on 20/04/15.
 */
public class PolynomialExtrapolation implements Extrapolation{

    @Override
    public Object extrapolate(KObject current, KMetaAttribute attribute, KInternalDataManager dataManager) {
        PolynomialLaw polynomialLaw = new PolynomialLaw(0.285796339, - 2736.016278, 7546.363798, -7460.92177, 3798.572543, - 1136.920265, 211.264638, - 24.65403975, 1.756913793, - 0.06983998705, 0.001186431353);
        return "" + polynomialLaw.evaluate((double)((current.now() / 1000) % 11));
    }

    @Override
    public void mutate(KObject current, KMetaAttribute attribute, Object payload, KInternalDataManager dataManager) {
        // Do nothing <=> no data will be saved
    }
}
