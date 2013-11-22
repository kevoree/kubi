package org.kevoree.kubi.frontend.web.core;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.kubi.KubiModel;
import org.kevoree.kubi.frontend.web.cmp.KubiWebFrontend;
import org.kevoree.kubi.impl.DefaultKubiFactory;
import org.kevoree.kubi.loader.JSONModelLoader;
import org.kevoree.kubi.serializer.JSONModelSerializer;
import org.kevoree.kubi.trace.DefaultTraceSequence;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.trace.TraceSequence;
import org.webbitserver.BaseWebSocketHandler;
import org.webbitserver.WebSocketConnection;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: duke
 * Date: 27/08/13
 * Time: 22:24
 */
public class WebSocketServerHandler extends BaseWebSocketHandler {

    private KubiModel model = null;
    private JSONModelSerializer saver = new JSONModelSerializer();
    //private JSONModelLoader loader = new JSONModelLoader();
    private DefaultKubiFactory factory = new DefaultKubiFactory();
    private List<WebSocketConnection> openConnections = new ArrayList<WebSocketConnection>();
    private KubiWebFrontend component;


    public WebSocketServerHandler(KubiWebFrontend component) {
        this.component = component;
        Log.set(Log.LEVEL_DEBUG);
        //init default Model
        model = factory.createKubiModel();
    }


    public void sendModelToClients() {
        try {
            JSONObject jsonMessage = new JSONObject();
            jsonMessage.put("CLASS", "MODEL");
            jsonMessage.put("ACTION", "INIT");
            jsonMessage.put("CONTENT", saver.serialize(model));
            for (WebSocketConnection connection : openConnections) {
                connection.send(jsonMessage.toString());
            }
        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }


    public void updateModel(JSONObject content) {
        try {
            TraceSequence seq = new DefaultTraceSequence();
            seq.populateFromString(content.getString("CONTENT"));
            seq.applyOn(model);
            Log.debug("[KubiWebFrontend] Forward ModelUpdate to webClients");
            sendMessageToClients(content);
        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

    public void sendMessageToClients(JSONObject content) {
        for (WebSocketConnection connection : openConnections) {
            connection.send(content.toString());
        }
    }

    public void sendPageTemplateToClient(JSONObject content, WebSocketConnection client) {

        try {
            JSONObject jsonMessage = new JSONObject();
            jsonMessage.put("CLASS", "PAGE_TEMPLATE");
            jsonMessage.put("ACTION", "REPORT");
            jsonMessage.put("CONTENT", content);
            client.send(jsonMessage.toString());

        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

    public void onOpen(WebSocketConnection connection) {
        openConnections.add(connection);
        sendModelToClients();
        //connection.send(saver.serialize(model));
    }

    public void onClose(WebSocketConnection connection) {
        openConnections.remove(connection);
    }

    public void onMessage(WebSocketConnection connection, String message) {
        try {

            Log.info("rec from client ("+connection.hashCode()+"): " + message);
            JSONObject msg = new JSONObject(message);

            if(msg.has("CLASS")) {
                String messageClass = msg.getString("CLASS");
                String messageAction = msg.getString("ACTION");
                if( messageClass.equals("PAGE_TEMPLATE")) {
                    if(messageAction.equals("GET")) {
                        sendPageTemplateToClient(PageTemplates.getPageTemplateFor(msg.getString("CONTENT")), connection);
                    }
                } else if(messageClass.equals("ACTION") || messageClass.equals("ADMIN")) {
                    component.messageReceivedFromWebClients(msg);
                } else {
                    Log.warn("Received message with unknown messageType:" + messageClass);
                }
            } else {
                Log.warn("Received message with no messageType:" + msg);
            }



        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

    }


}
