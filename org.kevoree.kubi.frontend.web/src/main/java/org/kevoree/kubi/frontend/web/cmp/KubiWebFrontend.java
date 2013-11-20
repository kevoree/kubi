package org.kevoree.kubi.frontend.web.cmp;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.annotation.*;
import org.kevoree.framework.AbstractComponentType;
import org.kevoree.framework.MessagePort;
import org.kevoree.kubi.frontend.web.core.EmbedHandler;
import org.kevoree.kubi.frontend.web.core.ViewListener;
import org.kevoree.kubi.frontend.web.core.WebSocketServerHandler;
import org.kevoree.kubi.trace.DefaultTraceSequence;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.trace.TraceSequence;
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

@Provides({
        @ProvidedPort(name = "fromController", type = PortType.MESSAGE)
})

@Requires({
        @RequiredPort(name = "toController", type = PortType.MESSAGE)
})

@DictionaryType({
        @DictionaryAttribute(name="logLevel", vals = {"DEBUG", "INFO", "ERROR", "TRACE", "OFF", "WARN"}, optional = true, defaultValue = "WARN")
})

@ComponentType
public class KubiWebFrontend extends AbstractComponentType implements ViewListener {


    //private SyncServerApp app;
    private WebSocketServerHandler modelAtRuntimeHandler;
    private WebServer webServer;


    public KubiWebFrontend() {
        modelAtRuntimeHandler = new WebSocketServerHandler(KubiWebFrontend.this);

        webServer = WebServers.createWebServer(Executors.newSingleThreadExecutor(), new InetSocketAddress(8081), URI.create("http://localhost:8081"))
                .add("/ws", modelAtRuntimeHandler)
                        //.add(new StaticFileHandler(baseStaticDir));
                .add(new EmbedHandler(KubiWebFrontend.this, "static"));
    }

    @Start
    public void startComponent() {
        setLogLevel();
        //app.start();
        Executors.newSingleThreadExecutor().submit(new Runnable() {
            @Override
            public void run() {
                webServer.start();
                Log.info("[KubiWebFrontend] Server running at " + webServer.getUri());
            }
        });
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
        String logLevelVal = (String)getDictionary().get("logLevel");
        if ("DEBUG".equals(logLevelVal)) {
            Log.DEBUG();
        } else if ("WARN".equals(logLevelVal)) {
            Log.WARN();
        } else if ("INFO".equals(logLevelVal)) {
            Log.INFO();
        } else if ("ERROR".equals(logLevelVal)) {
            Log.ERROR();
        } else if ("TRACE".equals(logLevelVal)) {
            Log.TRACE();
        } else {
            Log.NONE();
        }
    }

    @Port(name="fromController")
    public void viewUpdate(Object message) {

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
                if(action.equals("UPDATE")) {
                    modelAtRuntimeHandler.updateModel(controllerMessage);
                    Log.debug("[KubiWebFrontend] Forward ModelUpdate to webClients");
                } else {
                    Log.warn("[KubiWebFontend] Unknown message ACTION:" + actionClass);
                }
            } else {
                Log.warn("[KubiWebFontend] Unknown message CLASS:" + actionClass);
            }
        } catch (JSONException e) {
            Log.error("[KubiWebFontend]",e);
        }
    }


    public void messageReceivedFromWebClients(JSONObject message) {
        Log.warn("[KubiWebFrontend] Message Received! " + message.toString());
    }


}

