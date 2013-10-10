package org.kevoree.kubi.web;

import org.json.JSONException;
import org.json.JSONObject;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.events.ModelEvent;
import org.kevoree.modeling.api.events.ModelTreeListener;
import org.kevoree.kubi.KubiModel;
import org.kevoree.kubi.Node;
import org.kevoree.kubi.impl.DefaultKubiFactory;
import org.kevoree.kubi.loader.JSONModelLoader;
import org.kevoree.kubi.serializer.JSONModelSerializer;
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
    private JSONModelLoader loader = new JSONModelLoader();
    private DefaultKubiFactory factory = new DefaultKubiFactory();
    private List<WebSocketConnection> openConnections = new ArrayList<WebSocketConnection>();
    private SyncServerApp mainApp;


    public WebSocketServerHandler(SyncServerApp app) {
        mainApp = app;
        Log.set(Log.LEVEL_DEBUG);
        //init default Model
        model = factory.createKubiModel();
    }

    public void sendModelToClients() {
        try {
            JSONObject jsonMessage = new JSONObject();
            jsonMessage.put("messageType", "MODEL");
            jsonMessage.put("content", saver.serialize(model));
            for (WebSocketConnection connection : openConnections) {
                connection.send(jsonMessage.toString());
            }
        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

    public void sendMessageToClients(JSONObject content) {

        try {
            JSONObject jsonMessage = new JSONObject();
            jsonMessage.put("messageType", "MESSAGE");
            jsonMessage.put("content", content);

            for (WebSocketConnection connection : openConnections) {
                connection.send(jsonMessage.toString());
            }
        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

    public void sendPageTemplateToClient(JSONObject content, WebSocketConnection client) {

        try {
            JSONObject jsonMessage = new JSONObject();
            jsonMessage.put("messageType", "PAGE_TEMPLATE");
            jsonMessage.put("content", content);
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

            if(msg.has("messageType")) {
                String messageType = msg.getString("messageType");
                if( messageType.equals("MESSAGE")) {
                    mainApp.messageReceivedFromClient(msg.getJSONObject("content"));
                } else if(messageType.equals("PAGE_TEMPLATE")) {
                    sendPageTemplateToClient(PageTemplates.getPageTemplateFor(msg.getString("content")), connection);
                } else {
                    Log.warn("Received message with unknown messageType:" + messageType);
                }
            } else {
                Log.warn("Received message with no messageType:" + msg);
            }



        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

    }

    public KubiModel getModel() {
        return model;
    }

}
