package org.kevoree.kubi.driver.zwave.cmp;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.ContainerRoot;
import org.kevoree.annotation.*;
import org.kevoree.api.Callback;
import org.kevoree.api.ModelService;
import org.kevoree.api.Port;
import org.kevoree.api.handler.ModelListener;
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
@Library(name = "Kubi")
public class ZWaveDriver implements ZWaveListener{

    @Param(defaultValue = "WARN")
    private String logLevel;

    @Output
    private Port fromDevices;

    @Output
    private Port getInitialModel;

    @KevoreeInject
    private ModelService kevoreeModelService;

    private ZWaveConnector connector;
    private ModelListener modelListener;

    public ZWaveDriver() {
        initModelListener();
        connector = new ZWaveConnector();
        connector.addZwaveListener(this);
    }

    private void initModelListener() {
        modelListener = new ModelListener() {
            @Override
            public boolean preUpdate(ContainerRoot currentModel, ContainerRoot proposedModel) {
                return true;
            }

            @Override
            public boolean initUpdate(ContainerRoot currentModel, ContainerRoot proposedModel) {
                return true;
            }

            @Override
            public boolean afterLocalUpdate(ContainerRoot currentModel, ContainerRoot proposedModel) {
                return true;
            }

            @Override
            public void modelUpdated() {
                getInitialModel.call(null, new Callback() {
                    public void run(Object model) {
                        if(model != null) {
                            if(model instanceof KubiModel) {
                                kevoreeModelService.unregisterModelListener(modelListener);
                                connector.start((KubiModel)model);
                            } else {
                                Log.error("Could not start ZWave driver cause initial model was of type:" + model.getClass());
                            }
                        }else {
                            Log.error("Model received is null !");
                        }
                    }
                });
            }

            @Override
            public void preRollback(ContainerRoot currentModel, ContainerRoot proposedModel) {

            }

            @Override
            public void postRollback(ContainerRoot currentModel, ContainerRoot proposedModel) {

            }
        };
    }


    @Start
    public void startComponent() {
        setLogLevel();
        kevoreeModelService.registerModelListener(modelListener);
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
        fromDevices.call(msg);
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
