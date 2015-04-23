package org.kubi.plugins.zwave;

import org.kevoree.log.Log;
import org.kevoree.modeling.api.Callback;

/**
 * Created by gregory.nain on 06/03/15.
 */
public enum StandardCallback implements Callback<Throwable> {
    DISPLAY_ERROR;

    @Override
    public void on(Throwable throwable) {
        if(throwable != null) {
            Log.error("", throwable);
        }
    }
}
