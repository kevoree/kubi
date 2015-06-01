package org.kubi.plugins.polywebsite;

import org.kevoree.modeling.databases.websocket.WebSocketWrapper;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

/**
 * Created by jerome on 29/05/15.
 */
public class WebPlugin  implements KubiPlugin {

    private static int PORT = 8081;

    @Override
    public void start(KubiKernel kernel) {
        WebSocketWrapper webSocketWrapper = new WebSocketWrapper(kernel.model().manager().cdn(), PORT);
        webSocketWrapper.exposeResourcesOf(this.getClass().getClassLoader());
        kernel.model().setContentDeliveryDriver(webSocketWrapper);
        webSocketWrapper.connect(null);
    }

    @Override
    public void stop() {

    }
}