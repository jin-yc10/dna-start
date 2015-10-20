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
    var outliner = new Sidebar.Outliner( editor );
    return container;
};

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Scene = function ( editor ) {
    var signals = editor.signals;
    var RootContainer = new UI.Panel();
    var container = new UI.CollapsiblePanel();
    container.setCollapsed( editor.config.getKey( 'ui/sidebar/scene/collapsed' ) );
    container.onCollapsedChange( function ( boolean ) {
        editor.config.setKey( 'ui/sidebar/scene/collapsed', boolean );
    } );

    container.addStatic( new UI.Text( 'SCENE' ) );

    var ZTree = new UI.Panel();

    ZTree.dom.id = 'ZTreeContainer';
    var Info = new UI.CollapsiblePanel();
    Info.addStatic( new UI.Text( 'INFO' ) );
    Info.setCollapsed(true);
    // editor.selectById( parseInt( outliner.getValue() ) );
    // editor.focusById( parseInt( outliner.getValue() ) );
    container.add( ZTree );
    RootContainer.add(container);
    RootContainer.add(Info);

    var setting = {
        view: {
            showLine: false,
            showIcon: false,
            selectedMulti: false,
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
        }
    };
    var zNodes = [
    ];
    var treeContainer = $(ZTree.dom);
    var treeObj = $("<ul id=\"ZTree\" class=\"ztree\"></ul>");
    treeContainer.append(treeObj);
    $.fn.zTree.init(treeObj, setting, zNodes);

    signals.objectAdded.add(function(object){

    });
    signals.objectChanged.add(function(object){

    });
    signals.objectSelected.add(function(object){

    });
    signals.objectRemoved.add(function(object){

    });

    return RootContainer;
};

Sidebar.Outliner = function(editor) {
    var signals = editor.signals;

};
