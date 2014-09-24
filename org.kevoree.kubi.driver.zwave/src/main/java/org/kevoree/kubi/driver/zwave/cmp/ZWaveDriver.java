package org.kevoree.kubi.driver.zwave.cmp;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.annotation.*;
import org.kevoree.api.Callback;
import org.kevoree.api.Port;
import org.kevoree.kubi.KubiModel;
import org.kevoree.kubi.driver.zwave.core.ZWaveConnector;
import org.kevoree.kubi.driver.zwave.core.ZWaveListener;
import org.kevoree.log.Log;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 14/11/2013
 * Time: 11:38
 */

@ComponentType
public class ZWaveDriver implements ZWaveListener{

    @Param(defaultValue = "WARN")
    private String logLevel;

    @Output
    private Port fromDevices;

    @Output
    private Port getInitialModel;


    private ZWaveConnector connector;

    public ZWaveDriver() {
        initModelListener();
        connector = new ZWaveConnector();
        connector.addZwaveListener(this);
    }

    private void initModelListener() {
    }


    @Start
    public void startComponent() {
        setLogLevel();

        getInitialModel.call(null, new Callback<KubiModel>() {
            @Override
            public void onSuccess(KubiModel model) {
                if(model != null) {
                    try {
                        connector.start(model);
                    } catch(Exception e) {

                    }
                }else {
                    Log.error("Model received is null !");
                }
            }

            @Override
            public void onError(Throwable throwable) {
                Log.error("An exception occured while calling the getInitialModelPort:" + throwable.getMessage(), throwable);
            }

        });
    }

    @Stop
    public void stopComponent() {
        connector.stop();
    }

    @Update
    public void updateComponent() {
        setLogLevel();
    }

    @Input
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
        fromDevices.send(msg);
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



}
