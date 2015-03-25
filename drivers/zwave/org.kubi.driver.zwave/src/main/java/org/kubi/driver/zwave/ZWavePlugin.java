package org.kubi.driver.zwave;

import lu.snt.zwave.driver.ZWaveKey;
import lu.snt.zwave.driver.ZWaveKeyDiscoveryListener;
import lu.snt.zwave.driver.ZWaveManager;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;
import org.kevoree.modeling.api.KObject;
import org.kubi.Ecosystem;
import org.kubi.KubiUniverse;
import org.kubi.KubiView;
import org.kubi.Technology;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

import java.util.ArrayList;
import java.util.concurrent.ExecutorService;

/**
 * Created by duke on 25/03/15.
 */
public class ZWavePlugin implements KubiPlugin {

    private ZWaveManager manager;

    public static final String TECHNOLOGY = "ZWave";

    //TODO maybe change to hash or key managed by usb
    private ArrayList<StickHandler> _managedKeys = new ArrayList<StickHandler>();
    
    @Override
    public void start(final KubiKernel kernel) {
        Log.info("ZWave plugin start");
        checkOrAddTechnology(kernel);
        manager = new ZWaveManager();
        manager.addZWaveKeyDiscoveryListener(new ZWaveKeyDiscoveryListener() {
            @Override
            public void zwaveKeyDiscovered(ZWaveKey zWaveKey) {
                Log.info("ZWave stick discovered");
                _managedKeys.add(new StickHandler(zWaveKey, kernel.model()));
            }
        });
        manager.start();
    }

    @Override
    public void stop() {
        if (manager != null) {
            Log.info("ZWave connection closing");
            for (StickHandler handlers : _managedKeys) {
                handlers.stop();
            }
            manager.stop();
        }
        Log.info("ZWave connection closed.");
    }

    private void checkOrAddTechnology(KubiKernel kernel) {
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

}
