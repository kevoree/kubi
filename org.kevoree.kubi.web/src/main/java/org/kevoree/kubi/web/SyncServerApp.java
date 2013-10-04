package org.kevoree.kubi.web;

import org.kevoree.log.Log;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;
import org.webbitserver.handler.StaticFileHandler;

import java.io.File;
import java.net.URISyntaxException;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 27/08/13
 * Time: 22:22
 */
public class SyncServerApp {

     public static void main(String[] args) throws URISyntaxException {

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

         WebSocketServerHandler modelAtRuntimeHandler = new WebSocketServerHandler();
         WebServer webServer = WebServers.createWebServer(8081)
                 .add("/ws", modelAtRuntimeHandler)
                 .add(new StaticFileHandler(baseStaticDir));
         webServer.start();
         System.out.println("Server running at " + webServer.getUri());
     }

}
