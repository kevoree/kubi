package org.kubi.plugins.zwave;

import lu.snt.zwave.driver.ZWaveKey;
import lu.snt.zwave.driver.ZWaveKeyDiscoveryListener;
import lu.snt.zwave.driver.ZWaveManager;
import lu.snt.zwave.protocol.command.ZWControlCommand;
import lu.snt.zwave.protocol.command.ZWControlCommandWithResult;
import lu.snt.zwave.protocol.command.ZWaveFactories;
import lu.snt.zwave.protocol.constants.CommandClass;
import lu.snt.zwave.protocol.messages.app_command.SwitchBinaryCommandClass;
import lu.snt.zwave.utils.ZWCallback;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.*;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;
import org.kubi.meta.MetaDevice;
import org.kubi.meta.MetaTechnology;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 25/03/15.
 */
public class ZWavePlugin implements KubiPlugin, Runnable {

    private ZWaveManager manager;

    public static final String TECHNOLOGY = "ZWave";

    private StickPhysMapper mapper = new StickPhysMapper();

    private ScheduledExecutorService service;

    private KubiKernel kernel;

    @Override
    public void start(final KubiKernel kernel) {
        this.kernel = kernel;
        service = Executors.newScheduledThreadPool(1);
        checkOrAddTechnology();
        manager = new ZWaveManager();
        manager.addZWaveKeyDiscoveryListener(new ZWaveKeyDiscoveryListener() {
            @Override
            public void zwaveKeyDiscovered(ZWaveKey zWaveKey) {
                Log.info("ZWave stick discovered");
                StickHandler newStickHandler = new StickHandler(zWaveKey, kernel.model(), mapper);
            }
        });
        manager.start();
        service.scheduleAtFixedRate(this, 1, 3, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        if (manager != null) {
            for (StickHandler handlers : mapper.handlers()) {
                handlers.stop();
            }
            manager.stop();
        }
    }

    private void checkOrAddTechnology() {
        final KubiUniverse universe = kernel.model().universe(kernel.currentUniverse());
        final KubiView factory = universe.time(System.currentTimeMillis());
        factory.select("/technologies[name=" + TECHNOLOGY + "]").then(new Callback<KObject[]>() {
            public void on(KObject[] kObjects) {
                if (kObjects.length == 0) {
                    factory.select("/").then(new Callback<KObject[]>() {
                        public void on(KObject[] kObjects) {
                            Log.trace("Adding Technology ZWave");
                            Ecosystem kubiEcosystem = (Ecosystem) kObjects[0];
                            kubiEcosystem.addTechnologies(factory.createTechnology().setName(TECHNOLOGY));
                            kernel.model().save().then(StandardCallback.DISPLAY_ERROR);
                        }
                    });
                }
            }
        });
    }

    @Override
    public void run() {
        final KubiUniverse universe = kernel.model().universe(kernel.currentUniverse());
        final KubiView factory = universe.time(System.currentTimeMillis());
        factory.select("/technologies[name=" + TECHNOLOGY + "]").then(new Callback<KObject[]>() {
            public void on(KObject[] technologies) {
                if (technologies.length != 0) {
                    technologies[0].traversal().traverse(MetaTechnology.REF_DEVICES).done().then(new Callback<KObject[]>() {
                        @Override
                        public void on(KObject[] devices) {
                            for (int i = 0; i < devices.length; i++) {
                                Device device = (Device) devices[i];
                                device.traversal().traverse(MetaDevice.REF_ACTIONPARAMETERS).done().then(new Callback<KObject[]>() {
                                    @Override
                                    public void on(KObject[] params) {
                                        for (int j = 0; j < params.length; j++) {
                                            ActionParameter loopParam = (ActionParameter) params[j];
                                            //TODO check the diff
                                            //send the command
                                            String valueToSend = loopParam.getDesired();
                                            if (valueToSend != null) {
                                                if (loopParam.getName().equals(CommandClass.SWITCH_BINARY.getName())) {
                                                    ZWControlCommand cmd = ZWaveFactories.control().switchBinarySet(Integer.parseInt(device.getId()), Boolean.parseBoolean(valueToSend));
                                                    StickHandler handler = mapper.get(device.getHomeId());
                                                    if (handler != null) {
                                                        handler.getKey().submitCommand(cmd);
                                                        ZWControlCommandWithResult<SwitchBinaryCommandClass> cmd2 = ZWaveFactories.control().switchBinaryGet(Integer.parseInt(device.getId()));
                                                        cmd2.onResult(new ZWCallback<SwitchBinaryCommandClass>() {
                                                            @Override
                                                            public void on(SwitchBinaryCommandClass switchBinaryCommandClass) {
                                                                loopParam.jump(System.currentTimeMillis()).then(new Callback<KObject>() {
                                                                    @Override
                                                                    public void on(KObject paramOnTime) {
                                                                        ((ActionParameter) paramOnTime).setValue(switchBinaryCommandClass.isOn() + "");
                                                                        loopParam.view().universe().model().save();
                                                                    }
                                                                });
                                                            }
                                                        });
                                                        handler.getKey().submitCommand(cmd2);
                                                    }
                                                } else {
                                                    //TODO other command
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
}
