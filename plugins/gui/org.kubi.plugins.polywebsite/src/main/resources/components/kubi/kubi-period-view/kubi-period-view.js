/**
 * Created by jerome on 03/06/15.
 */

var periodViewVar = {
    universe : 0
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
            (document.getElementById(htmlIdTarget)).appendChild(view.render());

        }
        catch (e) {
            console.error(htmlIdSource, " has some issues initializing the template.",e);
        }
    });
}

paperclip.modifiers.timestampToDate = function (timestamp){
    var date = new Date(timestamp);
    return (date.getDate()<10?("0"+date.getDate()):date.getDate())+"/"
        +   ((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"/"
        +   (date.getFullYear()) +" At "
        +   (date.getHours()<10?("0"+date.getHours()):date.getHours()) +":"
        +   (date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes())+":"
        +   (date.getSeconds()<10?("0"+date.getSeconds()):date.getSeconds());
}