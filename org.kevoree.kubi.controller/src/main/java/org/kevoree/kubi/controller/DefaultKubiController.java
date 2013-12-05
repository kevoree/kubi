package org.kevoree.kubi.controller;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.annotation.*;
import org.kevoree.api.Port;
import org.kevoree.kubi.KubiFactory;
import org.kevoree.kubi.KubiModel;
import org.kevoree.kubi.cloner.DefaultModelCloner;
import org.kevoree.kubi.impl.DefaultKubiFactory;
import org.kevoree.kubi.trace.DefaultTraceSequence;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.ModelCloner;
import org.kevoree.modeling.api.trace.TraceSequence;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 14/11/2013
 * Time: 11:34
 */

@ComponentType
@Library(name = "Kubi")
public class DefaultKubiController {

    @Param(defaultValue = "WARN")
    private String logLevel;

    //Ports
    @Output(optional = true)
    protected Port toDrivers;

    @Output(optional = true)
    protected Port toViews;

    private KubiModel baseKubiModel;
    private KubiModel currentKubiModel;

    public DefaultKubiController() {
        KubiFactory factory = new DefaultKubiFactory();
        ModelCloner cloner = new DefaultModelCloner();
        baseKubiModel = factory.createKubiModel();

        currentKubiModel = cloner.clone(baseKubiModel, false);
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

    @Input
    public void fromDrivers(Object msg) {
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

    @Input
    public void fromViews(Object msg) {
        if(msg instanceof JSONObject) {
            handleViewMessage((JSONObject)msg);
        } else if(msg instanceof String) {
            try {
                JSONObject jsonMessage = new JSONObject((String)msg);
                handleViewMessage(jsonMessage);
            } catch (JSONException e) {
                Log.error("[KubiController] Could not parse the String 'fromViews' as JSON Object");
            }
        } else {
            Log.warn("[KubiController] Received a message on 'fromViews' port of strange type:" + msg.getClass());
        }
    }

    @Input
    public KubiModel getInitialModel(Object o) {
        return baseKubiModel;
    }

    private void setLogLevel() {
        switch(logLevel) {
            case "WARN" : Log.WARN();break;
            case "DEBUG" : Log.DEBUG();break;
            case "TRACE" : Log.TRACE();break;
            case "ERROR" : Log.ERROR();break;
            case "INFO" : Log.INFO();break;
            case "NONE" : Log.NONE();break;
            default:Log.WARN();
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
                    Log.trace("Applying trace in controler:" + seq.exportToString());
                    if(seq.applyOn(currentKubiModel)) {
                        toViews.call(driverMessage);
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


    private void handleViewMessage(JSONObject viewMessage) {
        toDrivers.call(viewMessage);
    }


}
