/**
 * Created by jerome on 03/06/15.
 */
var sideDevicePicker = {
    universe : 0
}


function setModelForTemplate(modelForTemplate) {
    sideDevicePicker.model = modelForTemplate;
}


/**
 * initialize the template htmlIdSource to fill the htmlIdTarget at the time timeTemplate iun the universe universeTemplate
 * @param htmlIdSource
 * @param htmlIdTarget
 * @param universeTemplate
 * @param timeTemplate
 */
function initTemplate(htmlIdSource, htmlIdTarget, universeTemplate, timeTemplate) {
    var viewTemplate = sideDevicePicker.model.universe(universeTemplate).time(timeTemplate);
    viewTemplate.getRoot(function (rootNow) {
        try {
            var template = paperclip.template((document.getElementById(htmlIdSource)).innerHTML);
            var view = template.view({ecosystem: rootNow });
            (document.getElementById(htmlIdTarget)).appendChild(view.render());
        }
        catch (e) {
            console.error(htmlIdTarget, " has some issues initializing the template.",e);
        }
    });
}
