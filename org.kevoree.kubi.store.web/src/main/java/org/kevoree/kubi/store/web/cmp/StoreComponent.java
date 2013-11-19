package org.kevoree.kubi.store.web.cmp;

import org.kevoree.annotation.*;
import org.kevoree.framework.AbstractComponentType;
import org.kevoree.kubi.store.web.core.KubiWebStoreMain;
import org.kevoree.log.Log;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 14/11/2013
 * Time: 11:30
 */


@DictionaryType({
        @DictionaryAttribute(name="logLevel", vals = {"DEBUG", "INFO", "ERROR", "TRACE", "OFF", "WARN"}, optional = true, defaultValue = "WARN")
})

@ComponentType
public class StoreComponent extends AbstractComponentType {

    private KubiWebStoreMain app;

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

}
