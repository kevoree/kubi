/**
 * Created by jerome on 03/06/15.
 */

var periodViewVar = {
    universe : 0,
    model : new org.kubi.KubiModel()
}


function testPeriod(model){
    periodViewVar.model = model;
}


/**
 * initialize the template to fill the htmlIdTarget at the time timeTemplate iun the universe universeTemplate
 * @param htmlIdTarget
 * @param universeTemplate
 * @param timeTemplate
 */
function initTemplatePeriod(htmlIdSource, htmlIdTarget, universeTemplate, timeTemplate) {
    var viewPeriod = periodViewVar.model.universe(universeTemplate).time(timeTemplate);
    viewPeriod.getRoot(function (rootNow) {
        try{
            var template = paperclip.template((document.getElementById(htmlIdSource)).innerHTML);
            var view = template.view({ecosystem: rootNow });
            console.log("/======5====/",view.render());
            (document.getElementById(htmlIdTarget)).appendChild(view.render());

        }
        catch (e) {
            console.error(htmlIdSource, " has some issues initializing the template.",e);
        }
    });
}

    paperclip.modifiers.timestampToDate = function (timestamp){
        return (new Date(timestamp));
    }
