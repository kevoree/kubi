package org.kubi.plugins.web;

import org.kevoree.modeling.drivers.websocket.WebSocketGateway;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

public class WebPlugin implements KubiPlugin {

    private static int PORT = 8080;

    @Override
    public void start(KubiKernel kernel) {
        WebSocketGateway webSocketGateway = WebSocketGateway.exposeModelAndResources(kernel.model(), PORT, this.getClass().getClassLoader());
        webSocketGateway.start();
    }

    @Override
    public void stop() {

    }

}
