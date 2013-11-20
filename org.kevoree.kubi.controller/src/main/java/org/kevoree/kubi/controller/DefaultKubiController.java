package org.kevoree.kubi.controller;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.annotation.*;
import org.kevoree.framework.AbstractComponentType;
import org.kevoree.framework.MessagePort;
import org.kevoree.framework.service.handler.ModelListenerAdapter;
import org.kevoree.kubi.KubiFactory;
import org.kevoree.kubi.KubiModel;
import org.kevoree.kubi.compare.DefaultModelCompare;
import org.kevoree.kubi.impl.DefaultKubiFactory;
import org.kevoree.kubi.loader.JSONModelLoader;
import org.kevoree.kubi.serializer.JSONModelSerializer;
import org.kevoree.kubi.trace.DefaultTraceSequence;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.KMFContainer;
import org.kevoree.modeling.api.compare.ModelCompare;
import org.kevoree.modeling.api.trace.TraceSequence;
import org.kevoree.modeling.api.util.ModelTracker;

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

    private KubiModel currentKubiModel;
    private JSONModelLoader kubiModelLoader = new JSONModelLoader();
    private JSONModelSerializer kubiModelSerializer = new JSONModelSerializer();
    private DefaultModelCompare modelComparator = new DefaultModelCompare();
    private ModelTracker tracker;

    public DefaultKubiController() {
        KubiFactory factory = new DefaultKubiFactory();
        currentKubiModel = factory.createKubiModel();
    }

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

        Log.debug("[KubiController] Received a message from a view:" + msg);

        if(msg instanceof JSONObject) {

        } else if(msg instanceof String) {
            try {
                JSONObject jsonMessage = new JSONObject((String)msg);

            } catch (JSONException e) {
                Log.error("[KubiController] Could not parse the String 'fromViews' as JSON Object");
            }
        } else {
            Log.warn("[KubiController] Received a message on 'fromViews' port of strange type:" + msg.getClass());
        }
    }

    @Port(name="fromDrivers")
    public void messageFromDrivers(Object msg) {

        Log.debug("[KubiController] Received a message from a driver" + msg);

        if(msg instanceof JSONObject) {
            handleDriverMessage((JSONObject)msg);
        } else if(msg instanceof String) {
            try {
                JSONObject jsonMessage = new JSONObject((String)msg);
                handleDriverMessage(jsonMessage);
            } catch (JSONException e) {
                Log.error("[KubiController] Could not parse the String 'fromDrivers' as JSON Object");
            }
        } else {
            Log.warn("[KubiController] Received a message on 'fromDrivers' port of strange type:" + msg.getClass());
        }
    }

    private void handleDriverMessage(JSONObject driverMessage) {

        if(!driverMessage.has("CLASS") || !driverMessage.has("ACTION")) {
            Log.error("[KubiController][DriverMessageHandler] Could not handle the message cause it missed CLASS or ACTION attribute: " + driverMessage.toString());
            return; // MESSAGE CAN NOT BE HANDLED
        }
        try {
            String actionClass = driverMessage.getString("CLASS");
            String action = driverMessage.getString("ACTION");
            if(actionClass.equals("MODEL")) {
                if(action.equals("UPDATE")) {

                    TraceSequence seq = new DefaultTraceSequence();
                    seq.populateFromString(driverMessage.getString("CONTENT"));
                    //Log.debug("[KubiController] Model before merge: " + kubiModelSerializer.serialize(currentKubiModel));
                    //Log.debug("[KubiController] MergeTrace:" +  seq.exportToString());
                    if(seq.applyOn(currentKubiModel)) {
                        if(isPortBinded("toViews")) {
                            getPortByName("toViews", MessagePort.class).process(driverMessage);
                        }
                        //Log.debug("[KubiController] Model after merge: " + kubiModelSerializer.serialize(currentKubiModel));
                    }

                } else {
                    Log.warn("[KubiController] Unknown message ACTION:" + actionClass);
                }
            } else {
                Log.warn("[KubiController] Unknown message CLASS:" + actionClass);
            }
        } catch (JSONException e) {
            Log.error("[KubiController]",e);
        }

    }


}
