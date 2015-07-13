package org.kubi.api;


import org.kubi.KubiModel;

/**
 * Created by duke on 25/03/15.
 */
public interface KubiKernel {

    public KubiModel model();

    public long currentUniverse();

    //TODO scheduler help, etc...

}
