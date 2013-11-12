package org.kevoree.kubi.web;/*
* Author : Gregory Nain (developer.name@uni.lu)
* Date : 04/10/13
*/

import lu.snt.helios.extra.zwave.driver.AbstractZwaveEnum;
import lu.snt.helios.extra.zwave.driver.ZWaveManager;
import lu.snt.helios.extra.zwave.driver.core.CommandClass;
import lu.snt.helios.extra.zwave.driver.core.messages.Message;
import lu.snt.helios.extra.zwave.driver.core.messages.MessageListener;
import lu.snt.helios.extra.zwave.driver.core.messages.RequestFactory;
import lu.snt.helios.extra.zwave.driver.core.messages.commands.AssociationCommandClass;
import lu.snt.helios.extra.zwave.driver.core.messages.commands.ManufacturerSpecificCommandClass;
import lu.snt.helios.extra.zwave.driver.core.messages.commands.SwitchBinaryCommandClass;
import lu.snt.helios.extra.zwave.driver.core.messages.commands.ZWCommand;
import lu.snt.helios.extra.zwave.driver.core.messages.serial.Serial_GetApiCapabilities;

import lu.snt.helios.extra.zwave.driver.core.messages.serial.Serial_GetInitData;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_common.ZW_ApplicationCommandHandler;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_common.ZW_ApplicationNodeInformation;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_controller.ZW_AddNodeToNetwork;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_controller.ZW_RemoveNodeFromNetwork;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_memory.ZW_MemoryGetId;
import lu.snt.helios.extra.zwave.driver.transport.Callback;
import org.json.*;
import org.kevoree.kubi.*;
import org.kevoree.kubi.impl.DefaultKubiFactory;
import org.kevoree.kubi.store.Manufacturer;
import org.kevoree.kubi.store.Product;
import org.kevoree.log.Log;
import java.util.ArrayList;

public class ZWaveConnector {

    private WebSocketServerHandler webSocketHandler;
    private ZWaveManager manager;
    private KubiFactory factory = new DefaultKubiFactory();
    private Technology zWave;
    private Node controller;
    //private KubiModel currentModel = factory.createKubiModel();

    private ZWaveConnector(){}

