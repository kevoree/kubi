package org.kubi.plugins.polywebsite;

import io.undertow.Handlers;
import io.undertow.Undertow;
import io.undertow.server.handlers.resource.ClassPathResourceManager;
import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

/**
 * Created by jerome on 29/05/15.
 */
public class WebPlugin  implements KubiPlugin {

    private static int PORT = 8081;
    private Undertow server;

    @Override
    public void start(KubiKernel kernel) {
        server = Undertow.builder()
                .addHttpListener(PORT, "0.0.0.0")
                .setHandler(Handlers.resource(new ClassPathResourceManager(this.getClass().getClassLoader()))).build();
        server.start();
    }

    @Override
    public void stop() {
        server.stop();

    }
}