/**
 * Created by jin-yc10 on 15/10/17.
 */
/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {
    var container = new UI.Panel();
    container.setId( 'sidebar' );

    container.add( new Sidebar.Scene( editor ) );
    container.add( new Sidebar.Info( editor ) );
    return container;
};

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Scene = function ( editor ) {
    var signals = editor.signals;
    var container = new UI.CollapsiblePanel();
    container.setCollapsed( editor.config.getKey( 'ui/sidebar/scene/collapsed' ) );
    container.onCollapsedChange( function ( boolean ) {
        editor.config.setKey( 'ui/sidebar/scene/collapsed', boolean );
    } );
    container.addStatic( new UI.Text( 'SCENE' ) );

    var ZTree = new UI.Panel();
    ZTree.dom.id = 'ZTreeContainer';

    // editor.selectById( parseInt( outliner.getValue() ) );
    // editor.focusById( parseInt( outliner.getValue() ) );
    container.add( ZTree );
    var zNodes =[
    ];
    function dropPrev(treeId, nodes, targetNode) {
        return true;
    }
    function dropInner(treeId, nodes, targetNode) {
        return targetNode.type !== "Strand";
    }
    function dropNext(treeId, nodes, targetNode) {
        return true;
    }

    function beforeDrag(treeId, treeNodes) {
        return treeNodes.level !== 0;
    }
    function beforeDragOpen(treeId, treeNode) {
//        autoExpandNode = treeNode;
        return true;
    }
    function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
        return targetNode.type !== "Strand";
    }
    function onDrag(event, treeId, treeNodes) {
    }
    function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
    }
    function onExpand(event, treeId, treeNode) {
    }

    var setting = {
        edit: {
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: false,
            drag: {
                autoExpandTrigger: true,
                prev: dropPrev,
                inner: dropInner,
                next: dropNext
            }
        },
        view: {
            showLine: true,
            showIcon: true,
            selectedMulti: false,
            dblClickExpand: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: function(event, treeId, treeNode, clickFlag) {
                console.log("ztree onClick");
                editor.signals.objectSelected.dispatch(zNodes[treeNode.id]);
            },
            beforeClick: function(treeId, treeNode, clickFlag) {
            },
            beforeDrag: beforeDrag,
            beforeDrop: beforeDrop,
            beforeDragOpen: beforeDragOpen,
            onDrag: onDrag,
            onDrop: onDrop,
            onExpand: onExpand
        }
    };

    var treeContainer = $(ZTree.dom);
    var treeObj = $("<ul id=\"ZTree\" class=\"ztree\"></ul>");
    treeContainer.append(treeObj);
    $.fn.zTree.init(treeObj, setting, zNodes);
    var zTree = $.fn.zTree.getZTreeObj("ZTree");
    //editor.scene; => root zTreeNode
    zTree.addNodes(null, {
        id:editor.scene.uuid,
        pId:0,
        isParent:true,
        name:editor.scene.name});

    signals.objectAdded.add(function(object){
        console.log("Add "+object);
        var parentNode = zTree.getNodeByParam("id",object.parent.uuid);
        console.log(parentNode);
        zTree.addNodes(parentNode, {
            id:object.uuid,
            pId:parentNode.id,
            isParent:false,
            name:object.type + " - " + object.userData.type,
            type:object.userData.type
        });
        zNodes[object.uuid] = object;
    });
    signals.objectChanged.add(function(object){
        console.log("Change "+object);
    });
    signals.objectSelected.add(function(object){
        console.log("Select "+object);
        if(object === null) {
            var selectNode = zTree.getSelectedNodes()[0];
            zTree.cancelSelectedNode(selectNode);
        } else {
            var selectNode = zTree.getNodeByParam("id",object.uuid);
            zTree.selectNode(selectNode);
        }
    });
    signals.objectRemoved.add(function(object){
        console.log("Remove "+object);
    });

    return container;
};

Sidebar.Info = function(editor) {
    var signals = editor.signals;
    var infoPanel = new UI.CollapsiblePanel();
    infoPanel.addStatic( new UI.Text( 'INFO' ) );
    infoPanel.setCollapsed(true);
    var infoContainer = new UI.Panel();
    infoContainer.dom.id = 'info-container';
    var $infoContainer = $(infoContainer.dom);
    function clear() {
        infoContainer.clear();
    }
    signals.objectSelected.add(function(object){
        if( object === null ) {
            return;
        }
        clear();
        var JsonString = object.toJSON();
        $('#info-container').rainbowJSON({
            maxElements: 0,
            maxDepth: 0,
            json: JsonString,
            bgColor: '#F5FAFF'
        });
    });
    infoPanel.add(infoContainer);
    return infoPanel;
};
