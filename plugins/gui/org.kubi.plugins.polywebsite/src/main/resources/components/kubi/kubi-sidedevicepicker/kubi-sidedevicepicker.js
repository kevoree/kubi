/**
 * Created by jerome on 03/06/15.
 */
var nunjucks;
var kModelTemplate = new org.kubi.KubiModel();


function setModelForTemplate(modelForTemplate) {
    kModelTemplate = modelForTemplate;
}


/**
 * initialize the template htmlIdSource to fill the htmlIdTarget at the time timeTemplate iun the universe universeTemplate
 * @param htmlIdSource
 * @param htmlIdTarget
 * @param universeTemplate
 * @param timeTemplate
 */
function initTemplate(htmlIdSource, htmlIdTarget, universeTemplate, timeTemplate) {
    var viewTemplate = kModelTemplate.universe(universeTemplate).time(timeTemplate);
    viewTemplate.getRoot(function (rootNow) {
        console.log("/***    -------  ",rootNow, kModelTemplate);
        //nunjucks.configure({autoescape: true});
        try {
            // init the graph
            nunjucks.renderString((document.getElementById(htmlIdSource)).innerHTML, {
                ecosystem: rootNow,
                model: kModelTemplate,
                autoRefresh: true,
                autoescape: true,
                autoNow: true
            }, function (err, res) {
                if (err) {
                    console.error("An error occurred in the renderString\n", err);
                }
                try {
                    (document.getElementById(htmlIdTarget)).innerHTML = res;
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
        catch (e) {
            console.error(htmlIdSource, " has some issues initializing the template.");
            e.printStackTrace();
        }
    });
}