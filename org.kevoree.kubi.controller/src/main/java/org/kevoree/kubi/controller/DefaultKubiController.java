package org.kevoree.kubi.controller;

import org.kevoree.annotation.*;
import org.kevoree.framework.AbstractComponentType;
import org.kevoree.framework.MessagePort;
import org.kevoree.framework.service.handler.ModelListenerAdapter;
import org.kevoree.log.Log;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 14/11/2013
 * Time: 11:34
 */

@Requires({
        @RequiredPort(name = "toDrivers", type = PortType.MESSAGE, optional = true),
        @RequiredPort(name = "toViews", type = PortType.MESSAGE, optional = true)
})

@Provides({
        @ProvidedPort(name = "fromDrivers", type = PortType.MESSAGE),
        @ProvidedPort(name = "fromViews", type = PortType.MESSAGE)
})

@DictionaryType({
        @DictionaryAttribute(name="logLevel", vals = {"DEBUG", "INFO", "ERROR", "TRACE", "OFF", "WARN"}, optional = true, defaultValue = "WARN")
})

@ComponentType
public class DefaultKubiController extends AbstractComponentType {


    @Start
    public void startComponent() {
        setLogLevel();
    }

    @Stop
    public void stopComponent() {
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


    @Port(name="fromViews")
    public void messageFromViews(Object msg) {

    }

    @Port(name="fromDrivers")
    public void messageFromDrivers(Object msg) {

    }


}
