package org.kubi.plugins.zwave;

import java.util.HashMap;

/**
 * Created by duke on 26/03/15.
 */
public class StickPhysMapper {

    private HashMap<String, StickHandler> mapper = new HashMap<String, StickHandler>();

    public void set(String homeId, StickHandler handler) {
        mapper.put(homeId, handler);
    }

    public StickHandler get(String homeId) {
        return mapper.get(homeId);
    }

    public StickHandler[] handlers() {
        return mapper.values().toArray(new StickHandler[mapper.size()]);
    }

}
