package org.kevoree.kubi.driver.zwave.core;

import lu.snt.helios.extra.zwave.driver.core.messages.Message;
import lu.snt.helios.extra.zwave.driver.core.messages.commands.SwitchBinaryCommandClass;
import lu.snt.helios.extra.zwave.driver.core.messages.zw_common.ZW_ApplicationCommandHandler;
import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.log.Log;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 19/11/2013
 * Time: 10:58
 * To change this template use File | Settings | File Templates.
 */
public class ZwaveJsonizer {

/*
    public static JSONObject toJSON(Message zWaveMessage) {

        if(zWaveMessage instanceof ZW_ApplicationCommandHandler) {
            ZW_ApplicationCommandHandler typedMessage = (ZW_ApplicationCommandHandler)zWaveMessage;
            try {

                JSONObject content = new JSONObject();
                content.put("technology", "Z-Wave");
                content.put("nodeId",typedMessage.getSourceNode());
                content.put("action",typedMessage.getCommandClass().getName() + "::" + typedMessage.getCommandFunction().getName());
                content.put("raw",typedMessage.toString());

                if(typedMessage instanceof SwitchBinaryCommandClass) {
                    content.put("state",((SwitchBinaryCommandClass)typedMessage).isOn());
                }

               return content;

            } catch (JSONException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        } else {
            Log.warn("Could not Jsonize ZWaveMessage of type: " + zWaveMessage.getClass());

        }
        return null;
    }
    */

}
