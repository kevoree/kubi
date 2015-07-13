package org.kubi.plugins.polywebsite;

import org.kevoree.modeling.drivers.websocket.WebSocketGateway;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

/**
 * Created by jerome on 29/05/15.
 */
public class WebPlugin  implements KubiPlugin {

    private static int PORT = 8081;

    @Override
    public void start(KubiKernel kernel) {
        WebSocketGateway webSocketWrapper = WebSocketGateway.exposeModelAndResources(kernel.model(), PORT, this.getClass().getClassLoader());
        webSocketWrapper.start();
    }

    @Override
    public void stop() {

    }
}