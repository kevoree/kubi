/// <reference path="org.kubi.model.d.ts" />
/// <reference path="org.kevoree.modeling.database.websocket.WebSocket.d.ts" />
var nunjucks;


var universeNumber :number = 0;
var timeNow: number=(new Date()).getTime();
initTemplate("radioDevicePicker-template", "radioDevicePicker", universeNumber, timeNow);


/**
 * initialize the template htmlIdSource to fill the htmlIdTarget at the time timeTemplate iun the universe universeTemplate
 * @param htmlIdSource
 * @param htmlIdTarget
 * @param universeTemplate
 * @param timeTemplate
 */
function initTemplate(htmlIdSource: string, htmlIdTarget: string, universeTemplate:number, timeTemplate:number){
    var viewTemplate = document.getElementById("modelhandler").model.universe(universeTemplate).time(timeTemplate);
    viewTemplate.getRoot().then(function (rootNow) {
        nunjucks.configure({autoescape: true});
        try {
            // init the graph
            nunjucks.renderString((document.getElementById(htmlIdSource)).innerHTML, {
                ecosystem: rootNow,
                model: document.getElementById("modelhandler").model,
                autoRefresh: true,
                autoescape: true,
                autoNow: true
            }, function (err, res) {
                if (err) {
                    console.log(err);
                }
                try {
                    (document.getElementById(htmlIdTarget)).innerHTML = res;
                } catch (e) {
                    console.log(e);
                }
            });
        } catch (e) {
            console.error(htmlIdSource, " has some issues initializing the template.");
            e.printStackTrace();
        }
    });
}