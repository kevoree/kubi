package org.kubi.driver.zwave.tasks;

import lu.snt.zwave.protocol.command.ZWAdminCommand;
import lu.snt.zwave.protocol.command.ZWaveFactories;
import lu.snt.zwave.protocol.messages.serial.Serial_GetApiCapabilities;
import lu.snt.zwave.protocol.messages.zw_memory.ZW_MemoryGetId;
import lu.snt.zwave.utils.ZWCallback;
import org.kubi.KubiUniverse;
import org.kubi.KubiView;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.driver.zwave.StickHandler;
import org.kubi.driver.zwave.ZWavePlugin;
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

    public UpdateGatewayTask(StickHandler stickHandler) {
        this._stickHandler = stickHandler;
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

                        String manuStringId = String.format("%02x%02x", apiCapabilities.getManufacturerId_msb(), apiCapabilities.getManufacturerId_lsb());
                        String productStringId = String.format("%02x%02x", apiCapabilities.getProductId_msb(), apiCapabilities.getProductId_lsb());
                        String productStringType = String.format("%02x%02x", apiCapabilities.getProductType_msb(), apiCapabilities.getProductType_lsb());

                        int manufacturerId = Integer.parseInt(manuStringId, 16);
                        int productId = Integer.parseInt(productStringId, 16);
                        int productType = Integer.parseInt(productStringType, 16);


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
                                                    _stickHandler.setHomeId("" + controllerId.getHomeId());

                                                    /*
                                                    final ZWaveProductsStoreView zWaveProductStore = _keyHandler.getZwaveStorel().universe(0).time(0);
                                                    zWaveProductStore.select("/manufacturers[id=" + manufacturerId + "]").then(new Callback<KObject[]>() {
                                                        public void on(KObject[] kObjects) {
                                                            if (kObjects != null && kObjects.length > 0) {
                                                                Manufacturer manufacturer = (Manufacturer) kObjects[0];
                                                                Log.trace("Controller Manufacturer found:" + manufacturer.getName());
                                                                manufacturer.traversal().traverse(MetaManufacturer.REF_PRODUCTS).withAttribute(MetaProduct.ATT_ID, productId).withAttribute(MetaProduct.ATT_TYPE, productType).done().then(new Callback<KObject[]>() {
                                                                    public void on(KObject[] kObjects) {
                                                                        if (kObjects != null && kObjects.length > 0) {
                                                                            Product product = (Product) kObjects[0];
                                                                            controller.setManufacturer(manufacturer.getName());
                                                                            controller.setName(product.getName());
                                                                            controller.setPicture("http://" + IP.getHostAddress() + ":8283/img/" + manuStringId + "/" + productStringType + productStringId + ".png");
                                                                            Log.trace("Controller:: {}({}) - {}({})", manufacturer.getName(), manuStringId, product.getName(), productStringType + productStringId);
                                                                            _keyHandler.getModel().save().then(new Callback<Throwable>() {
                                                                                @Override
                                                                                public void on(Throwable throwable) {
                                                                                    if (throwable != null) {
                                                                                        Log.error("", throwable);
                                                                                    }
                                                                                }
                                                                            });
                                                                        } else {
                                                                            Log.warn("ZWave Product not found for id:{}", productId);
                                                                        }
                                                                    }
                                                                });
                                                            } else {
                                                                Log.warn("ZWave Manufacturer not found for id:{}", manufacturerId);
                                                            }
                                                        }
                                                    });
                                                    */
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
