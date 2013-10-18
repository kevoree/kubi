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
import lu.snt.helios.extra.zwave.driver.core.messages.commands.SwitchBinaryCommandClass;
import lu.snt.helios.extra.zwave.driver.core.messages.commands.ZWCommand;
import lu.snt.helios.extra.zwave.driver.core.messages.serial.Serial_GetApiCapabilities;
import lu.snt.helios.extra.zwave.driver.config.Manufacturer;
import lu.snt.helios.extra.zwave.driver.config.Manufacturers;
import lu.snt.helios.extra.zwave.driver.config.Product;

import lu.snt.helios.extra.zwave.driver.core.messages.serial.Serial_GetInitData;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_common.ZW_ApplicationCommandHandler;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_common.ZW_ApplicationNodeInformation;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_transport.ZW_SendData;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.kubi.*;
import org.kevoree.kubi.impl.DefaultKubiFactory;
import org.kevoree.log.Log;

import java.util.ArrayList;

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
        final Technology zWave = factory.createTechnology();
        zWave.setName("Z-Wave");
        model.addTechnologies(zWave);

        final Node controler = factory.createGateway();
        Manufacturer manufacturer = Manufacturers.getManufacturer(response.getManufacturerId_msb(), response.getManufacturerId_lsb());
        Product product = manufacturer.getProduct(String.format("%02x%02x", response.getProductType_msb(), response.getProductType_lsb()), String.format("%02x%02x", response.getProductId_msb(), response.getProductId_lsb()));

        controler.setBrand(manufacturer.getName());
        controler.setId(product.getName());

        model.addNodes(controler);

        webSocketHandler.sendModelToClients();


        MessageListener lst = new MessageListener() {
            public void messageReceived(Message msg) {
                if(msg instanceof ZW_ApplicationNodeInformation) {
                    ZW_ApplicationNodeInformation nodeInfos = (ZW_ApplicationNodeInformation)msg;
                    if(nodeInfos.hasRequestSucceeded()) {
                        Log.info("[Message Listener] Information updated for node " + nodeInfos.getNodeId());
                        Log.info("[Message Listener] List of Commands for node " + nodeInfos.getNodeId() + ": " + String.format("%s", nodeInfos.getCommandClasses()));

                        Node n = factory.createNode();
                        n.setTechnology(zWave);
                        n.setId("" + nodeInfos.getNodeId());
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
                        controler.addLinks(n);
                        model.addNodes(n);
                        webSocketHandler.sendModelToClients();
                    }
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
        for(int nodeId : response2.getNodeLlist()) {
            if(nodeId != 0 && nodeId != 1)
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



    public void sendToNetwork(JSONObject msg) {

        try {


            String nodeId = msg.getString("nodeId");
            String cc = msg.getString("action").substring(0, msg.getString("action").lastIndexOf("::"));
            CommandClass commandClass = CommandClass.valueOf(cc);

            String function = msg.getString("action").substring(msg.getString("action").lastIndexOf("::") + 2, msg.getString("action").length());
            Log.debug("Have to send " + cc + "->" + function + " to " + nodeId);

            ZWCommand request = null;
            if(commandClass == CommandClass.SWITCH_BINARY) {
                if(function.equals("GET")) {
                    request = new ZWCommand(Integer.valueOf(nodeId), commandClass, commandClass.getFunctionByName(function));
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
                } else {
                   Log.warn("Unknown function:" + function);
                }
            } else if(commandClass == CommandClass.BASIC_WINDOW_COVERING) {
                if(function.equals("STOP_LEVEL_CHANGE")) {
                    request = (ZWCommand)RequestFactory.zwSopMovingBasicWindowCovering(Integer.valueOf(nodeId));
                } else if(function.equals("START_LEVEL_CHANGE")) {
                    JSONArray pms = msg.getJSONArray("parameters");
                    JSONObject param = pms.getJSONObject(0);
                    if(param.getString("value").equals("up")) {
                        request = (ZWCommand)RequestFactory.zwStartMovingBasicWindowCoveringUp(Integer.valueOf(nodeId));
                    } else {
                        request = (ZWCommand)RequestFactory.zwStartMovingBasicWindowCoveringDown(Integer.valueOf(nodeId));
                    }

                } else {
                    Log.warn("Unknown function:" + function);
                }
            } else {
                Log.warn("CommandClass of message received unknown: " + commandClass.toString());
            }
            if(request != null) {
                ZW_SendData resp = (ZW_SendData)manager.sendMessageAndWaitResponse(request);

                Log.debug(resp.toString());
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
