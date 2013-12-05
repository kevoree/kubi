package org.kevoree.kubi.store.web.cmp;

import org.kevoree.annotation.*;
import org.kevoree.kubi.store.web.core.KubiWebStoreMain;
import org.kevoree.log.Log;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 14/11/2013
 * Time: 11:30
 */

@ComponentType
@Library(name = "Kubi")
public class StoreComponent {

    private KubiWebStoreMain app;

    @Param(defaultValue = "WARN")
    private String logLevel;


    @Start
    public void startComponent() {
        setLogLevel();
        app = new KubiWebStoreMain();
        app.start(this);
    }

    @Stop
    public void stopComponent() {
        app.stop();
        app = null;
    }

    @Update
    public void updateComponent() {
        setLogLevel();
    }

    private void setLogLevel() {
        if ("DEBUG".equals(logLevel)) {
            Log.DEBUG();
        } else if ("WARN".equals(logLevel)) {
            Log.WARN();
        } else if ("INFO".equals(logLevel)) {
            Log.INFO();
        } else if ("ERROR".equals(logLevel)) {
            Log.ERROR();
        } else if ("TRACE".equals(logLevel)) {
            Log.TRACE();
        } else {
            Log.NONE();
        }
    }

}
