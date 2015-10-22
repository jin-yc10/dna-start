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
        var group = new THREE.Object3D();
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        var End3 = new THREE.Mesh( geometry, material );
        End3.translateOnAxis(new THREE.Vector3(0,0,1), 10);
        End3.parent = group;

        var End5 = new THREE.Mesh( geometry, material );
        End5.translateOnAxis(new THREE.Vector3(-0,-0,-1), 10);

        var lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            linewidth: 3
        });
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(
            new THREE.Vector3(0,0,10),
            new THREE.Vector3(-0,-0,-10)
        );
        var Strand = new THREE.Line(lineGeometry, lineMaterial);
        group.add(End3);
        group.add(End5);
        group.add(Strand);
        group.userData.type = "Strand";
        End3.userData.pick_parent = true;
        End5.userData.pick_parent = true;
        Strand.userData.pick_parent = true;

        editor.addObject(group);
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


    rootContainer.add(basicContainer);
    rootContainer.add(container);
    return rootContainer;
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



