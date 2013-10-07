/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 07/10/13
 * Time: 10:50
 * To change this template use File | Settings | File Templates.
 */


var KubiFunctionList = function() {


    var initialize = function() {
        var divContainer = $("div.kubiFunctionList");
        divContainer.addClass("dropdown");
        divContainer.id = "dropdown-component";

        $('<a id="dropdown-link" role="button" data-toggle="dropdown" href="#">Choose...<b class="caret"></b></a>').appendTo(divContainer);

        var list = $('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>');
        var listElem = $('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">Startup</a></li>');
        listElem.appendTo(list);
        list.appendTo(divContainer);
    };


    var privateReplaceList = function(modelElem) {
        clearList();
        var dropDownMenu = $('.dropdown-menu');

        if(modelElem.services != undefined) {
            for(var srv in modelElem.services.array) {
                var localService = modelElem.services.array[srv];
                $('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' +localService.function.name+'</a></li>').appendTo(dropDownMenu);
            }

            KubiUiActionsHandler.initDropdownMenuElements();
        }

    };

    var clearList = function() {
        var dropDownMenu = $('.dropdown-menu');
        dropDownMenu.empty();
        console.log("DopdownLink", $("a#dropdown-link"));
        $("a#dropdown-link").each(function(){this.innerHTML = "Choose...<b class=\"caret\"></b>";});
    };


    return {
        init : function(){
            initialize();
        },
        replaceList : function(modelElem) {
            privateReplaceList(modelElem);
        },
        clearList : clearList()
    };


}();







