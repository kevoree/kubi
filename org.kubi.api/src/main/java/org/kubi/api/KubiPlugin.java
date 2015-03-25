package org.kubi.api;

/**
 * Created by duke on 20/03/15.
 */
public interface KubiPlugin {

    public void start(KubiKernel kernel);

    public void stop();

}
