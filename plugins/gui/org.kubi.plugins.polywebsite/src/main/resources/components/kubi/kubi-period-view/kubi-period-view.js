/**
 * Created by jerome on 03/06/15.
 */
var nunjuckPeriod;
var kModelPeriod = new org.kubi.KubiModel();


function testPeriod(model){
    kModelPeriod = model;
}


/**
 * initialize the template htmlIdSource to fill the htmlIdTarget at the time timeTemplate iun the universe universeTemplate
 * @param htmlIdSource
 * @param htmlIdTarget
 * @param universeTemplate
 * @param timeTemplate
 */
function initTemplatePeriod(htmlIdSource, htmlIdTarget, universeTemplate, timeTemplate) {
    var viewTemplate = kModelPeriod.universe(universeTemplate).time(timeTemplate);
    viewTemplate.getRoot().then(function (rootNow) {
        nunjuckPeriod.configure({autoescape: true});
        try {
            // init the graph
            nunjuckPeriod.renderString((document.getElementById(htmlIdSource)).innerHTML, {
                ecosystem: rootNow,
                model: kModelPeriod,
                autoRefresh: true,
                autoescape: true,
                autoNow: true
            }, function (err, res) {
                if (err) {
                    console.log(err);
                }
                try {
                    (document.getElementById(htmlIdTarget)).innerHTML = res;
                }
                catch (e) {
                    console.log(e);
                }
            });
        }
        catch (e) {
            console.error(htmlIdSource, " has some issues initializing the template.");
            e.printStackTrace();
        }
    });
}