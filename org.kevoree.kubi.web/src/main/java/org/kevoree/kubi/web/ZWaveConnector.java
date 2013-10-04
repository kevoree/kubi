package org.kevoree.kubi.web;/*
* Author : Gregory Nain (developer.name@uni.lu)
* Date : 04/10/13
*/

import lu.snt.helios.extra.zwave.driver.ZWaveManager;
import lu.snt.helios.extra.zwave.driver.core.messages.Message;
import lu.snt.helios.extra.zwave.driver.core.messages.MessageListener;
import lu.snt.helios.extra.zwave.driver.core.messages.RequestFactory;
import lu.snt.helios.extra.zwave.driver.core.messages.commands.CommandClass;
import lu.snt.helios.extra.zwave.driver.core.messages.serial.Serial_GetApiCapabilities;
import lu.snt.helios.extra.zwave.driver.config.Manufacturer;
import lu.snt.helios.extra.zwave.driver.config.Manufacturers;
import lu.snt.helios.extra.zwave.driver.config.Product;

import lu.snt.helios.extra.zwave.driver.core.messages.serial.Serial_GetInitData;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_common.ZW_ApplicationNodeInformation;
import lu.snt.helios.extra.zwave.driver.utils.ByteEnum;
import org.kevoree.kubi.*;
import org.kevoree.kubi.impl.DefaultKubiFactory;
import org.kevoree.log.Log;

public class ZWaveConnector {

    private WebSocketServerHandler webSocketHandler;
    private ZWaveManager manager;
    private KubiFactory factory = new DefaultKubiFactory();

    public WebSocketServerHandler getWebSocketHandler() {
        return webSocketHandler;
    }

    public void setWebSocketHandler(WebSocketServerHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }


    public void start() {
        String aeonLabsKeyPort = "serial:///dev/tty.SLAB_USBtoUART";
        Log.info("Initiating Z-Wave Manager to " + aeonLabsKeyPort);
        manager = new ZWaveManager(aeonLabsKeyPort);
        manager.open();
        Log.info("ZWave connection ready.");
    }


    public void init() {

        Log.info("Collecting the SerialAPICapabilities");
        Serial_GetApiCapabilities response = (Serial_GetApiCapabilities) manager.sendMessageAndWaitResponse(RequestFactory.serialApiGetCapabilities()); // Capabilities of the API

        Log.debug("Received" + response.toString());

        final KubiModel model = webSocketHandler.getModel();

        final Node controler = factory.createNode();
        Manufacturer manufacturer = Manufacturers.getManufacturer(response.getManufacturerId_msb(), response.getManufacturerId_lsb());
        Product product = manufacturer.getProduct(String.format("%02x%02x", response.getProductType_msb(), response.getProductType_lsb()), String.format("%02x%02x", response.getProductId_msb(), response.getProductId_lsb()));

        controler.setBrand(manufacturer.getName());
        controler.setId("gw_" + product.getName());

        model.addNodes(controler);


        MessageListener lst = new MessageListener() {
            public void messageReceived(Message msg) {
                if(msg instanceof ZW_ApplicationNodeInformation) {
                    ZW_ApplicationNodeInformation nodeInfos = (ZW_ApplicationNodeInformation)msg;
                    if(nodeInfos.hasRequestSucceeded()) {
                        Log.info("[Message Listener] Information updated for node " + nodeInfos.getNodeId());
                        Log.info("[Message Listener] List of Commands for node " + nodeInfos.getNodeId() + ": " + String.format("%s", nodeInfos.getCommandClasses()));

                        Node n = factory.createNode();
                        n.setId("" + nodeInfos.getNodeId());
                        for(CommandClass cc : nodeInfos.getCommandClasses()) {
                            for(ByteEnum function : cc.getFunctionEnum().getEnumConstants()) {
                                Function f = factory.createFunction();
                                f.setName(cc.toString() + "_" + function.toString());
                                model.addFuntions(f);
                                Service s = factory.createService();
                                s.setFunction(f);
                                n.addServices(s);
                            }
                        }
                        controler.addLinks(n);
                        model.addNodes(n);
                    }
                }
            }
        };
        manager.addMessageListener(lst);

        Log.info("Collecting the Initial Data of the Z-Wave Network");
        Serial_GetInitData response2 = (Serial_GetInitData)manager.sendMessageAndWaitResponse(RequestFactory.serialApiGetInitData());
        for(int nodeId : response2.getNodeLlist()) {
            if(nodeId != 0 && nodeId != 1&& nodeId != 2)
            manager.sendMessageAndWaitResponse(RequestFactory.zwRequestNodeInfo(nodeId));
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }



        /*
        for (int i = 0; i < 2; i++) {

            gw.setId("gw_" + i);
            model.addNodes(gw);
            for (int j = 0; j < 5; j++) {
                Node devices = factory.createNode();
                devices.setId("devices_" + i + "_" + j);
                model.addNodes(devices);
                gw.addLinks(devices);
            }
        }

*/
    }


    public void stop() {
        Log.info("ZWave connection closing");
        manager.stop();
        Log.info("ZWave connection closed.");
    }























































}
