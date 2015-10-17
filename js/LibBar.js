/**
 * Created by jin-yc10 on 15/10/17.
 */

var LibBar = function ( editor ) {
    var container = new UI.Panel();
    container.setId( 'libbar' );

    container.add( new LibBar.Scene( editor ) );
    return container;
};

/**
 * @author mrdoob / http://mrdoob.com/
 */

LibBar.Scene = function ( editor ) {
    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed( true );
    container.onCollapsedChange( function ( boolean ) {
    });

    container.addStatic( new UI.Text( 'Three Arm' ) );
    container.add( new UI.Break() );

    var TestItem = new UI.Panel();
    TestItem.dom.className = 'TestItem';
    TestItem.onClick = function() {
        console.log('TestItem click');
    };
    TestItem.onDblClick = function() {
        console.log('TestItem DblClick');
    };
    var TestItem2 = new UI.Panel();
    TestItem2.dom.className = 'TestItem';
    TestItem2.onClick = function() {
    };
    var ItemInfo = new UI.Panel();
    container.add(TestItem);
    container.add(TestItem2);
    container.add(ItemInfo);

    return container;
};

LibBar.LibItem = function( editor ) {
    UI.Element.call( this );
    var scope = this;
    var dom = document.createElement( 'div' );
    dom.className = 'libItem';
    this.dom = dom;
};

LibBar.LibItem.prototype = Object.create(UI.Element.prototype);
LibBar.LibItem.prototype.constructor = LibBar.LibItem;



