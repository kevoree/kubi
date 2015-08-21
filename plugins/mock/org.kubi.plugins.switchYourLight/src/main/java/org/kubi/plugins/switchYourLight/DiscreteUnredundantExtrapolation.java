package org.kubi.plugins.switchYourLight;

import org.kevoree.modeling.KObject;
import org.kevoree.modeling.abs.AbstractKObject;
import org.kevoree.modeling.extrapolation.Extrapolation;
import org.kevoree.modeling.memory.chunk.KObjectChunk;
import org.kevoree.modeling.memory.manager.internal.KInternalDataManager;
import org.kevoree.modeling.meta.KLiteral;
import org.kevoree.modeling.meta.KMetaAttribute;
import org.kevoree.modeling.meta.KMetaEnum;
import org.kevoree.modeling.meta.KPrimitiveTypes;
import org.kevoree.modeling.meta.impl.MetaLiteral;
import org.kevoree.modeling.util.PrimitiveHelper;

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
    public Object extrapolate(KObject current, KMetaAttribute attribute, KInternalDataManager dataManager) {
        KObjectChunk payload = dataManager.closestChunk(current.universe(), current.now(), current.uuid(), current.metaClass(), ((AbstractKObject) current).previousResolved());
        if (payload != null) {
            if (KPrimitiveTypes.isEnum(attribute.attributeTypeId())) {
                KMetaEnum metaEnum = ((AbstractKObject) current)._manager.model().metaModel().metaTypes()[attribute.attributeTypeId()];
                return metaEnum.literal((int) payload.getPrimitiveType(attribute.index(), current.metaClass()));
            } else {
                return payload.getPrimitiveType(attribute.index(), current.metaClass());
            }
        } else {
            return null;
        }
    }

    @Override
    public void mutate(KObject current, KMetaAttribute attribute, Object payload, KInternalDataManager dataManager) {
        Object oldPayloadValue = this.extrapolate(current, attribute, dataManager);
        if (oldPayloadValue != null) {
            // The previous value value of the current KObject is different than the previous one
            //By requiring a raw on the current object, we automatically create and copy the previous object
            KObjectChunk internalPayload = dataManager.preciseChunk(current.universe(), current.now(), current.uuid(), current.metaClass(), ((AbstractKObject) current).previousResolved());
            //The object is also automatically cset to Dirty
            if (internalPayload != null && !oldPayloadValue.equals(payload)) {
                if (KPrimitiveTypes.isEnum(attribute.attributeTypeId())) {
                    if (payload instanceof MetaLiteral) {
                        internalPayload.setPrimitiveType(attribute.index(), ((KLiteral) payload).index(), current.metaClass());
                    } else {
                        KMetaEnum metaEnum = ((AbstractKObject) current)._manager.model().metaModel().metaTypes()[attribute.attributeTypeId()];
                        KLiteral foundLiteral = metaEnum.literalByName(payload.toString());
                        if (foundLiteral != null) {
                            internalPayload.setPrimitiveType(attribute.index(), foundLiteral.index(), current.metaClass());
                        }
                    }
                } else {
                    if (payload == null) {
                        internalPayload.setPrimitiveType(attribute.index(), null, current.metaClass());
                    } else {
                        internalPayload.setPrimitiveType(attribute.index(), convert(attribute, payload), current.metaClass());
                    }
                }
            }
        }
    }


    /**
     * @native ts
     * return payload;
     */
    private final Object convert(KMetaAttribute attribute, Object payload) {
        int attTypeId = attribute.attributeTypeId();
        switch (attTypeId) {
            case KPrimitiveTypes.INT_ID:
                if (payload instanceof Integer) {
                    return payload;
                } else {
                    try {
                        return PrimitiveHelper.parseInt(payload.toString());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            case KPrimitiveTypes.DOUBLE_ID:
                if (payload instanceof Double) {
                    return payload;
                } else {
                    try {
                        return PrimitiveHelper.parseDouble(payload.toString());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            case KPrimitiveTypes.LONG_ID:
                if (payload instanceof Long) {
                    return payload;
                } else {
                    try {
                        return PrimitiveHelper.parseLong(payload.toString());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            case KPrimitiveTypes.STRING_ID:
                if (payload instanceof String) {
                    return payload;
                } else {
                    try {
                        return payload.toString();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            case KPrimitiveTypes.BOOL_ID:
                if (payload instanceof Boolean) {
                    return payload;
                } else {
                    try {
                        return PrimitiveHelper.parseBoolean(payload.toString());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            default:
                return payload;
        }
    }
}
