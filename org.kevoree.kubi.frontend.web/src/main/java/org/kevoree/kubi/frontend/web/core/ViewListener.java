package org.kevoree.kubi.frontend.web.core;

import org.json.JSONObject;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 19/11/2013
 * Time: 11:53
 * To change this template use File | Settings | File Templates.
 */
public interface ViewListener {

    void actionPerformed(JSONObject message);
}
