package org.kevoree.kubi.store.model;

import org.json.JSONObject
import java.net.URL
import java.net.HttpURLConnection
import java.io.OutputStreamWriter
import java.io.InputStreamReader
import java.io.BufferedInputStream
import java.net.URLConnection
import java.io.BufferedReader

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 11/11/2013
 * Time: 18:06
 * To change this template use File | Settings | File Templates.
 */


open class HttpDataStore(val masterAddress : String) : org.kevoree.modeling.api.persistence.DataStore {

    val url = URL(masterAddress);


    override fun get(segment: String, key: String): String? {
        val request = JSONObject();
        request.put("method", "get");
        request.put("segment", segment);
        request.put("key", key);
        return sendCommand(request, true);
    }
    override fun put(segment: String, key: String, value: String) {
        val request = JSONObject();
        request.put("method", "put");
        request.put("segment", segment);
        request.put("key", key);
        request.put("value", value);
        sendCommand(request, false);
    }
    override fun remove(segment: String, key: String) {
        val request = JSONObject();
        request.put("method", "remove");
        request.put("segment", segment);
        request.put("key", key);
        sendCommand(request, false);
    }
    override fun sync() {
        throw UnsupportedOperationException()
    }


    private fun sendCommand(msg : JSONObject, waitResponse : Boolean) : String? {

        val stringBuilder = StringBuilder();
        val connection = url.openConnection() as URLConnection;
        connection.setDoOutput(true);

        val writer = OutputStreamWriter(connection.getOutputStream()!!);
        writer.write(msg.toString()!!);
        writer.flush();
        writer.close();

        if(waitResponse) {
            val isr = BufferedInputStream(connection.getInputStream()!!);
            while(isr.available()>0) {
                stringBuilder.append(isr.read().toChar());
            }

            return stringBuilder.toString();
        } else {
            return null;
        }
    }

}

