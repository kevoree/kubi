package org.kevoree.kubi.web;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.log.Log;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;
import org.webbitserver.handler.StaticFileHandler;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.text.ParseException;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 27/08/13
 * Time: 22:22
 */
public class SyncServerApp {

    private ZWaveConnector zWaveConnector;
    private WebSocketServerHandler modelAtRuntimeHandler;
    private WebServer webServer;

    public void start() {
        try {
            Log.DEBUG();

            File baseStaticDir = null;
            File staticDirFromRoot = new File("org.kevoree.kubi.web/src/main/resources/static");
            if(staticDirFromRoot.exists() && staticDirFromRoot.isDirectory()){
                baseStaticDir = staticDirFromRoot;
            } else {
                File staticDirFromProject = new File("src/main/resources/static");
                if(staticDirFromProject.exists() && staticDirFromRoot.isDirectory()){
                    baseStaticDir = staticDirFromProject;
                } else {
                    baseStaticDir = new File(SyncServerApp.class.getClassLoader().getResource("static").toURI());
                }
            }

            Log.info("Static from "+staticDirFromRoot.getAbsolutePath());

            modelAtRuntimeHandler = new WebSocketServerHandler(this);
            webServer = WebServers.createWebServer(8081)
                    .add("/ws", modelAtRuntimeHandler)
                    .add(new StaticFileHandler(baseStaticDir));
            webServer.start();
            Log.info("Server running at " + webServer.getUri());

            zWaveConnector = new ZWaveConnector();
            zWaveConnector.setWebSocketHandler(modelAtRuntimeHandler);
            zWaveConnector.start();
            zWaveConnector.init();

        } catch (URISyntaxException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

    public void stop() {
        webServer.stop();
        zWaveConnector.stop();
    }


    public void messageReceivedFromClient(JSONObject message) {
        try {

            //Technology routing
            if(message.getString("technology").equals("Z-Wave")) {
                zWaveConnector.sendToNetwork(message);
            }



        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }




    public static void main(String[] args) {
        final SyncServerApp app = new SyncServerApp();
        app.start();
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            public void run() {
                app.stop();
            }
        }));
    }

}
