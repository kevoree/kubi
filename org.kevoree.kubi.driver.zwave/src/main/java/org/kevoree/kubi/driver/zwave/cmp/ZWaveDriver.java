package org.kevoree.kubi.driver.zwave.cmp;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.annotation.*;
import org.kevoree.framework.AbstractComponentType;
import org.kevoree.framework.MessagePort;
import org.kevoree.kubi.driver.zwave.core.ZWaveConnector;
import org.kevoree.kubi.driver.zwave.core.ZWaveListener;
import org.kevoree.log.Log;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 14/11/2013
 * Time: 11:38
 */

@Provides({
        @ProvidedPort(name = "toDevices", type = PortType.MESSAGE)
})

@Requires({
        @RequiredPort(name = "fromDevices", type = PortType.MESSAGE, optional = true)
})

@DictionaryType({
        @DictionaryAttribute(name="logLevel", vals = {"DEBUG", "INFO", "ERROR", "TRACE", "OFF", "WARN"}, optional = true, defaultValue = "WARN")
})


@ComponentType
public class ZWaveDriver extends AbstractComponentType implements ZWaveListener{

    private Log localLog;
    private ZWaveConnector connector;

    public ZWaveDriver() {
        localLog = Log.getLog("ZWaveDriver");
        connector = new ZWaveConnector();
        connector.addZwaveListener(this);
    }

    @Start
    public void startComponent() {
        setLogLevel();
        connector.start();
    }

    @Stop
    public void stopComponent() {
        connector.stop();
    }

    @Update
    public void updateComponent() {
        setLogLevel();
    }

    @Port(name="toDevices")
    public void toDevices(Object msg) {
        if(msg instanceof JSONObject) {
            connector.sendToNetwork((JSONObject)msg);
        } else if(msg instanceof String) {
            try {
                connector.sendToNetwork(new JSONObject((String)msg));
            } catch (JSONException e) {
                Log.warn("Could not JSON parse the string received.", e);  //To change body of catch statement use File | Settings | File Templates.
            }
        } else {
            Log.error("Received a message of a type I could not deal with:" + msg.getClass());
        }
    }

    public void messageReceived(JSONObject msg) {
        getPortByName("fromDevices", MessagePort.class).process(msg);
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
