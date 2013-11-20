/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 10/10/13
 * Time: 17:21
 * To change this template use File | Settings | File Templates.
 */




var KubiMenuHandler = function(){

    return {
        initMenuItems : function() {
            $('.kubiMenuItem').click(function() {
                var request = {};
                request.CLASS = "PAGE_TEMPLATE";
                request.ACTION = "GET";
                request.CONTENT = $(this).text();
                WebSocketHandler.send(JSON.stringify(request));
                $("ul.nav li").removeClass("active");
                $(this).closest("li").addClass("active");
            });
        },
        applyPage : function(pageTemplate) {
            $('.kubiRemoveable').remove();

            var pageContentBody = $('#kubiMainContainer');
            var body = $('body');
            var head = $('head');

            pageContentBody.html($(pageTemplate.CONTENT).addClass("kubiRemoveable"));
            head.append($(pageTemplate.LINKS).addClass("kubiRemoveable"));
            body.append($(pageTemplate.SCRIPTS).addClass("kubiRemoveable"));

        }
    }
}();


