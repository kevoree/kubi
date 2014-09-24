package org.kevoree.kubi.store.web.core;

import org.kevoree.kubi.store.KubiStore;
import org.kevoree.kubi.store.factory.StoreTransaction;
import org.kevoree.kubi.store.factory.StoreTransactionManager;
import org.kevoree.kubi.store.web.cmp.StoreComponent;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.json.JSONModelLoader;
import org.kevoree.modeling.datastores.leveldb.LevelDbDataStore;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;
import org.webbitserver.handler.StaticFileHandler;

import java.io.*;
import java.net.*;
import java.util.Enumeration;
import java.util.concurrent.Executors;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 27/08/13
 * Time: 22:22
 */
public class KubiWebStoreMain {

    private WebServer webServer;
    //private KubiStore mainStore;
    private StoreTransactionManager transactionManager;
    private LevelDbDataStore localDatastore;

    public KubiWebStoreMain() {
        Log.TRACE();
        Log.debug("Building the store");
        String location = new File("").getAbsolutePath() + File.separator + "target";
        localDatastore = new LevelDbDataStore(location);
        transactionManager = new StoreTransactionManager(localDatastore);
        Log.info("[KubiStore] Base Storage location : " + location);
        initDatastore();
    }


    private void initDatastore() {

        Log.debug("Initializing DataStore");
        StoreTransaction localTransaction = transactionManager.createTransaction();

        InputStream fis;
        try {
            File staticDirFromRoot = new File("org.kevoree.kubi.store.web/src/main/resources/static/baseStore.json");
            if(staticDirFromRoot.exists() && staticDirFromRoot.isDirectory()){
                fis = new FileInputStream(staticDirFromRoot);
            } else {
                File staticDirFromProject = new File("src/main/resources/static/baseStore.json");
                if(staticDirFromProject.exists() && staticDirFromRoot.isDirectory()){
                    fis = new FileInputStream(staticDirFromProject);
                } else {

                    Enumeration<URL> resources = KubiWebStoreMain.class.getClassLoader().getResources("static");
                    while(resources.hasMoreElements()) {
                        Log.debug("Resource: " + resources.nextElement().toString());
                    }
                    fis = KubiWebStoreMain.class.getClassLoader().getResourceAsStream("static/baseStore.json");

                }
            }

            Log.debug("Loading from file...");
            JSONModelLoader loader = localTransaction.createJSONLoader();
            KubiStore mainStore = (KubiStore) loader.loadModelFromStream(fis).get(0);
            Log.debug("done.");

            Log.debug("Persisting in DB...");
            localTransaction.root(mainStore);
            Log.debug("done.");
        } catch (FileNotFoundException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } finally {
            localTransaction.commit();
            localTransaction.close();
        }
    }


    public void start(StoreComponent store) {
        File baseStaticDir = null;
        File staticDirFromRoot = new File("org.kevoree.kubi.store.web/src/main/resources/static");
        if(staticDirFromRoot.exists() && staticDirFromRoot.isDirectory()){
            baseStaticDir = staticDirFromRoot;
        } else {
            File staticDirFromProject = new File("src/main/resources/static");
            if(staticDirFromProject.exists() && staticDirFromRoot.isDirectory()){
                baseStaticDir = staticDirFromProject;
            } else {
                baseStaticDir = null;
            }
        }

        webServer = WebServers.createWebServer(Executors.newSingleThreadExecutor(), new InetSocketAddress(8082), URI.create("http://localhost:8082"))
                .add("/datastore", new DataStoreHandler(transactionManager));


        if(baseStaticDir ==  null) {
            webServer.add(new EmbedHandler(store, "static"));
        } else {
            webServer.add(new StaticFileHandler(baseStaticDir));
        }

        webServer.start();
        Log.info("Store Server running at " + webServer.getUri());
    }

    public void stop() {
        webServer.stop();
    }

    public static void main(String[] args) {
        Log.TRACE();
        final KubiWebStoreMain app = new KubiWebStoreMain();
        app.start(null);
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            public void run() {
                app.stop();
            }
        }));
    }

}
