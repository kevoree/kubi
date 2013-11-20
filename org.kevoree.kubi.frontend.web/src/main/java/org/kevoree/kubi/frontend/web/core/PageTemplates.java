package org.kevoree.kubi.frontend.web.core;

/*
* Author : Gregory Nain (developer.name@uni.lu)
* Date : 10/10/13
*/

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;

public class PageTemplates {

    private static HashMap<String, JSONObject> templates = new HashMap<String, JSONObject>();

    static {
        templates.put("Home", createHomeTemplate());
        templates.put("Network", createNetworkTemplate());
        templates.put("Administrate", createAdministrateTemplate());
    }

    public static JSONObject getPageTemplateFor(String menuName) {
        JSONObject template = templates.get(menuName);
        if(template != null) {
            return template;
        }
        return new JSONObject();
    }

    private static JSONObject createHomeTemplate() {
        JSONObject template = new JSONObject();
        StringBuilder links = new StringBuilder();
        StringBuilder scripts = new StringBuilder();
        StringBuilder content = new StringBuilder();
        try {


            BufferedReader br = new BufferedReader(new InputStreamReader(PageTemplates.class.getClassLoader().getResourceAsStream("static/pages/home.html")));
            String line = br.readLine();
            while(line != null) {
                content.append(line);
                line = br.readLine();
            }

            links.append("<link rel=\"stylesheet\" href=\"css/bootstrap-switch.css\">");

            scripts.append("<script src=\"lib/bootstrap-switch.min.js\"></script>\n");
            scripts.append("<script src=\"scripts/home/homePageScripts.js\"></script>\n");
            scripts.append("<script>\n" +
                    "            KubiHome.init();\n" +
                    "            </script>\n");

            template.put("LINKS", links.toString());
            template.put("SCRIPTS", scripts.toString());
            template.put("CONTENT", content.toString());

        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return template;
    }

    private static JSONObject createNetworkTemplate() {
        JSONObject template = new JSONObject();
        StringBuilder links = new StringBuilder();
        StringBuilder scripts = new StringBuilder();
        StringBuilder content = new StringBuilder();

        try {

            BufferedReader br = new BufferedReader(new InputStreamReader(PageTemplates.class.getClassLoader().getResourceAsStream("static/pages/network.html")));
            String line = br.readLine();
            while(line != null) {
                content.append(line);
                line = br.readLine();
            }


            scripts.append("<script src=\"scripts/network/graphHandler.js\"></script>\n");
            scripts.append("<script src=\"scripts/kubiFunctionList.js\"></script>\n");
            scripts.append("<script src=\"lib/vivagraph.js\"></script>\n");
            scripts.append("<script src=\"scripts/network/uiActionsHandler.js\"></script>\n");
            scripts.append("<script>\n" +
                    "            KubiFunctionList.init();\n" +
                    "            KubiGraphHandler.init();\n" +
                    "            KubiGraphHandler.refreshModel();\n" +
                    "            KubiUiActionsHandler.initAll();\n" +
                    "            </script>\n");


            template.put("LINKS", links.toString());
            template.put("SCRIPTS", scripts.toString());
            template.put("CONTENT", content.toString());

        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return template;
    }

    private static JSONObject createAdministrateTemplate() {
        JSONObject template = new JSONObject();
        StringBuilder links = new StringBuilder();
        StringBuilder scripts = new StringBuilder();
        StringBuilder content = new StringBuilder();
        try {


            BufferedReader br = new BufferedReader(new InputStreamReader(PageTemplates.class.getClassLoader().getResourceAsStream("static/pages/administration.html")));
            String line = br.readLine();
            while(line != null) {
                content.append(line);
                line = br.readLine();
            }


            scripts.append("<script src=\"scripts/admin/adminPageScripts.js\"></script>\n");
            scripts.append("<script>\n" +
                    "            KubiAdminPage.init();" +
                    "       </script>\n");

            template.put("LINKS", links.toString());
            template.put("SCRIPTS", scripts.toString());
            template.put("CONTENT", content.toString());

        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return template;
    }

}
