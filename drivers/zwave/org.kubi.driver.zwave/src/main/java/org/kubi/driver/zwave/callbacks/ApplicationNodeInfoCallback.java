package org.kubi.driver.zwave.callbacks;

import lu.snt.zwave.protocol.command.ZWControlCommandWithResult;
import lu.snt.zwave.protocol.command.ZWaveFactories;
import lu.snt.zwave.protocol.constants.CommandClass;
import lu.snt.zwave.protocol.messages.app_command.ManufacturerSpecificCommandClass;
import lu.snt.zwave.protocol.messages.zw_common.ZW_ApplicationNodeInformation;
import lu.snt.zwave.utils.ZWCallback;
import org.kubi.KubiUniverse;
import org.kubi.KubiView;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.driver.zwave.FunctionsFactory;
import org.kubi.driver.zwave.KeyHandler;
import org.kubi.driver.zwave.StandardCallback;
import org.kubi.zwave.*;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Created by gregory.nain on 06/03/15.
 */
public class ApplicationNodeInfoCallback implements ZWCallback<ZW_ApplicationNodeInformation> {

    private KeyHandler _keyHandler;
    private InetAddress IP= null;

    public ApplicationNodeInfoCallback(final KeyHandler handler) {
        this._keyHandler = handler;
        try {
            IP = InetAddress.getLocalHost();
            Log.trace("HostAddress::" + IP.getHostAddress());
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }

    public void on(ZW_ApplicationNodeInformation zw_applicationNodeInformation) {
        if(zw_applicationNodeInformation.getNodeId() != 0) {
            Log.trace("Application Node INFO: " + zw_applicationNodeInformation.toString());
            final KubiUniverse universe = _keyHandler.getModel().universe(0);
            final KubiView factory = universe.time(System.currentTimeMillis());

            factory.select("/").then(new Callback<KObject[]>() {
                public void on(KObject[] kObjects) {
                    final Ecosystem kubiEcosystem = (Ecosystem) kObjects[0];
                    kubiEcosystem.select("technologies[name=" + KeyHandler.TECHNOLOGY + "]").then(new Callback<KObject[]>() {
                        @Override
                        public void on(KObject[] kObjects) {
                            final Technology techno = (Technology) kObjects[0];
                            techno.select("devices[id=" + _keyHandler.getHomeId() + "_" + zw_applicationNodeInformation.getNodeId() + "]").then(new Callback<KObject[]>() {
                                @Override
                                public void on(KObject[] kObjects) {
                                    Device dev = null;
                                    if (kObjects.length == 0) {
                                        Log.debug("Adding Device id:" + zw_applicationNodeInformation.getNodeId());
                                        dev = factory.createDevice().setId("" + _keyHandler.getHomeId() + "_" + zw_applicationNodeInformation.getNodeId()).setTechnology(techno);

                                        ZWControlCommandWithResult<ManufacturerSpecificCommandClass> manufacturerSpecificCommand = ZWaveFactories.control().manufacturerSpecificInfoGet(zw_applicationNodeInformation.getNodeId());
                                        final Device finalDev = dev;
                                        manufacturerSpecificCommand.onResult(new ZWCallback<ManufacturerSpecificCommandClass>() {
                                            @Override
                                            public void on(ManufacturerSpecificCommandClass deviceDetails) {
                                                if (deviceDetails != null) {

                                                    /*
                                                    final ZWaveProductsStoreView zWaveProductStore = _keyHandler.getZwaveStorel().universe(0).time(0);
                                                    zWaveProductStore.select("/manufacturers[id=" + Integer.parseInt(deviceDetails.getManufacturer(), 16) + "]").then(new Callback<KObject[]>() {
                                                        public void on(KObject[] kObjects) {
                                                            if (kObjects != null && kObjects.length > 0) {
                                                                Manufacturer manufacturer = (Manufacturer) kObjects[0];
                                                                manufacturer.select("products[id=" + Integer.parseInt(deviceDetails.getProductId(), 16) + ",type=" + Integer.parseInt(deviceDetails.getProductType(), 16) + "]").then(new Callback<KObject[]>() {
                                                                    public void on(KObject[] kObjects) {
                                                                        if (kObjects != null && kObjects.length > 0) {
                                                                            Product product = (Product) kObjects[0];
                                                                            Log.trace("Prod:: {}({}) - {}({})", manufacturer.getName(), deviceDetails.getManufacturer(), product.getName(), deviceDetails.getProductType() + deviceDetails.getProductId());
                                                                            finalDev.setManufacturer(manufacturer.getName());
                                                                            finalDev.setName(product.getName());
                                                                            finalDev.setPicture("http://" + IP.getHostAddress() + ":8283/img/" + deviceDetails.getManufacturer() + "/" + deviceDetails.getProductType() + deviceDetails.getProductId() + ".png");
                                                                            _keyHandler.getModel().save().then(StandardCallback.DISPLAY_ERROR);
                                                                        } else {
                                                                            Log.warn("ZWave Product not found for id:{}", deviceDetails.getProductId());
                                                                        }
                                                                    }
                                                                });
                                                            } else {
                                                                Log.warn("ZWave Manufacturer not found for id:{}", deviceDetails.getManufacturer());
                                                            }
                                                        }
                                                    });
                                                    */
                                                }
                                            }
                                        });
                                        _keyHandler.getKey().submitCommand(manufacturerSpecificCommand);


                                        //adds functions to the model per CommandClass
                                        for (CommandClass cc : zw_applicationNodeInformation.getCommandClasses()) {
                                            FunctionsFactory.addFunctionFunction(dev, cc, _keyHandler.getKey());
                                        }

                                        kubiEcosystem.addDevices(dev);
                                    } else {
                                        dev = (Device) kObjects[0];
                                    }
                                    _keyHandler.getModel().save().then(StandardCallback.DISPLAY_ERROR);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}
