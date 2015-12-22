/**
 * Created by jin-yc10 on 15/10/17.
 */
SIDEBAR.Lib = {};
SIDEBAR.Lib.Container = function ( editor ) {
    var container = new UI.Panel();
    container.setId( 'libbar' );
    container.add( new SIDEBAR.Lib.Scene( editor ) );
    return container;
};
SIDEBAR.Lib.Scene = function ( editor ) {
    var signals = editor.signals;
    var rootContainer = new UI.Panel();
    var container = new UI.CollapsiblePanel();
    container.setCollapsed( true );
    container.onCollapsedChange( function ( boolean ) {
    });

    container.addStatic( new UI.Text( 'Three Arm' ) );
    container.add( new UI.Break() );

    var TestItem = new UI.Panel();
    TestItem.setClass('TestItem');
    TestItem.setTextContent( 'TestItem1' );
    TestItem.onClick(function() {
    });
    var TestItem2 = new UI.Panel();
    TestItem2.setClass('TestItem');
    TestItem2.setTextContent( 'TestItem2' );
    TestItem2.onClick(function() {
    });
    var ItemInfo = new UI.Panel();
    container.add(TestItem);
    container.add(TestItem2);
    container.add(ItemInfo);

    var basicContainer = new UI.CollapsiblePanel();
    basicContainer.setCollapsed( true );
    basicContainer.onCollapsedChange( function ( boolean ) {
    });
    basicContainer.addStatic( new UI.Text( 'Basic' ) );

    var StrandItem = new UI.Panel();
    StrandItem.setClass('TestItem');
    StrandItem.setTextContent( 'Strand' );
    StrandItem.onClick(function() {
        editor.addObject(Bio.createStrand());
    });
    basicContainer.add(StrandItem);

    var GroupItem = new UI.Panel();
    GroupItem.setClass('TestItem');
    GroupItem.setTextContent( 'EmptyGroup' );
    GroupItem.onClick(function() {
        var group = new THREE.Object3D();
        group.userData.type = "Group";
        editor.addObject(group);
    });
    basicContainer.add(GroupItem);

    var ConnectionItem = new UI.Panel();
    ConnectionItem.setClass('TestItem');
    ConnectionItem.setTextContent( 'Connection' );
    ConnectionItem.onClick(function() {
        var lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            linewidth: 2
        });
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(
            new THREE.Vector3(0,0,10),
            new THREE.Vector3(-0,-0,-10)
        );
        var Strand = new THREE.Line(lineGeometry, lineMaterial);
        Strand.userData.type = "Connection";
        editor.addObject(Strand);
    });
    basicContainer.add(ConnectionItem);

    rootContainer.add(basicContainer);
    rootContainer.add(container);
    return rootContainer;
};
SIDEBAR.Lib.LibItem = function( editor ) {
    UI.Element.call( this );
    var scope = this;
    var dom = document.createElement( 'div' );
    dom.className = 'libItem';
    this.dom = dom;
};
SIDEBAR.Lib.LibItem.prototype = Object.create(UI.Element.prototype);
SIDEBAR.Lib.LibItem.prototype.constructor = SIDEBAR.Lib.LibItem;



