/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 07/10/13
 * Time: 11:24
 * To change this template use File | Settings | File Templates.
 */


var module = Kotlin.modules['org.kevoree.kubi.model.js'];
var smartGridModel;
var saver;
var loader = new module.org.kevoree.kubi.loader.JSONModelLoader();
var cloner;
var compare;
var factory;
var selectedNode;
var selectedAction;


var KubiKernel = function(){

    return {
        init : function() {
            smartGridModel = null;
            saver = new module.org.kevoree.kubi.serializer.JSONModelSerializer();
            cloner = new module.org.kevoree.kubi.cloner.DefaultModelCloner();
            compare = new module.org.kevoree.kubi.compare.DefaultModelCompare();
            factory = new module.org.kevoree.kubi.impl.DefaultKubiFactory();
            selectedNode = null;
            selectedAction = null;
        },
       // module : function(){return module},
        smartGridModel : function(){return smartGridModel},
        saver : function(){return saver},
        loader : loader,
        cloner : function(){return cloner},
        compare : function(){return compare},
        factory : function(){return factory},
        selectedNode : function(){return selectedNode},
        selectedAction : function(){return selectedAction},
        setLogLevelToDebug : function() {
            module.org.kevoree.log.Log.DEBUG();
        },
        createModelVisitor : function() {
            return new module.org.kevoree.modeling.api.util.ModelVisitor();
        }
    }

}();