    public ZWaveConnector(WebSocketServerHandler webSocket) {
        this.webSocketHandler = webSocket;
        zWave = factory.createTechnology();
        zWave.setName("Z-Wave");
        webSocket.getModel().addTechnologies(zWave);
    }


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
        //manager.setLogLevel(Log.LEVEL_TRACE);
        manager.open();
        Log.info("ZWave connection ready.");
    }


    public void init() {

        Log.info("Collecting the SerialAPICapabilities");
        Serial_GetApiCapabilities response = (Serial_GetApiCapabilities) manager.sendMessageAndWaitResponse(RequestFactory.serialApiGetCapabilities()); // Capabilities of the API
        Log.debug("Received " + response.toString());

        Log.trace("[START]Collecting HomeID and NodeID");
        ZW_MemoryGetId idsResponse = (ZW_MemoryGetId)manager.sendMessageAndWaitResponse(RequestFactory.zwMemoryGetId()); // HomeId and NodeId of the serial gateway
        Log.trace("[STOP]Collecting HomeID and NodeID");

        final KubiModel model = webSocketHandler.getModel();
        controller = factory.createGateway();

        Manufacturer manufacturer = ProductsStoreManager.getInstance().getManufacturerById(String.format("%02x%02x", response.getManufacturerId_msb(), response.getManufacturerId_lsb()));
        Product product = ProductsStoreManager.getInstance().getProductById(manufacturer, String.format("%02x%02x%02x%02x", response.getProductType_msb(), response.getProductType_lsb(), response.getProductId_msb(), response.getProductId_lsb()));


        //Manufacturer manufacturer = Manufacturers.getManufacturer(response.getManufacturerId_msb(), response.getManufacturerId_lsb());
        //Product product = manufacturer.getProduct(String.format("%02x%02x", response.getProductType_msb(), response.getProductType_lsb()), String.format("%02x%02x", response.getProductId_msb(), response.getProductId_lsb()));
        Log.trace("[START]Setting brand of controller");
        controller.setBrand(manufacturer.getName());
        Log.trace("[STOP]Setting brand of controller: " + manufacturer.getName());

        controller.setName(product.getName());

        Log.trace("[START]Setting IDs of controller");
        controller.setId("" + idsResponse.getHomeId() + ":" + idsResponse.getNodeId());
        Log.trace("[STOP]Setting IDs of controller");

        controller.setPicture(ProductsStoreManager.getInstance().getProductStoreAddress()+"/img/"+String.format("%02x%02x", response.getManufacturerId_msb(), response.getManufacturerId_lsb())+"/"+String.format("%02x%02x%02x%02x", response.getProductType_msb(), response.getProductType_lsb(), response.getProductId_msb(), response.getProductId_lsb())+".png");


        Log.trace("[START]Adding node to Kubi model");
        model.addNodes(controller);
        Log.trace("[STOP]Adding node to Kubi model");

        Log.trace("[START]Sending model to clients");
        webSocketHandler.sendModelToClients();
        Log.trace("[STOP]Sending model to clients");

        Log.debug("Controller added to model. Sending to clients.");



        MessageListener lst = new MessageListener() {
            public void messageReceived(Message msg) {
                if(msg instanceof ZW_ApplicationNodeInformation) {
                    updateNodeInformation((ZW_ApplicationNodeInformation)msg);
                } else if(msg instanceof ZW_ApplicationCommandHandler) {
                    ZW_ApplicationCommandHandler typedMessage = (ZW_ApplicationCommandHandler)msg;
                    try {

                        JSONObject content = new JSONObject();
                        content.put("technology", "Z-Wave");
                        content.put("nodeId",typedMessage.getSourceNode());
                        content.put("action",typedMessage.getCommandClass().getName() + "::" + typedMessage.getCommandFunction().getName());
                        content.put("raw",typedMessage.toString());

                        if(typedMessage instanceof SwitchBinaryCommandClass) {
                            content.put("state",((SwitchBinaryCommandClass)typedMessage).isOn());
                        }

                        webSocketHandler.sendMessageToClients(content);

                    } catch (JSONException e) {
                        e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                    }
                }
            }
        };
        manager.addMessageListener(lst);

        Log.info("Collecting the Initial Data of the Z-Wave Network");
        Serial_GetInitData response2 = (Serial_GetInitData)manager.sendMessageAndWaitResponse(RequestFactory.serialApiGetInitData());
        Log.trace("Response received to collection of initial data");
        for(int nodeId : response2.getNodeLlist()) {
            if(nodeId != 0 && nodeId != 1) {
                Log.trace("Asking NodeInfos for node:" + nodeId);
                manager.sendMessageAndWaitResponse(RequestFactory.zwRequestNodeInfo(nodeId));
                Log.trace("Response received to collection of data for node:" + nodeId);
            }
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }

    }



    private void updateNodeInformation(ZW_ApplicationNodeInformation nodeInfos) {
        if(nodeInfos.hasRequestSucceeded()) {

            final KubiModel model = webSocketHandler.getModel();

            Log.info("[Message Listener] Information updated for node " + nodeInfos.getNodeId());
            Log.info("[Message Listener] List of Commands for node " + nodeInfos.getNodeId() + ": " + String.format("%s", nodeInfos.getCommandClasses()));

            Log.debug("Looking for Product Information");
            ManufacturerSpecificCommandClass manufacturerInfos = (ManufacturerSpecificCommandClass)manager.sendMessageAndWaitResponse(RequestFactory.zwGetManufacturerSpecificInfos(nodeInfos.getNodeId()));
            Manufacturer manufacturer = ProductsStoreManager.getInstance().getManufacturerById(manufacturerInfos.getManufacturer());
            Product product = ProductsStoreManager.getInstance().getProductById(manufacturer, manufacturerInfos.getProductType() + manufacturerInfos.getProductId());

            Log.debug("Creating KubiNode");
            Node n = factory.createNode();
            n.setTechnology(zWave);
            if(manufacturer != null) {
                n.setBrand(manufacturer.getName());
            } else {
                Log.warn("No manufacturer found in Product store for id:" + manufacturerInfos.getManufacturer());
            }

            if(product != null) {
                n.setName(product.getName() + "(" + nodeInfos.getNodeId() + ")");
            } else {
                n.setName("(" + nodeInfos.getNodeId() + ")");
                Log.warn("No Product found in store for manufacturer "+manufacturerInfos.getManufacturer()+" with id:" + manufacturerInfos.getProductType() + manufacturerInfos.getProductId());
            }
            n.setId("" + nodeInfos.getNodeId());
            n.setPicture(ProductsStoreManager.getInstance().getProductStoreAddress()+"/img/"+manufacturerInfos.getManufacturer()+"/"+manufacturerInfos.getProductType() + manufacturerInfos.getProductId()+".png");

            Log.debug("Setting its Command-Class");
            for(CommandClass cc : nodeInfos.getCommandClasses()) {
                for(AbstractZwaveEnum function : cc.getFunctions()) {

                    if(!function.getName().contains("REPORT")) {

                        Function f = factory.createFunction();
                        f.setName(cc.getName() + "::" + function.getName());
                        model.addFunctions(f);
                        Service s = factory.createService();
                        s.setFunction(f);
                        n.addServices(s);

                        if(cc.getName().equals("SWITCH_BINARY") && function.getName().equals("SET")) {
                            Parameter p1 = factory.createParameter();
                            p1.setName("on");
                            p1.setValueType(ParameterTypes.BOOLEAN);
                            f.addParameters(p1);
                        } else if(cc.getName().equals("BASIC_WINDOW_COVERING") && function.getName().equals("START_LEVEL_CHANGE")) {
                            Parameter p1 = factory.createParameter();
                            p1.setName("direction");
                            p1.setValueType(ParameterTypes.LIST);
                            p1.setRange("up,down");
                            f.addParameters(p1);
                        }
                    }
                }
            }
            Log.debug("Adding Links");
            controller.addLinks(n);
            Log.debug("Adding to model");
            model.addNodes(n);
            Log.debug("Sending to clients");
            webSocketHandler.sendModelToClients();
        }
    }


    public void sendToNetwork(JSONObject msg) {

        try {

            String action = msg.getString("action");
            String actionClass = action.substring(0, action.lastIndexOf("::"));
            String function = action.substring(action.lastIndexOf("::") + 2, action.length());


            if(actionClass.equals("ADMIN")) {
                if(function.equals("START_DEVICE_ADDITION_DISCOVERY")) {

                    final Message message = RequestFactory.zwAddAnyNodeToNetwork(false);
                    boolean acknowledged = manager.sendMessageWithCallback(message, new Callback(){
                        public void messageReceived(Message m) {
                            ZW_AddNodeToNetwork addMessage = (ZW_AddNodeToNetwork)m;
                            //Log.debug(addMessage.toString());
                            switch(addMessage.getStatus()) {
                                case ADD_NODE_STATUS_DONE:
                                case ADD_NODE_STATUS_PROTOCOL_DONE:

                                    manager.removeCallback(message);
                                    Log.info("New device added. Sending Stop");
                                    boolean acknowledged = manager.sendMessageAndWaitAck(RequestFactory.zwStopAddingNodeToNetwork());
                                    Log.info("Stop Acknowledged");

                                    AssociationCommandClass response = (AssociationCommandClass)manager.sendMessageAndWaitResponse(RequestFactory.zwGetAssociationGroups(addMessage.getSourceNodeId()));
                                    Log.debug("Got grouping report. Has " + response.getNumberOfGroups() + " groups.");
                                    for(int i = response.getNumberOfGroups(); i > 0; i--) {
                                        Log.debug("Asking group details for group {} on node {}",i, addMessage.getSourceNodeId());
                                        AssociationCommandClass groupDetails = (AssociationCommandClass)manager.sendMessageAndWaitResponse(RequestFactory.zwGetAssociations(addMessage.getSourceNodeId(), i));
                                        Log.debug("Group {} details:{}",i, groupDetails);
                                        if(groupDetails.getMaxNodeSupported() == 1) {
                                            if(!groupDetails.getAssociatedNodes().contains(1)) {
                                                Log.info("Associating Controller (id:1) to group:"+ i +" of node:" + addMessage.getSourceNodeId());
                                                m = RequestFactory.zwAddAssociations(addMessage.getSourceNodeId(), i, ((byte)1 & 0xFF));
                                                manager.sendMessageAndWaitResponse(m);
                                                Log.debug("Completed");
                                            } else {
                                                Log.info("Controller already associated.");
                                            }
                                            break;
                                        }
                                    }

                                    if(acknowledged) {
                                        Log.debug("Process completed");
                                    } else {
                                        Log.debug("Could not stop the inclusion process.");
                                    }
                                    manager.sendMessageAndWaitResponse(RequestFactory.zwRequestNodeInfo(addMessage.getSourceNodeId()));
                                    break;
                                default:{
                                    Log.debug(addMessage.toString());
                                }
                            }
                        }
                    });
                    if(acknowledged) {
                        Log.debug("Ready to include new device.");
                    } else {
                        Log.debug("Inclusion of new device aborted.");
                    }

                } else if(function.equals("START_DEVICE_REMOVAL_DISCOVERY")) {

                    final Message message = RequestFactory.zwRemoveAnyNodeFromNetwork();
                    boolean acknowledged = manager.sendMessageWithCallback(message, new Callback(){
                        public void messageReceived(Message m) {
                            ZW_RemoveNodeFromNetwork removeMessage = (ZW_RemoveNodeFromNetwork)m;
                            //Log.debug(removeMessage.toString());
                            switch(removeMessage.getStatus()) {
                                case REMOVE_NODE_STATUS_DONE:
                                    manager.removeCallback(message);
                                    webSocketHandler.getModel().removeNodes(webSocketHandler.getModel().findNodesByID(""+removeMessage.getSourceNodeId()));
                                    webSocketHandler.sendModelToClients();
                                    Log.debug("Device Removed.");
                                    boolean acknowledged = manager.sendMessageAndWaitAck(RequestFactory.zwStopRemovingNodeFromNetwork());
                                    if(acknowledged) {
                                        Log.debug("Process completed");

                                    } else {
                                        Log.debug("Could not stop the removal process.");
                                    }
                                    break;
                                default:{
                                    Log.debug(removeMessage.toString());
                                }
                            }
                        }
                    });
                    if(acknowledged) {
                        Log.debug("Ready to remove device.");
                    } else {
                        Log.debug("Removal of device aborted.");
                    }
                } else if(function.equals("REMOVE_ALL_DEVICES")) {
                    final Message message = RequestFactory.zwSetDefault();
                    boolean acknowledged = manager.sendMessageWithCallback(message, new Callback(){
                        public void messageReceived(Message m) {
                            manager.removeCallback(message);
                            Log.debug("Reset completed");
                        }
                    });

                    Log.debug((acknowledged?"Factory Reset Succeeded": "Factory Reset Failed"));

                } else {
                    Log.warn("Received and ADMIN message with function:" + function + "! Dunno what to do !");
                }
            } else {


                CommandClass commandClass = CommandClass.valueOf(actionClass);

                String nodeId = msg.getString("nodeId");

                Log.debug("Have to send " + actionClass + "->" + function + " to " + nodeId);

                ZWCommand request = null;
                if(commandClass == CommandClass.SWITCH_BINARY) {
                    if(function.equals("GET")) {
                        request = new ZWCommand(Integer.valueOf(nodeId), commandClass, commandClass.getFunctionByName(function));
                        Message resp = manager.sendMessageAndWaitResponse(request);
                        Log.trace("Response received from Z-Wave:" + resp);
                        Log.debug(resp.toString());
                    } else if (function.equals("SET")) {
                        JSONArray pms = msg.getJSONArray("parameters");
                        ArrayList<Object> params = new ArrayList<Object>();

                        for(int i = 0 ; i < pms.length(); i++) {
                            JSONObject param = pms.getJSONObject(i);
                            if(param.getString("valueType").equals("BOOLEAN")) {
                                Boolean b = Boolean.valueOf(param.getString("value"));
                                params.add(b);
                            } else {
                                Log.warn("Don't know what to do for param of type " + param.getString("valueType") + " when creating the command ");
                            }
                        }
                        request = new ZWCommand(Integer.valueOf(nodeId), commandClass, commandClass.getFunctionByName(function), params.toArray());
                        manager.sendMessageAndWaitAck(request);
                    } else {
                        Log.warn("Unknown function:" + function);
                    }
                } else if(commandClass == CommandClass.BASIC_WINDOW_COVERING) {
                    if(function.equals("STOP_LEVEL_CHANGE")) {
                        request = (ZWCommand)RequestFactory.zwStopMovingBasicWindowCovering(Integer.valueOf(nodeId));
                        manager.sendMessageAndWaitAck(request);
                    } else if(function.equals("START_LEVEL_CHANGE")) {
                        JSONArray pms = msg.getJSONArray("parameters");
                        JSONObject param = pms.getJSONObject(0);
                        if(param.getString("value").equals("up")) {
                            request = (ZWCommand)RequestFactory.zwStartMovingBasicWindowCoveringUp(Integer.valueOf(nodeId));
                        } else {
                            request = (ZWCommand)RequestFactory.zwStartMovingBasicWindowCoveringDown(Integer.valueOf(nodeId));
                        }
                        manager.sendMessageAndWaitAck(request);
                    } else {
                        Log.warn("Unknown function:" + function);
                    }
                } else {
                    Log.warn("CommandClass of message received unknown: " + commandClass.toString());
                }

            }

        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

    }



    public void stop() {
        Log.info("ZWave connection closing");
        manager.stop();
        Log.info("ZWave connection closed.");
    }




}
