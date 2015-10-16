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
    container.add( new UI.Break() );

    var ignoreObjectSelectedSignal = false;
    var outliner = new UI.Outliner( editor );
    outliner.onChange( function () {
        ignoreObjectSelectedSignal = true;
        editor.selectById( parseInt( outliner.getValue() ) );
        ignoreObjectSelectedSignal = false;
    } );
    outliner.onDblClick( function () {
        editor.focusById( parseInt( outliner.getValue() ) );
    } );
    container.add( outliner );
    container.add( new UI.Break() );

    return container;
};

