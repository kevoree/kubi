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


    public static JSONObject toJSON(Message zWaveMessage) {

        if(zWaveMessage instanceof ZW_ApplicationCommandHandler) {
            ZW_ApplicationCommandHandler typedMessage = (ZW_ApplicationCommandHandler)zWaveMessage;
            try {

                JSONObject content = new JSONObject();
                content.put("technology", "Z-Wave");
                content.put("CLASS", "REPORT");
                content.put("nodeId",typedMessage.getSourceNode());
                content.put("ACTION",typedMessage.getCommandClass().getName() + "::" + typedMessage.getCommandFunction().getName());

                String str = typedMessage.toString();
                content.put("raw",str);

                /* The terms power and energy are frequently confused.
                 * The BTU is most often used as a measure of power (as BTU/h)
                 * So we convert to watt that is also a measure of power (Joules/s)
                 * Watts*hour (Joules)
                 * */
                //1 Btu/hour = 1 055.0559 joule/hour
                //1 Btu/hour = O.29307107 joule/second => Watts
                 /* precision:0.100000, scale:BTU/h, value:0 */
                int deb = str.indexOf("precision:")+10;
                String valuePrecision = str.substring( deb, str.indexOf(",", deb) );
                double consumptionPrecision = new Double(valuePrecision);
                //
                String value = str.substring( str.indexOf("value:")+6, str.indexOf("]"));
                double consumptionWatts = new Double(value) * consumptionPrecision;
                /*double wattsPerHours = SteadyStateConsumption / timeToReachSteadyState */;
                /*double wattsHours = (SteadyStateConsumption * timeToReachSteadyState) + (SteadyStateConsumption * duration) */
                int debS = str.indexOf("scale:")+6;
                String sc = str.substring(debS, str.indexOf(",",debS));
                if( sc.equalsIgnoreCase("null") ){
                    content.put("dataRec", consumptionWatts);
                } else {
                    content.put("dataInstant", consumptionWatts);
                }

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
}
