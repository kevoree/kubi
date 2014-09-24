package org.kevoree.kubi.store.web.core;

import org.json.JSONObject;
import org.kevoree.kubi.store.factory.StoreTransaction;
import org.kevoree.kubi.store.factory.StoreTransactionManager;
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

    private StoreTransactionManager transactionManager;
    private ModelSerializer serializer;

    public DataStoreHandler(StoreTransactionManager transactionManager) {
        Log.DEBUG();
        this.transactionManager = transactionManager;
        StoreTransaction st = transactionManager.createTransaction();
        serializer = st.createJSONSerializer();
        st.close();
    }

    public void handleHttpRequest(HttpRequest httpRequest, HttpResponse httpResponse, HttpControl httpControl) throws Exception {
        StoreTransaction st = transactionManager.createTransaction();
        if(httpRequest.method().equalsIgnoreCase("get") || httpRequest.method().equalsIgnoreCase("post")) {
            JSONObject request = new JSONObject(httpRequest.body());
            Log.trace("Request.toString:" + request.toString());

            if(!request.has("method")) {
                Log.error("Request received with no datastore method!");
                httpResponse.status(500).content("Request received with no datastore method!").end();
            } else {
                if(request.getString("method").equals("get")) {
                    String content = transactionManager.getDatastore().get(request.getString("segment"), request.getString("key"));
                    Log.trace("Get Content:" + content);
                    if(content == null) {
                        Log.trace("Return 404");
                        httpResponse.status(404).header("Content-Type","text/plain").content("Found nothing in the store for key:" + request.getString("key")).end();
                    } else {
                        Log.trace("Return 200");
                        httpResponse.status(200).header("Content-Type","text/plain").content(content).end();
                    }
                } else if(request.getString("method").equals("put")) {
                    transactionManager.getDatastore().put(request.getString("segment"), request.getString("key"), request.getString("value"));
                    transactionManager.getDatastore().commit();
                    httpResponse.status(200).end();
                } else if(request.getString("method").equals("remove")) {
                    transactionManager.getDatastore().remove(request.getString("segment"), request.getString("key"));
                    transactionManager.getDatastore().commit();
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

        st.close();
    }
}
