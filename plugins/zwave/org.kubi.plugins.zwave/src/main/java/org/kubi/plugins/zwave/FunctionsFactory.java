package org.kubi.plugins.zwave;

import lu.snt.zwave.driver.ZWaveKey;
import lu.snt.zwave.protocol.constants.CommandClass;
import org.kubi.KubiView;
import org.kevoree.log.Log;
import org.kubi.*;

/**
 * Created by gregory.nain on 20/02/15.
 */
public class FunctionsFactory {

    public static void addFunctionFunction(Device dev, CommandClass cc, ZWaveKey key) {
        int ccIndex = cc.getByteValue();
        if (ccIndex == CommandClass.SWITCH_BINARY.getByteValue()) {
            addSwitchBinaryFunction(dev, key);
        } else if (ccIndex == CommandClass.SENSOR_MULTILEVEL.getByteValue()) {
            addSensorMultiLevel(dev, key);
        } else {
            Log.debug("No function factory for CommandClass:" + cc.getName());
        }
    }

    public static void addSensorMultiLevel(Device dev, ZWaveKey key) {
        KubiView factory = dev.view();
        StateParameter multiLevelSensorState = factory.createStateParameter();
        multiLevelSensorState.setName(CommandClass.SENSOR_MULTILEVEL.getName());
        multiLevelSensorState.setValueType("float");
        multiLevelSensorState.setPrecision(0.1f);
        multiLevelSensorState.setUnit("kW");
        dev.addStateParameters(multiLevelSensorState);
    }


    public static void addSwitchBinaryFunction(Device dev, ZWaveKey key) {
        KubiView kv = dev.view();
        ActionParameter onOffState = kv.createActionParameter();
        onOffState.setName(CommandClass.SWITCH_BINARY.getName());
        onOffState.setValueType("boolean");
        onOffState.setRange("[false,true]");
        dev.addActionParameters(onOffState);
    }


}
