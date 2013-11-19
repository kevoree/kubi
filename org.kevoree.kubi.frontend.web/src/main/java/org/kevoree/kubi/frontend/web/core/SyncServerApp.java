package org.kevoree.kubi.frontend.web.core;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.framework.AbstractComponentType;
import org.kevoree.log.Log;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;

import java.util.ArrayList;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 27/08/13
 * Time: 22:22
 */
public class SyncServerApp {

    private WebSocketServerHandler modelAtRuntimeHandler;
    private WebServer webServer;
    private AbstractComponentType component;
    private ArrayList<ViewListener> listeners;

    public SyncServerApp(AbstractComponentType cpt) {
        component = cpt;
        listeners = new ArrayList<ViewListener>();
    }


    public void addViewListener(ViewListener lst) {
        listeners.add(lst);
    }

    public void removeViewListener(ViewListener lst) {
        listeners.remove(lst);
    }


    public void start() {

        modelAtRuntimeHandler = new WebSocketServerHandler(this);
        webServer = WebServers.createWebServer(8081)
                .add("/ws", modelAtRuntimeHandler)
                        //.add(new StaticFileHandler(baseStaticDir));
                .add(new EmbedHandler(component, "static"));
        webServer.start();
        Log.info("Server running at " + webServer.getUri());
    }

    public void stop() {
        webServer.stop();
    }


    public void messageReceivedFromClient(JSONObject message) {
        for(ViewListener lst : listeners) {
            lst.actionPerformed(message);
        }
    }

}
