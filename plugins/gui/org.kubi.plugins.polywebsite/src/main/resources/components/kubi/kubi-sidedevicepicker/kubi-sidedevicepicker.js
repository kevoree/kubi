/**
 * Created by jerome on 03/06/15.
 */
var nunjucks;
var kModelTemplate = new org.kubi.KubiModel();

var sideDevicePicker = {
    universe : 0
}


function setModelForTemplate(modelForTemplate) {
    kModelTemplate = modelForTemplate;
    sideDevicePicker.model = modelForTemplate;
}


/**
 * initialize the template htmlIdSource to fill the htmlIdTarget at the time timeTemplate iun the universe universeTemplate
 * @param htmlIdSource
 * @param htmlIdTarget
 * @param universeTemplate
 * @param timeTemplate
 */
function initTemplate(htmlIdTarget, universeTemplate, timeTemplate) {
    var viewTemplate = kModelTemplate.universe(universeTemplate).time((new Date()).getTime());
    viewTemplate.getRoot(function (rootNow) {
        try {
            var template = paperclip.template(
                //'<p>ecosystem.name</p>'
                '<ul id="nav-mobile" class="side-nav fixed" repeat.each="{{ ecosystem.technologies }}" repeat.as="techno">'
                //'<ul id="nav-mobile" class="side-nav fixed">'
                //    +'<repeat each="{{ ecosystem.technologies }}" as="techno">'
                //        +'<li>coucou</li>'
                //    +'</repeat>'
                    +'<li>'
                        +'<p class="filled-in" >{{techno.name}} :</p>'
                        +'<ul repeat.each="{{techno.devices}}" repeat.as="{{device}}">'
                            +'<li>'
                                +'<input name="radioDevicePicker-group" class="filled-in" value="{{device.name}}" type="checkbox" checked="checked" id="radio{{device.name}}"/>'
                                +'<label for="radio{{device.name}}">{{device.name}}</label>'
                            +'</li>'
                        +'</ul>'
                    +'</li>'
                +'</ul>'
            );
            var view = template.view({ecosystem: rootNow });
            console.log("/======4====/",view.render());
            (document.getElementById(htmlIdTarget)).appendChild(view.render());
        }
        catch (e) {
            console.error(htmlIdTarget, " has some issues initializing the template.",e);
        }
    });
}

    //<ul id="nav-mobile" class="side-nav fixed">
        //{% asyncEach techno in ecosystem.technologies %}
            //<li>
                //<p class="filled-in" >{{techno.name}} :</p>
                //<ul>
                    //{% asyncEach device in techno.devices %}
                        //<li>
                            //<input name="radioDevicePicker-group" class="filled-in" value="{{device.name}}" type="checkbox" checked="checked" id="radio{{device.name}}"/>
                            //<label for="radio{{device.name}}">{{device.name}}</label>
                        //</li>
                    //{% endeach %}
                //</ul>
            //</li>
        //{% endeach %}
    //</ul>

//  var template = paperclip.template('
// <b>uuid:{{elem.uuid}}/value:{{elem.value}}</b>
// <input class="form-control" type="text" value="{{ <~>value }}"></input>
// <ul repeat.each="{{elem.sensors}}" repeat.as="i">
    // <li>
        // item {{i}} <br />
    // </li>
// </ul>');
//var template = paperclip.template('elem({{elem.uuid}}),val={{elem.value}} <br /><input class="form-control" type="text" value="{{ <~>elem.value }}" />');
//var view = template.view({elem: obj });
//document.body.appendChild(view.render());






/**
 * initialize the template htmlIdSource to fill the htmlIdTarget at the time timeTemplate iun the universe universeTemplate
 * @param htmlIdSource
 * @param htmlIdTarget
 * @param universeTemplate
 * @param timeTemplate
 */
function initTemplateNunjunks(htmlIdSource, htmlIdTarget, universeTemplate, timeTemplate) {
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