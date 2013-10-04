package org.kevoree.kubi.web;

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

    public WebSocketServerHandler() {
        Log.set(Log.LEVEL_DEBUG);
        //init default Model
        //TODO REMOVE
        model = factory.createKubiModel();
        //create GW
        for (int i = 0; i < 2; i++) {
            Node gw = factory.createNode();
            gw.setId("gw_" + i);
            model.addNodes(gw);
            for (int j = 0; j < 5; j++) {
                Node devices = factory.createNode();
                devices.setId("devices_" + i + "_" + j);
                model.addNodes(devices);
                gw.addLinks(devices);
            }
        }

        //END TODO REMOVE
        model.addModelTreeListener(new ModelTreeListener() {
            public void elementChanged(ModelEvent event) {
                //TODO incremental update
                for (WebSocketConnection connection : openConnections) {
                    connection.send(saver.serialize(model));
                }
            }
        });
    }

    public void onOpen(WebSocketConnection connection) {
        openConnections.add(connection);
        connection.send(saver.serialize(model));
    }

    public void onClose(WebSocketConnection connection) {
        openConnections.remove(connection);
    }

    public void onMessage(WebSocketConnection connection, String message) {
        Log.info("rec from client : "+message);

        //connection.send(saver.serialize(model));
    }

    public KubiModel getModel() {
        return model;
    }

}
