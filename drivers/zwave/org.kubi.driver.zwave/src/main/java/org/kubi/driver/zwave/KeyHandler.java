package org.kubi.driver.zwave;

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
import org.kubi.*;
import org.kubi.driver.zwave.callbacks.ApplicationNodeInfoCallback;
import org.kubi.driver.zwave.tasks.UpdateGatewayTask;
import org.kubi.zwave.ZWaveProductsStoreModel;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by gregory.nain on 18/02/15.
 */
public class KeyHandler {

    public static final String TECHNOLOGY = "ZWave";

    private ZWaveKey _key;
    private ExecutorService executor = Executors.newSingleThreadExecutor();
    private String _homeId;
    private KubiModel kubiModel;
    private ZWaveProductsStoreModel productStore;

    public KeyHandler(ZWaveKey key, KubiModel kubiModel, ZWaveProductsStoreModel productStore) {
        this._key = key;
        this.kubiModel = kubiModel;
        this.productStore = productStore;

        checkOrAddTechnology();

        _key.registerApplicationNodeInformationCallback(new ApplicationNodeInfoCallback(this));
        _key.registerApplicationCommandCallback(applicationCommandCallback);
        _key.addZWaveStateListener(new ZWaveStateListener() {
            public void stateChanged(ZWaveState zWaveState) {
                if (zWaveState == ZWaveState.READY) {
                    executor.execute(new UpdateGatewayTask(KeyHandler.this));
                }
            }
        });
        _key.connect();
        Log.info("ZWave connection ready.");
    }

    public void stop() {
        _key.disconnect();
    }


    public void setHomeId(String homeId) {
        this._homeId = homeId;
        executor.execute(launchDiscovery);
    }

    public String getHomeId() {
        return _homeId;
    }

    public ZWaveKey getKey() {
        return _key;
    }

    public KubiModel getModel() {
        return kubiModel;
    }

    public ZWaveProductsStoreModel getZwaveStorel() {
        return productStore;
    }

    private void checkOrAddTechnology() {
        final KubiUniverse universe = kubiModel.universe(0);
        final KubiView factory = universe.time(0);
        factory.select("/technologies[name=" + TECHNOLOGY + "]").then(new Callback<KObject[]>() {
            public void on(KObject[] kObjects) {
                if (kObjects.length == 0) {
                    factory.select("/").then(new Callback<KObject[]>() {
                        public void on(KObject[] kObjects) {
                            Log.trace("Adding Technology ZWave");
                            Ecosystem kubiEcosystem = (Ecosystem) kObjects[0];
                            kubiEcosystem.addTechnologies(factory.createTechnology().setName(TECHNOLOGY));
                            kubiModel.save().then(StandardCallback.DISPLAY_ERROR);
                        }
                    });
                }
            }
        });
    }


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
                factory.select("/technologies[name=" + TECHNOLOGY + "]/devices[id=" + valueUpdate.getSourceNode() + "]/parameters[name=" + zw_applicationCommandHandler.getCommandClass().getName() + "]").then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if (kObjects != null && kObjects.length > 0) {
                            Parameter param = (Parameter) kObjects[0];
                            //Log.trace("Parameter Resolved: {}", param);
                            param.setValue("" + kW);
                            kubiModel.save().then(StandardCallback.DISPLAY_ERROR);
                        }
                    }
                });
            } else if (zw_applicationCommandHandler instanceof SwitchBinaryCommandClass) {
                SwitchBinaryCommandClass valueUpdate = (SwitchBinaryCommandClass) zw_applicationCommandHandler;
                factory.select("/technologies[name=" + TECHNOLOGY + "]/devices[id=" + valueUpdate.getSourceNode() + "]/parameters[name=" + zw_applicationCommandHandler.getCommandClass().getName() + "]").then(new Callback<KObject[]>() {
                    @Override
                    public void on(KObject[] kObjects) {
                        if (kObjects != null && kObjects.length > 0) {
                            Parameter param = (Parameter) kObjects[0];
                            param.setValue(Boolean.toString(valueUpdate.isOn()));
                            kubiModel.save().then(StandardCallback.DISPLAY_ERROR);
                        }
                    }
                });
            }
        }
    };


}
