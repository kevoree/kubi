package org.kevoree.kubi.frontend.web.cmp;

import org.json.JSONObject;
import org.kevoree.annotation.*;
import org.kevoree.framework.AbstractComponentType;
import org.kevoree.kubi.frontend.web.core.SyncServerApp;
import org.kevoree.kubi.frontend.web.core.ViewListener;
import org.kevoree.log.Log;

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

    private Log localLog;

    private SyncServerApp app;


    public KubiWebFrontend() {
        localLog = Log.getLog("KubiWebFrontend");
        app = new SyncServerApp(this);
        app.addViewListener(this);
    }

    @Start
    public void startComponent() {
        setLogLevel();
        app.start();
    }

    @Stop
    public void stopComponent() {
        app.stop();
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
        Log.debug("View Update required");
    }
}

