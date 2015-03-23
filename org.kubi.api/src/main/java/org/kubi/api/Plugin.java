package org.kubi.api;

import org.kubi.KubiModel;

/**
 * Created by duke on 20/03/15.
 */
public interface Plugin {

    public void start(KubiModel model);

    public void stop();

}
