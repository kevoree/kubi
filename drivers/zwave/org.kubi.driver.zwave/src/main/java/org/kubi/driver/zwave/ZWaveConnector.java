package org.kubi.driver.zwave;

import lu.snt.zwave.driver.*;
import org.kubi.KubiModel;
import org.kevoree.log.Log;
import org.kevoree.modeling.databases.websocket.WebSocketClient;
import org.kubi.zwave.ZWaveProductsStoreModel;

import java.util.ArrayList;

/**
 * Created by Cyril Cassagnes
 * Date: 10/02/1014.
 */
public class ZWaveConnector {

    private KubiModel kubiModel;
    private ZWaveProductsStoreModel productStore;
    private ZWaveManager manager;
    private ArrayList<KeyHandler> _managedKeys = new ArrayList<KeyHandler>();

    public ZWaveConnector(KubiModel kubiModel) {
        this.kubiModel = kubiModel;
    }

    public void start() {

        productStore = new ZWaveProductsStoreModel();
        productStore.setContentDeliveryDriver(new WebSocketClient("ws://localhost:23666"));
        //productStore.connect().then(StandardCallback.DISPLAY_ERROR);


        manager = new ZWaveManager();
        manager.addZWaveKeyDiscoveryListener(new ZWaveKeyDiscoveryListener() {
            @Override
            public void zwaveKeyDiscovered(ZWaveKey zWaveKey) {
                _managedKeys.add(new KeyHandler(zWaveKey, kubiModel, productStore));
            }
        });
        manager.start();
    }

    public void stop() {
        if (manager != null) {
            Log.info("ZWave connection closing");
            for (KeyHandler handlers : _managedKeys) {
                handlers.stop();
            }
            manager.stop();
        }
        Log.info("ZWave connection closed.");
    }


}
