package org.kubi.plugins.zwave.tasks;

import lu.snt.zwave.protocol.command.ZWAdminCommand;
import lu.snt.zwave.protocol.command.ZWaveFactories;
import lu.snt.zwave.protocol.messages.serial.Serial_GetApiCapabilities;
import lu.snt.zwave.protocol.messages.zw_memory.ZW_MemoryGetId;
import lu.snt.zwave.utils.ZWCallback;
import org.kubi.*;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.plugins.zwave.StickHandler;
import org.kubi.plugins.zwave.StickPhysMapper;
import org.kubi.plugins.zwave.ZWavePlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaTechnology;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Created by gregory.nain on 06/03/15.
 */
public class UpdateGatewayTask implements Runnable {

    private StickHandler _stickHandler;
    private InetAddress IP = null;
    private StickPhysMapper mapper;

    public UpdateGatewayTask(StickHandler stickHandler, StickPhysMapper mapper) {
        this._stickHandler = stickHandler;
        this.mapper = mapper;
        try {
            IP = InetAddress.getLocalHost();
            Log.trace("HostAddress::" + IP.getHostAddress());
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void run() {
        Log.trace("Submitting getControllerId");
        ZWAdminCommand<ZW_MemoryGetId> getIdCommand = ZWaveFactories.admin().zwMemoryGetId();
        getIdCommand.onControllerResponse(new ZWCallback<ZW_MemoryGetId>() {
            public void on(ZW_MemoryGetId controllerId) {

                Log.trace("Submitting getApiCapabilityCommand");
                ZWAdminCommand<Serial_GetApiCapabilities> apiCapabilitiesCommand = ZWaveFactories.admin().serialApiGetCapabilities();
                apiCapabilitiesCommand.onControllerResponse(new ZWCallback<Serial_GetApiCapabilities>() {
                    @Override
                    public void on(Serial_GetApiCapabilities apiCapabilities) {
                        final KubiUniverse universe = _stickHandler.getModel().universe(0);
                        final KubiView factory = universe.time(System.currentTimeMillis());

                        /*
                        String manuStringId = String.format("%02x%02x", apiCapabilities.getManufacturerId_msb(), apiCapabilities.getManufacturerId_lsb());
                        String productStringId = String.format("%02x%02x", apiCapabilities.getProductId_msb(), apiCapabilities.getProductId_lsb());
                        String productStringType = String.format("%02x%02x", apiCapabilities.getProductType_msb(), apiCapabilities.getProductType_lsb());
*/
                        /*
                        int manufacturerId = Integer.parseInt(manuStringId, 16);
                        int productId = Integer.parseInt(productStringId, 16);
                        int productType = Integer.parseInt(productStringType, 16);
                        */

                        factory.select("/").then(new Callback<KObject[]>() {
                            public void on(KObject[] kObjects) {
                                final Ecosystem kubiEcosystem = (Ecosystem) kObjects[0];
                                kubiEcosystem.select("technologies[name=" + ZWavePlugin.TECHNOLOGY + "]").then(new Callback<KObject[]>() {
                                    @Override
                                    public void on(KObject[] kObjects) {
                                        final Technology techno = (Technology) kObjects[0];
                                        techno.traversal().traverse(MetaTechnology.REF_DEVICES).withAttribute(MetaDevice.ATT_ID, controllerId.getHomeId() + "_" + controllerId.getNodeId()).done().then(new Callback<KObject[]>() {
                                            public void on(KObject[] kObjects) {
                                                if (kObjects.length == 0) {
                                                    Log.debug("Adding ZWave Controller:{}", controllerId.getHomeId() + "_" + controllerId.getNodeId());
                                                    Device controller = factory.createDevice();
                                                    controller.setId("" + controllerId.getHomeId() + "_" + controllerId.getNodeId());
                                                    techno.addDevices(controller);

                                                    mapper.set(controllerId.getHomeId() + "", _stickHandler);
                                                    _stickHandler.set_homeId(controllerId.getHomeId()+"");
                                                    _stickHandler.discoverDevices();
                                                    _stickHandler.getModel().save().then(new Callback<Throwable>() {
                                                        @Override
                                                        public void on(Throwable throwable) {
                                                            if (throwable != null) {
                                                                Log.error("", throwable);
                                                            }
                                                        }
                                                    });

                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                _stickHandler.getKey().submitCommand(apiCapabilitiesCommand);
            }
        });
        _stickHandler.getKey().submitCommand(getIdCommand);
    }

}
