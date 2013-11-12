package org.kevoree.kubi.store.web;

import org.json.JSONObject;
import org.kevoree.kubi.store.KubiStore;
import org.kevoree.kubi.store.Manufacturer;
import org.kevoree.kubi.store.StoreFactory;
import org.kevoree.kubi.store.serializer.JSONModelSerializer;
import org.kevoree.log.Log;
import org.kevoree.modeling.api.ModelSerializer;
import org.webbitserver.HttpControl;
import org.webbitserver.HttpHandler;
import org.webbitserver.HttpRequest;
import org.webbitserver.HttpResponse;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 11/11/2013
 * Time: 16:09
 * To change this template use File | Settings | File Templates.
 */
public class DataStoreHandler implements HttpHandler {

    private StoreFactory mainStore;
    private ModelSerializer serializer = new JSONModelSerializer();

    public DataStoreHandler(StoreFactory store) {
        Log.DEBUG();
        this.mainStore = store;
    }

    public void handleHttpRequest(HttpRequest httpRequest, HttpResponse httpResponse, HttpControl httpControl) throws Exception {
        if(httpRequest.method().equalsIgnoreCase("get") || httpRequest.method().equalsIgnoreCase("post")) {
            JSONObject request = new JSONObject(httpRequest.body());
            Log.debug("Request.toString:" + request.toString());

            if(!request.has("method")) {
                Log.error("Request received with no datastore method!");
                httpResponse.status(500).content("Request received with no datastore method!").end();
            } else {
                if(request.getString("method").equals("get")) {
                    String content = mainStore.getDatastore().get(request.getString("segment"), request.getString("key"));
                    Log.debug("Get Content:" + content);
                    if(content == null) {
                        Log.trace("Return 404");
                        httpResponse.status(404).header("Content-Type","text/plain").content("Found nothing in the store for key:" + request.getString("key")).end();
                    } else {
                        Log.trace("Return 200");
                        httpResponse.status(200).header("Content-Type","text/plain").content(content).end();
                    }
                } else if(request.getString("method").equals("put")) {
                    mainStore.getDatastore().put(request.getString("segment"), request.getString("key"), request.getString("value"));
                    mainStore.commit();
                    httpResponse.status(200).end();
                } else if(request.getString("method").equals("remove")) {
                    mainStore.getDatastore().remove(request.getString("segment"), request.getString("key"));
                    mainStore.commit();
                    httpResponse.status(200).end();
                } else {
                    Log.error("Request received with unsupported method:" + httpRequest.method());
                    httpResponse.status(500).end();
                }
            }

        } else {
            Log.error("HttpRequest received with unsupported method:" + httpRequest.method());
            httpResponse.status(500).content("HttpRequest received with unsupported method:" + httpRequest.method()).end();
        }
    }
}
