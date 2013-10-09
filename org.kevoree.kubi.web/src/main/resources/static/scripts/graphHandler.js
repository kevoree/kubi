/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 07/10/13
 * Time: 11:23
 * To change this template use File | Settings | File Templates.
 */


var KubiGraphHandler = function(){

    var graph = null;
    var graphics = null;
    var layout = null;
    var renderer = null;


    var privateRefreshModel = function() {
        graph.beginUpdate();
        //TODO incremental modification
        graph.clear();

        graph.endUpdate();

        graph.beginUpdate();

        var childVisitor = KubiKernel.createModelVisitor();
        // TODO check why it is not possible to put outside the refresh method

        /* ugly hack */
        graph.addNode('home',{id:'home', metaClassName:function(){return 'home';}});
        //console.log("Adding node 'home'");

        //Add nodes
        $.each(KubiKernel.getKubiModel().nodes.array, function (key, val) {
            //console.log("Element in Nodes", val);
            if (val.metaClassName() == "org.kevoree.kubi.Node" || val.metaClassName() == "org.kevoree.kubi.Gateway") {
                graph.addNode(val.id, val);
               // console.log("Adding node id:" + val.id, val);
            }
        });

        //add links
        $.each(KubiKernel.getKubiModel().nodes.array, function (key, val) {
            if (val.metaClassName() == "org.kevoree.kubi.Node" || val.metaClassName() == "org.kevoree.kubi.Gateway") {
                var node = val;
                $.each(val.links.array, function (key, val2) {
                   // console.log("Linking "+node.id+" with " +val2.id);
                    graph.addLink(node.id, val2.id);
                });
                if(val.metaClassName() == "org.kevoree.kubi.Gateway"){
                    //console.log("Linking "+node.id+" with 'home'");
                    graph.addLink(node.id, 'home');
                }
            }
        });

/*
        Object.getPrototypeOf(childVisitor).visit = function (modelElem) {
            if (modelElem.metaClassName() == "org.kevoree.kubi.Node") {
                graph.addNode(modelElem.id, modelElem);
                $.each(modelElem.links.array, function (key, val) {
                    console.log("linking ", key, val);
                    graph.addLink(modelElem.id, val.id);
                });
                /* ugly hack


            }
        }
*/

        //KubiKernel.smartGridModel.visit(childVisitor, true, true, false);
        graph.endUpdate();
        renderer.run(5);

        console.log("ModelUpdated!");
    };

    var initGraph = function() {
        graph = Viva.Graph.graph();
        layout = Viva.Graph.Layout.forceDirected(graph, {
            springLength: 30,
            springCoeff: 0.0008,
            dragCoeff: 0.02,
            gravity: -1.2
        });
    };

    var initGraphics = function() {
        graphics = Viva.Graph.View.svgGraphics();
        graphics.node(function (node) {
            var modelElem = node.data;
            var nodeUI = Viva.Graph.svg('rect');

            if(modelElem.id == "home") {
                nodeUI.attr('width', 20)
                    .attr('height', 20)
                    .attr('fill', 'black');
            } else {
                if(modelElem != undefined && modelElem.metaClassName != undefined){
                    switch (modelElem.metaClassName()) {
                        /*
                         case "smartgrid.core.CentralSystem":
                         var color = currentState != 'Active' ? 'grey' : 'red';
                         nodeUI.attr('width', 10)
                         .attr('height', 10)
                         .attr('fill', color);
                         break;

                         case "smartgrid.core.Hub":
                         var color = currentState != 'Active' ? 'grey' : 'yellow';
                         nodeUI.attr('width', 10)
                         .attr('height', 10)
                         .attr('fill', color);
                         break;
                         */

                         case "org.kevoree.kubi.Gateway":
                         nodeUI.attr('width', 15)
                         .attr('height', 15)
                         .attr('fill', 'orange');
                         break;
                        default: {
                            nodeUI.attr('width', 10)
                                .attr('height', 10)
                                .attr('fill', 'blue');
                            break;
                        }

                    }
                } else {
                    nodeUI.attr('width', 10)
                        .attr('height', 10)
                        .attr('fill', 'blue');
                }
            }




/*
            $(nodeUI).hover(function () { // mouse over
                highlightRelatedNodes(node.id, true,nodeUI);
            }, function () { // mouse out
                highlightRelatedNodes(node.id, false,nodeUI);
            });
            */

            $(nodeUI).click(function () { // click
                //console.log("this",this);
                //console.log("Node",node);

                KubiKernel.setSelectedNode(node);

                document.getElementById("entity_id").innerHTML = modelElem.id;
                document.getElementById("entity_technology").innerHTML = modelElem.technology.name;

                var metaClassShort = modelElem.metaClassName()
                metaClassShort = modelElem.metaClassName().substring(metaClassShort.lastIndexOf('.') + 1)
                document.getElementById("entity_metaclass").innerHTML = metaClassShort;

                KubiFunctionList.replaceList(modelElem)

            });

            // when user hovers mouse over a node:
            var highlightRelatedNodes = function (nodeId, isOn,nodeUI) {
                // just enumerate all realted nodes and update link color:
                nodeUI.attr('fill', isOn ? 'orange' : 'blue');
                graph.forEachLinkedNode(nodeId, function (node, link) {
                    if (link && link.ui) {
                        // link.ui is a special property of each link
                        // points to the link presentation object.
                        link.ui.attr('stroke', isOn ? 'orange' : 'gray');
                    }
                });
            };

            return nodeUI;
        });
    };

    var initRenderer = function() {
        renderer = Viva.Graph.View.renderer(graph,
            {
                layout: layout,
                graphics: graphics,
                container: document.getElementById('graphContainer'),
                renderLinks: true
            });
    };


    return {

        init : function() {
            initGraph();
            initGraphics();
            initRenderer();
        },
        refreshModel : function () {
            privateRefreshModel();
        }



    };

}();


