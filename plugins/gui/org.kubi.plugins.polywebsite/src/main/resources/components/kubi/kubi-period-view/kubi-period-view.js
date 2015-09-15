/**
 * Created by jerome on 03/06/15.
 */

var periodViewVar = periodViewVar || {
    universe : 0
}


function testPeriod(model){
    periodViewVar.model = model;
    periodViewVar.modelContext = periodViewVar.model.createModelContext();
    periodViewVar.modelContext.set((new Date()).getTime(),org.kevoree.modeling.KConfig.END_OF_TIME,0,0);
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
            var view = template.view({ecosystem: rootNow }, {modelContext : periodViewVar.modelContext});
            (document.getElementById(htmlIdTarget)).appendChild(view.render());

        }
        catch (e) {
            console.error(htmlIdSource, " has some issues initializing the template.",e);
        }
    });
}
