package org.kubi.plugins.zwave;

import lu.snt.zwave.driver.ZWaveKey;
import lu.snt.zwave.driver.ZWaveState;
import lu.snt.zwave.driver.ZWaveStateListener;
import lu.snt.zwave.protocol.command.ZWAdminCommand;
import lu.snt.zwave.protocol.command.ZWaveFactories;
import lu.snt.zwave.protocol.messages.app_command.MultilevelSensorCommandClass;
import lu.snt.zwave.protocol.messages.app_command.SwitchBinaryCommandClass;
import lu.snt.zwave.protocol.messages.serial.Serial_GetInitData;
import lu.snt.zwave.protocol.messages.zw_common.ZW_ApplicationCommandHandler;
import lu.snt.zwave.protocol.messages.zw_controller.ZW_RequestNodeInfo;
import lu.snt.zwave.utils.ZWCallback;
import org.kubi.KubiModel;
import org.kubi.KubiUniverse;
import org.kubi.KubiView;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.StateParameter;
import org.kubi.plugins.zwave.callbacks.ApplicationNodeInfoCallback;
import org.kubi.plugins.zwave.tasks.UpdateGatewayTask;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by gregory.nain on 18/02/15.
 */
public class StickHandler {

    private ZWaveKey _key;
    private ExecutorService executor = Executors.newSingleThreadExecutor();

    public void set_homeId(String _homeId) {
        this._homeId = _homeId;
    }

    private String _homeId;
    private KubiModel kubiModel;
    //private ZWaveProductsStoreModel productStore;

    public String homeId() {
        return _homeId;
    }

    public StickHandler(ZWaveKey key, KubiModel kubiModel, StickPhysMapper mapper) {
        this._key = key;
        this.kubiModel = kubiModel;
        // this.productStore = productStore;
        _key.registerApplicationNodeInformationCallback(new ApplicationNodeInfoCallback(this));
        _key.registerApplicationCommandCallback(applicationCommandCallback);
        _key.addZWaveStateListener(new ZWaveStateListener() {
            public void stateChanged(ZWaveState zWaveState) {
                if (zWaveState == ZWaveState.READY) {
                    executor.execute(new UpdateGatewayTask(StickHandler.this, mapper));
                }
            }
        });
        _key.connect();
        Log.info("ZWave connection ready.");
    }

    public void stop() {
        _key.disconnect();
    }

    public ZWaveKey getKey() {
        return _key;
    }

    public KubiModel getModel() {
        return kubiModel;
    }

    public void discoverDevices() {
        executor.submit(launchDiscovery);
    }

    //TODO, maybe do it periodically
    private Runnable launchDiscovery = new Runnable() {
        @Override
        public void run() {
            ZWAdminCommand<Serial_GetInitData> getInitialDataCommand = ZWaveFactories.admin().serialApiGetInitData();
            getInitialDataCommand.onControllerResponse(new ZWCallback<Serial_GetInitData>() {
                @Override
                public void on(Serial_GetInitData initialData) {
                    for (int nodeId : initialData.getNodeLlist()) {
                        if (nodeId != 0 && nodeId != 1) {
                            ZWAdminCommand<ZW_RequestNodeInfo> deviceInformationRequest = ZWaveFactories.admin().zwRequestNodeInfo(nodeId);
                            deviceInformationRequest.onControllerResponse(new ZWCallback<ZW_RequestNodeInfo>() {
                                public void on(ZW_RequestNodeInfo zw_requestNodeInfo) {
                                    if (!zw_requestNodeInfo.hasBeenTransmitted()) {
                                        try {
                                            Thread.sleep(100 + (50 * nodeId));
                                            _key.submitCommand(deviceInformationRequest);
                                        } catch (InterruptedException e) {
                                            e.printStackTrace();
                                        }
                                    }
                                }
                            });
                            _key.submitCommand(deviceInformationRequest);
                        }
                    }
                }
            });
            _key.submitCommand(getInitialDataCommand);
        }
    };

    private ZWCallback<ZW_ApplicationCommandHandler> applicationCommandCallback = new ZWCallback<ZW_ApplicationCommandHandler>() {
        @Override
        public void on(ZW_ApplicationCommandHandler zw_applicationCommandHandler) {
            final KubiUniverse universe = kubiModel.universe(0);
            final KubiView factory = universe.time(System.currentTimeMillis());
            Log.info(zw_applicationCommandHandler.toString());
            if (zw_applicationCommandHandler instanceof MultilevelSensorCommandClass) {
                MultilevelSensorCommandClass valueUpdate = (MultilevelSensorCommandClass) zw_applicationCommandHandler;
                float kW = (float) (valueUpdate.getValue() / 3412.142);
                factory.select("/technologies[name=" + ZWavePlugin.TECHNOLOGY + "]/devices[id=" + _homeId + "_" + valueUpdate.getSourceNode() + "]/stateParameters[name=" + zw_applicationCommandHandler.getCommandClass().getName() + "]").then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if (kObjects != null && kObjects.length > 0) {
                            StateParameter param = (StateParameter) kObjects[0];
                            Log.trace("Parameter Resolved: {}", param);
                            param.setValue("" + kW);
                            kubiModel.save().then(StandardCallback.DISPLAY_ERROR);
                        }
                    }
                });
            } else if (zw_applicationCommandHandler instanceof SwitchBinaryCommandClass) {
                SwitchBinaryCommandClass valueUpdate = (SwitchBinaryCommandClass) zw_applicationCommandHandler;
                factory.select("/technologies[name=" + ZWavePlugin.TECHNOLOGY + "]/devices[id=" + _homeId + "_" + valueUpdate.getSourceNode() + "]/actionParameters[name=" + zw_applicationCommandHandler.getCommandClass().getName() + "]").then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if (kObjects != null && kObjects.length > 0) {
                            StateParameter param = (StateParameter) kObjects[0];
                            param.setValue(Boolean.toString(valueUpdate.isOn()));
                            kubiModel.save().then(StandardCallback.DISPLAY_ERROR);
                        }
                    }
                });
            }
        }
    };


}
