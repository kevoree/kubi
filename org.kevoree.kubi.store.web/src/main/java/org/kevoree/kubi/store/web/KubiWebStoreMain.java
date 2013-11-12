package org.kevoree.kubi.store.web;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.kubi.store.KubiStore;
import org.kevoree.kubi.store.StoreFactory;
import org.kevoree.kubi.store.factory.MainFactory;
import org.kevoree.kubi.store.impl.DefaultStoreFactory;
import org.kevoree.kubi.store.loader.JSONModelLoader;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.ModelLoader;
import org.kevoree.modeling.api.persistence.Batch;
import org.kevoree.modeling.api.persistence.MemoryDataStore;
import org.kevoree.modeling.api.persistence.PersistenceKMFFactory;
import org.kevoree.modeling.datastores.leveldb.LevelDbDataStore;
import org.webbitserver.WebServer;
import org.webbitserver.WebServers;
import org.webbitserver.handler.StaticFileHandler;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.text.ParseException;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 27/08/13
 * Time: 22:22
 */
public class KubiWebStoreMain {

    private WebServer webServer;
    //private KubiStore mainStore;
    private StoreFactory factory = new DefaultStoreFactory();
    private LevelDbDataStore localDatastore = new LevelDbDataStore();

    public KubiWebStoreMain() {

        factory.setDatastore(localDatastore);
        //initDatastore();

    }


    private void initDatastore() {

        Log.debug("Initializing DataStore");

        File baseStaticDir = null;
        try {
            File staticDirFromRoot = new File("org.kevoree.kubi.store.web/src/main/resources/static/baseStore.json");
            if(staticDirFromRoot.exists() && staticDirFromRoot.isDirectory()){
                baseStaticDir = staticDirFromRoot;
            } else {
                File staticDirFromProject = new File("src/main/resources/static/baseStore.json");
                if(staticDirFromProject.exists() && staticDirFromRoot.isDirectory()){
                    baseStaticDir = staticDirFromProject;
                } else {
                    baseStaticDir = new File(KubiWebStoreMain.class.getClassLoader().getResource("static/baseStore.json").toURI());
                }
            }

            Log.debug("Loading from file...");
            FileInputStream fis = new FileInputStream(baseStaticDir);
            ModelLoader loader = new JSONModelLoader();
            KubiStore mainStore = (KubiStore) loader.loadModelFromStream(fis).get(0);
            Log.debug("done.");

            Log.debug("Persisting in DB...");
            factory.persistBatch(factory.createBatch().addElementAndReachable(mainStore));
            factory.commit();
            Log.debug("done.");
        } catch (URISyntaxException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (FileNotFoundException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }


    public void start() {
        try {
            File baseStaticDir = null;
            File staticDirFromRoot = new File("org.kevoree.kubi.store.web/src/main/resources/static");
            if(staticDirFromRoot.exists() && staticDirFromRoot.isDirectory()){
                baseStaticDir = staticDirFromRoot;
            } else {
                File staticDirFromProject = new File("src/main/resources/static");
                if(staticDirFromProject.exists() && staticDirFromRoot.isDirectory()){
                    baseStaticDir = staticDirFromProject;
                } else {
                    baseStaticDir = new File(KubiWebStoreMain.class.getClassLoader().getResource("static").toURI());
                }
            }

            webServer = WebServers.createWebServer(8082)
                    .add("/datastore", new DataStoreHandler(factory))
                    .add(new StaticFileHandler(baseStaticDir));

            webServer.start();
            Log.info("Store Server running at " + webServer.getUri());
        } catch (URISyntaxException e) {
            Log.error("Exception occured");
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

    public void stop() {
        webServer.stop();
    }

    public static void main(String[] args) {
        Log.TRACE();
        final KubiWebStoreMain app = new KubiWebStoreMain();
        app.start();
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            public void run() {
                app.stop();
            }
        }));
    }

}
