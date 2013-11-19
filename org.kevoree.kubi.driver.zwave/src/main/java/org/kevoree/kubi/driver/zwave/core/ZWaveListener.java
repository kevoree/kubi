package org.kevoree.kubi.driver.zwave.core;

import lu.snt.helios.extra.zwave.driver.core.messages.Message;
import org.json.JSONObject;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 19/11/2013
 * Time: 10:48
 * To change this template use File | Settings | File Templates.
 */
public interface ZWaveListener {

    void messageReceived(JSONObject msg);

}
