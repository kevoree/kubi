/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 07/10/13
 * Time: 11:24
 * To change this template use File | Settings | File Templates.
 */


var module = Kotlin.modules['org.kevoree.kubi'];
var smartGridModel;
var saver;
var loader;
var cloner;
var compare;
var factory;
var selectedNode;
var selectedAction;


var KubiKernel = function(){

    return {
        init : function() {
            smartGridModel = null;
            factory = new module.org.kevoree.kubi.factory.DefaultKubiFactory();
            loader = factory.createJSONLoader();
            saver = factory.createJSONSerializer();
            cloner = factory.createModelCloner();
            compare = factory.createModelCompare();
            selectedNode = null;
            selectedAction = null;
        },
       // module : function(){return module},
        getKubiModel : function(){return smartGridModel},
        getSaver : function(){return saver},
        getLoader : function(){return loader},
        getCloner : function(){return cloner},
        getCompare : function(){return compare},
        getFactory : function(){return factory},
        getSelectedNode : function(){return selectedNode},
        getSelectedAction : function(){return selectedAction},

        setKubiModel : function(model){smartGridModel=model},
        setSelectedNode : function(node){return selectedNode = node},
        setSelectedAction : function(action){return selectedAction = action},

        setLogLevelToDebug : function() {
            module.org.kevoree.log.Log.DEBUG();
        },
        createModelVisitor : function() {
            return new module.org.kevoree.modeling.api.util.ModelVisitor();
        }
    }

}();



