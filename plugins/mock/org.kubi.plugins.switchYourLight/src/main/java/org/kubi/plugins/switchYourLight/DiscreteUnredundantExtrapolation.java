package org.kubi.plugins.switchYourLight;

import org.kevoree.modeling.KObject;
import org.kevoree.modeling.abs.AbstractKObject;
import org.kevoree.modeling.extrapolation.Extrapolation;
import org.kevoree.modeling.memory.struct.segment.KMemorySegment;
import org.kevoree.modeling.meta.KLiteral;
import org.kevoree.modeling.meta.KMetaAttribute;
import org.kevoree.modeling.meta.KMetaEnum;
import org.kevoree.modeling.meta.impl.MetaLiteral;

/**
 * Created by jerome on 17/07/15.
 */
public class DiscreteUnredundantExtrapolation implements Extrapolation {

    private static DiscreteUnredundantExtrapolation INSTANCE;

    public static Extrapolation instance() {
        if (INSTANCE == null) {
            INSTANCE = new DiscreteUnredundantExtrapolation();
        }
        return INSTANCE;
    }

    @Override
    public Object extrapolate(KObject current, KMetaAttribute attribute) {
        KMemorySegment payload = ((AbstractKObject) current)._manager.segment(current.universe(), current.now(), current.uuid(), true, current.metaClass(), null);
        if (payload != null) {
            if (attribute.attributeType().isEnum()) {
                return ((KMetaEnum) attribute.attributeType()).literal((int) payload.get(attribute.index(), current.metaClass()));
            } else {
                return payload.get(attribute.index(), current.metaClass());
            }
        } else {
            return null;
        }
    }

    @Override
    public void mutate(KObject current, KMetaAttribute attribute, Object payload) {
        Object oldPayloadValue = this.extrapolate(current, attribute);
        if(oldPayloadValue!=null && !oldPayloadValue.equals(payload)) {
            // The previous value value of the current KObject is different than the previous one
            //By requiring a raw on the current object, we automatically create and copy the previous object
            KMemorySegment internalPayload = ((AbstractKObject) current)._manager.segment(current.universe(), current.now(), current.uuid(), false, current.metaClass(), null);
            //The object is also automatically cset to Dirty
            if (internalPayload != null) {
                if (attribute.attributeType().isEnum()) {
                    if (payload instanceof MetaLiteral) {
                        internalPayload.set(attribute.index(), ((KLiteral) payload).index(), current.metaClass());
                    } else {
                        KMetaEnum metaEnum = (KMetaEnum) attribute.attributeType();
                        KLiteral foundLiteral = metaEnum.literalByName(payload.toString());
                        if (foundLiteral != null) {
                            internalPayload.set(attribute.index(), foundLiteral.index(), current.metaClass());
                        }
                    }
                } else {
                    internalPayload.set(attribute.index(), payload, current.metaClass());
                }
            }
        }
    }
}
