package org.kubi.driver.zwave;

import com.eclipsesource.json.JsonObject;
import lu.snt.zwave.driver.ZWaveKey;
import lu.snt.zwave.protocol.command.ZWControlCommandWithResult;
import lu.snt.zwave.protocol.command.ZWaveFactories;
import lu.snt.zwave.protocol.constants.CommandClass;
import lu.snt.zwave.protocol.messages.app_command.SwitchBinaryCommandClass;
import lu.snt.zwave.utils.ZWCallback;
import org.kubi.KubiModel;
import org.kubi.KubiView;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kevoree.modeling.api.KOperation;
import org.kubi.*;
import org.kubi.meta.MetaFunction;

/**
 * Created by gregory.nain on 20/02/15.
 */
public class FunctionsFactory {

    public static void addFunctionFunction(Device dev, CommandClass cc, ZWaveKey key) {
        int ccIndex = cc.getByteValue();
        if(ccIndex == CommandClass.SWITCH_BINARY.getByteValue() ) {
            addSwitchBinaryFunction(dev, key);
        } else if(ccIndex == CommandClass.SENSOR_MULTILEVEL.getByteValue() ) {
            addSensorMultiLevel(dev, key);
        } else {
            Log.debug("No function factory for CommandClass:" + cc.getName());
        }
    }

    public static void addSensorMultiLevel(Device dev, ZWaveKey key) {
        KubiView factory = dev.view();
        Parameter multiLevelSensorState = factory.createParameter();
        multiLevelSensorState.setName(CommandClass.SENSOR_MULTILEVEL.getName());
        multiLevelSensorState.setValueType("float");
        multiLevelSensorState.setPrecision(0.1f);
        multiLevelSensorState.setUnit("kW");
        dev.addParameters(multiLevelSensorState);
    }


    public static void addSwitchBinaryFunction(Device dev,  ZWaveKey key) {
        KubiView kv = dev.view();

        //add a parameter to the device
        Parameter onOffState = kv.createParameter();
        onOffState.setName(CommandClass.SWITCH_BINARY.getName());
        onOffState.setValueType("boolean");
        onOffState.setRange("[false,true]");
        dev.addParameters(onOffState);

        //create the function instance
        Function switchBinary = kv.createFunction();
        switchBinary.setName("Simple Switch");
        dev.addFunctions(switchBinary);

        //add a input parameter to the function
        Parameter switchState = kv.createParameter();
        switchState.setName("state");
        switchState.setValueType("boolean");
        switchState.setRange("[false,true]");
        switchBinary.addParameters(switchState);

        //Registers the callback for this function
        KubiModel km = kv.universe().model();
        km.setInstanceOperation(MetaFunction.OP_EXEC, switchBinary, new KOperation() {
            @Override
            public void on(KObject kObject, Object[] objects, Callback<Object> callback) {

                Function func = ((Function) kObject);
                func.getDevice().then(new Callback<Device>() {
                    public void on(Device device) {

                        //Reads the Parameter : 1 string, must be a JSON string with named parameters
                        JsonObject param = JsonObject.readFrom((String) objects[0]);
                        //Submits the ZWave SET command
                        String nodeId = device.getId();
                        nodeId = nodeId.substring(nodeId.lastIndexOf("_") + 1);
                        int zwNodeId = Integer.valueOf(nodeId);
                        key.submitCommand(ZWaveFactories.control().switchBinarySet(zwNodeId, param.get("state").asBoolean()));
                        //Submits a GET command to refresh the switch state
                        ZWControlCommandWithResult<SwitchBinaryCommandClass> getStateCommand = ZWaveFactories.control().switchBinaryGet(zwNodeId);
                        getStateCommand.onResult(new ZWCallback<SwitchBinaryCommandClass>() {
                            public void on(SwitchBinaryCommandClass switchBinaryCommandClass) {

                                //jumps the device to the time the answer is received
                                device.jump(System.currentTimeMillis()).then(new Callback<KObject>() {
                                    public void on(KObject deviceNow) {

                                        //select the device parameter
                                        deviceNow.select("parameters[name=" + switchBinaryCommandClass.getCommandClass().getName() + "]").then(new Callback<KObject[]>() {
                                            @Override
                                            public void on(KObject[] kObjects) {
                                                if (kObjects != null && kObjects.length > 0) {

                                                    //sets the parameter value
                                                    Parameter param = (Parameter) kObjects[0];
                                                    param.setValue(Boolean.toString(switchBinaryCommandClass.isOn()));

                                                    param.universe().model().save().then(new Callback<Throwable>() {
                                                        @Override
                                                        public void on(Throwable throwable) {
                                                            if (throwable != null) {
                                                                throwable.printStackTrace();
                                                            }
                                                        }
                                                    });
                                                    if (callback != null) {
                                                        callback.on(Boolean.toString(switchBinaryCommandClass.isOn()));
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        key.submitCommand(getStateCommand);
                    }
                });
            }
        });


    }


}
