package org.kevoree.kubi.frontend.web.cmp;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.ContainerRoot;
import org.kevoree.annotation.*;
import org.kevoree.api.Callback;
import org.kevoree.api.ModelService;
import org.kevoree.api.Port;
import org.kevoree.api.handler.ModelListener;
import org.kevoree.kubi.KubiModel;
import org.kevoree.kubi.frontend.web.core.EmbedHandler;
import org.kevoree.kubi.frontend.web.core.ViewListener;
import org.kevoree.kubi.frontend.web.core.WebSocketServerHandler;
import org.kevoree.log.Log;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;

import java.net.InetSocketAddress;
import java.net.URI;
import java.util.concurrent.Executors;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 14/11/2013
 * Time: 11:39
 */

@ComponentType
@Library(name = "Kubi")
public class KubiWebFrontend implements ViewListener {

    @Param(defaultValue = "WARN")
    private String logLevel;


    //private SyncServerApp app;
    private WebSocketServerHandler modelAtRuntimeHandler;
    private WebServer webServer;

    @KevoreeInject
    private ModelService kevoreeModelService;

    private ModelListener modelListener;

    @Output
    private Port getInitialModel;

    @Output
    private Port toConroller;

    public KubiWebFrontend() {
        initModelListener();
    }

    @Start
    public void startComponent() {
        setLogLevel();
        kevoreeModelService.registerModelListener(modelListener);
    }

    @Stop
    public void stopComponent() {
        webServer.stop();
    }

    @Update
    public void updateComponent() {
        setLogLevel();
    }

    @Override
    public void actionPerformed(JSONObject message) {

    }

    private void setLogLevel() {
        switch(logLevel) {
            case "WARN" : Log.WARN();break;
            case "DEBUG" : Log.DEBUG();break;
            case "TRACE" : Log.TRACE();break;
            case "ERROR" : Log.ERROR();break;
            case "INFO" : Log.INFO();break;
            case "NONE" : Log.NONE();break;
            default:Log.WARN();
        }
    }

    @Input
    public void fromController(Object message) {

        Log.debug("[KubiWebFrontend] Received a message from a driver:" + message);

        if(message instanceof JSONObject) {
            handleControllerMessage((JSONObject)message);
        } else if(message instanceof String) {
            try {
                JSONObject jsonMessage = new JSONObject((String)message);
                handleControllerMessage(jsonMessage);
            } catch (JSONException e) {
                Log.error("[KubiWebFrontend] Could not parse the String 'fromDrivers' as JSON Object");
            }
        } else {
            Log.warn("[KubiWebFrontend] Received a message on 'fromDrivers' port of strange type:" + message.getClass());
        }


    }


    private void handleControllerMessage(JSONObject controllerMessage) {
        if(!controllerMessage.has("CLASS") || !controllerMessage.has("ACTION")) {
            Log.error("[KubiWebFontend][handleControllerMessage] Could not handle the message cause it missed CLASS or ACTION attribute: " + controllerMessage.toString());
            return; // MESSAGE CAN NOT BE HANDLED
        }
        try {
            String actionClass = controllerMessage.getString("CLASS");
            String action = controllerMessage.getString("ACTION");
            if(actionClass.equals("MODEL")) {
                if (action.equals("UPDATE")) {
                    modelAtRuntimeHandler.updateModel(controllerMessage);
                    Log.debug("[KubiWebFrontend] Forward ModelUpdate to webClients");
                } else {
                    Log.warn("[KubiWebFontend] Unknown message ACTION:" + actionClass);
                }
            } else if (actionClass.equals("REPORT")) {
                modelAtRuntimeHandler.sendMessageToClients(controllerMessage);
            } else {
                Log.warn("[KubiWebFontend] Unknown message CLASS:" + actionClass);
            }
        } catch (JSONException e) {
            Log.error("[KubiWebFontend]",e);
        }
    }


    public void messageReceivedFromWebClients(JSONObject message) {
        Log.warn("[KubiWebFrontend] Message Received! " + message.toString());
        toConroller.send(message);
    }

    private void initModelListener() {
        modelListener = new ModelListener() {
            @Override
            public boolean preUpdate(ContainerRoot currentModel, ContainerRoot proposedModel) {
                return true;
            }

            @Override
            public boolean initUpdate(ContainerRoot currentModel, ContainerRoot proposedModel) {
                return true;
            }

            @Override
            public boolean afterLocalUpdate(ContainerRoot currentModel, ContainerRoot proposedModel) {
                return true;
            }

            @Override
            public void modelUpdated() {
                getInitialModel.call(null, new Callback<KubiModel>() {
                    @Override
                    public void onSuccess(KubiModel model) {
                        if(model != null) {
                            kevoreeModelService.unregisterModelListener(modelListener);

                            modelAtRuntimeHandler = new WebSocketServerHandler(KubiWebFrontend.this, model);

                            webServer = WebServers.createWebServer(Executors.newSingleThreadExecutor(), new InetSocketAddress(8081), URI.create("http://localhost:8081"))
                                    .add("/ws", modelAtRuntimeHandler)
                                            //.add(new StaticFileHandler(baseStaticDir));
                                    .add(new EmbedHandler(KubiWebFrontend.this, "static"));


                            webServer.start();
                            Log.info("[KubiWebFrontend] Server running at " + webServer.getUri());
                        }else {
                            Log.error("Model received is null !");
                        }
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        Log.error("An error occured while calling getInitialModelPort:" + throwable.getMessage());
                    }
                });
            }

            @Override
            public void preRollback(ContainerRoot currentModel, ContainerRoot proposedModel) {

            }

            @Override
            public void postRollback(ContainerRoot currentModel, ContainerRoot proposedModel) {

            }
        };
    }

}

