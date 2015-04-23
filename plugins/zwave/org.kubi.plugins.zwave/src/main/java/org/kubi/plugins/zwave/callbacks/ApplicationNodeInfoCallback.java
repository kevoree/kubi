package org.kubi.plugins.zwave.callbacks;

import lu.snt.zwave.protocol.constants.CommandClass;
import lu.snt.zwave.protocol.messages.zw_common.ZW_ApplicationNodeInformation;
import lu.snt.zwave.utils.ZWCallback;
import org.kubi.*;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.plugins.zwave.FunctionsFactory;
import org.kubi.plugins.zwave.StickHandler;
import org.kubi.plugins.zwave.StandardCallback;
import org.kubi.plugins.zwave.ZWavePlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaTechnology;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Created by gregory.nain on 06/03/15.
 */
public class ApplicationNodeInfoCallback implements ZWCallback<ZW_ApplicationNodeInformation> {

    private StickHandler _stickHandler;
    private InetAddress IP = null;

    public ApplicationNodeInfoCallback(final StickHandler handler) {
        this._stickHandler = handler;
        try {
            IP = InetAddress.getLocalHost();
            Log.trace("HostAddress::" + IP.getHostAddress());
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }

    public void on(ZW_ApplicationNodeInformation zw_applicationNodeInformation) {
        if (zw_applicationNodeInformation.getNodeId() != 0) {
            Log.trace("Application Node INFO: " + zw_applicationNodeInformation.toString());
            final KubiUniverse universe = _stickHandler.getModel().universe(0);
            final KubiView factory = universe.time(System.currentTimeMillis());
            factory.select("/").then(new Callback<KObject[]>() {
                public void on(KObject[] kObjects) {
                    final Ecosystem kubiEcosystem = (Ecosystem) kObjects[0];
                    kubiEcosystem.select("technologies[name=" + ZWavePlugin.TECHNOLOGY + "]").then(new Callback<KObject[]>() {
                        @Override
                        public void on(KObject[] kObjects) {
                            final Technology techno = (Technology) kObjects[0];
                            techno.traversal().traverse(MetaTechnology.REF_DEVICES).withAttribute(MetaDevice.ATT_HOMEID, _stickHandler.homeId()).withAttribute(MetaDevice.ATT_ID, zw_applicationNodeInformation.getNodeId()).done().then(new Callback<KObject[]>() {
                                @Override
                                public void on(KObject[] kObjects) {
                                    if (kObjects.length == 0) {
                                        Log.debug("Adding Device id:" + zw_applicationNodeInformation.getNodeId());
                                        Device dev = factory.createDevice().setId(zw_applicationNodeInformation.getNodeId() + "").setHomeId(_stickHandler.homeId()).setTechnology(techno);
                                        //adds functions to the model per CommandClass
                                        for (CommandClass cc : zw_applicationNodeInformation.getCommandClasses()) {
                                            FunctionsFactory.addFunctionFunction(dev, cc, _stickHandler.getKey());
                                        }
                                    }
                                    _stickHandler.getModel().save().then(StandardCallback.DISPLAY_ERROR);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}
